// ================= GAME STATE =================
let lives = 6;
let score = 0;
let currentScript = "";
let selectedRole = "";
let currentIndex = 0;
let currentLevel = "";

// ================= MISSIONS =================
const missions = {
    pilot: { title: "✈️ Flight Mission", success: "Smooth flight!", fail: "⚠️ Turbulence!", effect: "shake" },
    news: { title: "📡 Live News", success: "Clear broadcast!", fail: "📡 Signal glitch!", effect: "glitch" },
    service: { title: "☎️ Customer Service", success: "Customer happy!", fail: "😡 Customer angry!", effect: "angry" },
    host: { title: "🎬 TV Show", success: "Audience loves it!", fail: "😬 Awkward moment!", effect: "awkward" },
    minister: { title: "🏛️ Speech", success: "👏 Crowd impressed!", fail: "😠 Crowd unhappy!", effect: "crowd" }
};

// ================= SCRIPTS =================
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
            ["Today’s story is very important."],
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
            ["That concludes today’s news update", "We will continue to bring you updates", "Thank you for watching and stay safe"]
        ]
    },

    host: {
        easy: [
            ["Hello everyone, welcome to the show."],
            ["Today we have a special guest."],
            ["Let’s start the program now."],
            ["This is very exciting."],
            ["Thank you for joining us."],
            ["See you next time."]
        ],
        medium: [
            ["Hello everyone, welcome to our show.", "I am your host today.", "Let’s begin the program."],
            ["Today we have a special guest.", "They are very talented.", "Let’s welcome them."],
            ["Can you tell us about yourself?", "That is very interesting.", "Thank you for sharing."],
            ["Now we will play a fun game.", "Everyone can join.", "Let’s have some fun."],
            ["Thank you for being here.", "We enjoyed your time.", "It was amazing."],
            ["That’s all for today.", "Thank you for watching.", "See you again soon."]
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
            ["Good morning ladies and gentlemen", "It is a great honour to be here today", "Education shapes our nation’s future"],
            ["Today I am proud to announce new initiatives", "We will improve facilities and teacher training", "Together we can achieve excellence"],
            ["In conclusion I thank everyone for your support", "Let us build a brighter future together", "Have a pleasant day"]
        ]
    }
}; //

// ================= SPEECH SETUP =================
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-GB';

speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices();
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
    document.getElementById("questTitle").innerText = "Quest 1";
    document.getElementById("levels").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    currentLevel = level;
    currentIndex = 0;
    lives = 6;
    score = 0;

    currentScript = scripts[selectedRole][level][currentIndex].join(" ");

    document.getElementById("roleTitle").innerText = selectedRole.toUpperCase();
    document.getElementById("missionTitle").innerText = missions[selectedRole].title;
    document.getElementById("script").innerText = currentScript;

    updateHearts();
    updateScore();
    document.getElementById("feedback").innerHTML = "";
}

// ================= SPEECH =================
function startListening() {
    recognition.start();
}

recognition.onresult = function(event) {
    let spokenText = event.results[0][0].transcript;
    let result = highlightWords(spokenText, currentScript);

    document.getElementById("feedback").innerHTML = result.html;

    handleResult(result.mistakes === 0);
};

// ================= RESULT =================
function handleResult(isCorrect) {
    const feedback = document.getElementById("feedback");
    const gameArea = document.getElementById("gameArea");

    gameArea.className = "card";

    if (isCorrect) {
        feedback.innerHTML += "<br>✅ " + missions[selectedRole].success;
        score += 10;
    } else {
        feedback.innerHTML += "<br>❌ " + missions[selectedRole].fail;
        lives--;
        gameArea.classList.add(missions[selectedRole].effect);
    }

    updateHearts();
    updateScore();
}

// ================= WORD HIGHLIGHT + AUDIO =================
function highlightWords(spoken, correct) {
    spoken = spoken.toLowerCase().split(" ");
    correct = correct.toLowerCase().split(" ");

    let result = "";
    let mistakes = 0;

    correct.forEach((word, i) => {
        if (spoken[i] === word) {
            result += `<span class="correct">${word}</span> `;
        } else {
            result += `<span class="wrong">${word}</span> `;
            mistakes++;
            setTimeout(() => speakWord(word), 700 * i);
        }
    });

    return { html: result, mistakes: mistakes };
}

// ================= AUDIO =================
function speakWord(word) {
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-GB';
    utterance.rate = 0.9;

    let voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
        utterance.voice = voices.find(v => v.lang === 'en-GB') || voices[0];
    }

    speechSynthesis.speak(utterance);
}

// ================= UI =================
function updateHearts() {
    document.getElementById("hearts").innerText = "❤️".repeat(lives);
}

function updateScore() {
    document.getElementById("score").innerText = "⭐ " + score;
}

function nextRound() {
    document.getElementById("questTitle").innerText = "Quest " + (currentIndex + 1);

    let quests = scripts[selectedRole][currentLevel];
    currentIndex++;

    if (currentIndex >= quests.length) {
        document.getElementById("script").innerText = "🏰 Final Castle Reached!";
        document.getElementById("feedback").innerHTML = "👑 You saved the princess! 🎉";
        return;
    }

    currentScript = quests[currentIndex].join(" ");
    document.getElementById("script").innerText = currentScript;
    document.getElementById("feedback").innerHTML = "";
}

function goToMenu() {
    document.getElementById("game").classList.add("hidden");
    document.getElementById("menu").classList.remove("hidden");
}
