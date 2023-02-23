const gameboard = document.getElementById("gameboard");
const message1 = document.getElementById("message1");
const message2 = document.getElementById("message2");
const scoreScreen = document.getElementById("score");
const bestScoreScreen = document.getElementById("best-score");
const biteSound = new Audio('./bite.mp3');
const loseGameSound = new Audio('./lose.mp3');
const rowsAndColumns = new Object;
const modeButton = document.getElementById("mode-button");
const modeScreen = document.getElementById("mode");
const upArrow = document.getElementById('up-arrow');
const downArrow = document.getElementById('down-arrow');
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');
let initialPosition = [10, 11];
let headPosition = initialPosition;
let previousHeadPosition = [];
let isTailSet = false;
let tailPosition = [];
let currentDirection;
let previousDirection;
let boardSize;
let keepIterating = true;
let snakeLength = 1;
let foodPosition;
let gameSpeed = 180;
let bestScore = 0;
let currentMode = 'Normal';
let gameOver = false;



function createBoard(rowsNumber = 8){
    for (let i = 1; i <= rowsNumber; i++){
        const myRow = document.createElement('div');
        myRow.className = 'row';
        myRow.id = i;
        gameboard.appendChild(myRow);
        for (let j = 1; j <= rowsNumber; j++){
            const myColumn = document.createElement('div');
            myColumn.id = `${i}x${j}`;
            gameboard.children[i - 1].appendChild(myColumn);
        }
    }
    boardSize = rowsNumber;
};


function generateRowsAndColumns() {
    for (let i = 1; i < 21; i++){
      rowsAndColumns[`row${i}`] = {};
        for (let j = 1; j < 21; j++){
            rowsAndColumns[`row${i}`][`column${j}`] = {};
            rowsAndColumns[`row${i}`][`column${j}`]['status'] = 'free';
            rowsAndColumns[`row${i}`][`column${j}`]['next'] = [];
            rowsAndColumns[`row${i}`][`column${j}`]['queuedGrowth'] = 0;
        }
    };
};


function switchDirection(event){

    if (event.key === 'w' || event.key === 'ArrowUp'){
        currentDirection == 'down' ? null :
        previousDirection == 'down' ? null :
        currentDirection = 'up';
    } else if (event.key === 's' || event.key === 'ArrowDown'){
        currentDirection == 'up' ? null :
        previousDirection == 'up' ? null :
        currentDirection = 'down';
    } else if (event.key === 'a' || event.key === 'ArrowLeft'){
        currentDirection == 'right' ? null :
        previousDirection == 'right' ? null :
        currentDirection = 'left';
    } else if (event.key === 'd' || event.key === 'ArrowRight'){
        currentDirection == 'left' ? null :
        previousDirection == 'left' ? null :
        currentDirection = 'right';
    }
};


function moveHead(){
    let current = document.getElementById(`${headPosition[0]}x${headPosition[1]}`);
    snakeLength === 1 ? current.style.backgroundColor = '#abc620' : null
    previousHeadPosition[0] = headPosition[0];
    previousHeadPosition[1] = headPosition[1];

    if (currentDirection === 'up'){
        headPosition[0] == 1 ? loseGame() : 
        headPosition[0] -= 1;
    } else if (currentDirection === 'down'){
        headPosition[0] == boardSize ? loseGame() :
        headPosition[0] += 1;
    } else if (currentDirection === 'left'){
        headPosition[1] == 1 ? loseGame() :
        headPosition[1] -= 1;
    } else if (currentDirection === 'right'){
        headPosition[1] == boardSize ? loseGame() :
        headPosition[1] += 1;
    }

    if (snakeLength > 1){
        rowsAndColumns[`row${headPosition[0]}`][`column${headPosition[1]}`]['status'] === 'taken' ? loseGame() :
        rowsAndColumns[`row${headPosition[0]}`][`column${headPosition[1]}`]['status'] = 'taken';
    }

    
    current = document.getElementById(`${headPosition[0]}x${headPosition[1]}`);
    current.style.backgroundColor = '#354900';
    current.style.backgroundImage = null;
    rowsAndColumns[`row${previousHeadPosition[0]}`][`column${previousHeadPosition[1]}`]['next'] = [headPosition[0], headPosition[1]];
    previousDirection = currentDirection;
};

function moveTail(){

    if (isTailSet === true){
        tailPosition[0] = headPosition[0];
        tailPosition[1] = headPosition[1];
        isTailSet = 'inactive';
    } else if (rowsAndColumns[`row${tailPosition[0]}`][`column${tailPosition[1]}`]['queuedGrowth'] > 0){
        rowsAndColumns[`row${tailPosition[0]}`][`column${tailPosition[1]}`]['queuedGrowth'] -= 1;
    } else {
        let tail = document.getElementById(`${tailPosition[0]}x${tailPosition[1]}`);
        tail.style.backgroundColor = '#abc620';
        let tempTail = tailPosition.slice();
        rowsAndColumns[`row${tailPosition[0]}`][`column${tailPosition[1]}`]['status'] = 'free';
        tailPosition[0] = rowsAndColumns[`row${tempTail[0]}`][`column${tempTail[1]}`]['next'][0];
        tailPosition[1] = rowsAndColumns[`row${tempTail[0]}`][`column${tempTail[1]}`]['next'][1];
    };
};


