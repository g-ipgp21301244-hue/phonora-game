// ================= GAME STATE =================
let lives = 6;
let score = 0;
let currentScript = "";
let selectedRole = "";
let currentIndex = 0;
let currentLevel = "";

// ================= MISSIONS =================
const missions = {
    pilot: { title: "✈️ Flight Mission", success: "Smooth flight!", fail: "⚠️ Turbulence!" },
    news: { title: "📡 Live News", success: "Clear broadcast!", fail: "📡 Signal glitch!" },
    service: { title: "☎️ Customer Service", success: "Customer happy!", fail: "😡 Customer angry!" },
    host: { title: "🎬 TV Show", success: "Audience loves it!", fail: "😬 Awkward moment!" },
    minister: { title: "🏛️ Speech", success: "👏 Crowd impressed!", fail: "😠 Crowd unhappy!" }
};

const characters = {
    pilot: "🧑‍✈️",
    news: "🧑‍💼",
    service: "📞",
    host: "🎤",
    minister: "🏛️"
};
const scripts = {
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
            ["Good morning passengers this is your captain speaking", "Please fasten your seatbelts and ensure your seats are upright", "Follow the instructions given by the cabin crew"],
            ["We are currently flying at thirty thousand feet", "We will be passing over several islands", "Our estimated arrival time is two hours"],
            ["We are experiencing slight turbulence", "Please remain calm and stay seated", "Our crew is here to ensure your safety"]
        ]
    },

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
            ["Hello, welcome to our service center.", "How may I assist you today?", "I am here to help you."],
            ["Can you explain your problem?", "Please provide more information.", "I will check it for you."],
            ["We are sorry for the inconvenience.", "We understand your concern.", "We will fix this issue quickly."],
            ["Your issue has been identified.", "We are working on a solution.", "Please wait for a moment."],
            ["Your problem has been resolved.", "Please check again.", "Let us know if you need help."],
            ["Thank you for contacting us.", "We appreciate your patience.", "Have a wonderful day ahead."]
        ],
        hard: [
            ["Good day, thank you for contacting customer service", "I understand that you are facing an issue with your account", "Please allow me a moment to check the details for you"],
            ["After checking your account, I have identified the issue", "We will take immediate action to resolve it", "Please rest assured that this will not happen again"],
            ["Your issue has now been successfully resolved", "Thank you for your understanding and cooperation", "Please feel free to contact us again if needed"]
        ]
    },

    news: {
        easy: [
            ["Good evening, this is the news."],
            ["Today's story is very important."],
            ["There is heavy rain today."],
            ["Many people are affected."],
            ["The situation is improving."],
            ["Stay safe and take care."]
        ],
        medium: [
            ["Good evening, this is the news.", "I am your news anchor today.", "Here are the top stories."],
            ["There is heavy rain today.", "Flooding has been reported.", "People are advised to stay safe."],
            ["A new school has opened.", "Many students are excited.", "The event was successful."],
            ["Doctors advise people to stay healthy.", "Drink enough water daily.", "Exercise regularly."],
            ["The situation is improving.", "Rescue teams are helping.", "More updates will follow."],
            ["That is all for today.", "Thank you for watching.", "Stay safe and take care."]
        ],
        hard: [
            ["Good evening, this is your live news report", "Heavy rain has caused flooding in several areas", "Rescue teams have been deployed to assist families"],
            ["In other news, a new community school was opened", "The event was attended by local leaders and students", "This school will improve learning opportunities"],
            ["That concludes today's news update", "We will continue to bring you updates", "Thank you for watching and stay safe"]
        ]
    },

    host: {
        easy: [
            ["Hello everyone, welcome to the show."],
            ["Today we have a special guest."],
            ["Let's start the program now."],
            ["This is very exciting."],
            ["Thank you for joining us."],
            ["See you next time."]
        ],
        medium: [
            ["Hello everyone, welcome to our show.", "I am your host today.", "Let's begin the program."],
            ["Today we have a special guest.", "They are very talented.", "Let's welcome them."],
            ["Can you tell us about yourself?", "That is very interesting.", "Thank you for sharing."],
            ["Now we will play a fun game.", "Everyone can join.", "Let's have some fun."],
            ["Thank you for being here.", "We enjoyed your time.", "It was amazing."],
            ["That's all for today.", "Thank you for watching.", "See you again soon."]
        ],
        hard: [
            ["Hello everyone and welcome to our exciting show", "I am your host for today", "We have an amazing program lined up"],
            ["Today we are joined by a special guest", "Thank you for being here with us", "Please share your experience with our audience"],
            ["It has been a wonderful time today", "Thank you to our guest and viewers", "See you next time for more exciting content"]
        ]
    },

    minister: {
        easy: [
            ["Good morning, everyone."],
            ["I am happy to be here today."],
            ["Education is very important."],
            ["We will improve our schools."],
            ["Thank you for your support."],
            ["Have a great day."]
        ],
        medium: [
            ["Good morning, everyone.", "I am honoured to be here today.", "Thank you for attending."],
            ["Education is very important.", "Students are our future.", "We must support learning."],
            ["We will improve our schools.", "New facilities will be built.", "Teachers will be trained."],
            ["We must work together.", "Strong communities build strong nations.", "Your support matters."],
            ["Thank you for your cooperation.", "We value your contribution.", "Together we succeed."],
            ["Thank you for your time.", "I appreciate your presence.", "Have a wonderful day."]
        ],
        hard: [
            ["Good morning ladies and gentlemen", "It is a great honour to be here today", "Education shapes our nation's future"],
            ["Today I am proud to announce new initiatives", "We will improve facilities and teacher training", "Together we can achieve excellence"],
            ["In conclusion I thank everyone for your support", "Let us build a brighter future together", "Have a pleasant day"]
        ]
    }
};
// ================= SPEECH =================
let recognition;
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-GB";
} else {
    alert("Speech recognition not supported 😢");
}

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

