let lives = 6;
let currentScript = "";

const scripts = {
    pilot: "Prepare for takeoff. The plane is ready.",
    news: "Good evening. This is the latest news update.",
    service: "Hello, how may I assist you today?",
    host: "Welcome to the show. We are live tonight.",
    minister: "We must work together for a better future."
};

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-GB';

// NAVIGATION
function goToRoles() {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("roles").classList.remove("hidden");
}

function selectRole(role) {
    document.getElementById("roles").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    currentScript = scripts[role];
    lives = 6;

    document.getElementById("roleTitle").innerText = role.toUpperCase();
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

// HEARTS UI
function updateHearts() {
    document.getElementById("hearts").innerText = "❤️".repeat(lives);
}

// SPEAK CORRECT WORD
function speakWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-GB';
    speechSynthesis.speak(utterance);
}
