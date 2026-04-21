let lives = 6;
let currentScript = "";

// 🎭 Scripts for each role
const scripts = {
    pilot: "Prepare for takeoff. The plane is ready.",
    news: "Good evening. This is the latest news update.",
    service: "Hello, how may I assist you today?",
    host: "Welcome to the show. We are live tonight.",
    minister: "We must work together for a better future."
};

// 🎤 Speech Recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-GB';

// NAVIGATION
function goToRoles() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("roles").style.display = "block";
}

function selectRole(role) {
    document.getElementById("roles").style.display = "none";
    document.getElementById("game").style.display = "block";

    currentScript = scripts[role];
    lives = 6;

    document.getElementById("roleTitle").innerText = "Role: " + role.toUpperCase();
    document.getElementById("script").innerText = currentScript;
    document.getElementById("lives").innerText = "Lives: " + lives;
}

// START SPEAKING
function startListening() {
    recognition.start();
}

recognition.onresult = function(event) {
    const speechResult = event.results[0][0].transcript.toLowerCase();
    document.getElementById("result").innerText = "You said: " + speechResult;
    checkPronunciation(speechResult);
};

// CHECK PRONUNCIATION
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
        document.getElementById("lives").innerText = "Lives: " + lives;

        alert("Wrong words: " + mistakes.join(", "));

        mistakes.forEach(word => speakWord(word));

        if (lives <= 0) {
            alert("💀 Game Over!");
        }
    } else {
        alert("🎉 Excellent pronunciation!");
    }
}

// 🔊 CORRECT PRONUNCIATION
function speakWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-GB';
    speechSynthesis.speak(utterance);
}
