/* 
    Using: views & controllers
        
    view:
        - initial HTML (squares with black borders 8x8)
    controllers:
        - click on a cell (if valid cell, flip all surrounded discs to be 
            current turn color, change whose turn it is)
        - 2 dimensional list ( a grid - contains information about what is
            found at every cell of the game board)
*/

// set variabel
let boardBackground;
let gap = 3;
let BOARD_LENGTH = 8;
let cellWidth = 65;
let coinLayer;
let turn = 1;
let scoreLabel;
let gameOver = false;
let canMoveLayer;
let checkWinner;
let passTurn;
let btnSkip;
// let BLACK = 0;
// let WHITE = 0;
let count = 0;

// init boards
let boards = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,2,1,0,0,0],
    [0,0,0,1,2,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
]

// let boards = [
//     [0,0,0,0],
//     [0,2,1,0],
//     [0,1,2,0],
//     [0,0,0,0],
// ]

// event handler 
window.onload = function() {
    btnSkip = document.getElementById("skip");
    checkWinner = document.getElementById('winner');
    passTurn = document.getElementById('pass');
    scoreLabel = document.getElementById("score");
    canMoveLayer = document.getElementById("canMoveLayer");
    boardBackground = document.getElementById("boardBackground");
    coinLayer = document.getElementById("coinLayer");
    boardBackground.style.width = cellWidth * 8 + (gap * 9);
    boardBackground.style.height = cellWidth * 8 + (gap * 9);
    drawBoardSquares()
    displayCoin();
    drawCanMoveCoin();
    // showWinner()
}

// Draw Board
// menampilkan board
function drawBoardSquares() {
    for(let row = 0; row < BOARD_LENGTH; row++) {
        for(let column = 0; column < BOARD_LENGTH; column++) {
            // console.log(row, column, 'r c');
            // make a new element div for squares board
            let greenSquare = document.createElement("div");
            greenSquare.style.position = "absolute";
            greenSquare.style.width = cellWidth+'px';
            greenSquare.style.height = cellWidth+'px';
            greenSquare.style.backgroundColor = "green";
            // make a board squares by one squares
            greenSquare.style.left = (cellWidth + gap) * column + gap+'px'; // column
            greenSquare.style.top = (cellWidth + gap) * row + gap+'px'; // row
            // add event onclicm define with setAttribute and make function with parameter row and column
            greenSquare.setAttribute("onclick", "clickedSquare("+row+", "+column+")");
            boardBackground.appendChild(greenSquare)
        }
    }
}

function showPassTurn(turn, row, column) {
    // let textSkipTurn = document.createElement("a");
    // textSkipTurn.appendChild(document.createTextNode("Skip"))
    btnSkip.onclick = function() {
        buttonSkipTurn(turn, row, column)
        btnSkip.remove()
        passTurn.remove()
    }
    // btnSkip.appendChild(textSkipTurn)
}

function buttonSkipTurn(turn, row, column) {
    // btnSkip.innerHTML = "You CLICKED ME"
    // console.log(turn, 'btnSkip')
    if(turn == 1) {
        turn = 2
        // console.log(turn, 'cek turn if')
        canClickSpot(turn, row, column)
        drawCanMoveCoin()
    } else if(turn == 2) {
        turn = 1;
        // console.log(turn, 'cek turn else if')
        canClickSpot(turn, row, column)
        drawCanMoveCoin()
    } 
}

function showWinner(BLACK, WHITE) {
    let textWinner = 'End of Game! The Winner is ';
    if(BLACK > WHITE) {
        checkWinner.innerHTML = textWinner + "Black"
    } else if(BLACK == WHITE) {
        checkWinner.innerHTML = 'End of Game! DRAW'
    } else {
        checkWinner.innerHTML = textWinner + "White"
    }
}

// menampilkan score
function showScore() {
    let scoreWhite = 0;
    let scoreBlack = 0;

    for(let row = 0; row < BOARD_LENGTH; row++) {
        for(let column = 0; column < BOARD_LENGTH; column++) {
            let value = boards[row][column]
            // console.log(value, 'cek val')
            if(value == 1) {
                scoreBlack += 1 
            } else if(value == 2) {
                scoreWhite += 1
            } else if(value != 0 ) {
                showWinner(scoreBlack, scoreWhite)
            }
        }
    }
    let countScore = scoreBlack + scoreWhite;
    if(countScore == BOARD_LENGTH * BOARD_LENGTH) {
        showWinner(scoreBlack, scoreWhite)
    }
    scoreLabel.innerHTML = "Black: "+ scoreBlack + " White: "+ scoreWhite;
}

