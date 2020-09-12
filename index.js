const downArrow = document.getElementById("down-arrow");
const gameOverDisplay = document.getElementById("game-over");
const grid = document.querySelector(".grid");
const leftArrow = document.getElementById("left-arrow");
const levelDisplay = document.getElementById("level-display");
const rightArrow = document.getElementById("right-arrow");
const scoreDisplay = document.getElementById("score-display");
const spacebar = document.getElementById("spacebar");
const startButton = document.getElementById("start-button");
const upArrow = document.getElementById("up-arrow");
let squares = Array.from(document.querySelectorAll(".grid div"));

const colors = ["orange", "yellow", "red", "cyan", "purple", "lightgreen", "blue"];
const width = 10;
let delay = 1000;
let isGameOver = false;
let level = 1;
let nextRandom = 0;
let score = 0;
let timerId;

const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
];

const l2Tetromino = [
    [0, 1, width + 1, width * 2 + 1],
    [width, width * 2, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [width * 2, width * 2 + 1, width * 2 + 2, width + 2]
];

const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
];

const z2Tetromino = [
    [1, width + 1, width, width, width * 2],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [1, width + 1, width, width, width * 2],
    [width, width + 1, width * 2 + 1, width * 2 + 2]
];

const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
];

const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
];

const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
];

const theTetrominoes = [lTetromino, l2Tetromino, zTetromino, z2Tetromino, tTetromino, oTetromino, iTetromino];

let currentPosition = 44;
let currentRotation = 0;

let random = Math.floor(Math.random() * theTetrominoes.length);
let current = theTetrominoes[random][currentRotation];

function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add("tetromino");
        squares[currentPosition + index].style.backgroundColor = colors[random];
    });
}

function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove("tetromino");
        squares[currentPosition + index].style.backgroundColor = "";
    });
}

document.addEventListener("keydown", control);
downArrow.addEventListener("click", control);
leftArrow.addEventListener("click", control);
rightArrow.addEventListener("click", control);
spacebar.addEventListener("click", control);
upArrow.addEventListener("click", control);

function control(event) {
    if (timerId && !isGameOver) {
        if (event.key === "ArrowLeft" || event.target.id === "left-arrow") {
            moveLeft();
        } else if (event.key === "ArrowRight" || event.target.id === "right-arrow") {
            moveRight();
        } else if (event.key === "ArrowDown" || event.target.id === "down-arrow") {
            moveDown();
        } else if (event.key === "ArrowUp" || event.target.id === "up-arrow") {
            rotate();
        } else if (event.key === " " || event.target.id === "spacebar") {
            snapDown();
        }
    }
}

function moveDown() {
    undraw();

    if (!current.some(index => squares[currentPosition + index + width].classList.contains("taken"))) {
        currentPosition += width;
    } else {
        setTimeout(() => {
            freeze();
        }, delay);
    }
    
    draw();
}

function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

    if (!isAtLeftEdge) {
        currentPosition -= 1;
    }
    
    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
        currentPosition += 1;
    }

    draw();
}

function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

    if (!isAtRightEdge) {
        currentPosition += 1;
    }
    
    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
        currentPosition -= 1;
    }

    draw();
}

function snapDown() {
    undraw();

    while (!current.some(index => squares[currentPosition + index + width].classList.contains("taken"))) {
        currentPosition += width;
    }

    draw();
    freeze();
}

