// ================= GAME STATE =================
let lives = 6;
let score = 0;
let currentScript = "";
let selectedRole = "";
let currentIndex = 0;
let currentLevel = "";

// ================= MISSIONS =================
const missions = {
    pilot: { title: "✈️ Flight Mission", success: "Smooth flight!", fail: "⚠️ Turbulence!", effect: "shake" },
    news: { title: "📡 Live News", success: "Clear broadcast!", fail: "📡 Signal glitch!", effect: "glitch" },
    service: { title: "☎️ Customer Service", success: "Customer happy!", fail: "😡 Customer angry!", effect: "angry" },
    host: { title: "🎬 TV Show", success: "Audience loves it!", fail: "😬 Awkward moment!", effect: "awkward" },
    minister: { title: "🏛️ Speech", success: "👏 Crowd impressed!", fail: "😠 Crowd unhappy!", effect: "crowd" }
};

// ================= SCRIPTS =================
const scripts = {
    service: {
        easy: ["Please hold while I check"],
        medium: ["I will assist you shortly"],
        hard: ["Your request is being processed now"]
    },
    pilot: {
        easy: ["The plane is ready"],
        medium: ["Prepare for takeoff now"],
        hard: ["Passengers must fasten seatbelts"]
    },
    news: {
        easy: ["This is the news"],
        medium: ["Here is the latest update"],
        hard: ["We are reporting live"]
    },
    host: {
        easy: ["Welcome to the show"],
        medium: ["We have a guest today"],
        hard: ["Stay tuned for performance"]
    },
    minister: {
        easy: ["We must work together"],
        medium: ["We must act now"],
        hard: ["This will benefit future generations"]
    }
};

// ================= SPEECH SETUP =================
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-GB';

// Ensure voices load
speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices();
};

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
    document.getElementById("levels").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    currentLevel = level;
    currentIndex = 0;
    lives = 6;
    score = 0;

    currentScript = scripts[selectedRole][level][0];

    document.getElementById("roleTitle").innerText = selectedRole.toUpperCase();
    document.getElementById("missionTitle").innerText = missions[selectedRole].title;
    document.getElementById("script").innerText = currentScript;

    updateHearts();
    updateScore();
    document.getElementById("feedback").innerHTML = "";
}

// ================= SPEECH =================
function startListening() {
    recognition.start();
}

recognition.onresult = function(event) {
    let spokenText = event.results[0][0].transcript;

    let result = highlightWords(spokenText, currentScript);

    // show highlighted words
    document.getElementById("feedback").innerHTML = result.html;

    if (result.mistakes === 0) {
        handleResult(true);
    } else {
        handleResult(false);
    }
};

// ================= RESULT =================
function handleResult(isCorrect) {
    const feedback = document.getElementById("feedback");
    const gameArea = document.getElementById("gameArea");

    gameArea.className = "card";

    if (isCorrect) {
        feedback.innerHTML += "<br>✅ " + missions[selectedRole].success;
        score += 10;
    } else {
        feedback.innerHTML += "<br>❌ " + missions[selectedRole].fail;
        lives--;
        gameArea.classList.add(missions[selectedRole].effect);
    }

    updateHearts();
    updateScore();
}

// ================= WORD HIGHLIGHT + AUDIO =================
function highlightWords(spoken, correct) {
    spoken = spoken.toLowerCase().split(" ");
    correct = correct.toLowerCase().split(" ");

    let result = "";
    let mistakes = 0;

    correct.forEach((word, i) => {
        if (spoken[i] === word) {
            result += `<span class="correct">${word}</span> `;
        } else {
            result += `<span class="wrong">${word}</span> `;
            mistakes++;

            // delay audio so it doesn't overlap
            setTimeout(() => speakWord(word), 700 * i);
        }
    });

    return { html: result, mistakes: mistakes };
}

// ================= AUDIO =================
function speakWord(word) {
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-GB';
    utterance.rate = 0.9;

    let voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
        utterance.voice = voices.find(v => v.lang === 'en-GB') || voices[0];
    }

    speechSynthesis.speak(utterance);
}

// ================= UI =================
function updateHearts() {
    document.getElementById("hearts").innerText = "❤️".repeat(lives);
}

function updateScore() {
    document.getElementById("score").innerText = "⭐ " + score;
}

function nextRound() {
    let arr = scripts[selectedRole][currentLevel];
    currentIndex++;

    if (currentIndex >= arr.length) {
        document.getElementById("feedback").innerHTML = "🎉 Level complete!";
        return;
    }

    currentScript = arr[currentIndex];
    document.getElementById("script").innerText = currentScript;
    document.getElementById("feedback").innerHTML = "";
}

function goToMenu() {
    document.getElementById("game").classList.add("hidden");
    document.getElementById("menu").classList.remove("hidden");
}
