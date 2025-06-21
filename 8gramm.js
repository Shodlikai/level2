document.addEventListener('DOMContentLoaded', function() {

    // Helper function for checking text input
    function checkTextInput(inputElement, feedbackElement) {
        const userAnswer = inputElement.value.trim().toLowerCase(); // Case-insensitive check
        const correctAnswer = inputElement.dataset.answer.toLowerCase();

        if (userAnswer === correctAnswer) {
            feedbackElement.textContent = 'To\'g\'ri!';
            feedbackElement.className = 'feedback correct';
        } else {
            feedbackElement.textContent = `Noto'g'ri. To'g'ri javob: ${inputElement.dataset.answer}`;
            feedbackElement.className = 'feedback incorrect';
        }
    }

    // 1. Bo'sh joylarni to'ldirish mashqlari
    const fillBlanksInputs = document.querySelectorAll('#practice-exercises input[type="text"]');
    fillBlanksInputs.forEach(input => {
        const feedback = input.nextElementSibling; // Assuming feedback is right after input
        input.addEventListener('blur', function() {
            checkTextInput(this, feedback);
        });
    });

    // 2. "Since" yoki "For" ni tanlash mashqlari (YANGILANGAN QISM)
    const sinceForQuestionsContainers = document.querySelectorAll('#practice-exercises .question .options');

    sinceForQuestionsContainers.forEach(optionsContainer => {
        const feedbackElement = optionsContainer.nextElementSibling; // Feedback is after options div
        // To'g'ri javobni options divining data-correct-answer atributidan olamiz
        const correctAnswerString = optionsContainer.dataset.correctAnswer;

        optionsContainer.addEventListener('click', function(event) {
            if (event.target.tagName === 'BUTTON') {
                const selectedButton = event.target;
                // Tugmaning data-choice atributidan foydalanib foydalanuvchi tanlovini olamiz
                const selectedChoice = selectedButton.dataset.choice;

                const isCorrect = selectedChoice === correctAnswerString; // To'g'ri javob bilan solishtiramiz

                // Barcha tugmalardagi stilni tiklaymiz va ularni o'chiramiz
                optionsContainer.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('correct-answer', 'incorrect-answer');
                    btn.disabled = true; // Javob tanlangandan so'ng tugmalarni o'chirish
                });

                if (isCorrect) {
                    selectedButton.classList.add('correct-answer');
                    feedbackElement.textContent = 'To\'g\'ri!';
                    feedbackElement.className = 'feedback correct';
                } else {
                    selectedButton.classList.add('incorrect-answer');
                    feedbackElement.textContent = `Noto'g'ri. To'g'ri javob: ${correctAnswerString}`; // To'g'ri javobni ko'rsatamiz
                    feedbackElement.className = 'feedback incorrect';
                    // To'g'ri tugmani ham belgilash
                    optionsContainer.querySelectorAll('button').forEach(btn => {
                        if (btn.dataset.choice === correctAnswerString) {
                            btn.classList.add('correct-answer');
                        }
                    });
                }
            }
        });
    });


    // 3. Gapni qayta tartiblash mashqlari
    const reorderQuestions = document.querySelectorAll('#practice-exercises .question .answer-area');

    reorderQuestions.forEach(answerArea => {
        const questionContainer = answerArea.closest('.question');
        const wordBank = questionContainer.querySelector('.word-bank');
        const checkButton = questionContainer.querySelector('.check-button');
        const feedback = questionContainer.querySelector('.feedback');

        // Make words in word-bank draggable
        Array.from(wordBank.children).forEach(span => {
            span.setAttribute('draggable', 'true');
            span.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', this.textContent);
                e.dataTransfer.effectAllowed = 'move';
                this.classList.add('dragging');
            });
            span.addEventListener('dragend', function() {
                this.classList.remove('dragging');
            });
        });

        // Add drag/drop listeners to answer-area
        answerArea.addEventListener('dragover', function(e) {
            e.preventDefault(); // Allow drop
            e.dataTransfer.dropEffect = 'move';
        });

        answerArea.addEventListener('drop', function(e) {
            e.preventDefault();
            const draggedText = e.dataTransfer.getData('text/plain');
            const draggedElement = document.querySelector('.dragging');

            if (draggedElement && draggedElement.parentNode === wordBank) {
                answerArea.appendChild(draggedElement);
            } else if (draggedElement && draggedElement.parentNode === answerArea) {
                // If dragging within the answer area to reorder
                const target = e.target.closest('span') || answerArea;
                if (target === answerArea) {
                    answerArea.appendChild(draggedElement);
                } else {
                    answerArea.insertBefore(draggedElement, target);
                }
            }
        });

        // Add drop listeners to word-bank to return words
        wordBank.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        wordBank.addEventListener('drop', function(e) {
            e.preventDefault();
            const draggedElement = document.querySelector('.dragging');
            if (draggedElement && draggedElement.parentNode === answerArea) {
                wordBank.appendChild(draggedElement);
            }
        });

        // Check button for reorder exercise
        checkButton.addEventListener('click', function() {
            const userAnswer = Array.from(answerArea.children)
                                .map(span => span.textContent.trim())
                                .join(' ');
            const correctAnswer = answerArea.dataset.answer.trim();

            if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) { // Case-insensitive check
                feedback.textContent = 'To\'g\'ri!';
                feedback.className = 'feedback correct';
            } else {
                feedback.textContent = `Noto'g'ri. To'g'ri javob: ${correctAnswer}`;
                feedback.className = 'feedback incorrect';
            }
        });
    });
});
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