function rotate() {
    let leftCount = 0;
    let rightCount = 0;
    
    undraw();
    
    currentRotation++;

    if (currentRotation === current.length) {
        currentRotation = 0;
    }

    current = theTetrominoes[random][currentRotation];
    
    //ON ROTATION, CHECK HOW MANY SQUARES ARE ON EACH SIDE OF GRID
    current.forEach(index => {
        if ((currentPosition + index) % width <= 1) {
            leftCount++;
        } else if ((currentPosition + index) % width >= 8) {
            rightCount++;
        }
    });

    //DEPENDING ON WHICH SIDE HAS MORE SQUARES, SHIFT PIECE OVER ACCORDINGLY
    if (leftCount !== 0 && rightCount !== 0) {
        if (leftCount > rightCount) {
            currentPosition += 1;
        } else if (leftCount < rightCount) {
            currentPosition -= 1;
        } else if (leftCount === rightCount) {
            currentPosition -= 2;
        }
    }
    
    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
        const currentHold = currentPosition;
        let count = 0;
        
        while (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
            currentPosition -= width;
            count++;
        }
        
        if (count > 2) {
            currentPosition = currentHold;
        }
    }
    
    if (current.some(index => squares[currentPosition + index].classList.contains("tetromino"))) {
        currentRotation--;
        
        if (currentRotation < 0) {
            currentRotation = current.length - 1;
        }

        current = theTetrominoes[random][currentRotation];
    }

    draw();
}

function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains("taken"))) {
        current.forEach(index => {
            squares[currentPosition + index].classList.add("taken");
        });

        currentPosition = 44;
        currentRotation = 0;
        random = nextRandom
        
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        
        current = theTetrominoes[random][currentRotation];
        
        displayShape();
        addScore();
        gameOver();
        draw();
    }
}

const displaySquares = document.querySelectorAll(".mini-grid div");
const displayWidth = 4;


const upNext = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, 1, displayWidth + 1, displayWidth * 2 + 1],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth + 1, displayWidth, displayWidth, displayWidth * 2],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
];

function displayShape() {
    displaySquares.forEach(square => {
        square.classList.remove("tetromino");
        square.style.backgroundColor = "";
    });
    
    upNext[nextRandom].forEach(index => {
        displaySquares[index].classList.add("tetromino");
        displaySquares[index].style.backgroundColor = colors[nextRandom];
    });
}


function addScore() {
    let countRows = 0;

    for (let i = 0; i < 239; i += width) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
    
        if (row.every(index => squares[index].classList.contains("taken"))) {
            countRows++;
            score += 10;

            if (score % 50 === 0) {
                nextLevel();
            }

            row.forEach(index => {
                squares[index].classList.remove("taken");
                squares[index].classList.remove("tetromino");
                squares[index].style.backgroundColor = "";
            });

            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));

            for (let j = 0; j < 50; j++) {
                if (j <= 39) {
                    squares[j].classList.add("hidden");
                } else {
                    squares[j].classList.remove("hidden");
                }
            }
        }
    }

    if (countRows === 4) {
        score += 10;
    }

    if (score % 50 === 0 && countRows === 4) {
        nextLevel();
    }

    scoreDisplay.innerHTML = score;
}

function nextLevel() {
    clearInterval(timerId);
                
    level++;
    levelDisplay.innerHTML = level;
    delay -= 100;
    
    if (delay < 100) {
        delay = 100;
    }

    timerId = setInterval(moveDown, delay);
}

function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
        isGameOver = true;
        gameOverDisplay.innerHTML = "Game Over";
        clearInterval(timerId);
    }
}

startButton.addEventListener("click", function() {
    if (!levelDisplay.innerHTML) {
        levelDisplay.innerHTML = level;
    }

    if (!gameOverDisplay.innerHTML) {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            this.blur();

            draw();
            timerId = setInterval(moveDown, delay);

            if (!levelDisplay.innerHTML) {
                nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            }
            
            displayShape();
        }
    } else {
        isGameOver = false;
        gameOverDisplay.innerHTML = "";
        this.blur();

        for (let i = 0; i < 239; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
            delay = 1000;

            row.forEach(index => {
                squares[index].classList.remove("taken");
                squares[index].classList.remove("tetromino");
                squares[index].style.backgroundColor = "";
            });
        }

        draw();
        timerId = setInterval(moveDown, delay);

        level = 1;
        score = 0;
        levelDisplay.innerHTML = level;
        scoreDisplay.innerHTML = score;

        displayShape();
    }
});