var questions = [
    {
        title: "What's the name of the place Steven Universe is set it?:",
        choices: ["Beach City", "Park Town", "Forest Village", "Bay State"],
        answer: "Beach City"
    },
    {
        title: "Who created Steven Universe?:",
        choices: ["Ben Bocquelet", "Rebecca Sugar", "Genndy Tartakovsky", "Pendleton Ward"],
        answer: "Rebecca Sugar"
    },
    {
        title: "Which of these powers does Rose Possess?:",
        choices: ["Healing sneezes", "Healing Burps", "Healing Tears", "Healing Blood"],
        answer: "Healing Tears"
    },
    {
        title: "What pink animal does Steven have as a pet?:",
        choices: ["Elephant", "Rhino", "Giraffe", "Lion"],
        answer: "Lion"
    },
    {
        title: "Which famous singer voiced the character Sugilite?:",
        choices: ["Nicki Minaj", "Rihanna", "Iggy Azalea", "Cardi B"],
        answer: "Nicki Minaj"
    }
];



// Home Page Elements //
var welcomeEl = document.querySelector("#welcome");
var startQuizButtonEl = document.querySelector("#startQuiz");

// Quiz Elements // 

var quizEl = document.querySelector("#quiz");
var questionEl = document.querySelector("#question");
var answersEl = document.querySelector("#answers");

// Input Score Elements // 

var inputScoresEl = document.querySelector("#inputScore");
var initialsEl = document.querySelector("#initials");
var submitInitialsButtonEl = document.querySelector("#submitInitials");
var userScoreEl = document.querySelector("#score");

// view high score elements //

var highScoresEl = document.querySelector("#highScores");
var scoresEl = document.querySelector("#scores");
var goBackButtonEl = document.querySelector("#goBack");
var clearButtonEl = document.querySelector("#clearScores");

// Uni vars //
var viewHighScoresButtonEl = document.querySelector("#viewHScores");
var timerEl = document.querySelector("#timer");
var score = 0;
var currentQ = 0;
var highScores = [];
var interval;
var timeGiven = 75;
var secondsElapsed = 0;

// Start and update timer //

function startTimer() {
    timerEl.textContent = timeGiven;
    interval = setInterval(function(){
        secondsElapsed++;
        timerEl.textContent = timeGiven - secondsElapsed;
        if (secondsElapsed >= timeGiven){
            currentQ = questions.length;
            nextQuestion();
        }
    }, 1000);
}

//stop timer//
function stopTimer() {
    clearInterval(interval);
}

// Clear Current question and display next question //
function nextQuestion() {
    currentQ++;
    if (currentQ < questions.length){
        renderQuestion();
    } else {
        stopTimer();
        if ((timeGiven - secondsElapsed) > 0)
        score += (timeGiven - secondsElapsed);
        userScoreEl.textContent = score;
        hide(quizEl);
        show(inputScoresEl);
        timerEl.textContent = 0;
    }
}

// check answers //

function checkAnswer(answer) {
    if (questions[currentQ].answer == questions[currentQ].choices[answer.id]) {
        score += 5;
        displayMessage("Correct");
    } else {
        secondsElapsed += 10;
        displayMessage("Wrong");
    }
}

//display a message//

function displayMessage(m) {
    let messageHr = document.createElement("hr");
    let messageEl = document.createElement("div");
    messageEl.textContent = m;
    document.querySelector(".greetingContainer").appendChild(messageHr);
    document.querySelector(".greetingContainer").appendChild(messageEl);
    setTimeout(function () {
            messageHr.remove();
            messageEl.remove();
    }, 2000);

}

// hide elements //

function hide(element) {
    element.style.display = "none";
}

// display elements // 

function show(element) {
    element.style.display = "block";
}

// reset local var // 

function reset() {
    score = 0;
currentQ = 0;
secondsElapsed = 0;
timerEl.textContent = 0;
}

// display question //

function renderQuestion() {
    questionEl.textContent = questions[currentQ].title;
    for (i = 0; i < answersEl.children.length; i++) {
        answersEl.children[i].children[0].textContent = 
        `${(i + 1)}: ${questions[currentQ].choices[i]}`;
    }
}

// put high scores in local storage //

function renderHighScores() {
    scoresEl.innerHTML = "";
    show(highScoresEl);
    highScores = JSON.parse(localStorage.getItem("scores"));
    for (let i = 0; i < highScores.length; i++) {
        let scoreItem = document.createElement("div");
        scoreItem.className += "row mb-3 p-2";
        console.log(scoreItem)
        scoreItem.setAttribute("style", "background-color:PaleTurquoise;");
        scoreItem.textContent = `${(i + 1)}. ${highScores[i].username} - ${highScores[i].userScore}`;
        scoresEl.appendChild(scoreItem);
    }
}

//display high scores //

viewHighScoresButtonEl.addEventListener("click", function(){
    hide(welcomeEl);
    hide(quizEl);
    hide(inputScoresEl);
    renderHighScores();
    stopTimer();
    reset();
});

//start quiz//

startQuizButtonEl.addEventListener("click", function (){
    hide(welcomeEl);
    startTimer();
    renderQuestion();
    show(quizEl);
}); 

answersEl.addEventListener("click", function (e) {
    if (e.target.matches("button")) {
        checkAnswer(e.target);
        nextQuestion();
    }
});

submitInitialsButtonEl.addEventListener("click", function() {
    let initValue = initialsEl.ariaValueMax.trim();
    if (initValue) {
        let userScore = { username: initValue, userScore: score};
        initialsEl.value = "";
        highScores = JSON.parse(localStorage.getItem("scores")) || [];
        highScores.push(userScore)
        localStorage.setItem("scores", JSON.stringify(highScores));
        hide(inputScoresEl);
        renderHighScores();
        reset();
    }
});

goBackButtonEl.addEventListener("click", function() {
    hide(highScoresEl);
    show(welcomeEl);
});

clearButtonEl.addEventListener("click", function () {
    highScores = [];
    localStorage.setItem("scores", JSON.stringify(highScores));
    renderHighScores();
});