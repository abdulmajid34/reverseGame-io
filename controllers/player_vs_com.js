// set variabel
let BOARD_LENGTH = 8;
let cellWidth = 65;
let gap = 3;
let boardGames;
let initCoin;
let turn = 1;
let scoreLabel;
let canMoveCoin;
let coorSuggest = [];
let tempCoordPlayer = []


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

window.onload = function() {
    canMoveCoin = document.getElementById("canMoveCoin");
    boardGames = document.getElementById("boardGames");
    initCoin = document.getElementById("initCoin");
    scoreLabel = document.getElementById("score");
    boardGames.style.width = cellWidth * 8 + (gap * 9);
    boardGames.style.height = cellWidth * 8 + (gap * 9);
    drawBoardGame()
    displayCoin()
    drawCanMoveCoin();
}

// count score
function score() {
    let scoreWhite = 0;
    let scoreBlack = 0;

    for(let row = 0; row < BOARD_LENGTH; row++) {
        for(let column = 0; column < BOARD_LENGTH; column++) {
            let value = boards[row][column]

            if(value == 1) {
                scoreBlack += 1;
            } else if(value == 2) {
                scoreWhite += 1
            } else if(value != 0) {
                console.log("winner")
            }
        }
    }
    let countScore = scoreBlack + scoreWhite;
    if(countScore == BOARD_LENGTH * BOARD_LENGTH) {
        console.log("winner")
    }
    scoreLabel.innerHTML = "Black: "+ scoreBlack + " White: "+ scoreWhite;
}

// draw board game
function drawBoardGame() {
    for(let row = 0; row < BOARD_LENGTH; row++) {
        for(let column = 0; column < BOARD_LENGTH; column++) {
            let makeBoard = document.createElement("div");
            makeBoard.style.position = "absolute";
            makeBoard.style.width = cellWidth+'px';
            makeBoard.style.height = cellWidth+'px';
            makeBoard.style.backgroundColor = 'green';
            makeBoard.style.left = (cellWidth + gap) * column + gap+'px';
            makeBoard.style.top = (cellWidth + gap) * row + gap+'px';
            makeBoard.setAttribute("onclick", "clickedTurn("+row+", "+column+")")
            boardGames.appendChild(makeBoard);
        }
    }
}

// draw init coin
function displayCoin() {
    initCoin.innerHTML = "";
    for(let row = 0; row < BOARD_LENGTH; row++) {
        for(let column = 0; column < BOARD_LENGTH; column++) {
            let checkValueBoard = boards[row][column];

            // check board if value other than 0
            if(checkValueBoard == 0) {

            } else {
                // make a display init coin with new element div
                let makeCoin = document.createElement("div");
                makeCoin.style.position = "absolute";
                makeCoin.style.width = cellWidth+'px';
                makeCoin.style.height = cellWidth+'px';
                makeCoin.style.borderRadius = "50%";
                makeCoin.style.marginTop = "8px";
                makeCoin.style.left = (cellWidth + gap) * column + gap+'px';
                makeCoin.style.top = (cellWidth + gap) * row + gap+'px';

                if(checkValueBoard == 1) {
                    makeCoin.style.backgroundImage = "radial-gradient(#333333 30%, black 70%)"
                } else {
                    makeCoin.style.backgroundImage = "radial-gradient(white 30%, #cccccc 70%)";
                }
                initCoin.appendChild(makeCoin);
            }
        }
    }
}

// draw can move coin turn
function drawCanMoveCoin() {
    canMoveCoin.innerHTML = "";
    for(let row = 0; row < BOARD_LENGTH; row++) {
        for(let column = 0; column < BOARD_LENGTH; column++) {
            let checkValue = boards[row][column];
            // console.log(row, column, 'test');
            if(checkValue == 0 && canClickSpot(turn, row, column)) {
                let discOutline = document.createElement("div");
                discOutline.className = "suggest-outline"
                discOutline.style.position = "absolute";
                discOutline.style.width = cellWidth - 8 +'px';
                discOutline.style.height = cellWidth - 8 +'px';
                discOutline.style.borderRadius = "50%"
                discOutline.style.cursor = "pointer"
                // make a board squares by one squares
                discOutline.style.left = (cellWidth + gap) * column + gap + 2+'px'; // column
                discOutline.style.top = (cellWidth + gap) * row + gap + 9 +'px'; // row
                discOutline.setAttribute("onclick", "clickedTurn("+row+", "+column+")");
                discOutline.style.zIndex = 2;
                discOutline.style.border = "2px solid black"
                if(turn == 1) {
                    discOutline.style.border = "2px solid black"
                    tempPlayerTurn(turn, row, column)
                } else if(turn == 2) {
                    // discOutline.className = "suggest-outline"
                    discOutline.style.border = "2px solid white"
                    setTimeout(() => {
                        tempCoordAIturn(turn, row, column)
                    }, 1500)
                }
                canMoveCoin.appendChild(discOutline)
            }
        }
    }
}

