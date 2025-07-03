// Quiz ma'lumotlari
const quizData = [
    {
        question: "To'g'ri formulani tanlang:",
        options: [
            "Subject + will + be + V-ing",
            "Subject + will have been + V-ing",
            "Subject + have been + V-ing",
            "Subject + will + V-ing"
        ],
        correct: 1
    },
    {
        question: "Qaysi gap to'g'ri yozilgan?",
        options: [
            "I will have been studying for 3 hours by 5 PM.",
            "I will have been study for 3 hours by 5 PM.",
            "I will been studying for 3 hours by 5 PM.",
            "I will have studying for 3 hours by 5 PM."
        ],
        correct: 0
    },
    {
        question: "Future Perfect Continuous zamoni qachon ishlatiladi?",
        options: [
            "Kelajakdagi oddiy harakat uchun",
            "O'tmishdagi harakat uchun",
            "Kelajakda ma'lum paytga kelib davom etadigan harakat uchun",
            "Hozirgi zamondagi harakat uchun"
        ],
        correct: 2
    },
    {
        question: "Qaysi kalit so'z Future Perfect Continuous bilan ishlatilmaydi?",
        options: [
            "for",
            "since",
            "by",
            "already"
        ],
        correct: 3
    },
    {
        question: "Inkor gapni tanlang:",
        options: [
            "They will have been working.",
            "They will not have been working.",
            "They have not been working.",
            "They will not be working."
        ],
        correct: 1
    }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

// Sahifa yuklanganda
document.addEventListener('DOMContentLoaded', function() {
    initializeQuiz();
    addEventListeners();
});

// Quiz boshlash
function initializeQuiz() {
    displayQuestion();
    updateScore();
}

// Savolni ko'rsatish
function displayQuestion() {
    const question = quizData[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;
    
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        option.textContent = `${String.fromCharCode(65 + index)}) ${question.options[index]}`;
        option.className = 'option';
        option.disabled = false;
    });
    
    document.getElementById('quiz-result').textContent = '';
    selectedAnswer = null;
}

// Javob tanlash
function selectAnswer(index) {
    selectedAnswer = index;
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
    
    // Javobni tekshirish
    setTimeout(() => {
        checkQuizAnswer();
    }, 500);
}

// Quiz javobini tekshirish
function checkQuizAnswer() {
    const question = quizData[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    const resultDiv = document.getElementById('quiz-result');
    
    if (selectedAnswer === question.correct) {
        score++;
        options[selectedAnswer].classList.add('correct');
        resultDiv.textContent = "To'g'ri! 🎉";
        resultDiv.className = 'quiz-result correct';
    } else {
        options[selectedAnswer].classList.add('incorrect');
        options[question.correct].classList.add('correct');
        resultDiv.textContent = `Noto'g'ri! To'g'ri javob: ${String.fromCharCode(65 + question.correct)}`;
        resultDiv.className = 'quiz-result incorrect';
    }
    
    // Tugmalarni o'chirish
    options.forEach(option => option.disabled = true);
    updateScore();
}

// Keyingi savol
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        displayQuestion();
    } else {
        showQuizResult();
    }
}

// Quiz natijasini ko'rsatish
function showQuizResult() {
    const percentage = (score / quizData.length) * 100;
    let message = '';
    
    if (percentage >= 80) {
        message = 'Ajoyib! Siz Future Perfect Continuous zamonini yaxshi o\'rganibsiz! 🏆';
    } else if (percentage >= 60) {
        message = 'Yaxshi! Lekin biroz ko\'proq mashq qilishingiz kerak. 📚';
    } else {
        message = 'Mashq qilishda davom eting! Siz albatta muvaffaqiyatga erishasiz! 💪';
    }
    
    document.getElementById('question').innerHTML = `
        <h3>Test tugadi!</h3>
        <p>Sizning natijangiz: ${score}/${quizData.length} (${percentage.toFixed(1)}%)</p>
        <p>${message}</p>
    `;
    
    document.querySelector('.quiz-options').style.display = 'none';
    document.querySelector('.next-btn').textContent = 'Testni qayta boshlash';
    document.querySelector('.next-btn').onclick = restartQuiz;
}

// Testni qayta boshlash
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;
    document.querySelector('.quiz-options').style.display = 'grid';
    document.querySelector('.next-btn').textContent = 'Keyingi savol';
    document.querySelector('.next-btn').onclick = nextQuestion;
    initializeQuiz();
}

// Natijani yangilash
function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('total').textContent = quizData.length;
}

// Mashiq javoblarini tekshirish
function checkAnswer(inputId, correctAnswer) {
    const input = document.getElementById(inputId);
    const userAnswer = input.value.trim().toLowerCase();
    const correct = correctAnswer.toLowerCase();
    const resultId = 'result' + inputId.slice(-1);
    const resultDiv = document.getElementById(resultId);
    
    if (userAnswer === correct) {
        resultDiv.textContent = "To'g'ri! 🎉";
        resultDiv.className = 'result correct';
        input.style.borderColor = '#00b894';
    } else {
        resultDiv.textContent = `Noto'g'ri! To'g'ri javob: ${correctAnswer}`;
        resultDiv.className = 'result incorrect';
        input.style.borderColor = '#d63031';
    }
    
    // Animatsiya
    resultDiv.style.animation = 'fadeInUp 0.5s ease-out';
}

