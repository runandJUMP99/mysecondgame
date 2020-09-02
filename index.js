const grid = document.querySelector(".grid");
const levelDisplay = document.getElementById("level-display");
const scoreDisplay = document.getElementById("score-display");
const startButton = document.getElementById("start-button");
let squares = Array.from(document.querySelectorAll(".grid div"));

const colors = ["orange", "yellow", "red", "cyan", "purple", "green", "blue"];
const width = 10;
let delay = 1000;
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

let currentPosition = 4;
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

document.addEventListener("keyup", control);

function control(event) {
    if (event.key === "ArrowLeft") {
        moveLeft();
    } else if (event.key === "ArrowRight") {
        moveRight();
    } else if (event.key === "ArrowDown") {
        moveDown();
    } else if (event.key === "ArrowUp") {
        snapDown();
    } else if (event.key === " ") {
        rotate();
    }
}

function moveDown() {
    undraw();

    if (!current.some(index => squares[currentPosition + index + width].classList.contains("taken"))) {
        currentPosition += width;
    }
    
    draw();
    
    if (current.some(index => squares[currentPosition + index + width].classList.contains("taken"))) {
        setTimeout(() => {
            freeze();
        }, delay);
    }
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
    
    current.forEach(index => {
        if ((currentPosition + index) % width <=1) {
            leftCount++;
        } else if ((currentPosition + index) % width >= 8) {
            rightCount++;
        }
    });

    if (leftCount !== 0 && rightCount !== 0) {
        if (leftCount > rightCount) {
            currentPosition += 1;
        } else if (leftCount < rightCount) {
            currentPosition -= 1;
        } else if (leftCount === rightCount) {
            currentPosition -= 2;
        }
    }

    draw();
}

function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains("taken"))) {
        current.forEach(index => {
            squares[currentPosition + index].classList.add("taken");
        });

        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];
        currentPosition = 4;
        
        draw();
        displayShape();
        addScore();
        gameOver();
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
    for (let i = 0; i < 199; i += width) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
    
        if (row.every(index => squares[index].classList.contains("taken"))) {
            score += 10;
            scoreDisplay.innerHTML = score;

            if (score % 50 === 0) {
                clearInterval(timerId);
                
                delay -= 100;
                level++;
                levelDisplay.innerHTML = level;
                timerId = setInterval(moveDown, delay);

                if (delay < 100) {
                    delay = 50;
                }
            }

            row.forEach(index => {
                squares[index].classList.remove("taken");
                squares[index].classList.remove("tetromino");
                squares[index].style.backgroundColor = "";
            });

            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
        }
    }
}

function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
        scoreDisplay.innerHTML = " Game Over";
        clearInterval(timerId);
    }
}

startButton.addEventListener("click", function() {
    if (!levelDisplay.innerHTML) {
        levelDisplay.innerHTML = level;
    }

    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    } else {
        draw();
        timerId = setInterval(moveDown, delay);
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        displayShape();
    }
});