// handle event click in square
// fungsi pada saat kita mengklik kotak kosong di board
function clickedSquare(row, column) { // 3 - 3
    // if(gameOver) {
    //     showScore()
    // }
    /* 
        if the user is allowed to click here
        get all affected coin
        flip them
    */

    // add conditional for when the user click on a coin other than value 0 or blank spot
    if(boards[row][column] != 0) {
        return;
    }


    // cek apakah terdapat spot blank atau 0
    // console.log(turn, row, column, '???')
    if(canClickSpot(turn, row, column) == true) { // 1 3 3
        // console.log(turn, row, column, ">>>>>>")
        let affectedBoard = getAffectedBoard(turn, row, column);
        // console.log(affectedBoard, 'affectedboard ===');
        flipDisc(affectedBoard);
        // console.log(boards[row][column], 'boards')
        boards[row][column] = turn
        // console.log(boards[row][column], 'turnnnnn')
        if(turn == 1 && canMove(2)) {
            turn = 2
            // console.log('ganti turn if')
        } else if(turn == 2 && canMove(1)) {
            turn = 1
            // console.log('ganti turn else')
        }
        // else if(turn == 1 && canMove(2) == false) {
        //     passTurn.innerHTML = "PASS!, BLACK can't turn"
        //     turn = 1
        // } else if(turn == 2 && canMove(1) == false) {
        //     passTurn.innerHTML = "PASS!, WHITE can't turn"
        //     turn = 2
        // }
        // else if(turn == 1 && canMove(2) == false) {
        //     passTurn.innerHTML = "PASS!, BLACK can't turn"
        //     turn = 1
        // } else if(turn == 2 && canMove(1) == false) {
        //     passTurn.innerHTML = "PASS!, WHITE can't turn"
        //     turn = 2
        // }
        // if(canMove(1) == false || canMove(2) == false) {
        //     alert('game over')
        //     gameOver = true
        // }
        // if(turn == 1 && canMove(2) == false) {
        //     turn = 1
        //     // alert('game over')
        //     // gameOver = true
        // } else if(turn == 2 && canMove(1) == false) {
        //     turn = 2
        //     // alert('game over')
        //     // gameOver = true
        // }
        displayCoin();
        drawCanMoveCoin();
        showScore();
    } 
    else {
        // console.log('ELSE');
        if(turn == 1 && canMove(2)) {
            passTurn.innerHTML = "PASS!, BLACK can't turn"
            // turn = 1
            btnSkip.innerHTML = "SKIP"
            // let textSkipTurn = document.createElement("a");
            // textSkipTurn.innerHTML = "SKIP"
            // btnSkip.appendChild(textSkipTurn)
            showPassTurn(turn, row, column)
            // drawCanMoveCoin()
            // getAffectedBoard(turn, row, column)
        } else if(turn == 2 && canMove(1)) {
            passTurn.innerHTML = "PASS!, WHITE can't turn"
            // turn = 2
            btnSkip.innerHTML = "SKIP"
            // let textSkipTurn = document.createElement("a");
            // textSkipTurn.innerHTML = "SKIP"
            // btnSkip.appendChild(textSkipTurn)
            showPassTurn(turn, row, column)
            // drawCanMoveCoin()
            // getAffectedBoard(turn, row, column)
        }
    }
}

// handle even allowed to click spot
function canClickSpot(turnId, row, column) { // 1 3 3
    // console.log(turnId, row, column, 'canClickSpot')
    /* 
        if the number of affected disc by clicking at this spot would be 0
        return false
        otherwise return true
    */
//    console.log("canClickSpot")
    let affectedBoard = getAffectedBoard(turnId, row, column); // 1 3 3
    // console.log(affectedBoard, 'affectedBoard')
    if(affectedBoard.length == 0) {
        // console.log('canClickSpot false');
        // if(turnId == 2 && !canMove(2) || turnId == 1 && !canMove(1)) {
        //     return false
        // } else if(turnId == 2 && canMove(1) || turnId == 1 && canMove(2)) {
        //     if(turnId == 1) {
        //         turnId == 2
        //         affectedBoard(turnId, row, column)
        //     } else {
        //         turnId == 1
        //         affectedBoard(turnId, row, column)
        //     }
        // } else {
        //     return false
        // }
        return false
    } else {
        turn =  turnId
        // console.log('canClickSpot true');
        return true
    }
}



