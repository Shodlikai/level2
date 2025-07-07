// Mashqlar uchun javoblarni tekshirish funksiyasi
function checkAnswer(inputId, correctAnswer) {
    const input = document.getElementById(inputId).value.trim().toLowerCase();
    const resultDiv = document.getElementById(`result${inputId.slice(-1)}`);
    
    if (input === correctAnswer.toLowerCase()) {
        resultDiv.textContent = "To'g'ri! ✅";
        resultDiv.className = "result correct";
    } else {
        resultDiv.textContent = `Noto'g'ri! To'g'ri javob: ${correctAnswer} ❌`;
        resultDiv.className = "result incorrect";
    }
}

// Interaktiv test uchun savollar
const questions = [
    {
        question: "_____ sun is very bright today.",
        options: ["A) The", "B) A", "C) An", "D) No article"],
        correct: 0
    },
    {
        question: "I want to go to _____ school.",
        options: ["A) The", "B) A", "C) An", "D) No article"],
        correct: 3
    },
    {
        question: "She plays _____ piano very well.",
        options: ["A) The", "B) A", "C) An", "D) No article"],
        correct: 0
    },
    {
        question: "_____ London is a beautiful city.",
        options: ["A) The", "B) A", "C) An", "D) No article"],
        correct: 3
    },
    {
        question: "We saw _____ Himalayas last summer.",
        options: ["A) The", "B) A", "C) An", "D) No article"],
        correct: 0
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
        document.getElementById("quiz-result").textContent = `Sizning natijangiz: ${score} / ${questions.length}`;
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
    
    // Oddiy tahlil qoidalari
    const sentences = text.split(".");
    const rules = [
        { pattern: /\bthe school\b/i, correct: "school", explanation: "Maqsad uchun 'school' oldidan THE ishlatilmaydi." },
        { pattern: /\bthe park\b/i, correct: "the park", explanation: "An iq narsa sifatida 'the park' to'g'ri." },
        { pattern: /\bthe breakfast\b/i, correct: "breakfast", explanation: "Umumiy ma'noda 'breakfast' oldidan THE ishlatilmaydi." },
        { pattern: /\bthe morning\b/i, correct: "the morning", explanation: "'in the morning' to'g'ri, chunki kun qismi sifatida THE ishlatiladi." },
    ];
    
    sentences.forEach(sentence => {
        sentence = sentence.trim();
        if (sentence) {
            let foundError = false;
            rules.forEach(rule => {
                if (rule.pattern.test(sentence)) {
                    foundError = true;
                    if (sentence.includes(rule.correct) || (rule.correct.includes("the") && sentence.includes(rule.correct))) {
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