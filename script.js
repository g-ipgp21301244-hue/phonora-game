let lives = 6;
let currentScript = "";
let selectedRole = "";

// 🎭 Scripts with levels
const scripts = {
    pilot: {
        easy: "The plane is ready",
        medium: "Prepare for takeoff now",
        hard: "Passengers must fasten their seatbelts immediately"
    },
    news: {
        easy: "This is the news",
        medium: "Here is the latest update",
        hard: "We are reporting live from the scene tonight"
    },
    service: {
        easy: "How can I help you",
        medium: "Please hold while I check",
        hard: "We apologise for the inconvenience caused"
    },
    host: {
        easy: "Welcome to the show",
        medium: "We are live tonight",
        hard: "Stay tuned for an exciting performance"
    },
    minister: {
        easy: "We must work together",
        medium: "This is important for our country",
        hard: "We will implement policies for national development"
    }
};

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-GB';

// NAVIGATION
function goToRoles() {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("roles").classList.remove("hidden");
}

// SELECT ROLE → GO TO LEVEL
function selectRole(role) {
    selectedRole = role;
    document.getElementById("roles").classList.add("hidden");
    document.getElementById("levels").classList.remove("hidden");
}

// START GAME AFTER LEVEL
function startGame(level) {
    document.getElementById("levels").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    currentScript = scripts[selectedRole][level];
    lives = 6;

    document.getElementById("roleTitle").innerText =
        selectedRole.toUpperCase() + " - " + level.toUpperCase();

    document.getElementById("script").innerText = currentScript;

    updateHearts();
    document.getElementById("feedback").innerText = "";
}

// SPEECH
function startListening() {
    recognition.start();
}

recognition.onresult = function(event) {
    const speechResult = event.results[0][0].transcript.toLowerCase();
    checkPronunciation(speechResult);
};

// CHECK
function checkPronunciation(spoken) {
    let spokenWords = spoken.split(" ");
    let targetWords = currentScript.toLowerCase().split(" ");

    let mistakes = [];

    targetWords.forEach((word, index) => {
        if (spokenWords[index] !== word) {
            mistakes.push(word);
        }
    });

    if (mistakes.length > 0) {
        lives -= mistakes.length;
        updateHearts();

        document.getElementById("feedback").innerText =
            "❌ Try again: " + mistakes.join(", ");

        mistakes.forEach(word => speakWord(word));

        if (lives <= 0) {
            document.getElementById("feedback").innerText = "💀 Game Over!";
        }

    } else {
        document.getElementById("feedback").innerText =
            "🎉 Perfect pronunciation!";
    }
}

// HEARTS
function updateHearts() {
    document.getElementById("hearts").innerText = "❤️".repeat(lives);
}

// AUDIO
function speakWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-GB';
    speechSynthesis.speak(utterance);
}
