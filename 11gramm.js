document.addEventListener('DOMContentLoaded', () => {
    const quizQuestions = document.querySelectorAll('.quiz-question');

    quizQuestions.forEach(question => {
        const buttons = question.querySelectorAll('.options button');
        const feedbackElement = question.querySelector('.feedback');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove previous feedback classes from buttons
                buttons.forEach(btn => {
                    btn.classList.remove('correct', 'wrong');
                    btn.disabled = true; // Disable all buttons after one is clicked
                });

                // Check if the clicked button is correct
                if (button.dataset.correct === 'true') {
                    button.classList.add('correct');
                    feedbackElement.textContent = "To'g'ri! Juda yaxshi.";
                    feedbackElement.classList.add('correct');
                    feedbackElement.classList.remove('wrong');
                } else {
                    button.classList.add('wrong');
                    feedbackElement.textContent = "Noto'g'ri. Qoidalarni yana bir bor ko'rib chiqing.";
                    feedbackElement.classList.add('wrong');
                    feedbackElement.classList.remove('correct');
                    // Highlight the correct answer if the user was wrong
                    question.querySelector('button[data-correct="true"]').classList.add('correct');
                }
            });
        });
    });
});