function tempPlayerTurn(turnId, row, column) {
    console.log(row, column, 'tempPlyerTurn');
    let valueAtSpot = boards[row][column]
    if(canClickSpot(turnId, row, column) && valueAtSpot == 0) {
        let checkAffectedBoard = getAffectedBoard(turnId, row, column)
        // console.log(checkAffectedBoard, 'check');
        if(checkAffectedBoard.length == 0) {
            // console.log("ELSE CHECK");
        } else {
            let coorLocation = {row:row,column:column}
            tempCoordPlayer.push(coorLocation)
        // console.log(tempCoordPlayer, 'coordPlayer')
        }
    } else {
        // console.log("ELSE CHECK CANCLICKSPOT");
    }
    // tempCoordPlayer = []
}

// handle clicked turn player
function clickedTurn(row, column) {
    // console.log(row, column, 'test')

    // add conditional for when the user click on a coin other than value 0 or blank spot
    if(boards[row][column] != 0) {
        return;
    }

    // console.log(row, column, 'CEK PLAYER TURN');

    if(canClickSpot(turn, row, column)) { // 
        let affectedBoard = getAffectedBoard(turn, row, column);
        // console.log(affectedBoard, 'affected');
        flipCoin(affectedBoard)
        // console.log(boards[row][column], 'boards')
        boards[row][column] = turn;
        // console.log(boards, 'players');
        // console.log(boards[row][column], 'turn')
        if(turn == 1) {
            turn = 2
            tempCoordPlayer = []
            drawCanMoveCoin();
        } 
        // else if(turn == 2) {
        //     turn = 1
        //     // tempCoordAIturn(turn, row, column)
        //     tempCoordPlayer = []
        // }
        // console.log(turn, 'turn')
        // tempCoordPlayer = []
        displayCoin();
        score();
        drawCanMoveCoin();
    } 
     
}

function tempCoordAIturn(turnId, row, column) {
    // console.log(row, column, 'rc temp')
    let availSpot = boards[row][column];
    if(canClickSpot(turnId, row, column) && availSpot == 0 && turnId == 2) {
        let affectedBoard = getAffectedBoard(turnId, row, column)
        // console.log(affectedBoard, 'coorSuggest')
        if(affectedBoard.length != 0) {
            let coorLocation = {row:row,column:column}
            coorSuggest.push(coorLocation)
            // console.log(coorSuggest, 'suggest')
        } else {
            coorSuggest = []
        }
        let random = Math.floor(Math.random() * coorSuggest.length)
        // console.log(random, 'random');
        if(canClickSpot(turnId, coorSuggest[random].row, coorSuggest[random].column)) {
            // console.log(turnId, coorSuggest[random].row, coorSuggest[random].column, 'if canClickSpot')
            computerMove(turnId, coorSuggest[random].row, coorSuggest[random].column)
            // turn = 1
            coorSuggest = [];
            // console.log(coorSuggest, 'coor')
        } else {
            // NOTES: BUG 1
            // console.log(coorSuggest[random].row, coorSuggest[random].column, 'else canClickSpot')
        }
        // if(coorSuggest.length == 0) {
        //     return
        // } else {
        //     // console.log(coorSuggest, 'coor')
        //     let random = Math.floor(Math.random() * coorSuggest.length)
        //     // console.log(random, 'random')
        //     // console.log(coorSuggest[random], 'random coord')
        //     if(canClickSpot(turn, coorSuggest[random].row, coorSuggest[random].column)) {
        //         // console.log(coorSuggest[random].row, coorSuggest[random].column, 'if canClickSpot')
        //         computerMove(coorSuggest[random].row, coorSuggest[random].column)
        //     } else {
        //         // NOTES: BUG 1
        //         // console.log(coorSuggest[random].row, coorSuggest[random].column, 'else canClickSpot')
        //     }
        //     // if(random != NaN || undefined) {
        //     //     let cutCoord = coorSuggest.slice(0, 1)
        //     //     console.log(cutCoord, 'cut')
        //     //     temp = cutCoord
        //     // }
        //     // let cutCoord = coorSuggest.slice(1, 2);
        //     // console.log(cutCoord, 'coor')
        //     // let randomTurn = Math.floor(Math.random() * cutCoord.length)
        //     // console.log(randomTurn, 'random turn')
        // }
    } else {
        console.log("masuk ELSE temp");
    }
    
}

