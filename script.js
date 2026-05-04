// ================= GAME STATE =================
let lives = 6;
let score = 0;
let currentScript = "";
let selectedRole = "";
let currentIndex = 0;
let currentLevel = "";

const monsters = ["👾", "👹", "👻", "🤖", "🐲", "🧟"];
const scripts = {

    // ✈️ PILOT
    pilot: {
        easy: [
            ["Welcome aboard our flight today."],
            ["Please fasten your seatbelt now."],
            ["We are ready for takeoff."],
            ["The weather is clear and sunny."],
            ["We will land in one hour."],
            ["Thank you for flying with us."]
        ],
        medium: [
            ["Please fasten your seatbelt securely.", "Make sure your seat is upright.", "Keep your tray table closed."],
            ["We are ready for takeoff.", "Please remain seated at all times.", "Enjoy your flight with us."],
            ["The weather today is calm.", "There may be light clouds ahead.", "The flight will be smooth."],
            ["We are flying over the ocean.", "You may see islands below.", "Our destination is Kuala Lumpur."],
            ["We may experience some turbulence.", "Please stay seated for safety.", "Keep your seatbelt fastened."],
            ["We are preparing to land now.", "Please check your seatbelt again.", "Thank you for flying with us."]
        ],
        hard: [
            ["Good morning passengers this is your captain speaking please fasten your seatbelts and ensure your seats are upright thank you for your cooperation"],
            ["Ladies and gentlemen we are currently flying at thirty thousand feet please enjoy your flight and relax"],
            ["Attention passengers we are experiencing turbulence please remain seated and stay calm thank you"]
        ]
    },

    // ☎️ CUSTOMER SERVICE
    service: {
        easy: [
            ["Hello, how can I help you?"],
            ["Please tell me your problem."],
            ["I will check it for you."],
            ["Thank you for your patience."],
            ["Your issue has been solved."],
            ["Have a nice day."]
        ],
        medium: [
            ["Hello welcome to our service center", "How may I assist you today", "I am here to help you"],
            ["Can you explain your problem", "Please provide more information", "I will check it for you"],
            ["We are sorry for the inconvenience", "We understand your concern", "We will fix this issue quickly"],
            ["Your issue has been identified", "We are working on a solution", "Please wait for a moment"],
            ["Your problem has been resolved", "Please check again", "Let us know if you need help"],
            ["Thank you for contacting us", "We appreciate your patience", "Have a wonderful day ahead"]
        ],
        hard: [
            ["Good day thank you for contacting customer service I understand your issue and will assist you shortly"],
            ["After checking your account I have identified the issue and will resolve it immediately"],
            ["Your issue has been resolved thank you for your patience and have a great day"]
        ]
    },

    // 📰 NEWS ANCHOR
    anchor: {
        easy: [
            ["Good evening this is the news"],
            ["Today story is very important"],
            ["There is heavy rain today"],
            ["Many people are affected"],
            ["The situation is improving"],
            ["Stay safe and take care"]
        ],
        medium: [
            ["Good evening this is the news", "I am your news anchor today", "Here are the top stories"],
            ["There is heavy rain today", "Flooding has been reported", "People are advised to stay safe"],
            ["A new school has opened", "Many students are excited", "The event was successful"],
            ["Doctors advise people to stay healthy", "Drink enough water daily", "Exercise regularly"],
            ["The situation is improving", "Rescue teams are helping", "More updates will follow"],
            ["That is all for today", "Thank you for watching", "Stay safe and take care"]
        ],
        hard: [
            ["Good evening this is your live news report heavy rain has caused flooding in several areas"],
            ["In other news a new community school was opened today with many excited students"],
            ["That concludes today news update thank you for watching and stay safe"]
        ]
    },

    // 🎤 TV HOST
    host: {
        easy: [
            ["Hello everyone welcome to the show"],
            ["Today we have a special guest"],
            ["Let us start the program now"],
            ["This is very exciting"],
            ["Thank you for joining us"],
            ["See you next time"]
        ],
        medium: [
            ["Hello everyone welcome to our show", "I am your host today", "Let us begin the program"],
            ["Today we have a special guest", "They are very talented", "Let us welcome them"],
            ["Can you tell us about yourself", "That is very interesting", "Thank you for sharing"],
            ["Now we will play a fun game", "Everyone can join", "Let us have some fun"],
            ["Thank you for being here", "We enjoyed your time", "It was amazing"],
            ["That is all for today", "Thank you for watching", "See you again soon"]
        ],
        hard: [
            ["Hello everyone and welcome to our exciting show we have an amazing program for you"],
            ["Today we are joined by a special guest please share your experience with us"],
            ["It has been a wonderful time thank you for watching and see you next time"]
        ]
    },

    // 🏛️ MINISTER
    minister: {
        easy: [
            ["Good morning everyone"],
            ["I am happy to be here today"],
            ["Education is very important"],
            ["We will improve our schools"],
            ["Thank you for your support"],
            ["Have a great day"]
        ],
        medium: [
            ["Good morning everyone", "I am honoured to be here today", "Thank you for attending"],
            ["Education is very important", "Students are our future", "We must support learning"],
            ["We will improve our schools", "New facilities will be built", "Teachers will be trained"],
            ["We must work together", "Strong communities build strong nations", "Your support matters"],
            ["Thank you for your cooperation", "We value your contribution", "Together we succeed"],
            ["Thank you for your time", "I appreciate your presence", "Have a wonderful day"]
        ],
        hard: [
            ["Good morning ladies and gentlemen it is an honour to be here education is important for our future"],
            ["Today I announce new initiatives to improve education including facilities and training"],
            ["Thank you for your support let us build a better future together"]
        ]
    }
};

