// Quiz savollari
const quizQuestions = [
    {
        question: "She walked _____ the library to find a book.",
        options: ["to", "into", "onto", "through"],
        correct: 1,
        explanation: "INTO - ichiga kirish harakati uchun ishlatiladi"
    },
    {
        question: "The cat jumped _____ the table.",
        options: ["to", "into", "onto", "across"],
        correct: 2,
        explanation: "ONTO - ustiga chiqish harakati uchun ishlatiladi"
    },
    {
        question: "We drove _____ the tunnel.",
        options: ["across", "through", "along", "onto"],
        correct: 1,
        explanation: "THROUGH - ichki qismidan o'tish uchun ishlatiladi"
    },
    {
        question: "They swam _____ the river.",
        options: ["through", "along", "across", "into"],
        correct: 2,
        explanation: "ACROSS - bir tarafdan ikkinchisiga o'tish uchun ishlatiladi"
    },
    {
        question: "I'm going _____ school.",
        options: ["to", "into", "onto", "through"],
        correct: 0,
        explanation: "TO - umumiy yo'nalish uchun ishlatiladi"
    },
    {
        question: "The bird flew _____ the window.",
        options: ["to", "into", "through", "onto"],
        correct: 2,
        explanation: "THROUGH - orqali o'tish uchun ishlatiladi"
    },
    {
        question: "We walked _____ the beach.",
        options: ["through", "across", "along", "onto"],
        correct: 2,
        explanation: "ALONG - bo'ylab yurish uchun ishlatiladi"
    },
    {
        question: "He climbed _____ the mountain.",
        options: ["up", "down", "across", "through"],
        correct: 0,
        explanation: "UP - yuqoriga harakat uchun ishlatiladi"
    }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = -1;

// Sahifa yuklanganda quiz boshlash
document.addEventListener('DOMContentLoaded', function() {
    loadQuestion();
});

// Savolni yuklash
function loadQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;
    
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        option.textContent = String.fromCharCode(65 + index) + ') ' + question.options[index];
        option.className = 'option';
    });
    
    document.getElementById('quiz-result').innerHTML = '';
    document.getElementById('total').textContent = quizQuestions.length;
    selectedAnswer = -1;
}

// Javobni tanlash
function selectAnswer(index) {
    selectedAnswer = index;
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
}

// Keyingi savolga o'tish
function nextQuestion() {
    if (selectedAnswer === -1) {
        alert('Iltimos, javobni tanlang!');
        return;
    }
    
    const question = quizQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    
    // To'g'ri va noto'g'ri javoblarni ko'rsatish
    options.forEach((option, index) => {
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedAnswer && selectedAnswer !== question.correct) {
            option.classList.add('incorrect');
        }
    });
    
    // Natijani ko'rsatish
    let resultHTML = '';
    if (selectedAnswer === question.correct) {
        score++;
        resultHTML = `<div class="result correct">To'g'ri! ${question.explanation}</div>`;
    } else {
        resultHTML = `<div class="result incorrect">Noto'g'ri! ${question.explanation}</div>`;
    }
    
    document.getElementById('quiz-result').innerHTML = resultHTML;
    document.getElementById('score').textContent = score;
    
    // Keyingi savolga o'tish
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestions.length) {
            loadQuestion();
        } else {
            showFinalResult();
        }
    }, 2000);
}

// Yakuniy natijani ko'rsatish
function showFinalResult() {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    let message = '';
    
    if (percentage >= 80) {
        message = 'Ajoyib! Siz prepositions of movement mavzusini yaxshi o\'zlashtirgansiz!';
    } else if (percentage >= 60) {
        message = 'Yaxshi! Lekin yana bir oz mashq kerak.';
    } else {
        message = 'Mashq qilishda davom eting. Siz buni uddalaysiz!';
    }
    
    document.getElementById('question').innerHTML = `
        <h3>Test yakunlandi!</h3>
        <p>Sizning natijangiz: ${score}/${quizQuestions.length} (${percentage}%)</p>
        <p>${message}</p>
        <button onclick="restartQuiz()" style="background: linear-gradient(45deg, #00b894, #00a085); color: white; border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; font-size: 16px; margin-top: 15px;">Qayta boshlash</button>
    `;
    
    document.querySelector('.quiz-options').style.display = 'none';
    document.querySelector('.next-btn').style.display = 'none';
}

// Testni qayta boshlash
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = -1;
    document.getElementById('score').textContent = '0';
    document.querySelector('.quiz-options').style.display = 'grid';
    document.querySelector('.next-btn').style.display = 'block';
    loadQuestion();
}