// handle computer turn
function computerMove(turnId, row, column) {
    // console.log(turn, row, column, 'coord')
    // NOTES: COORDINAT SUGGESTED AI
    // let coorLocation = {row:row,column:column}
    // coorSuggest.push(coorLocation)
    // let cutCoord = coorSuggest.slice(0, 1)
    // console.log(cutCoord, 'cut')
    // NOTES: RANDOM berdasarkan COORDINAT AI
    // let randomTurn = Math.floor(Math.random() * coorSuggest.length)
    // console.log(turn, coorSuggest[randomTurn].row, coorSuggest[randomTurn].column, 'coord random')
    // let valueAtSpot = boards[coorSuggest[randomTurn].row][coorSuggest[randomTurn].column]
    let valueAtSpot = boards[row][column]
    if(canClickSpot(turnId, row, column) && valueAtSpot == 0 && turnId == 2) {
        // console.log(turn, row, column, 'coord after if')
        let affectedBoard = getAffectedBoard(turnId, row, column);
        // console.log(affectedBoard, 'check');
        document.querySelector(".suggest-outline").click()
        // document.querySelector('.suggest-outline').addEventListener('click', function() {
        //     flipCoin(affectedBoard);
        // })
        flipCoin(affectedBoard);
        console.log(boards, 'after flip');
        boards[row][column] = turn;
        // console.log(boards, 'com')
        turn = 1
        console.log(turn);
        coorSuggest = [];
        drawCanMoveCoin()
        // drawBoardGame()
    } else {
        // turn = 1
        // console.log("ELSE")
        // drawCanMoveCoin()
        // return
    }
    // drawCanMoveCoin()
    
}

// handle check canMove next turn player
function canMove(turnId) {
    for(let row = 0; row < BOARD_LENGTH; row++) {
        for(let column = 0; column < BOARD_LENGTH; column++) {
            if(canClickSpot(turnId, row, column)) {
                return true;
            }
        }
    }
    return false;
}

// handle player can clicked turn 
function canClickSpot(turnId, row, column) {
    let affectedBoard = getAffectedBoard(turnId, row, column)
    // console.log(affectedBoard, 'test')
    if(affectedBoard.length == 0) {
        return false
    } else {
        return true
    }
}

// handle flip coin
function flipCoin(affectedCoin) {
    // console.log(boards, 'boards before');
    // console.log(affectedCoin, 'affectedCoin');
    for(let i = 0; i < affectedCoin.length; i++) {
        let spot = affectedCoin[i]
        // console.log(spot, 'spot');
        if(boards[spot.row][spot.column] == 1) {
            boards[spot.row][spot.column] = 2
            console.log('masuk sini');
            // console.log(boards[spot.row][spot.column], 'boards');
            // console.log(boards);
        } else if(boards[spot.row][spot.column] == 2) {
            console.log('kesini');
            // console.log(boards[spot.row][spot.column], 'boards else');
            // let affectedFlipCoin = document.createElement("div");
            // affectedFlipCoin.style.borderRadius = "10px solid white"
            boards[spot.row][spot.column] = 1
        }
        console.log(boards, 'flip boards')
    }
}