function iterate(){
    if (keepIterating === true){

        setTimeout(() => {
            moveHead();
            if (headPosition[0] == foodPosition[0] && headPosition[1] == foodPosition[1]){
                eatFood();
                spawnFood();
            };
            snakeLength > 1 ? moveTail() : null;
            iterate();
        }, gameSpeed)
    }
};


function spawnFood(){
    let randomRow = +`${Math.floor(Math.random() * 20 + 1)}`;
    let randomColumn = +`${Math.floor(Math.random() * 20 + 1)}`;
    let randomPosition = rowsAndColumns[`row${randomRow}`][`column${randomColumn}`]['status'];
    if (randomPosition === 'free'){
        foodPosition = [randomRow, randomColumn];
        rowsAndColumns[`row${randomRow}`][`column${randomColumn}`]['status'] = 'food';
        let food = document.getElementById(`${randomRow}x${randomColumn}`);
        food.style.backgroundImage = "url('./egg.png')";
    } else { spawnFood() }
};


function eatFood(){
    biteSound.play();
    rowsAndColumns[`row${headPosition[0]}`][`column${headPosition[1]}`]['queuedGrowth'] += 2;
    isTailSet === false ? isTailSet = true : null;
    snakeLength += 2;
    scoreScreen.textContent = `Score: ${snakeLength}`;
    if (snakeLength > bestScore){
        bestScore = snakeLength;
        bestScoreScreen.textContent = `Best score: ${bestScore}`;
    };
};


function loseGame(){
    loseGameSound.play();
    keepIterating = false;
    message1.textContent = "You lost! :(";
    message2.textContent = "Press a key to play again.";
    gameOver = true;
};

function changeMode(){
    if (currentMode === 'Normal'){
        currentMode = 'Hard';
        gameSpeed = 90;
    } else if (currentMode === 'Hard'){
        currentMode = 'Insane';
        gameSpeed = 30;
    } else if (currentMode === 'Insane'){
        currentMode = 'Easy';
        gameSpeed = 300;
    } else {
        currentMode = 'Normal';
        gameSpeed = 180;
    }
    modeScreen.textContent = `Mode: ${currentMode}`;
}

function restartGame(){
    keepIterating = false;
    console.log("RESTARTING");
    for (let i = 1; i < 21; i++){
      rowsAndColumns[`row${i}`] = {};
        for (let j = 1; j < 21; j++){
            rowsAndColumns[`row${i}`][`column${j}`] = {};
            rowsAndColumns[`row${i}`][`column${j}`]['status'] = 'free';
            rowsAndColumns[`row${i}`][`column${j}`]['next'] = [];
            rowsAndColumns[`row${i}`][`column${j}`]['queuedGrowth'] = 0;
        }
    };

    for (let i = 1; i <= 20; i++){
        for (let j = 1; j <= 20; j++){
            let currentSquare = document.getElementById(`${i}x${j}`);
            currentSquare.style.backgroundColor = '#abc620';
            currentSquare.style.backgroundImage = null;
        }
    }

    initialPosition = [10, 11];
    headPosition = initialPosition;
    previousHeadPosition = [];
    isTailSet = false;
    tailPosition = [];
    currentDirection = null;
    previousDirection;
    keepIterating = true;
    snakeLength = 1;
    foodPosition = null;
    gameOver = false;

    message1.textContent = null;
    message2.textContent = null;
    scoreScreen.textContent = `Score: 0`;
    let paintInitial = document.getElementById('10x11');
    paintInitial.style.backgroundColor = '#354900';
    keepIterating = true;
    spawnFood();
    iterate();
}

modeButton.onclick = changeMode;
upArrow.onclick = function() {gameOver ? restartGame() : currentDirection = 'up';};
downArrow.onclick = function() {gameOver ? restartGame() : currentDirection = 'down';};
leftArrow.onclick = function() {gameOver ? restartGame() : currentDirection = 'left';};
rightArrow.onclick = function() {gameOver ? restartGame() : currentDirection = 'right';};

///////////////////////////////////////////////////////////////////////////////////////////
// Initialize game //

createBoard(20);
generateRowsAndColumns();
let paintInitial = document.getElementById('10x11');
paintInitial.style.backgroundColor = '#354900';

document.onkeydown = function(){
    if (gameOver === false){
        switchDirection(event);
    } else {
        restartGame();
    };
};

spawnFood();
iterate();
