// Define the game board
let gameBoard = Array(20).fill().map(() => Array(10).fill(0));

// Initialize the score
let score = 0;

// Define the score multiplier
let scoreMultiplier = 1;

// Define the current position
let currentPosition = [5, 0];

// Define the pieces
let pieces = [
    [[1, 1, 1, 1]], // I
    [[1, 1, 1], [0, 0, 1]], // J
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1], [1, 1]], // O
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 0], [0, 1, 1]] // Z
];

// Function to generate a new piece
function generatePiece() {
    let piece = pieces[Math.floor(Math.random() * pieces.length)]; // Select a random piece
    return piece.map(row => [...row]); // Return a copy of the piece
}

// Define the current piece
let currentPiece = generatePiece();

// Function to draw the game board
function drawGameBoard() {
    // Create a copy of the game board
    let gameBoardCopy = gameBoard.map(row => [...row]);

    // Draw the current piece on the copy
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x] === 1) {
                gameBoardCopy[currentPosition[1] + y][currentPosition[0] + x] = 1;
            }
        }
    }

    // Update the table
    let table = document.getElementById('gameBoard');
    table.innerHTML = gameBoardCopy.map(row => '<tr>' + row.map(cell => '<td class="' + (cell ? 'block' : '') + '"></td>').join('') + '</tr>').join('');
}

// Function to update the game board with the current piece
function updateGameBoard() {
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x] === 1) {
                gameBoard[currentPosition[1] + y][currentPosition[0] + x] = 1;
            }
        }
    }
}

// Function to update the score display
function updateScore() {
    let scoreElement = document.getElementById('score');
    scoreElement.textContent = 'Score: ' + score;
}

// Function to remove completed lines
function removeCompletedLines() {
    let linesRemoved = 0;
    for (let y = 0; y < gameBoard.length; y++) {
        if (gameBoard[y].every(cell => cell !== 0)) {
            gameBoard.splice(y, 1);
            gameBoard.unshift(Array(10).fill(0));
            linesRemoved++;
        }
    }
    let bonusMultiplier = linesRemoved > 1 ? linesRemoved * 0.5 : 1; // Add a bonus multiplier for clearing more than one line
    score += linesRemoved * 10 * (scoreMultiplier * bonusMultiplier); // Increase the score
    scoreMultiplier += linesRemoved * 0.1; // Increase the score multiplier
    updateScore(); // Update the score display
}

// Function to move the current piece
function movePiece(direction) {
    // Calculate the new position
    let newPosition = [...currentPosition]; // Copy the current position
    if (direction === 'left') {
        newPosition[0] -= 1; // Move left
    } else if (direction === 'right') {
        newPosition[0] += 1; // Move right
    } else if (direction === 'down') {
        newPosition[1] += 1; // Move down
    }

    // Check if the new position is valid
    let isValid = true;
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x] === 1) {
                let newX = newPosition[0] + x;
                let newY = newPosition[1] + y;
                if (newX < 0 || newX >= 10 || newY < 0 || newY >= 20 || gameBoard[newY][newX] !== 0) {
                    isValid = false;
                }
            }
        }
    }

    // Only update the current position if the new position is valid
    if (isValid) {
        currentPosition = newPosition;
    } else if (direction === 'down') {
        // If the piece can't move down, update the game board and generate a new piece
        updateGameBoard();
        removeCompletedLines();
        currentPiece = generatePiece();
        currentPosition = [5, 0]; // Start at the top of the game board

        // Check if the game is over
        if (!isValidMove(currentPosition, currentPiece)) {
            alert('Game Over');
            window.location.reload();
        }
    }

    // Draw the game board
    drawGameBoard();
}

// Function to check if a move is valid
function isValidMove(position, piece) {
    for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
            if (piece[y][x] === 1) {
                let newX = position[0] + x;
                let newY = position[1] + y;
                if (newX < 0 || newX >= 10 || newY < 0 || newY >= 20 || gameBoard[newY][newX] !== 0) {
                    return false;
                }
            }
        }
    }
    return true;
}
// Function to rotate the current piece
function rotatePiece() {
    let newPiece = currentPiece[0].map((val, index) => currentPiece.map(row => row[index])); // Transpose
    newPiece = newPiece.map(row => row.reverse()); // Reverse each row
    currentPiece = newPiece;
}
// Add event listener for keydown events
window.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        movePiece('left');
    } else if (event.key === 'ArrowRight') {
        movePiece('right');
    } else if (event.key === 'ArrowDown') {
        movePiece('down');
    } else if (event.key === 'ArrowUp') {
        rotatePiece();
    } else if (event.key === ' ') {
        hardDropPiece();
    }
});
// Start the game loop
setInterval(() => {
    movePiece('down');
}, 500);

// Function to hard drop the current piece
function hardDropPiece() {
    // Keep moving the piece down until it can't move any further
    while (isValidMove([currentPosition[0], currentPosition[1] + 1], currentPiece)) {
        currentPosition[1]++;
    }

    // Update the game board and generate a new piece
    updateGameBoard();
    removeCompletedLines();
    currentPiece = generatePiece();
    currentPosition = [5, 0]; // Start at the top of the game board

    // Check if the game is over
    if (!isValidMove(currentPosition, currentPiece)) {
        alert('Game Over');
        window.location.reload();
    }

    // Draw the game board
    drawGameBoard();
}