function canMove(turnId) {
    // console.log("canmove")
    // console.log(turnId)
    for(let row = 0; row < BOARD_LENGTH; row++) {
        for(let column = 0; column < BOARD_LENGTH; column++) {
            // console.log(canClickSpot(turnId, row, column), 'test')
            // console.log(turnId, row, column, 'canMove')
            if(canClickSpot(turnId, row, column) == true) {
                return true;
            } 
            // else if(canClickSpot(turnId, row, column) == false && turnId == 1) {
            //     turnId = 2
            //     canClickSpot(turnId, row, column)
            // }
        }
    }
    return false;
}



// function to change coin after getAffectedBoard
function flipDisc(affectedCoin) {
    // console.log(affectedCoin, 'affectedCoin')
    /* 
        for all item in the list: affectedDisc:
        if the disc at that has spot as value 1
            make it a 2
        else 
            make it a 1
    */
    for(let i = 0; i < affectedCoin.length; i++) {
        let spot = affectedCoin[i]
        // console.log(spot, 'spot')
        if(boards[spot.row][spot.column] == 1) {
            boards[spot.row][spot.column] = 2;
        } else {
            boards[spot.row][spot.column] = 1
        }
    }
}   

// handle change for coin and board
function getAffectedBoard(turnId, row, column) { // 1 3 2
    // console.log(turnId, row, column, 'getAffectedBoard')
    // console.log(turnId, 'turn')
    let showAffectedCoin = [];
    /* 
        from current spot:
        for all eight directions. (left right up down and 4 diagonals)
           move along in direction until your reach a blank or your own color
           (keeping track of all the opposite color locations along the way)
        if the terminal title is your own color
            add those locations to the list that will be returned
        return the list of affected disc
    */

    // to the right
    let couldBeAffected = [];
    let colIterator = column; // 3
    // console.log(colIterator, 'col');
    while(colIterator < BOARD_LENGTH-1) {
        colIterator += 1; // 3
        // console.log(colIterator, 'col after');
        let valueAtSpot = boards[row][colIterator]; // 1
        // console.log(valueAtSpot, 'value at spot')
        if(valueAtSpot == 0 || valueAtSpot == turnId) {
            if(valueAtSpot == turnId) {
                showAffectedCoin = showAffectedCoin.concat(couldBeAffected); // [row: 3, col: 3]
                // count.push(couldBeAffected)
                // console.log(count, 'count')
                // console.log(showAffectedCoin, 'showaffectedcoin')
            }
            break;
        } else {
            let discLocation = {row:row,column:colIterator};
            // console.log(discLocation, 'discLocation')
            couldBeAffected.push(discLocation);
            // console.log(couldBeAffected, 'could')
        }
    }
    
    // to the left
    let couldBeAffectedLeft = [];
    let colIteratorLeft = column;
    while(colIteratorLeft > 0) {
        colIteratorLeft -= 1;
        let valueAtSpot = boards[row][colIteratorLeft];
        if(valueAtSpot == 0 || valueAtSpot == turnId) {
            if(valueAtSpot == turnId) {
                showAffectedCoin = showAffectedCoin.concat(couldBeAffectedLeft);
            }
            break;
        } else {
            let discLocation = {row:row,column:colIteratorLeft};
            couldBeAffectedLeft.push(discLocation);
        }
    }

    // up
    let couldBeAffectedAbove = [];
    let rowIteratorAbove = row;
    while(rowIteratorAbove > 0) {
        rowIteratorAbove -= 1;
        let valueAtSpot = boards[rowIteratorAbove][column];
        if(valueAtSpot == 0 || valueAtSpot == turnId) {
            if(valueAtSpot == turnId) {
                showAffectedCoin = showAffectedCoin.concat(couldBeAffectedAbove);
            }
            break;
        } else {
            let discLocation = {row:rowIteratorAbove,column:column};
            couldBeAffectedAbove.push(discLocation);
        }
    }

    // down
    let couldBeAffectedBelow = [];
    let rowIteratorBelow = row;
    while(rowIteratorBelow < BOARD_LENGTH-1) {
        rowIteratorBelow += 1;
        let valueAtSpot = boards[rowIteratorBelow][column];
        if(valueAtSpot == 0 || valueAtSpot == turnId) {
            if(valueAtSpot == turnId) {
                showAffectedCoin = showAffectedCoin.concat(couldBeAffectedBelow);
            }
            break;
        } else {
            let discLocation = {row:rowIteratorBelow,column:column};
            couldBeAffectedBelow.push(discLocation);
        }
    }

    // down right
    let couldBeAffectedDownRight = [];
    let rowIteratorDownRight = row;
    let colIteratorDownRight = column;
    // karna dia akan berjalan secara diagonal maka buat kondisi untuk mengecek row dan column nya
    while(rowIteratorDownRight < BOARD_LENGTH-1 && colIteratorDownRight < BOARD_LENGTH-1) {
        rowIteratorDownRight += 1;
        colIteratorDownRight += 1;
        let valueAtSpot = boards[rowIteratorDownRight][colIteratorDownRight];
        if(valueAtSpot == 0 || valueAtSpot == turnId) {
            if(valueAtSpot == turnId) {
                showAffectedCoin = showAffectedCoin.concat(couldBeAffectedDownRight);
            }
            break;
        } else {
            let discLocation = {row:rowIteratorDownRight,column:colIteratorDownRight};
            couldBeAffectedDownRight.push(discLocation);
        }
    }

    // down left
    let couldBeAffectedDownLeft = [];
    let rowIteratorDownLeft = row;
    let colIteratorDownLeft = column;
    while(rowIteratorDownLeft < BOARD_LENGTH-1 && colIteratorDownLeft > 0) {
        rowIteratorDownLeft += 1;
        colIteratorDownLeft -= 1;
        let valueAtSpot = boards[rowIteratorDownLeft][colIteratorDownLeft];
        if(valueAtSpot == 0 || valueAtSpot == turnId) {
            if(valueAtSpot == turnId) {
                showAffectedCoin = showAffectedCoin.concat(couldBeAffectedDownLeft);
            }
            break;
        } else {
            let discLocation = {row:rowIteratorDownLeft,column:colIteratorDownLeft};
            couldBeAffectedDownLeft.push(discLocation);
        }
    }

    // up left
    let couldBeAffectedUpLeft = [];
    let rowIteratorUpLeft = row;
    let colIteratorUpLeft = column;
    while(rowIteratorUpLeft > 0 && colIteratorUpLeft > 0) {
        rowIteratorUpLeft -= 1;
        colIteratorUpLeft -= 1;
        let valueAtSpot = boards[rowIteratorUpLeft][colIteratorUpLeft];
        if(valueAtSpot == 0 || valueAtSpot == turnId) {
            if(valueAtSpot == turnId) {
                showAffectedCoin = showAffectedCoin.concat(couldBeAffectedUpLeft);
            }
            break;
        } else {
            let discLocation = {row:rowIteratorUpLeft,column:colIteratorUpLeft};
            couldBeAffectedUpLeft.push(discLocation);
        }
    }

    // up right
    let couldBeAffectedUpRight = [];
    let rowIteratorUpRight = row;
    let colIteratorUpRight = column;
    while(rowIteratorUpRight > 0 && colIteratorUpRight < BOARD_LENGTH-1) {
        rowIteratorUpRight -= 1;
        colIteratorUpRight += 1;
        let valueAtSpot = boards[rowIteratorUpRight][colIteratorUpRight];
        if(valueAtSpot == 0 || valueAtSpot == turnId) {
            if(valueAtSpot == turnId) {
                showAffectedCoin = showAffectedCoin.concat(couldBeAffectedUpRight);
            }
            break;
        } else {
            let discLocation = {row:rowIteratorUpRight,column:colIteratorUpRight};
            couldBeAffectedUpRight.push(discLocation);
        }
    }
    // console.log(showAffectedCoin, 'showAffected')
    return showAffectedCoin
}