// ✅ CLEAN startGame (VERY IMPORTANT)
function startGame(level) {

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
    
    document.getElementById("roleTitle").innerText = selectedRole.toUpperCase();
    document.getElementById("missionTitle").innerText = missions[selectedRole].title;

    const character = document.getElementById("character");
    character.innerText = characters[selectedRole];
    character.style.left = "5%";

    document.getElementById("progressBar").style.width = "0%";

    updateHearts();
    updateScore();
    document.getElementById("feedback").innerHTML = "";
}

// ================= SPEECH =================
function startListening() {
    if (!recognition) {
        alert("Speech recognition not available");
        return;
    }

    try {
        recognition.stop(); // prevent already started error
    } catch (e) {}

    recognition.start();
}

// ================= RESULT =================
function handleResult(isCorrect, resultHTML, wrongWords = []) {
    const feedback = document.getElementById("feedback");

    feedback.innerHTML = resultHTML;

    if (isCorrect) {
        feedback.innerHTML += "<br>✅ " + missions[selectedRole].success;
        score += 10;
        sounds.correct.play();
        showStar();
        jumpToStar();
    } else {
        feedback.innerHTML += "<br>❌ " + missions[selectedRole].fail;
        lives--;
        sounds.wrong.play();
        showEnemy();
        enemyAttack();

        setTimeout(() => {
            speakWrongWords(wrongWords);
        }, 800);
    }

    updateHearts();
    updateScore();
}

// ================= WORD CHECK =================
function highlightWords(spoken, correct) {
    spoken = spoken.toLowerCase().trim().split(/\s+/);
    correct = correct.toLowerCase().trim().split(/\s+/);

    let result = "";
    let mistakes = 0;
    let wrongWords = [];

    correct.forEach((word, i) => {
        if (spoken[i] === word) {
            result += `<span class="correct">${word}</span> `;
        } else {
            result += `<span class="wrong">${word}</span> `;
            mistakes++;
            wrongWords.push(word);
        }
    });

    return { html: result, mistakes, wrongWords };
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

// ================= UI =================
function updateHearts() {
    document.getElementById("hearts").innerText = "❤️".repeat(lives);
}

function updateScore() {
    document.getElementById("score").innerText = "⭐ " + score;
}

function nextRound() {
    let quests = scripts[selectedRole][currentLevel];

    currentIndex++;

    if (currentIndex >= quests.length) {
        document.getElementById("script").innerText = "🏰 You reached the castle!";
        document.getElementById("feedback").innerHTML = "👑 Victory!";
        sounds.win.play();
        return;
    }

    document.getElementById("questTitle").innerText = "Quest " + (currentIndex + 1);
    currentScript = quests[currentIndex].join(" ");
    document.getElementById("script").innerText = currentScript;
    document.getElementById("feedback").innerHTML = "";

    moveCharacter();
}

function goToMenu() {
    document.getElementById("game").classList.add("hidden");
    document.getElementById("menu").classList.remove("hidden");
}

function moveCharacter() {
    let total = scripts[selectedRole][currentLevel].length;
    let progress = (currentIndex / total) * 80;
    document.getElementById("character").style.left = progress + "%";
}

// ================= ANIMATION =================
function showStar() {
    document.getElementById("star").classList.add("show-star");
    setTimeout(() => document.getElementById("star").classList.remove("show-star"), 1000);
}

function jumpToStar() {
    const c = document.getElementById("character");
    c.style.transform = "translateY(-60px)";
    setTimeout(() => c.style.transform = "translateY(0)", 600);
}

function showEnemy() {
    document.getElementById("enemy").classList.add("show-enemy");
    setTimeout(() => document.getElementById("enemy").classList.remove("show-enemy"), 800);
}

function enemyAttack() {
    const c = document.getElementById("character");
    c.classList.add("hit");
    setTimeout(() => c.classList.remove("hit"), 400);
}

// ================= SOUND =================
const sounds = {
    correct: new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"),
    wrong: new Audio("https://actions.google.com/sounds/v1/cartoon/boing.ogg"),
    win: new Audio("https://actions.google.com/sounds/v1/cartoon/ta_da.ogg")
};
