'use strict';

// Getting data from the login page
const storedUsername = localStorage.getItem('username');
const storedDifficulty = localStorage.getItem('difficulty');
let guessedImageSrc = '';
let canFlipCard = false;
// Initialize game variables
let currentScore = 0;
let highscore = localStorage.getItem('Highscore') || 0;
let toGuessImageNumber;
let flippedCard = false;


// Setting selected difficulty mode in left-aside section 
document.addEventListener('DOMContentLoaded', function () {
    console.log('Content Loaded')
    if(storedDifficulty === 'Easy'){
        document.querySelector('.medium').style.display = 'none';
        document.querySelector('.hard').style.display = 'none';
    }else if(storedDifficulty === 'Medium'){
        document.querySelector('.easy').style.display = 'none';
        document.querySelector('.hard').style.display = 'none';
    }else{
        document.querySelector('.easy').style.display = 'none';
        document.querySelector('.medium').style.display = 'none';
    }
});


// Utility Functions
function getScoreIncrement(level) {
    console.log('Score Level has Been Assigned')
    switch (level) {
        case 'Easy':
            return 10;
        case 'Medium':
            return 5;
        case 'Hard':
            return 3;
        default:
            return 0;
    }
}

function updateScores() {
    console.log('score upated')
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
    console.log('Game has been Initialized')
    // currentScore = 0;
    // highscore = 0; // Assuming you want to reset highscore as well
    updateScores();
    generateCardGrid(storedDifficulty);
    initializeCards();
    startTimer(storedDifficulty, onTimerEnd);
    canFlipCard = true;
    flippedCard = false
}

function Reset() {
    console.log('Game has been Initialized')
    currentScore = 0;
    updateScores();
    generateCardGrid(storedDifficulty);
    initializeCards();
    startTimer(storedDifficulty, onTimerEnd);
    canFlipCard = true;
    flippedCard = false
}


// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    console.log('User Name has been updated')
    // Set player name
    const playerNameEl = document.querySelector('.p-name');
    if (playerNameEl) {
        playerNameEl.innerHTML = storedUsername;
    } else {
        console.error('Player name element not found');
    }

    document.querySelector('.start_game').addEventListener('click', init);

    const refreshButton = document.getElementById('refreshButton');
    if (refreshButton) {
        refreshButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the default action of the link
            Reset(); // Call the init function to reset the game
        });
    } else {
        console.error('Refresh button not found');
    }
});


function setCardGrid(numCards) {
    console.log('Card number has been set up')
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


    console.log('Gird size SET')

    // Adjust card sizes based on the number of columns
    // Adjust for any padding and gap within the gameArea
    const gapSize = 10; // If you have set a gap in your CSS
    const paddingSize = 10; // If you have set padding in your CSS
    const totalGapWidth = gapSize * (cols - 1);
    const totalGapHeight = gapSize * (rows - 1);

    console.log('Gird Padding SET')

    // Calculate the available width and height for the cards
    // const availableWidth = gameArea.offsetWidth - totalGapWidth - (paddingSize * 2);
    // const availableHeight = gameArea.offsetHeight - totalGapHeight - (paddingSize * 2);

    // Calculate the available width and height for the cards, considering the parent's max dimensions
    const availableWidth = Math.min(parentElement.clientWidth - totalGapWidth - (paddingSize * 2), gameArea.offsetWidth);
    const availableHeight = Math.min(parentElement.clientHeight - totalGapHeight - (paddingSize * 2), gameArea.offsetHeight);



    // Assume a square card for simplicity; adjust based on your desired aspect ratio
    const cardWidth = availableWidth / cols;
    const cardHeight = availableHeight / rows;

    console.log('Card Height and Width Set')

    // Set size of cards to fit within the grid
    const cards = gameArea.querySelectorAll('.flip-card');
    // cards.forEach(card => {
    //     card.style.width = `${cardWidth}px`;
    //     card.style.height = `${cardHeight}px`;
    // });
}