// make coin display
function displayCoin() {
    coinLayer.innerHTML = ""
    for(let row = 0; row < BOARD_LENGTH; row++) {
        for(let column = 0; column < BOARD_LENGTH; column++) {
            let checkValue = boards[row][column];
            // check value from board length
            if(checkValue == 0) {
                // showWinner()
                // return;
            } else {
                // make a display coin with new element div
                let makeCoin = document.createElement("div");
                makeCoin.style.position = "absolute";
                makeCoin.style.width = cellWidth +'px';
                makeCoin.style.height = cellWidth +'px';
                makeCoin.style.borderRadius = "50%"
                makeCoin.style.marginTop = "8px"
                // make a board squares by one squares
                makeCoin.style.left = (cellWidth + gap) * column + gap+'px'; // column
                makeCoin.style.top = (cellWidth + gap) * row + gap +'px'; // row
                
                
                if(checkValue == 1) {
                    // makeCoin.style.backgroundColor = "black";
                    makeCoin.style.backgroundImage = "radial-gradient(#333333 30%, black 70%)"
                } else {
                    // makeCoin.style.backgroundColor = "white"
                    makeCoin.style.backgroundImage = "radial-gradient(white 30%, #cccccc 70%)";
                }
                coinLayer.appendChild(makeCoin)
            }
        }
    }
}