// ================= SPEECH =================
let recognition = null;

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-GB";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function(event) {
    const spoken = event.results[0][0].transcript;
    const result = checkSpeech(spoken, currentScript);

    const allowedMistakes = Math.ceil(result.total * 0.4);
    const isCorrect = result.mistakes <= allowedMistakes;

    handleResult(isCorrect, result.html, result.wrongWords);
};

    recognition.onend = function() {
        console.log("Speech ended");
    };
} else {
    alert("Speech recognition not supported 😢");
}

// ================= NAVIGATION =================
function goToRoles() {
    console.log("BUTTON CLICKED"); // 👈 ADD THIS
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("roles").classList.remove("hidden");
}
function selectRole(role) {
    if (!scripts[role]) {
        role = "service"; // fallback
    }

    selectedRole = role;

    document.getElementById("roles").classList.add("hidden");
    document.getElementById("levels").classList.remove("hidden");
}

function startGame(level) {
    console.log("START CLICKED", selectedRole, level);

    if (!selectedRole) {
        alert("Please select a role first!");
        return;
    }

    document.getElementById("levels").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    currentLevel = level;
    currentIndex = 0;
    lives = 6;
    score = 0;

    updateHearts();
    updateScore();

    moveToObstacle(); // 🔥 IMPORTANT
}
function moveToObstacle() {
    const char = document.getElementById("character");

char.classList.remove("walk");
void char.offsetWidth;
char.classList.add("walk");
    document.getElementById("character").style.left = "10%";
const monster = document.getElementById("obstacle");
monster.classList.add("monster-idle");
    setTimeout(() => {
        showPrompt();
    }, 500);
}
// ================= PROMPT =================
function showPrompt() {
    const box = document.getElementById("promptBox");

    let quests = scripts[selectedRole][currentLevel];

    if (!quests || !quests[currentIndex]) {
        console.error("No script found");
        return;
    }

    currentScript = quests[currentIndex].join(" ");

    document.getElementById("script").innerText = currentScript;
    document.getElementById("feedback").innerHTML = "";

    box.classList.remove("hidden");

    box.classList.remove("show");
    void box.offsetWidth; 
    box.classList.add("show");
}
// ================= SPEECH CONTROL =================
function startListening() {
    if (!recognition) return;

    try { recognition.stop(); } catch(e) {}

    recognition.start();
}

// ================= CHECK LOGIC =================
function checkSpeech(spoken, correct) {

    const clean = t => t.toLowerCase().replace(/[.,!?]/g, "").split(/\s+/);

    const spokenWords = clean(spoken);
    const correctWords = clean(correct);

    const easyWords = ["hello","hi","you","i","is","the","a","an","can"];

    let mistakes = 0;
    let wrongWords = [];
    let html = "";

    correctWords.forEach(word => {
        let match = spokenWords.some(w => similarity(w, word) > 0.5);

        if (match || easyWords.includes(word)) {
            html += `<span class="correct">${word}</span> `;
        } else {
            html += `<span class="wrong">${word}</span> `;
            mistakes++;
            wrongWords.push(word);
        }
    });

    return {
        html,
        mistakes,
        wrongWords,
        total: correctWords.length
    };
}

function similarity(a, b) {
    if (a === b) return 1;
    if (a.includes(b) || b.includes(a)) return 0.8;

    let match = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        if (a[i] === b[i]) match++;
    }
    return match / Math.max(a.length, b.length);
}

