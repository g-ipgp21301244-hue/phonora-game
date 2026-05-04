// GAME STATE
let selectedRole = "";
let currentLevel = "";
let currentIndex = 0;
let lives = 3;
let score = 0;
let currentScript = "";

// SIMPLE SCRIPTS
const scripts = {
    pilot: {
        easy: [
            ["The plane is ready"],
            ["We are flying high"]
        ]
    },
    service: {
        easy: [
            ["Hello how can I help you"],
            ["Your problem is solved"]
        ]
    }
};

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
    currentLevel = level;
    currentIndex = 0;
    lives = 3;
    score = 0;

    document.getElementById("levels").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    updateUI();
    showPrompt();
}

// PROMPT
function showPrompt() {
    let quest = scripts[selectedRole][currentLevel][currentIndex];
    currentScript = quest.join(" ");

    document.getElementById("script").innerText = currentScript;
    document.getElementById("feedback").innerText = "";
}

// SPEECH
let recognition;

if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = function(e) {
        let spoken = e.results[0][0].transcript.toLowerCase();
        let correct = currentScript.toLowerCase();

        if (spoken.includes(correct)) {
            score += 10;
            currentIndex++;

            if (currentIndex >= scripts[selectedRole][currentLevel].length) {
                alert("YOU WIN!");
                location.reload();
            } else {
                showPrompt();
            }

        } else {
            lives--;

            if (lives <= 0) {
                alert("GAME OVER");
                location.reload();
            }
        }

        updateUI();
    };
}

function startListening() {
    if (!recognition) {
        alert("Speech not supported");
        return;
    }
    recognition.start();
}

// UI
function updateUI() {
    document.getElementById("hearts").innerText = "❤️".repeat(lives);
    document.getElementById("score").innerText = "⭐ " + score;
}
