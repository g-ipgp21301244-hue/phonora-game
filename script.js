// ================= GAME STATE =================
let lives = 6;
let score = 0;
let currentScript = "";
let selectedRole = "";
let currentIndex = 0;
let currentLevel = "";

// ================= MISSIONS =================
const missions = {
    pilot: { title: "✈️ Flight Mission", success: "Smooth flight!", fail: "⚠️ Turbulence!" },
    news: { title: "📡 Live News", success: "Clear broadcast!", fail: "📡 Signal glitch!" },
    service: { title: "☎️ Customer Service", success: "Customer happy!", fail: "😡 Customer angry!" },
    host: { title: "🎬 TV Show", success: "Audience loves it!", fail: "😬 Awkward moment!" },
    minister: { title: "🏛️ Speech", success: "👏 Crowd impressed!", fail: "😠 Crowd unhappy!" }
};

const characters = {
    pilot: "🧑‍✈️",
    news: "🧑‍💼",
    service: "📞",
    host: "🎤",
    minister: "🏛️"
};

// ================= SPEECH =================
let recognition;
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-GB";
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

// ✅ CLEAN startGame (VERY IMPORTANT)
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

    currentScript = scripts[selectedRole][level][0].join(" ");
    document.getElementById("script").innerText = currentScript;

    document.getElementById("roleTitle").innerText = selectedRole.toUpperCase();
    document.getElementById("missionTitle").innerText = missions[selectedRole].title;

    const character = document.getElementById("character");
    character.innerText = characters[selectedRole];
    character.style.left = "5%";

    document.getElementById("progressBar").style.width = "0%";

    updateHearts();
    updateScore();
    document.getElementById("feedback").innerHTML = "";
}

// ================= SPEECH =================
function startListening() {
    if (!recognition) return;
    recognition.start();
}

recognition.onresult = function(event) {
    let spokenText = event.results[0][0].transcript;
    let result = highlightWords(spokenText, currentScript);
    handleResult(result.mistakes === 0, result.html, result.wrongWords);
};

// ================= RESULT =================
function handleResult(isCorrect, resultHTML, wrongWords = []) {
    const feedback = document.getElementById("feedback");

    feedback.innerHTML = resultHTML;

    if (isCorrect) {
        feedback.innerHTML += "<br>✅ " + missions[selectedRole].success;
        score += 10;
        sounds.correct.play();
        showStar();
        jumpToStar();
    } else {
        feedback.innerHTML += "<br>❌ " + missions[selectedRole].fail;
        lives--;
        sounds.wrong.play();
        showEnemy();
        enemyAttack();

        setTimeout(() => {
            speakWrongWords(wrongWords);
        }, 800);
    }

    updateHearts();
    updateScore();
}

// ================= WORD CHECK =================
function highlightWords(spoken, correct) {
    spoken = spoken.toLowerCase().trim().split(/\s+/);
    correct = correct.toLowerCase().trim().split(/\s+/);

    let result = "";
    let mistakes = 0;
    let wrongWords = [];

    correct.forEach((word, i) => {
        if (spoken[i] === word) {
            result += `<span class="correct">${word}</span> `;
        } else {
            result += `<span class="wrong">${word}</span> `;
            mistakes++;
            wrongWords.push(word);
        }
    });

    return { html: result, mistakes, wrongWords };
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

function speakWord(word) {
    let u = new SpeechSynthesisUtterance(word);
    u.lang = "en-GB";
    speechSynthesis.speak(u);
}

// ================= UI =================
function updateHearts() {
    document.getElementById("hearts").innerText = "❤️".repeat(lives);
}

function updateScore() {
    document.getElementById("score").innerText = "⭐ " + score;
}

function nextRound() {
    let quests = scripts[selectedRole][currentLevel];

    currentIndex++;

    if (currentIndex >= quests.length) {
        document.getElementById("script").innerText = "🏰 You reached the castle!";
        document.getElementById("feedback").innerHTML = "👑 Victory!";
        sounds.win.play();
        return;
    }

    document.getElementById("questTitle").innerText = "Quest " + (currentIndex + 1);
    currentScript = quests[currentIndex].join(" ");
    document.getElementById("script").innerText = currentScript;
    document.getElementById("feedback").innerHTML = "";

    moveCharacter();
}

function goToMenu() {
    document.getElementById("game").classList.add("hidden");
    document.getElementById("menu").classList.remove("hidden");
}

function moveCharacter() {
    let total = scripts[selectedRole][currentLevel].length;
    let progress = (currentIndex / total) * 80;
    document.getElementById("character").style.left = progress + "%";
}

// ================= ANIMATION =================
function showStar() {
    document.getElementById("star").classList.add("show-star");
    setTimeout(() => document.getElementById("star").classList.remove("show-star"), 1000);
}

function jumpToStar() {
    const c = document.getElementById("character");
    c.style.transform = "translateY(-60px)";
    setTimeout(() => c.style.transform = "translateY(0)", 600);
}

function showEnemy() {
    document.getElementById("enemy").classList.add("show-enemy");
    setTimeout(() => document.getElementById("enemy").classList.remove("show-enemy"), 800);
}

function enemyAttack() {
    const c = document.getElementById("character");
    c.classList.add("hit");
    setTimeout(() => c.classList.remove("hit"), 400);
}

// ================= SOUND =================
const sounds = {
    correct: new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"),
    wrong: new Audio("https://actions.google.com/sounds/v1/cartoon/boing.ogg"),
    win: new Audio("https://actions.google.com/sounds/v1/cartoon/ta_da.ogg")
};