// Mashiq javoblarini tekshirish
function checkAnswer(inputId, correctAnswer) {
    const userAnswer = document.getElementById(inputId).value.trim().toLowerCase();
    const resultDiv = document.getElementById('result' + inputId.slice(-1));
    
    if (userAnswer === correctAnswer.toLowerCase()) {
        resultDiv.innerHTML = '<div class="result correct">To\'g\'ri! Ajoyib!</div>';
    } else {
        resultDiv.innerHTML = `<div class="result incorrect">Noto'g'ri! To'g'ri javob: ${correctAnswer}</div>`;
    }
}

// Amaliy mashqni tahlil qilish
function analyzePractice() {
    const text = document.getElementById('practice-text').value.trim();
    const resultDiv = document.getElementById('practice-result');
    
    if (text.length < 50) {
        resultDiv.innerHTML = '<div class="result incorrect">Iltimos, kamida 5 ta gap yozing!</div>';
        return;
    }
    
    // Prepositions of movement ro'yxati
    const prepositions = ['to', 'into', 'onto', 'through', 'across', 'along', 'up', 'down', 'around', 'over', 'under', 'past', 'towards'];
    
    let foundPrepositions = [];
    let sentenceCount = text.split(/[.!?]+/).length - 1;
    
    prepositions.forEach(prep => {
        const regex = new RegExp('\\b' + prep + '\\b', 'gi');
        const matches = text.match(regex);
        if (matches) {
            foundPrepositions.push({
                preposition: prep,
                count: matches.length
            });
        }
    });
    
    let feedback = '';
    if (foundPrepositions.length >= 3) {
        feedback = `<div class="result correct">
            Ajoyib! Siz ${foundPrepositions.length} xil harakat predlogini ishlatdingiz: 
            ${foundPrepositions.map(p => p.preposition.toUpperCase()).join(', ')}
            <br>Jami ${sentenceCount} ta gap yozdingiz.
        </div>`;
    } else if (foundPrepositions.length >= 1) {
        feedback = `<div class="result incorrect">
            Yaxshi boshlanish! Siz ${foundPrepositions.length} ta harakat predlogini ishlatdingiz.
            Ko'proq turli predloglar ishlatishga harakat qiling.
        </div>`;
    } else {
        feedback = `<div class="result incorrect">
            Harakat predloglarini ishlatmadingiz. To, into, through, across kabi so'zlarni qo'shing.
        </div>`;
    }
    
    resultDiv.innerHTML = feedback;
}

// Animatsiya effektlari
document.addEventListener('DOMContentLoaded', function() {
    // Sahifa yuklanganda animatsiyalar
    const sections = document.querySelectorAll('.section, .structure-box, .examples, .keywords, .rules, .exercises, .quiz, .practice, .conclusion');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
        // Enter bosilganda mashiq javobini tekshirish
        const inputId = event.target.id;
        if (inputId === 'ex1') {
            checkAnswer('ex1', 'to');
        } else if (inputId === 'ex2') {
            checkAnswer('ex2', 'We went across the bridge');
        } else if (inputId === 'ex3') {
            checkAnswer('ex3', 'through');
        }
    }
    
    // Quiz uchun raqam tugmalari
    if (event.key >= '1' && event.key <= '4') {
        const optionIndex = parseInt(event.key) - 1;
        if (optionIndex < 4) {
            selectAnswer(optionIndex);
        }
    }
    
    // Space bosilganda keyingi savol
    if (event.key === ' ' && selectedAnswer !== -1) {
        event.preventDefault();
        nextQuestion();
    }
});

// Tooltip effektlari
document.addEventListener('DOMContentLoaded', function() {
    const highlights = document.querySelectorAll('.highlight');
    
    highlights.forEach(highlight => {
        highlight.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        });
        
        highlight.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
});

// Matn kiritish maydonlari uchun yordamchi funksiya
function addInputHelper() {
    const inputs = document.querySelectorAll('input[type="text"]');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderLeft = '4px solid #00b894';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderLeft = 'none';
        });
    });
}

// Sahifa yuklanganda yordamchi funksiyalarni chaqirish
document.addEventListener('DOMContentLoaded', function() {
    addInputHelper();
});

// Progress bar uchun
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    // Progress bar qo'shish mumkin
}

// Local storage uchun natijalarni saqlash (ixtiyoriy)
function saveProgress() {
    const progress = {
        currentQuestion: currentQuestionIndex,
        score: score,
        timestamp: new Date().toISOString()
    };
    // localStorage.setItem('prepositions_progress', JSON.stringify(progress));
}

// Tasodifiy savol tanlash funksiyasi
function shuffleQuestions() {
    for (let i = quizQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quizQuestions[i], quizQuestions[j]] = [quizQuestions[j], quizQuestions[i]];
    }
}

// Sahifa yuklanganda savollarni aralashtirish
document.addEventListener('DOMContentLoaded', function() {
    shuffleQuestions();
});