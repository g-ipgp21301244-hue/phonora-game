let lives = 6;
let currentScript = "The plane is ready to fly";

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-GB';

function startListening() {
    recognition.start();
}

recognition.onresult = function(event) {
    const speechResult = event.results[0][0].transcript.toLowerCase();
    document.getElementById("result").innerText = "You said: " + speechResult;
    checkPronunciation(speechResult);
};

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
            alert("Game Over!");
        }
    } else {
        alert("Correct! Well done!");
    }
}

function speakWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-GB';
    speechSynthesis.speak(utterance);
}
