// GAME STATE
let lives = 6;
let score = 0;
let currentScript = "";
let selectedRole = "";
let currentIndex = 0;
let currentLevel = "";

// MISSIONS
const missions = {
    pilot: { title: "✈️ Flight Mission", success: "Smooth flight!", fail: "⚠️ Turbulence!", effect: "shake" },
    news: { title: "📡 Live News", success: "Clear broadcast!", fail: "📡 Signal glitch!", effect: "glitch" },
    service: { title: "☎️ Customer Service", success: "Customer happy!", fail: "😡 Customer angry!", effect: "angry" },
    host: { title: "🎬 TV Show", success: "Audience loves it!", fail: "😬 Awkward moment!", effect: "awkward" },
    minister: { title: "🏛️ Speech", success: "👏 Crowd impressed!", fail: "😠 Crowd unhappy!", effect: "crowd" }
};

// SCRIPTS
const scripts = {
    pilot: { easy: ["The plane is ready"], medium: ["Prepare for takeoff now"], hard: ["Passengers must fasten seatbelts"] },
    news: { easy: ["This is the news"], medium: ["Here is the latest update"], hard: ["We are reporting live"] },
    customerservice: { easy: ["How can I help you"], medium: ["Please hold while I check"], hard: ["We apologise for inconvenience"] },
    TVhost: { easy: ["Welcome to the show"], medium: ["We have a guest today"], hard: ["Stay tuned for performance"] },
    minister: { easy: ["We must work together"], medium: ["We must act now"], hard: ["This will benefit future generations"] }
};

// SPEECH
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-GB';

// NAVIGATION
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

// SPEECH START
function startListening() {
    recognition.start();
}

// SPEECH RESULT
recognition.onresult = function(event) {
    let spokenText = event.results[0][0].transcript;

    let result = highlightWords(spokenText, currentScript);
console.log(result);

    // ✅ SHOW WORD-BY-WORD FIRST
    document.getElementById("feedback").innerHTML = result.html;

    // ✅ THEN ADD RESULT MESSAGE
    if (result.mistakes === 0) {
        handleResult(true);
    } else {
        handleResult(false);
    }
};

// RESULT SYSTEM
function handleResult(isCorrect) {
    const feedback = document.getElementById("feedback");
    const gameArea = document.getElementById("gameArea");

    gameArea.className = "card"; // reset effect

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

// UI
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
// ================= WORD FEEDBACK + AUDIO =================

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

            // 🔊 play correct pronunciation (with delay)
            setTimeout(() => speakWord(word), 500 * i);
        }
    });

    return { html: result, mistakes: mistakes };
}


// 🔊 SPEAK WORD FUNCTION
function setTimeout(() => speakWord(word), 500 * i);
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-GB';

    let voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
        utterance.voice = voices.find(v => v.lang === 'en-GB') || voices[0];
    }

    speechSynthesis.speak(utterance);
}
    });

    return { html: result, mistakes: mistakes };
}
    });

    return { html: result, mistakes: mistakes };
}

// ================= AUDIO =================
function speakWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-GB';

    let voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
        utterance.voice = voices.find(v => v.lang === 'en-GB') || voices[0];
    }

    setTimeout(() => {
        speechSynthesis.speak(utterance);
    }, 200);
}
