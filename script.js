// ================= GAME STATE =================
let lives = 6;
let score = 0;
let currentScript = "";
let selectedRole = "";
let currentIndex = 0;
let currentLevel = "";

// ================= SCRIPTS =================
const scripts = {
    service: {
        easy: [
            ["Hello, how can I help you?"],
            ["Please tell me your problem."],
            ["I will check it for you."],
            ["Thank you for your patience."],
            ["Your issue has been solved."],
            ["Have a nice day."]
        ],
        medium: [
            ["Hello, welcome to our service center.", "How may I assist you today?", "I am here to help you."]
        ],
        hard: [
            ["Good day, thank you for contacting customer service"]
        ]
    }
}; //

// ================= SPEECH =================
let recognition = null;

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-GB";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function(event) {
        const spoken = event.results[0][0].transcript;
        const result = checkSpeech(spoken, currentScript);

        const allowedMistakes = Math.ceil(result.total * 0.5);
        const isCorrect = result.mistakes <= allowedMistakes;

        handleResult(isCorrect, result.html, result.wrongWords);
    };

    recognition.onend = function() {
        console.log("Speech ended");
    };
} else {
    alert("Speech recognition not supported 😢");
}

// ================= NAVIGATION =================
function goToRoles() {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("roles").classList.remove("hidden");
}

function selectRole(role) {
    selectedRole = role;
    document.getElementById("roles").classList.add("hidden");
    document.getElementById("levels").classList.remove("hidden");
}

function startGame(level) {

    if (!selectedRole) {
        alert("Please select a role first!");
        return;
    }

    document.getElementById("levels").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    currentLevel = level;
    currentIndex = 0;
    lives = 6;
    score = 0;

    updateHearts();
    updateScore();

    moveToObstacle(); // 🔥 IMPORTANT
}
function moveToObstacle() {
    document.getElementById("character").style.left = "10%";

    setTimeout(() => {
        showPrompt();
    }, 500);
}
// ================= PROMPT =================
function showPrompt() {
    const box = document.getElementById("promptBox");

    let quests = scripts[selectedRole][currentLevel];

    if (!quests || !quests[currentIndex]) {
        console.error("No script found");
        return;
    }

    currentScript = quests[currentIndex].join(" ");

    document.getElementById("script").innerText = currentScript;
    document.getElementById("feedback").innerHTML = "";

    box.classList.remove("hidden");

    box.classList.remove("show");
    void box.offsetWidth; 
    box.classList.add("show");
}
// ================= SPEECH CONTROL =================
function startListening() {
    if (!recognition) return;

    try { recognition.stop(); } catch(e) {}

    recognition.start();
}

// ================= CHECK LOGIC =================
function checkSpeech(spoken, correct) {

    const clean = t => t.toLowerCase().replace(/[.,!?]/g, "").split(/\s+/);

    const spokenWords = clean(spoken);
    const correctWords = clean(correct);

    const easyWords = ["hello","hi","you","i","is","the","a","an","can"];

    let mistakes = 0;
    let wrongWords = [];
    let html = "";

    correctWords.forEach(word => {
        let match = spokenWords.some(w => similarity(w, word) > 0.5);

        if (match || easyWords.includes(word)) {
            html += `<span class="correct">${word}</span> `;
        } else {
            html += `<span class="wrong">${word}</span> `;
            mistakes++;
            wrongWords.push(word);
        }
    });

    return {
        html,
        mistakes,
        wrongWords,
        total: correctWords.length
    };
}

function similarity(a, b) {
    if (a === b) return 1;
    if (a.includes(b) || b.includes(a)) return 0.8;

    let match = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        if (a[i] === b[i]) match++;
    }
    return match / Math.max(a.length, b.length);
}

// ================= RESULT =================
function handleResult(isCorrect, html, wrongWords) {

    document.getElementById("feedback").innerHTML = html;

    if (isCorrect) {
        score += 10;
        updateScore();

        setTimeout(() => {
            currentIndex++;
            moveForward();
        }, 1000);

    } else {
        lives--;
        updateHearts();

        if (lives <= 0) {
            gameOver();
        } else {
            speakWrongWords(wrongWords);

            // 🔥 AUTO RETRY
            setTimeout(() => {
                startListening();
            }, 1500);
        }
    }
}

// ================= GAME FLOW =================
function moveForward() {
    let total = scripts[selectedRole][currentLevel].length;

    if (currentIndex >= total) {
        showEndScreen();
        return;
    }

    showPrompt();
}

// ================= END =================
function showEndScreen() {
    const box = document.getElementById("promptBox");

    box.classList.remove("hidden");
    box.classList.add("show");

    document.getElementById("script").innerText = "🏰 You've reached the castle!";
    document.getElementById("feedback").innerHTML = `
        🎉 Great job! <br><br>
        ${nextLevelButton()}
    `;
}

function nextLevelButton() {
    if (currentLevel === "easy") {
        return `<button onclick="startNextLevel('medium')">Next Level ➡️</button>`;
    }
    if (currentLevel === "medium") {
        return `<button onclick="startNextLevel('hard')">Next Level ➡️</button>`;
    }
    return `<button onclick="goToMenu()">Finish</button>`;
}

function startNextLevel(level) {
    currentLevel = level;
    currentIndex = 0;
    showPrompt();
}

// ================= UI =================
function updateHearts() {
    document.getElementById("hearts").innerText = "❤️".repeat(lives);
}

function updateScore() {
    document.getElementById("score").innerText = "⭐ " + score;
}

function goToMenu() {
    document.getElementById("game").classList.add("hidden");
    document.getElementById("menu").classList.remove("hidden");
}

// ================= AUDIO =================
function speakWrongWords(words) {
    if (!words.length) return;

    speechSynthesis.cancel();

    let i = 0;

    function next() {
        if (i >= words.length) return;

        let u = new SpeechSynthesisUtterance(words[i]);
        u.lang = "en-GB";
        u.rate = 0.8;

        u.onend = () => {
            i++;
            next();
        };

        speechSynthesis.speak(u);
    }

    next();
}