// ================= RESULT =================
function handleResult(isCorrect, html, wrongWords) {

    document.getElementById("feedback").innerHTML = html;

    if (isCorrect) {
        score += 10;
        updateScore();

        speakCorrect();
        const char = document.getElementById("character");
const star = document.getElementById("star");

star.classList.add("show-star");

char.classList.remove("jump-star");
void char.offsetWidth;
char.classList.add("jump-star");

const monster = document.getElementById("obstacle");

monster.classList.remove("monster-hit");
void monster.offsetWidth;
monster.classList.add("monster-hit");
// remove star after animation
setTimeout(() => {
    star.classList.remove("show-star");
}, 800);
        setTimeout(() => {
            currentIndex++;
            moveForward();
        }, 1500);

    } else {
        const char = document.getElementById("character");
    const lightning = document.getElementById("lightning");

    lightning.classList.remove("show-lightning");
    void lightning.offsetWidth;
    lightning.classList.add("show-lightning");

    char.classList.add("hit");

    setTimeout(() => {
        char.classList.remove("hit");
    }, 400);
        lives--;
        updateHearts();

        // 🔥 monster attack animation
let monster = document.getElementById("obstacle");
monster.classList.remove("attack");
void monster.offsetWidth;
monster.classList.add("attack");

speakWrongWords(wrongWords);

        if (lives <= 0) {
            gameOver();
            return;
        }

        // ✅ ADD AUTO-RETRY HERE
        setTimeout(() => {
            startListening();
        }, 1200);
    }
}
// ================= GAME FLOW =================
function moveForward() {
    let total = scripts[selectedRole][currentLevel].length;

    if (currentIndex >= total) {
        showEndScreen();
        return;
    }

    // 🔥 MOVE CHARACTER FORWARD EACH QUEST
    let character = document.getElementById("character");
    let currentLeft = parseInt(character.style.left) || 10;

    character.style.left = (currentLeft + 12) + "%"; // move forward

    // 🔥 MOVE MONSTER TO NEW POSITION
    moveMonster();

    showPrompt();
}
function moveMonster() {
    let monster = document.getElementById("obstacle");

    let newPosition = 50 + Math.random() * 30;
    monster.style.left = newPosition + "%";

    // 🔥 change monster each quest
    monster.innerText = monsters[Math.floor(Math.random() * monsters.length)];

    // reset animation
    monster.classList.remove("attack");
    void monster.offsetWidth;
    monster.classList.add("bounce");
}
// ================= END =================
function showEndScreen() {
    const box = document.getElementById("promptBox");

    box.classList.remove("hidden");
    box.classList.add("show");

    document.getElementById("script").innerText = "🏰 You've reached the castle!";
    document.getElementById("feedback").innerHTML = `
        🎉 Great job! <br><br>
        ${nextLevelButton()}
    `;
}

function nextLevelButton() {
    if (currentLevel === "easy") {
        return `<button onclick="startNextLevel('medium')">Next Level ➡️</button>`;
    }
    if (currentLevel === "medium") {
        return `<button onclick="startNextLevel('hard')">Next Level ➡️</button>`;
    }
    return `<button onclick="goToMenu()">Finish</button>`;
}

function startNextLevel(level) {
    currentLevel = level;
    currentIndex = 0;
    showPrompt();
}

// ================= UI =================
function updateHearts() {
    document.getElementById("hearts").innerText = "❤️".repeat(lives);
}

function updateScore() {
    document.getElementById("score").innerText = "⭐ " + score;
}

function goToMenu() {
    document.getElementById("game").classList.add("hidden");
    document.getElementById("menu").classList.remove("hidden");
}

// ================= AUDIO =================
function speakWrongWords(words) {
    if (!words.length) return;

    speechSynthesis.cancel();

    let i = 0;

    function next() {
        if (i >= words.length) return;

        let u = new SpeechSynthesisUtterance(words[i]);
        u.lang = "en-GB";
        u.rate = 0.8;

        u.onend = () => {
            i++;
            next();
        };

        speechSynthesis.speak(u);
    }

    next();
}
function speakWord(word) {
    let u = new SpeechSynthesisUtterance(word);
    u.lang = "en-GB";
    speechSynthesis.speak(u);
}
function speakCorrect() {
    let u = new SpeechSynthesisUtterance("Good job!");
    u.lang = "en-GB";
    u.rate = 1;

    speechSynthesis.cancel(); // stop previous
    speechSynthesis.speak(u);
}
function gameOver() {
    const box = document.getElementById("promptBox");

    box.classList.remove("hidden");
    box.classList.add("show");

    document.getElementById("script").innerText = "💀 Game Over";
    document.getElementById("feedback").innerHTML = `
        Try again! <br><br>
        <button onclick="goToMenu()">Back to Menu</button>
    `;
}
window.goToRoles = function () {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("roles").classList.remove("hidden");
};
function goToRoles() {
    alert("CLICK WORKED");
}