// make suggestion turn coin
// buat sugesti turn coin
function drawCanMoveCoin() {
    canMoveLayer.innerHTML = ""
    for(let row = 0; row < BOARD_LENGTH; row++) {
        for(let column = 0; column < BOARD_LENGTH; column++) {
            let checkValue = boards[row][column];  
            // ngecek apakah terdapat value selain 1 dan 2
            // console.log(canClickSpot(turn, row, column), 'test test')
            // console.log(turn, row, column, 'drawCanMoveCoin')
            // console.log(checkValue, 'cek value')
            // console.log(turn, 'cek turn')
            // console.log(buttonSkipTurn(turn, row, column), 'test')
            if(checkValue == 0 && canClickSpot(turn, row, column)) {
                // console.log("MASUK IF")
                // buat tampilan coin dengan menambahkan element div baru
                let discOutline = document.createElement("div");
                discOutline.style.position = "absolute";
                discOutline.style.width = cellWidth - 8 +'px';
                discOutline.style.height = cellWidth - 8 +'px';
                discOutline.style.borderRadius = "50%"
                discOutline.style.cursor = "pointer"
                // make a board squares by one squares
                discOutline.style.left = (cellWidth + gap) * column + gap + 2+'px'; // column
                discOutline.style.top = (cellWidth + gap) * row + gap + 9 +'px'; // row
                discOutline.setAttribute("onclick", "clickedSquare("+row+", "+column+")");
                discOutline.style.zIndex = 2;
                if(turn == 1) {
                    discOutline.style.border = "2px solid black"
                }
                if(turn == 2) {
                    discOutline.style.border = "2px solid white"
                }
                canMoveLayer.appendChild(discOutline)
            } 
            else {
                // console.log("MASUK ELSE")
                // if(turn == 1 && !canMove(2)) {
                //     passTurn.innerHTML = "PASS!, BLACK can't turn";
                //     btnSkip.innerHTML = "SKIP";
                //     showPassTurn(turn, row, column)
                // } else if(turn == 2 && !canMove(1)) {
                //     passTurn.innerHTML = "PASS!, WHITE can't turn";
                //     btnSkip.innerHTML = "SKIP";
                //     showPassTurn(turn, row, column);
                // }
                // showPassTurn(turn, row, column)
                // if(turn == 1 && canMove(2)) {
                //     passTurn.innerHTML = "PASS!, BLACK can't turn"
                //     turn = 1
                //     let textSkipTurn = document.createElement("a");
                //     textSkipTurn.appendChild(document.createTextNode("Skip"))
                //     btnSkip.appendChild(textSkipTurn)
                //     showPassTurn(turn, row, column)
                //     // drawCanMoveCoin()
                //     // getAffectedBoard(turn, row, column)
                // } else if(turn == 2 && canMove(1)) {
                //     passTurn.innerHTML = "PASS!, WHITE can't turn"
                //     turn = 2
                //     let textSkipTurn = document.createElement("a");
                //     textSkipTurn.appendChild(document.createTextNode("Skip"))
                //     btnSkip.appendChild(textSkipTurn)
                //     showPassTurn(turn, row, column)
                //     // drawCanMoveCoin()
                //     // getAffectedBoard(turn, row, column)
                // }
                // if(turn == 1) {
                //     passTurn.innerHTML = "PASS!, BLACK can't turn"
                // } else {
                //     passTurn.innerHTML = "PASS!, WHITE can't turn"
                // }
                // if(turn == 1 && canMove(2)) {
                //     turn = 2
                //     if(checkValue == 0 && canClickSpot(turn, row, column)) {
                //         let discOutline = document.createElement("div");
                //             discOutline.style.position = "absolute";
                //             discOutline.style.width = cellWidth - 8 +'px';
                //             discOutline.style.height = cellWidth - 8 +'px';
                //             discOutline.style.borderRadius = "50%"
                //             discOutline.style.cursor = "pointer"
                //             // make a board squares by one squares
                //             discOutline.style.left = (cellWidth + gap) * column + gap + 2+'px'; // column
                //             discOutline.style.top = (cellWidth + gap) * row + gap + 9 +'px'; // row
                //             discOutline.setAttribute("onclick", "clickedSquare("+row+", "+column+")");
                //             discOutline.style.zIndex = 2;
                //             if(turn == 1) {
                //                 discOutline.style.border = "2px solid black"
                //             }
                //             if(turn == 2) {
                //                 discOutline.style.border = "2px solid white"
                //             }
                //             canMoveLayer.appendChild(discOutline)
                //     }
                // } else if(turn == 2 && canMove(1)) {
                //     turn = 1
                //     if(checkValue == 0 && canClickSpot(turn, row, column)) {
                //         let discOutline = document.createElement("div");
                //             discOutline.style.position = "absolute";
                //             discOutline.style.width = cellWidth - 8 +'px';
                //             discOutline.style.height = cellWidth - 8 +'px';
                //             discOutline.style.borderRadius = "50%"
                //             discOutline.style.cursor = "pointer"
                //             // make a board squares by one squares
                //             discOutline.style.left = (cellWidth + gap) * column + gap + 2+'px'; // column
                //             discOutline.style.top = (cellWidth + gap) * row + gap + 9 +'px'; // row
                //             discOutline.setAttribute("onclick", "clickedSquare("+row+", "+column+")");
                //             discOutline.style.zIndex = 2;
                //             if(turn == 1) {
                //                 discOutline.style.border = "2px solid black"
                //             }
                //             if(turn == 2) {
                //                 discOutline.style.border = "2px solid white"
                //             }
                //             canMoveLayer.appendChild(discOutline)
                //     }
                // }
                // console.log(canMove(1), 'satu')
                // console.log(canMove(2), 'dua')
                // if(turn == 1 && canMove(2) == false) {
                //     console.log('sini')
                //     passTurn.innerHTML = "PASS!, WHITE can't turn"
                //     turn = 1
                //     getAffectedBoard(turn, row, column)
                // } else if(turn == 2 && canMove(1) == false) {
                //     console.log('situ')
                //     passTurn.innerHTML = "PASS!, BLACK can't turn"
                //     turn = 2
                //     getAffectedBoard(turn, row, column)
                // }
                // if(checkValue == 0 && !canClickSpot(turn, row, column) && canMove(2)) {
                //     turn = 2
                //     canClickSpot(turn, row, column)
                // } else if(checkValue == 0 && !canClickSpot(turn, row, column) && canMove(1)) {
                //     turn = 1
                //     canClickSpot(turn, row, column)
                // }
                // alert("PASS Turn")
                // console.log(turn, row, column, 'MASUK ELSE >>>')
                // if(turn == 1 && canMove(2) == false) {
                //     turn = 1
                //     console.log(turn, row, column, 'MASUK ELSE ====')
                //     canClickSpot(turn, row, column)
                // } else if(turn == 2 && canMove(1) == false) {
                //     turn = 2
                //     console.log(turn, row, column, 'MASUK ELSE ?????')
                //     canClickSpot(turn, row, column)
                // }
            }
        }
    }
}