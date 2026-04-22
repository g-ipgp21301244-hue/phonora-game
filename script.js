// 🎤 Load voices
speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices();
};

// 🎮 GAME STATE
let lives = 6;
let score = 0;
let currentScript = "";
let selectedRole = "";
let currentIndex = 0;
let currentLevel = "";
const missions = {
    pilot: {
        title: "✈️ Flight Mission",
        success: "Smooth flight! Good pronunciation!",
        fail: "⚠️ Turbulence! Fix your pronunciation!",
        effect: "shake"
    },
    news: {
        title: "📡 Live News",
        success: "Clear broadcast!",
        fail: "📡 Signal glitch detected!",
        effect: "glitch"
    },
    customer: {
        title: "☎️ Customer Service",
        success: "Customer satisfied 😊",
        fail: "😡 Customer is angry!",
        effect: "angry"
    },
    host: {
        title: "🎬 TV Show",
        success: "Audience loves you!",
        fail: "😬 Awkward silence...",
        effect: "awkward"
    },
    minister: {
        title: "🏛️ Public Speech",
        success: "👏 Crowd is impressed!",
        fail: "😠 Crowd dissatisfied!",
        effect: "crowd"
    }
};

// 🎭 SCRIPTS (ALL ROLES COMPLETE)
const scripts = {
    pilot: {
        easy: [
            "The plane is ready",
            "The sky is clear",
            "We are flying high"
        ],
        medium: [
            "Prepare for takeoff now",
            "The passengers are seated",
            "We will land soon"
        ],
        hard: [
            "Passengers must fasten their seatbelts immediately",
            "We are experiencing slight turbulence",
            "Please remain seated during landing"
        ]
    },

    news: {
        easy: [
            "This is the news",
            "Good morning everyone",
            "Here is the update"
        ],
        medium: [
            "Here is the latest update",
            "We are live today",
            "This just in"
        ],
        hard: [
            "We are reporting live from the scene tonight",
            "Authorities have issued a warning",
            "More updates will follow shortly"
        ]
    },

    service: {
        easy: [
            "How can I help you",
            "Please wait a moment"
        ],
        medium: [
            "Please hold while I check",
            "I will assist you shortly"
        ],
        hard: [
            "We apologise for the inconvenience caused",
            "Your request is being processed now"
        ]
    },

    host: {
        easy: [
            "Welcome to the show",
            "We are live now"
        ],
        medium: [
            "We have an exciting guest today",
            "Stay tuned for more"
        ],
        hard: [
            "Stay tuned for an exciting performance",
            "We will be back after this short break"
        ]
    },

    minister: {
        easy: [
            "We must work together",
            "This is important"
        ],
        medium: [
            "This is important for our country",
            "We must act now"
        ],
        hard: [
            "We will implement policies for national development",
            "This decision will benefit future generations"
        ]
    }
};

// 🎤 SPEECH RECOGNITION
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-GB';

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

    let levelScripts = scripts[selectedRole][level];

    if (!levelScripts || levelScripts.length === 0) {
        alert("No scripts found!");
        return;
    }

    currentScript = levelScripts[currentIndex];

    lives = 6;
    score = 0;

    document.getElementById("roleTitle").innerText =
        selectedRole.toUpperCase() + " - " + level.toUpperCase();

    document.getElementById("script").innerText = currentScript;

    updateHearts();
    updateScore();
    document.getElementById("feedback").innerHTML = "";
}

function goToMenu() {
    document.getElementById("game").classList.add("hidden");
    document.getElementById("levels").classList.add("hidden");
    document.getElementById("roles").classList.add("hidden");

    document.getElementById("menu").classList.remove("hidden");
}

// ================= SPEECH =================

function startListening() {
    recognition.start();
}

recognition.onresult = function(event) {
    const speechResult = event.results[0][0].transcript.toLowerCase();
    checkPronunciation(speechResult);
};

// ================= PRONUNCIATION CHECK =================

function checkPronunciation(spoken) {
    spoken = spoken.replace(/[.,!?]/g, "").toLowerCase();

    let spokenWords = spoken.split(" ");
    let targetWords = currentScript
        .toLowerCase()
        .replace(/[.,!?]/g, "")
        .split(" ");

    let resultHTML = "";
    let mistakes = 0;

    targetWords.forEach((word, index) => {
        let spokenWord = spokenWords[index];

        if (!spokenWord) {
            resultHTML += `<span class="missing">${word}</span> `;
            mistakes++;
        } else if (spokenWord !== word) {
            resultHTML += `<span class="wrong">${word}</span> `;
            mistakes++;
            speakWord(word);
        } else {
            resultHTML += `<span class="correct">${word}</span> `;
        }
    });

    document.getElementById("feedback").innerHTML = resultHTML;

    if (mistakes > 0) {
        lives -= mistakes;
        score -= mistakes * 2;
        if (score < 0) score = 0;

        updateHearts();

        if (lives <= 0) {
            document.getElementById("feedback").innerHTML += "<br>💀 Game Over!";
        }
    } else {
        score += 10;
        document.getElementById("feedback").innerHTML += "<br>🎉 Perfect!";
    }

    updateScore();
}

// ================= UI =================

function updateHearts() {
    document.getElementById("hearts").innerText = "❤️".repeat(lives);
}

function updateScore() {
    document.getElementById("score").innerText = "⭐ " + score;
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

// ================= NEXT ROUND =================

function nextRound() {
    let levelScripts = scripts[selectedRole][currentLevel];

    currentIndex++;

    if (currentIndex >= levelScripts.length) {
        document.getElementById("feedback").innerHTML =
            "🎉 You completed this level!";
        return;
    }

    currentScript = levelScripts[currentIndex];
    document.getElementById("script").innerText = currentScript;
    document.getElementById("feedback").innerHTML = "";
}