// Amaliy mashqni tahlil qilish
function analyzePractice() {
    const textarea = document.getElementById('practice-text');
    const text = textarea.value.trim();
    const resultDiv = document.getElementById('practice-result');
    
    if (text.length < 50) {
        resultDiv.textContent = "Iltimos, kamida 5 ta gap yozing!";
        resultDiv.className = 'result incorrect';
        return;
    }
    
    // Future Perfect Continuous ni tekshirish
    const pattern = /will\s+have\s+been\s+\w+ing/gi;
    const matches = text.match(pattern);
    
    if (matches && matches.length >= 3) {
        resultDiv.innerHTML = `
            <strong>Ajoyib!</strong> Siz ${matches.length} ta Future Perfect Continuous gapini to'g'ri yozdingiz:<br>
            ${matches.map(match => `• ${match}`).join('<br>')}
        `;
        resultDiv.className = 'result correct';
    } else if (matches && matches.length > 0) {
        resultDiv.innerHTML = `
            <strong>Yaxshi!</strong> ${matches.length} ta to'g'ri gap topildi, lekin ko'proq yozishga harakat qiling:<br>
            ${matches.map(match => `• ${match}`).join('<br>')}
        `;
        resultDiv.className = 'result';
    } else {
        resultDiv.textContent = "Future Perfect Continuous zamonini ishlatishga harakat qiling! (will have been + V-ing)";
        resultDiv.className = 'result incorrect';
    }
}

// Event listenerlar qo'shish
function addEventListeners() {
    // Klaviatura hodisalari
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const focusedElement = document.activeElement;
            if (focusedElement.tagName === 'INPUT') {
                // Enter bosilganda javobni tekshirish
                const button = focusedElement.nextElementSibling;
                if (button && button.tagName === 'BUTTON') {
                    button.click();
                }
            }
        }
    });
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Input animatsiyalari
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Textarea animatsiyalari
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });
        
        textarea.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
}

// Sahifa yuklash animatsiyasi
window.addEventListener('load', function() {
    const sections = document.querySelectorAll('.section, .structure-box, .examples, .keywords, .rules, .exercises, .quiz, .practice, .conclusion');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out';
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Rasmiy vaqtni ko'rsatish
function showCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('uz-UZ');
    console.log(`Hozirgi vaqt: ${timeString}`);
}

// Sahifa ochilganda vaqtni ko'rsatish
showCurrentTime();

// Progress bar
window.addEventListener('scroll', function() {
    const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    // Progress bar yaratish (agar mavjud bo'lmasa)
    let progressBar = document.querySelector('.progress-bar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(45deg, #3498db, #9b59b6);
            z-index: 1000;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);
    }
    
    progressBar.style.width = scrolled + '%';
});

// Mahalliy saqlash (localStorage o'rniga oddiy o'zgaruvchi)
let userProgress = {
    completedExercises: 0,
    quizScore: 0,
    practiceSubmitted: false
};

// Foydalanuvchi progressini yangilash
function updateProgress(type) {
    switch(type) {
        case 'exercise':
            userProgress.completedExercises++;
            break;
        case 'quiz':
            userProgress.quizScore = score;
            break;
        case 'practice':
            userProgress.practiceSubmitted = true;
            break;
    }
    
    console.log('Progress updated:', userProgress);
}

// Mashq tugagandan so'ng progressni yangilash
const originalCheckAnswer = checkAnswer;
checkAnswer = function(inputId, correctAnswer) {
    originalCheckAnswer(inputId, correctAnswer);
    updateProgress('exercise');
};

// Amaliy mashq tugagandan so'ng
const originalAnalyzePractice = analyzePractice;
analyzePractice = function() {
    originalAnalyzePractice();
    updateProgress('practice');
};

// Motivatsion xabarlar
const motivationalMessages = [
    "Siz juda yaxshi o'rganib borayapsiz! 💪",
    "Davom eting, muvaffaqiyat yaqin! 🌟",
    "Har bir mashq sizni maqsadga yaqinlashtiradi! 🎯",
    "Ajoyib! Siz haqiqiy o'quvchisiz! 📚",
    "Ingliz tilini o'rganish - eng yaxshi sarmoya! 🏆"
];

// Tasodifiy motivatsion xabar
function showMotivationalMessage() {
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    const message = motivationalMessages[randomIndex];
    
    // Xabar ko'rsatish
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #00b894, #00a085);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideInRight 0.5s ease-out;
    `;
    
    document.body.appendChild(messageDiv);
    
    // 3 soniyadan so'ng o'chirish
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 500);
    }, 3000);
}

// Har 2 daqiqada motivatsion xabar
setInterval(showMotivationalMessage, 120000);