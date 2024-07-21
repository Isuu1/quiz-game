//Grab all needed DOM elements
const questionContainer = document.querySelector(".question");
const quizFormContainer = document.querySelector(".quiz-questions");
const answersContainer = document.querySelector(".answers-container");
const quizForm = document.querySelector(".quiz-form");
const url = "https://opentdb.com/api.php?amount=10&type=multiple";
const passScreen = document.querySelector(".pass");
const failScreen = document.querySelector(".fail");
const questionTracker = document.querySelector(".question-tracker");
const playerScoreContainer = document.querySelector(".player-score");
const playerHighScore = document.querySelector(".player-highscore");
//Fail screen question node
const failScreenQuestion = document.querySelector(
  ".fail-current-question"
);
//Fail screen answer node
const failScreenAnswer = document.querySelector(
  ".fail-correct-answer"
);

//Buttons
const nextButtonPass = document.querySelector(".next-button-pass");
const nextButtonFail = document.querySelector(".next-button-fail");
const playAgainButton = document.querySelector(".play-again-button");

const gameOverContainer = document.querySelector(".game-over");

let data = [];
let questionIndex = 0;
let correctAnswer;
let scoreCounter = 0;
let playerScore = 0;
let highScore;

async function fetchData() {
  const res = await fetch(url);
  if (!res.ok) {
    alert("There was a problem fetching data");
  }
  data = await res.json();
  renderElement();
}

function renderElement() {
  console.log("Question index: " + questionIndex);
  if (questionIndex === 10) {
    gameOverContainer.classList.remove("hide");
    gameOverContainer.classList.add("show");
    quizForm.classList.remove("quiz-form");
    quizForm.classList.add("hide");
    playAgainButton.addEventListener("click", function () {
      answersContainer.innerHTML = "";
      gameOverContainer.classList.remove("show");
      gameOverContainer.classList.add("hide");
      // quizForm.classList.add("quiz-form");
      quizForm.classList.remove("hide");
      quizForm.classList.add("quiz-form");
      playerScore = 0;
      fetchData();
    });

    questionIndex = 0;
  }
  if (localStorage.getItem("highscore")) {
    highScore = localStorage.getItem("highscore");
  } else {
    highScore = 0;
  }

  const obj = data.results[questionIndex];
  createQuestion(obj);
  createAnswers(obj);
  //Update player score
  playerScoreContainer.innerHTML = "Correct answers: " + playerScore;
  quizForm.addEventListener("submit", handleSubmit);
  let currentQuestionIndex = questionIndex + 1;

  questionTracker.innerHTML =
    "Question " + currentQuestionIndex + " out of 10";
  playerHighScore.innerHTML = "Highscore: " + highScore;
}

function createQuestion(obj) {
  //Creating question
  console.log(obj);
  questionContainer.innerHTML = obj.question;
}

function createAnswers(obj) {
  //Creating answers
  let allAnswers = [];
  const incorrectAnswers = obj.incorrect_answers;
  allAnswers.push(...incorrectAnswers);
  const correctAnswer = obj.correct_answer;
  allAnswers.push(correctAnswer);
  console.log(allAnswers);
  shuffleArray(allAnswers);
  //Display answers
  allAnswers.forEach((answer) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.setAttribute("name", "answer");
    input.setAttribute("value", answer);
    input.setAttribute("id", answer);
    label.innerHTML = answer;
    label.prepend(input);
    answersContainer.appendChild(label);
  });
}

function shuffleArray(allAnswers) {
  for (let i = allAnswers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]]; // Swap elements
  }
}

function updatePlayerScore() {
  playerScore++;
  playerScoreContainer.innerHTML = "Correct answers: " + playerScore;
}

function handleSubmit(event) {
  event.preventDefault();
  const obj = data.results[questionIndex];
  const selectedAnswer = document.querySelector(
    'input[name="answer"]:checked'
  );
  if (selectedAnswer.value === obj.correct_answer) {
    updatePlayerScore();
    console.log(obj.correct_answer);
    showResultScreen(passScreen);
    nextButtonPass.addEventListener("click", nextQuestion);
  } else {
    showResultScreen(failScreen, obj);
    nextButtonFail.addEventListener("click", nextQuestion);
    console.log(obj.incorrect_answers);
  }
  if (playerScore > highScore) {
    localStorage.setItem("highscore", JSON.stringify(playerScore));
  }
}

//Dynamically show result screen based on screen type
function showResultScreen(screenType, obj) {
  screenType.classList.remove("hide");
  screenType.classList.add("show");
  quizForm.classList.add("hide");
  quizForm.classList.remove("show");
  quizForm.classList.remove("quiz-form");
  if (screenType === failScreen) {
    failScreenQuestion.innerHTML = "Question: " + obj.question;
    failScreenAnswer.innerHTML =
      "Correct answer: " + obj.correct_answer;
  }
}

function nextQuestion() {
  if (questionIndex <= data.results.length) {
    answersContainer.innerHTML = "";
    questionIndex++;
    console.log(questionIndex);
    quizForm.classList.add("show");
    quizForm.classList.add("quiz-form");
    quizForm.classList.remove("hide");
    failScreen.classList.remove("show");
    failScreen.classList.add("hide");
    passScreen.classList.remove("show");
    passScreen.classList.add("hide");
    renderElement();
  }
}

fetchData();