// handle affected board or coin
function getAffectedBoard(turnId, row, column) {
    // console.log(row, column, 'test')
    let showAffectedCoin = [];

    // to the right
    let couldBeAffected = [];
    let columnIterator = column;
    while(columnIterator < BOARD_LENGTH-1) {
        columnIterator += 1;
        let valueAtSpot = boards[row][columnIterator];
        if(valueAtSpot == 0 || valueAtSpot == turnId) {
            if(valueAtSpot == turnId) {
                showAffectedCoin = showAffectedCoin.concat(couldBeAffected);
            }
            break;
        } else {
            let boardLocation = {row:row,column:columnIterator};
            // console.log(boardLocation, 'boardLocation')
            couldBeAffected.push(boardLocation)
        }
    }

    // to the left
    let couldBeAffectedLeft = [];
    let columnIteratorLeft = column;
    while(columnIteratorLeft > 0) {
        columnIteratorLeft -= 1;
        let valueAtSpot = boards[row][columnIteratorLeft];
        if(valueAtSpot == 0 || valueAtSpot == turnId) {
            if(valueAtSpot == turnId) {
                showAffectedCoin = showAffectedCoin.concat(couldBeAffectedLeft);
            }
            break;
        } else {
            let boardLocation = {row:row,column:columnIteratorLeft};
            couldBeAffectedLeft.push(boardLocation);
        }
    }

    // up
    let couldBeAffectedUp = [];
    let rowIteratorUp = row;
    while(rowIteratorUp > 0) {
        rowIteratorUp -= 1;
        let valueAtSpot = boards[rowIteratorUp][column];
        if(valueAtSpot == 0 || valueAtSpot == turnId) {
            if(valueAtSpot == turnId) {
                showAffectedCoin = showAffectedCoin.concat(couldBeAffectedUp);
            }
            break;
        } else {
            let boardLocation = {row:rowIteratorUp,column:column};
            couldBeAffectedUp.push(boardLocation);
        }
    }

    // down
    let couldBeAffectedDown = [];
    let rowIteratorDown = row;
    while(rowIteratorDown < BOARD_LENGTH-1) {
        rowIteratorDown += 1;
        let valueAtSpot = boards[rowIteratorDown][column];
        if(valueAtSpot == 0 || valueAtSpot == turnId) {
            if(valueAtSpot == turnId) {
                showAffectedCoin = showAffectedCoin.concat(couldBeAffectedDown);
            }
            break;
        } else {
            let boardLocation = {row:rowIteratorDown,column:column};
            couldBeAffectedDown.push(boardLocation);
        }
    }

    // down right
    let couldBeAffectedDownRight = [];
    let rowIteratorDownRight = row;
    let columnIteratorDownRight = column;
    // karna dia akan berjalan secara diagonal maka buat kondisi untuk mengecek row dan column nya
    while(rowIteratorDownRight < BOARD_LENGTH-1 && columnIteratorDownRight < BOARD_LENGTH-1) {
        rowIteratorDownRight += 1;
        columnIteratorDownRight += 1;
        let valueAtSpot = boards[rowIteratorDownRight][columnIteratorDownRight];
        if(valueAtSpot == 0 || valueAtSpot == turnId) {
            if(valueAtSpot == turnId) {
                showAffectedCoin = showAffectedCoin.concat(couldBeAffectedDownRight);
            }
            break;
        } else {
            let boardLocation = {row:rowIteratorDownRight,column:columnIteratorDownRight};
            couldBeAffectedDownRight.push(boardLocation);
        }
    }

    // down left
    let couldBeAffectedDownLeft = [];
    let rowIteratorDownLeft = row;
    let columnIteratorDownLeft = column;
    while(rowIteratorDownLeft < BOARD_LENGTH-1 && columnIteratorDownLeft > 0) {
        rowIteratorDownLeft += 1;
        columnIteratorDownLeft -= 1;
        let valueAtSpot = boards[rowIteratorDownLeft][columnIteratorDownLeft];
        if(valueAtSpot == 0 || valueAtSpot == turnId) {
            if(valueAtSpot == turnId) {
                showAffectedCoin = showAffectedCoin.concat(couldBeAffectedDownLeft);
            }
            break;
        } else {
            let boardLocation = {row:rowIteratorDownLeft,column:columnIteratorDownLeft};
            couldBeAffectedDownLeft.push(boardLocation);
        }
    }

    // up left
    let couldBeAffectedUpLeft = [];
    let rowIteratorUpLeft = row;
    let columnIteratorUpLeft = column;
    while(rowIteratorUpLeft > 0 && columnIteratorUpLeft > 0) {
        rowIteratorUpLeft -= 1;
        columnIteratorUpLeft -= 1;
        let valueAtSpot = boards[rowIteratorUpLeft][columnIteratorUpLeft];
        if(valueAtSpot == 0 || valueAtSpot == turnId) {
            if(valueAtSpot == turnId) {
                showAffectedCoin = showAffectedCoin.concat(couldBeAffectedUpLeft);
            }
            break;
        } else {
            let boardLocation = {row:rowIteratorUpLeft,column:columnIteratorUpLeft};
            couldBeAffectedUpLeft.push(boardLocation);
        }
    }

    // up right
    let couldBeAffectedUpRight = [];
    let rowIteratorUpRight = row;
    let columnIteratorUpRight = column;
    while(rowIteratorUpRight > 0 && columnIteratorUpRight < BOARD_LENGTH-1) {
        rowIteratorUpRight -= 1;
        columnIteratorUpRight += 1;
        let valueAtSpot = boards[rowIteratorUpRight][columnIteratorUpRight];
        if(valueAtSpot == 0 || valueAtSpot == turnId) {
            if(valueAtSpot == turnId) {
                showAffectedCoin = showAffectedCoin.concat(couldBeAffectedUpRight);
            }
            break;
        } else {
            let discLocation = {row:rowIteratorUpRight,column:columnIteratorUpRight};
            couldBeAffectedUpRight.push(discLocation);
        }
    }
    // console.log(showAffectedCoin, 'return')
    return showAffectedCoin
}