function generateCardGrid(level) {

    console.log('Grid Generation Started')

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
                    <p class="title">${i + 1}</p>
                    </div>
                    <div class="flip-card-back" style="background-image: url('./assets/child/${imageNumber}.png');">
                    <!-- The back face of the card -->
                    </div>
                </div>`
                ;

        console.log('Grid Generation Finished')

        gameArea.appendChild(flipCard);

    }
    setCardGrid(numCards);

    initializeCards();
}

/*=================== TIME FUNCTION =========================*/

function onTimerEnd() {
    const cards = document.querySelectorAll('.flip-card-inner');
    cards.forEach(card => card.style.transform = ''); // Remove the rotation

    // Now allow cards to be clicked and flipped back to the image
    canFlipCard = true;

    // Pick a guessed image when the timer ends
    pickGuessedImage();

    // Flip back all images with front side Number 1 to difficulty level in loop
    for (let i = 1; i <= storedDifficulty; i++) {
        document.querySelector(`.flip-card-back[style*="assets/child/${i}.png"] .flip-card-inner`).style.transform = '';
    }

    console.log('Timer Finished')
}

function startTimer(gameLevel, onTimerEnd) {

    console.log('Timer Started')

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
    if (!canFlipCard || flippedCard) return;

    let cardInner = e.currentTarget.querySelector('.flip-card-inner');

    if (cardInner.style.transform === 'rotateY(180deg)') {
        return;
    }

    cardInner.style.transform = 'rotateY(180deg)';
    flippedCard = true;

    let cardImage = cardInner.querySelector('.flip-card-back').style.backgroundImage;
    cardImage = cardImage.replace('url("', '').replace('")', '');
    let cardImageNumber = cardImage.split('/').pop().replace('.png', '');

    guessedImageSrc = guessedImageSrc.replace('url("', '').replace('")', '');
    let guessedImageNumber = guessedImageSrc.split('/').pop().replace('.png', '');

    if (cardImageNumber === guessedImageNumber) {
        currentScore += getScoreIncrement(storedDifficulty);
        if (currentScore > highscore) {
            highscore = currentScore;
            // Save highscore to localStorage
            localStorage.setItem('highscore', highscore);
        }
        updateScores();
        flippedCard = false;
        setTimeout(() => {
            document.querySelectorAll('.flip-card-inner').forEach(card => card.style.transform = 'rotateY(180deg)');
            document.querySelector(`.flip-card-back[style*="assets/child/${guessedImageNumber}.png"]`).parentElement.parentElement.style.border = '3px solid green';
            setTimeout(init, 3000);
        }, 2000);

        document.querySelector('.question_image img').src = '';

    } else {
        setTimeout(() => {
            document.querySelectorAll('.flip-card-inner').forEach(card => card.style.transform = 'rotateY(180deg)');
            document.querySelector(`.flip-card-back[style*="assets/child/${guessedImageNumber}.png"]`).parentElement.parentElement.style.border = '3px solid red';
            setTimeout(init, 3000);
        }, 2000);

        document.querySelector('.question_image img').src = '';
    }
}

// Add click event listener to cards
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', onCardClick);
});

// Pick a random card's image as the guessed image when the game starts
function pickGuessedImage() {
    console.log('Guess Image Generated')
    const cards = document.querySelectorAll('.flip-card-back');
    const randomCardIndex = Math.floor(Math.random() * cards.length);
    guessedImageSrc = cards[randomCardIndex].style.backgroundImage;
    // Set the guessed image in the question image span
    document.querySelector('.question_image img').src = guessedImageSrc.replace('url("', '').replace('")', '');
    console.log(document.querySelector('.question_image img').src)
}

function initializeCards() {
    const cards = document.querySelectorAll('.flip-card');
    cards.forEach(card => {
        card.addEventListener('click', onCardClick);
        card.querySelector('.flip-card-inner').style.transform = 'rotateY(180deg)';
    });
}

function toggleCard(cardId) {
    var card = document.getElementById(cardId);
    card.style.display = (card.style.display === 'none' || card.style.display === '') ? 'block' : 'none';
}


