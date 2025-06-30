// 9gramm.js

document.addEventListener('DOMContentLoaded', function() {
    // Barcha quiz savollarini tanlab olamiz
    const quizQuestions = document.querySelectorAll('.quiz-question');

    quizQuestions.forEach(question => {
        const options = question.querySelectorAll('.options button');
        const feedbackElement = question.querySelector('.feedback');

        options.forEach(button => {
            button.addEventListener('click', function() {
                // Avvalgi feedbackni tozalash
                feedbackElement.textContent = '';
                feedbackElement.className = 'feedback'; // Barcha classlarni olib tashlash

                // Barcha tugmalardagi to'g'ri/noto'g'ri belgilashlarni olib tashlash
                options.forEach(optBtn => {
                    optBtn.classList.remove('correct-answer', 'incorrect-answer');
                    optBtn.disabled = false; // Tugmalarni qayta yoqish
                });

                // Tanlangan tugma to'g'rimi yoki yo'qmi tekshirish
                const isCorrect = this.dataset.correct === 'true';

                if (isCorrect) {
                    feedbackElement.textContent = '✅ Toʻgʻri!';
                    feedbackElement.classList.add('correct');
                    this.classList.add('correct-answer');
                } else {
                    feedbackElement.textContent = '❌ Notoʻgʻri.';
                    feedbackElement.classList.add('incorrect');
                    this.classList.add('incorrect-answer');

                    // To'g'ri javobni ham ko'rsatish
                    options.forEach(optBtn => {
                        if (optBtn.dataset.correct === 'true') {
                            optBtn.classList.add('correct-answer');
                        }
                    });
                }

                // Javob berilgandan keyin barcha tugmalarni o'chirib qo'yish
                options.forEach(optBtn => {
                    optBtn.disabled = true;
                });
            });
        });
    });
});
