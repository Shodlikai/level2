// Mashqlar uchun javoblarni tekshirish funksiyasi
function checkAnswer(inputId, correctAnswer) {
    const input = document.getElementById(inputId).value.trim().toLowerCase();
    const resultDiv = document.getElementById(`result${inputId.slice(-1)}`);
    
    if (input === correctAnswer.toLowerCase()) {
        resultDiv.textContent = "To'g'ri! ✅";
        resultDiv.className = "result correct";
    } else {
        resultDiv.textContent = `Noto'g'ri! To'g'ri javob: ${correctAnswer || 'bo\'sh'} ❌`;
        resultDiv.className = "result incorrect";
    }
}

// Interaktiv test uchun savollar
const questions = [
    {
        question: "_____ Tashkent is the capital of Uzbekistan.",
        options: ["A) The", "B) A", "C) An", "D) No article"],
        correct: 3
    },
    {
        question: "I love playing _____ football.",
        options: ["A) The", "B) A", "C) An", "D) No article"],
        correct: 3
    },
    {
        question: "She studies _____ English every day.",
        options: ["A) The", "B) A", "C) An", "D) No article"],
        correct: 3
    },
    {
        question: "_____ Mount Fuji is in Japan.",
        options: ["A) The", "B) A", "C) An", "D) No article"],
        correct: 3
    },
    {
        question: "_____ Dogs are loyal animals.",
        options: ["A) The", "B) A", "C) An", "D) No article"],
        correct: 3
    }
];

let currentQuestion = 0;
let score = 0;

// Test savollarini yuklash
function loadQuestion() {
    const quizQuestion = document.getElementById("question");
    const options = document.querySelectorAll(".option");
    
    quizQuestion.textContent = questions[currentQuestion].question;
    options.forEach((option, index) => {
        option.textContent = questions[currentQuestion].options[index];
        option.classList.remove("correct", "incorrect", "selected");
    });
    document.getElementById("quiz-result").textContent = "";
}

// Javobni tanlash
function selectAnswer(index) {
    const options = document.querySelectorAll(".option");
    options.forEach(option => option.classList.remove("selected"));
    options[index].classList.add("selected");

    const correctIndex = questions[currentQuestion].correct;
    if (index === correctIndex) {
        options[index].classList.add("correct");
        score++;
        document.getElementById("quiz-result").textContent = "To'g'ri! ✅";
        document.getElementById("quiz-result").style.color = "#00b894";
    } else {
        options[index].classList.add("incorrect");
        options[correctIndex].classList.add("correct");
        document.getElementById("quiz-result").textContent = `Noto'g'ri! To'g'ri javob: ${questions[currentQuestion].options[correctIndex]} ❌`;
        document.getElementById("quiz-result").style.color = "#d63031";
    }
    updateScore();
}

// Keyingi savolga o'tish
function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        document.getElementById("question").textContent = "Test yakunlandi!";
        document.querySelector(".quiz-options").style.display = "none";
        document.querySelector(".next-btn").style.display = "none";
        document.getPharmacist("quiz-result").textContent = `Sizning natijangiz: ${score} / ${questions.length}`;
    }
}

// Natijani yangilash
function updateScore() {
    document.getElementById("score").textContent = score;
    document.getElementById("total").textContent = questions.length;
}

// Amaliy mashq matnini tahlil qilish
function analyzePractice() {
    const text = document.getElementById("practice-text").value;
    const resultDiv = document.getElementById("practice-result");
    let analysis = "";
    
    // Tahlil qoidalari
    const sentences = text.split(".");
    const rules = [
        { pattern: /\bthe school\b/i, correct: "school", explanation: "Maqsad uchun 'school' oldidan THE ishlatilmaydi." },
        { pattern: /\bthe English\b/i, correct: "English", explanation: "Tillarda THE ishlatilmaydi." },
        { pattern: /\bthe football\b/i, correct: "football", explanation: "Sport turlari bilan THE ishlatilmaydi." },
        { pattern: /\bthe Tashkent\b/i, correct: "Tashkent", explanation: "Shahar nomlari bilan THE ishlatilmaydi." },
        { pattern: /\bthe Math\b/i, correct: "Math", explanation: "Fan nomlarida THE ishlatilmaydi." },
        { pattern: /\bthe university\b/i, correct: "university", explanation: "Maqsad uchun 'university' oldidan THE ishlatilmaydi." },
        { pattern: /\bthe Brazil\b/i, correct: "Brazil", explanation: "Yakka mamlakat nomlari bilan THE ishlatilmaydi." },
        { pattern: /\bthe train\b/i, correct: "train", explanation: "'by train' iborasida THE ishlatilmaydi." },
        { pattern: /\bthe Lake Baikal\b/i, correct: "Lake Baikal", explanation: "Ko'l nomlari bilan THE ishlatilmaydi." },
        { pattern: /\bthe music\b/i, correct: "music", explanation: "Umumiy ma'noda THE ishlatilmaydi." },
        { pattern: /\bthe work\b/i, correct: "work", explanation: "Maqsad uchun 'work' oldidan THE ishlatilmaydi." },
    ];
    
    sentences.forEach(sentence => {
        sentence = sentence.trim();
        if (sentence) {
            let foundError = false;
            rules.forEach(rule => {
                if (rule.pattern.test(sentence)) {
                    foundError = true;
                    if (sentence.includes(rule.correct)) {
                        analysis += `<p>✅ To'g'ri: "${sentence}" - ${rule.explanation}</p>`;
                    } else {
                        analysis += `<p>❌ Xato: "${sentence}" → To'g'ri: "${sentence.replace(rule.pattern, rule.correct)}" - ${rule.explanation}</p>`;
                    }
                }
            });
            if (!foundError) {
                analysis += `<p>ℹ️ "${sentence}" - Bu jumlada aniq xato topilmadi, lekin qo'shimcha tekshirish kerak bo'lishi mumkin.</p>`;
            }
        }
    });
    
    resultDiv.innerHTML = analysis || "Iltimos, matn kiritib tahlil qiling!";
    resultDiv.className = "result";
}

// Sahifa yuklanganda birinchi savolni yuklash
document.addEventListener("DOMContentLoaded", () => {
    loadQuestion();
    updateScore();
});