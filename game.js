let targetWord;
let currentAttempt;
let currentTile;
let gameActive;
const gameBoard = document.getElementById('game-board');
const keyboard = document.getElementById('keyboard');
const restartBtn = document.getElementById('restart-btn');

let words = [];

async function loadWords() {
    try {
        const response = await fetch('https://gist.githubusercontent.com/scholtes/94f3c0303ba6a7768b47583aff36654d/raw/d9cddf5e16140df9e14f19c2de76a0ef36fd2748/wordle-La.txt');
        const text = await response.text();
        words = text.split('\n').map(word => word.trim().toUpperCase()).filter(word => word.length === 5);
        initializeGame();
    } catch (error) {
        console.error('Error loading word list:', error);
    }
}

function initializeGame() {
    gameBoard.innerHTML = '';
    keyboard.innerHTML = '';
    targetWord = words[Math.floor(Math.random() * words.length)];
    currentAttempt = 0;
    currentTile = 0;
    gameActive = true;
    restartBtn.style.display = 'none';

    // Create game board
    for (let i = 0; i < 30; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        gameBoard.appendChild(tile);
    }
        const keyboardLayout = [
            'QWERTYUIOP',
            'ASDFGHJKL',
            'ZXCVBNM'
        ];

        function createKey(letter, isSpecial = false) {
            const key = document.createElement('button');
            key.textContent = letter;
            key.classList.add('key');
            if (isSpecial) key.classList.add('special-key');
            key.setAttribute('data-key', letter);
            key.addEventListener('click', () => {
                if (letter === 'ENTER') {
                    checkGuess();
                } else if (letter === 'DEL') {
                    deleteLetter();
                } else {
                    handleInput(letter);
                }
            });
            return key;
        }

        keyboardLayout.forEach((row, index) => {
            const rowDiv = document.createElement('div');
            rowDiv.style.display = 'flex';
            rowDiv.style.justifyContent = 'center';
        
            if (index === 2) {
                rowDiv.appendChild(createKey('ENTER', true));
            }
        
            row.split('').forEach(letter => {
                rowDiv.appendChild(createKey(letter));
            });
        
            if (index === 2) {
                rowDiv.appendChild(createKey('DEL', true));
            }
        
            keyboard.appendChild(rowDiv);
        });
    }

function handleInput(letter) {
    if (!gameActive) return;
    if (currentTile < (currentAttempt + 1) * 5) {
        const tiles = gameBoard.querySelectorAll('.tile');
        tiles[currentTile].textContent = letter;
        currentTile++;
    }
}

document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    if (e.key === 'Enter') {
        checkGuess();
    } else if (e.key === 'Backspace') {
        deleteLetter(e.ctrlKey);
    } else if (e.key.match(/^[a-zA-Z]$/)) {
        handleInput(e.key.toUpperCase());
    }
});

function deleteLetter(ctrlKey = false) {
    if (ctrlKey) {
        // Delete all letters in the current attempt
        while (currentTile > currentAttempt * 5) {
            currentTile--;
            const tiles = gameBoard.querySelectorAll('.tile');
            tiles[currentTile].textContent = '';
        }
    } else if (currentTile > currentAttempt * 5) {
        currentTile--;
        const tiles = gameBoard.querySelectorAll('.tile');
        tiles[currentTile].textContent = '';
    }
}
let lastMessageTime = 0;

function showMessage(message, duration = 2000) {
const now = Date.now();
if (now - lastMessageTime < 2000) return; // Cooldown check

lastMessageTime = now;
const messageElement = document.createElement('div');
messageElement.textContent = message;
messageElement.style.position = 'fixed';
messageElement.style.top = '10%';
messageElement.style.left = '50%';
messageElement.style.transform = 'translate(-50%, -50%)';
messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
messageElement.style.color = 'white';
messageElement.style.padding = '10px';
messageElement.style.borderRadius = '5px';
document.body.appendChild(messageElement);
setTimeout(() => {
    document.body.removeChild(messageElement);
}, duration);
}

function checkGuess() {
    const tiles = gameBoard.querySelectorAll('.tile');
    const guess = Array.from(tiles)
        .slice(currentAttempt * 5, (currentAttempt + 1) * 5)
        .map(tile => tile.textContent)
        .join('');

    if (guess.length !== 5) {
        showMessage("Too short");
        return;
    }

    if (!words.includes(guess)) {
        showMessage("Word not found");
        return;
    }

    for (let i = 0; i < 5; i++) {
        const tile = tiles[currentAttempt * 5 + i];
        const letter = guess[i];
        const key = keyboard.querySelector(`button[data-key="${letter}"]`);

        if (letter === targetWord[i]) {
            tile.classList.add('correct');
            key.classList.add('correct');
        } else if (targetWord.includes(letter)) {
            tile.classList.add('present');
            if (!key.classList.contains('correct')) {
                key.classList.add('present');
            }
        } else {
            tile.classList.add('absent');
            key.classList.add('absent');
        }
    }

    if (guess === targetWord) {
        gameActive = false;
        showMessage('Congratulations! You guessed the word!');
        restartBtn.style.display = 'block';
        triggerConfetti();
    } else if (currentAttempt === 5) {
        gameActive = false;
        showMessage(`Game over! The word was ${targetWord}`);
        restartBtn.style.display = 'block';
    }

    currentAttempt++;
    currentTile = currentAttempt * 5;
}        function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

restartBtn.addEventListener('click', initializeGame);


// Load words and initialize the game
loadWords();
// Initialize the game
initializeGame();