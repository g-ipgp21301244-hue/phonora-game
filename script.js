speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices();
};
let lives = 6;
let score = 0;
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
    score = 0;
document.getElementById("score").innerText = "⭐ " + score;

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

    let resultHTML = "";
    let mistakes = 0;

    targetWords.forEach((word, index) => {
        if (!spokenWords[index]) {
            resultHTML += `<span class="missing">${word}</span> `;
            mistakes++;
        } else if (spokenWords[index] !== word) {
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
        score -= mistakes * 2; // penalty
        updateHearts();

        if (lives <= 0) {
            document.getElementById("feedback").innerHTML += "<br>💀 Game Over!";
        }
    } else {
        score += 10; // reward
        document.getElementById("feedback").innerHTML += "<br>🎉 Perfect!";
    }
    document.getElementById("score").innerText = "⭐ " + score;

// HEARTS
function updateHearts() {
    document.getElementById("hearts").innerText = "❤️".repeat(lives);
}

// AUDIO
function speakWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-GB';

    // ensure voices are loaded
    let voices = speechSynthesis.getVoices();

    if (voices.length > 0) {
        utterance.voice = voices.find(v => v.lang === 'en-GB') || voices[0];
    }

    // slight delay helps playback
    setTimeout(() => {
        speechSynthesis.speak(utterance);
    }, 200);
}
