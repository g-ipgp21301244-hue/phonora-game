// ================= STATE =================
let selectedRole = "";
let currentLevel = "";
let currentIndex = 0;
let lives = 6;
let score = 0;
let currentScript = "";

// ================= SCRIPTS =================
const scripts = {
    pilot: {
        easy: [["The plane is ready"], ["We are flying safely"]],
        medium: [["Please fasten your seatbelt", "We are ready for takeoff"]],
        hard: [["Ladies and gentlemen welcome aboard this flight please remain seated"]]
    },
    service: {
        easy: [["Hello how can I help you"], ["Your problem is solved"]],
        medium: [["We are sorry for the inconvenience", "We will fix your issue"]],
        hard: [["Thank you for contacting us we will resolve your issue immediately"]]
    },
    anchor: {
        easy: [["Good evening this is the news"]],
        medium: [["Heavy rain has caused flooding", "People must stay safe"]],
        hard: [["This is a live news report from the affected area"]]
    },
    host: {
        easy: [["Welcome to the show"]],
        medium: [["Today we have a special guest", "Let us begin"]],
        hard: [["Welcome everyone to our exciting program tonight"]]
    },
    minister: {
        easy: [["Education is important"]],
        medium: [["We will improve our schools", "Students are our future"]],
        hard: [["We are introducing new policies to improve education nationwide"]]
    }
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
    currentLevel = level;
    currentIndex = 0;
    lives = 6;
    score = 0;

    document.getElementById("levels").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    updateUI();
    showPrompt();
}

// ================= PROMPT =================
function showPrompt() {
    let quest = scripts[selectedRole][currentLevel][currentIndex];
    currentScript = quest.join(" ");

    document.getElementById("script").innerText = currentScript;
    document.getElementById("feedback").innerHTML = "";
}

// ================= SPEECH =================
let recognition;

if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "en-GB";

    recognition.onresult = function(e) {
        let spoken = e.results[0][0].transcript.toLowerCase();
        let result = checkSpeech(spoken, currentScript);

        let allowed = Math.ceil(result.total * 0.4);
        let correct = result.mistakes <= allowed;

        handleResult(correct, result.html, result.wrongWords);
    };
}

// ================= CHECK =================
function checkSpeech(spoken, correct) {
    const clean = t => t.toLowerCase().replace(/[.,!?]/g,"").split(" ");
    const s = clean(spoken);
    const c = clean(correct);

    let mistakes = 0;
    let wrongWords = [];
    let html = "";

    c.forEach(word => {
        let match = s.includes(word);

        if (match) {
            html += `<span class="correct">${word}</span> `;
        } else {
            html += `<span class="wrong">${word}</span> `;
            mistakes++;
            wrongWords.push(word);
        }
    });

    return { html, mistakes, wrongWords, total: c.length };
}

// ================= RESULT =================
function handleResult(correct, html, wrongWords) {
    document.getElementById("feedback").innerHTML = html;

    if (correct) {
        score += 10;
        currentIndex++;

        moveCharacter();

        if (currentIndex >= scripts[selectedRole][currentLevel].length) {
            setTimeout(() => {
                alert("🎉 You finished!");
                location.reload();
            }, 800);
            return;
        }

        setTimeout(showPrompt, 800);

    } else {
        lives--;
        speakWrongWords(wrongWords);

        if (lives <= 0) {
            setTimeout(() => {
                alert("💀 Game Over");
                location.reload();
            }, 800);
        }
    }

    updateUI();
}

// ================= MOVEMENT =================
function moveCharacter() {
    let char = document.getElementById("character");
    let left = parseInt(char.style.left) || 10;
    char.style.left = (left + 10) + "%";
}

// ================= SPEECH CONTROL =================
function startListening() {
    if (!recognition) {
        alert("Speech not supported");
        return;
    }
    recognition.start();
}

// ================= AUDIO =================
function speakWrongWords(words) {
    if (!words.length) return;

    let i = 0;

    function next() {
        if (i >= words.length) return;

        let u = new SpeechSynthesisUtterance(words[i]);
        u.lang = "en-GB";
        u.onend = () => { i++; next(); };

        speechSynthesis.speak(u);
    }

    next();
}

// ================= UI =================
function updateUI() {
    document.getElementById("hearts").innerText = "❤️".repeat(lives);
    document.getElementById("score").innerText = "⭐ " + score;
}
