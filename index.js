// VARIABLE DECLARATION
const gameDisplayText = document.querySelector(".game-update-text");
const remainingCardsText = document.querySelector(".remaining-cards-text");
const remainingCardsNumberText = document.getElementById("remaining-cards");
const getDeckBtn = document.getElementById("get-deck");
const drawCardBtn = document.getElementById("draw-card");
const computerScoreText = document.getElementById("computer-score");
const playerScoreText = document.getElementById("player-score");
const card1Display = document.getElementById("card-1");
const card2Display = document.getElementById("card-2");
let deckId;
let computerScore = 0;
let playerScore = 0;
let gameOver = false;
const CardToValue = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "JACK",
  "QUEEN",
  "KING",
];

// FUNCTIONS
const fetchCards = async () => {
  if (!deckId) {
    const response = await fetch(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    );
    const data = await response.json();
    console.log(data);
    deckId = data.deck_id;
    remainingCardsText.style.display = "block";
    getDeckBtn.classList.add("disabled-btn");
    gameDisplayText.textContent = "Draw Cards Now!";
    drawCardBtn.classList.remove("disabled-btn");
  } else {
    gameDisplayText.textContent = "You Already Have A Deck!";
    setTimeout(() => {
      gameDisplayText.textContent = "Draw Cards";
    }, 2000);
  }
};

const displayCards = (data) => {
  card1Display.innerHTML = `
      <img src="${data.cards[0].image}" alt="${data.cards[0].value} of ${data.cards[0].suit}" />
    `;
  card2Display.innerHTML = `
      <img src="${data.cards[1].image}" alt="${data.cards[1].value} of ${data.cards[1].suit}" />
    `;
};

const checkGameOver = (data) => {
  if (data.remaining === 0) {
    gameOver = true;
    remainingCardsText.style.display = "none";
    gameDisplayText.classList.add("salmon-color");
    if (computerScore > playerScore) {
      gameDisplayText.innerHTML =
        "Computer Won The Game,<br />Better Luck Next Time!";
    } else if (playerScore > computerScore) {
      gameDisplayText.textContent = "You Won The Game, Congrats!";
    } else if (computerScore === playerScore) {
      gameDisplayText.textContent = "It's a Tie, Play Again?";
    }
    drawCardBtn.classList.add("disabled-btn");
    getDeckBtn.removeEventListener("click", fetchCards);
    getDeckBtn.classList.remove("disabled-btn");
    getDeckBtn.textContent = "New Game?";
    getDeckBtn.addEventListener("click", () => {
      location.reload();
    });
  }
};

const drawCards = async () => {
  if (deckId && !gameOver) {
    const response = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
    );
    const data = await response.json();
    console.log(data);
    remainingCardsNumberText.textContent = data.remaining;
    displayCards(data);
    const card1 = data.cards[0].value;
    const card2 = data.cards[1].value;
    if (CardToValue.indexOf(card1) > CardToValue.indexOf(card2)) {
      computerScore++;
      computerScoreText.textContent = computerScore;
      gameDisplayText.textContent = "Computer Wins!";
    } else if (CardToValue.indexOf(card2) > CardToValue.indexOf(card1)) {
      playerScore++;
      playerScoreText.textContent = playerScore;
      gameDisplayText.textContent = "You Win!";
    } else if (CardToValue.indexOf(card1) === CardToValue.indexOf(card2)) {
      gameDisplayText.textContent = "It's a War!";
    }
    checkGameOver(data);
  } else if (gameOver) {
    gameDisplayText.innerHTML =
      "Game is Over.<br />Press New Game To Start Again";
    setTimeout(() => {
      gameDisplayText.textContent = "This Button👇";
    }, 4000);
  } else if (!deckId) {
    gameDisplayText.textContent = "Click Get Deck To Start!";
    setTimeout(() => {
      gameDisplayText.textContent = "This Button👇";
    }, 2000);
  }
};

// PROGRAM STARTS
getDeckBtn.addEventListener("click", fetchCards);
drawCardBtn.addEventListener("click", drawCards);
