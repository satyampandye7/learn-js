const cells = document.querySelectorAll('.cell');
const messageElement = document.getElementById('message');
const resetButton = document.getElementById('resetButton');
const resetAllButton = document.getElementById('resetAllButton');
const finalMessage = document.getElementById('finalMessage');
const scoreDisplay = document.getElementById('scoreDisplay');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // Player 'X' starts the game
let gameActive = true;

// Game statistics stored in localStorage
let gamesPlayed = parseInt(localStorage.getItem('gamesPlayed')) || 0;
let playerWins = parseInt(localStorage.getItem('playerWins')) || 0;
let computerWins = parseInt(localStorage.getItem('computerWins')) || 0;
let ties = parseInt(localStorage.getItem('ties')) || 0; // New variable for ties
const totalGames = 5;
const resetDelay = 2000; // 2-second delay for automatic reset

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Update the win count display
function updateScoreDisplay() {
    scoreDisplay.textContent = `Player Wins: ${playerWins} | Computer Wins: ${computerWins} | Ties: ${ties}`;
}

// Player's move
function handleClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (board[index] !== '' || !gameActive || currentPlayer !== 'X') {
        return;
    }

    // Player 'X' moves
    makeMove(index, 'X');

    if (gameActive) {
        // Let the computer take its turn after the player's move
        setTimeout(computerMove, 500); // Delay for a more realistic feel
    }
}

// Make a move on the board
function makeMove(index, player) {
    board[index] = player;
    document.querySelector(`.cell[data-index="${index}"]`).textContent = player;
    
    if (checkWinner(player)) {
        messageElement.textContent = `Player ${player} wins!`;
        gameActive = false;

        if (player === 'X') {
            playerWins++;
            localStorage.setItem('playerWins', playerWins);
        } else {
            computerWins++;
            localStorage.setItem('computerWins', computerWins);
        }

        updateScoreDisplay(); // Update the score display after each game
        checkGameEnd();
        setTimeout(resetGame, resetDelay); // Automatically reset after win
    } else if (!board.includes('')) {
        messageElement.textContent = "It's a tie!";
        gameActive = false;
        ties++;
        localStorage.setItem('ties', ties); // Store ties in localStorage
        updateScoreDisplay(); // Update to reflect the tie
        checkGameEnd();
        setTimeout(resetGame, resetDelay); // Automatically reset after tie
    } else {
        currentPlayer = player === 'X' ? 'O' : 'X';
        messageElement.textContent = `Player ${currentPlayer}'s turn`;
    }
}

// Computer's move (random for simplicity)
function computerMove() {
    if (!gameActive) return;

    const availableCells = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);

    if (availableCells.length > 0) {
        const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        makeMove(randomIndex, 'O');
    }
}

// Check for a winner
function checkWinner(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return board[index] === player;
        });
    });
}

// Check if 5 games have been played and declare the winner
function checkGameEnd() {
    gamesPlayed++;
    localStorage.setItem('gamesPlayed', gamesPlayed);

    if (gamesPlayed >= totalGames) {
        gameActive = false;

        if (playerWins > computerWins) {
            finalMessage.textContent = `Congratulations! Player X wins with ${playerWins} out of ${totalGames} games.`;
        } else if (computerWins > playerWins) {
            finalMessage.textContent = `Computer wins with ${computerWins} out of ${totalGames} games.`;
        } else {
            finalMessage.textContent = `Match Draw! Both players have won ${playerWins} times with ${ties} ties.`;
        }

        // Disable further moves
        cells.forEach(cell => cell.removeEventListener('click', handleClick));
    }
}

// Reset the game but keep track of total games
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
    });
    messageElement.textContent = "Player X's turn";
}

// Reset all data including localStorage
function resetAll() {
    localStorage.removeItem('gamesPlayed');
    localStorage.removeItem('playerWins');
    localStorage.removeItem('computerWins');
    localStorage.removeItem('ties'); // Reset ties in localStorage
    gamesPlayed = 0;
    playerWins = 0;
    computerWins = 0;
    ties = 0; // Reset ties count
    finalMessage.textContent = '';
    updateScoreDisplay(); // Reset the score display
    resetGame();
    cells.forEach(cell => cell.addEventListener('click', handleClick)); // Re-enable clicking on cells
}

// Add event listener to each cell for player moves
cells.forEach(cell => cell.addEventListener('click', handleClick));

// Add event listener for reset buttons
resetButton.addEventListener('click', resetGame);
resetAllButton.addEventListener('click', resetAll);

// Initial score display on page load
updateScoreDisplay();
