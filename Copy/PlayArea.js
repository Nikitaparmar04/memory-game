'use strict';

// Getting data from the login page
const storedUsername = localStorage.getItem('username');
const storedDifficulty = localStorage.getItem('difficulty');
let guessedImageSrc = '';
let canFlipCard = false;
// Initialize game variables
let currentScore = 0;
let highscore = 0;
let toGuessImageNumber;


// Utility Functions
function getScoreIncrement(level) {
    switch (level) {
        case 'easy':
            return 10;
        case 'medium':
            return 5;
        case 'hard':
            return 3;
        default:
            return 0;
    }
}

function updateScores() {
    const highScoreEl = document.getElementById('Highscore');
    const currentScoreEl = document.getElementById('currentScore');
    if (highScoreEl && currentScoreEl) {
        highScoreEl.textContent = highscore;
        currentScoreEl.textContent = currentScore;
    } else {
        console.error('Score elements not found');
    }
}


// function checkWinnerCondition() {
//     if (currentScore >= 100) {
//         // TODO: Implement game winning pop-up
//         console.log('Winner!');
//     }
// }

function init() {
    currentScore = 0;
    highscore = 0; // Assuming you want to reset highscore as well
    updateScores();
    generateCardGrid(storedDifficulty);
    pickGuessedImage();
    initializeCards();
    startTimer(storedDifficulty, function () {
        console.log('Timer ended for easy level');
    });
    // TODO: Implement GenImageToGuess logic
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    // Set player name
    const playerNameEl = document.querySelector('.p-name');
    if (playerNameEl) {
        playerNameEl.innerHTML = storedUsername;
    } else {
        console.error('Player name element not found');
    }

    document.querySelector('.start_game').addEventListener('click', init);
    // Initialize game if submitted
    // if (localStorage.getItem('isSubmitted') === 'true') {
    //     init();
    //     localStorage.removeItem('isSubmitted');
    // }
});


function setCardGrid(numCards) {
    const gameArea = document.querySelector('.cardArea');
    const parentElement = gameArea.parentElement;


    // Calculate the number of rows and columns we want to display
    const sqrt = Math.sqrt(numCards);
    let rows, cols;

    // If the square root is an integer, it means we can create a perfect square
    if (Number.isInteger(sqrt)) {
        rows = sqrt;
        cols = sqrt;
    } else {
        // If not, we find the nearest square number and use its square root as the number of rows
        rows = Math.ceil(sqrt);
        // Ensure we have enough columns to fit all cards
        cols = Math.ceil(numCards / rows);
    }

    // Set the CSS grid layout properties dynamically
    gameArea.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    gameArea.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    // Adjust card sizes based on the number of columns
    // Adjust for any padding and gap within the gameArea
    const gapSize = 10; // If you have set a gap in your CSS
    const paddingSize = 10; // If you have set padding in your CSS
    const totalGapWidth = gapSize * (cols - 1);
    const totalGapHeight = gapSize * (rows - 1);

    // Calculate the available width and height for the cards
    // const availableWidth = gameArea.offsetWidth - totalGapWidth - (paddingSize * 2);
    // const availableHeight = gameArea.offsetHeight - totalGapHeight - (paddingSize * 2);

    // Calculate the available width and height for the cards, considering the parent's max dimensions
    const availableWidth = Math.min(parentElement.clientWidth - totalGapWidth - (paddingSize * 2), gameArea.offsetWidth);
    const availableHeight = Math.min(parentElement.clientHeight - totalGapHeight - (paddingSize * 2), gameArea.offsetHeight);


    // Assume a square card for simplicity; adjust based on your desired aspect ratio
    const cardWidth = availableWidth / cols;
    const cardHeight = availableHeight / rows;

    // Set size of cards to fit within the grid
    const cards = gameArea.querySelectorAll('.flip-card');
    cards.forEach(card => {
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
    });
}


function generateCardGrid(level) {
    const gameArea = document.querySelector('.cardArea');
    if (!gameArea) {
        console.error('The gameArea element was not found in the DOM.');
        return; // Exit the function if gameArea doesn't exist
    }

    gameArea.innerHTML = ''; // Clear the game area

    const numCards = level === 'Easy' ? 4 : level === 'Medium' ? 9 : 16; // Determine the number of cards based on level
    const usedImages = new Set(); // To keep track of images already used

    for (let i = 0; i < numCards; i++) {
        let imageNumber;
        do {
            imageNumber = Math.trunc(Math.random() * 19) + 1; // Random number between 1 and 19
        } while (usedImages.has(imageNumber)); // Ensure unique images for each card
        usedImages.add(imageNumber); // Add the number to the set of used images

        const flipCard = document.createElement('div');
        flipCard.className = 'flip-card';
        flipCard.innerHTML = `
  <div class="flip-card-inner">
    <div class="flip-card-front">
      <p class="title">Flip Me</p>
      <p>Hover Me</p>
    </div>
    <div class="flip-card-back" style="background-image: url('./assets/child/${imageNumber}.png');">
      <!-- The back face of the card -->
    </div>
  </div>
`;

        gameArea.appendChild(flipCard);
    }

    setCardGrid(numCards);
}

/*=================== TIME FUNCTION =========================*/

function onTimerEnd() {
    const cards = document.querySelectorAll('.flip-card-inner');
    cards.forEach(card => card.style.transform = ''); // Remove the rotation

    // Now allow cards to be clicked and flipped back to the image
    canFlipCard = true;
}

function startTimer(gameLevel, onTimerEnd) {
    let duration;
    switch (gameLevel) {
        case 'Easy':
            duration = 5;
            break;
        case 'Medium':
            duration = 12;
            break;
        case 'Hard':
            duration = 15;
            break;
        default:
            duration = 5; // Default duration if level is not recognized
    }

    let timer = duration, seconds;
    const timerElement = document.getElementById('timer');
    const interval = setInterval(function () {
        seconds = parseInt(timer, 10);
        timerElement.textContent = seconds < 10 ? "0" + seconds : seconds;
        if (--timer < 0) {
            clearInterval(interval);
            onTimerEnd();
        }
    }, 1000);
}

//====================== IMAGE SELECTION ===============================//


function onCardClick(e) {
    if (!canFlipCard) return; // Ignore clicks if the cards shouldn't be flipped

    let cardInner = e.currentTarget.querySelector('.flip-card-inner');

    // Check if the card is already facing up, if so, ignore the click
    if (cardInner.style.transform === 'rotateY(180deg)') {
        return;
    }

    // Flip the card
    cardInner.style.transform = 'rotateY(180deg)';

    // Check if the card's image matches the guessed image
    let cardImage = cardInner.querySelector('.flip-card-back').style.backgroundImage;
    if (cardImage === guessedImageSrc) {
        currentScore += getScoreIncrement(level); // Increase score based on level
        updateScores();
    }
}

// Add click event listener to cards
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', onCardClick);
});

// Pick a random card's image as the guessed image when the game starts
function pickGuessedImage() {
    const cards = document.querySelectorAll('.flip-card-back');
    const randomCardIndex = Math.floor(Math.random() * cards.length);
    guessedImageSrc = cards[randomCardIndex].style.backgroundImage;
    // Set the guessed image in the question image span
    document.querySelector('.question_image img').src = guessedImageSrc.replace('url("', '').replace('")', '');
}

function initializeCards() {
    const cards = document.querySelectorAll('.flip-card-inner');
    cards.forEach(card => card.style.transform = 'rotateY(180deg)');
}

