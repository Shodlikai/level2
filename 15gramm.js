document.addEventListener('DOMContentLoaded', function() {

    // Helper function for checking text input
    function checkTextInput(inputElement, feedbackElement) {
        // Convert to lowercase and remove extra spaces for robust comparison
        const userAnswer = inputElement.value.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\.$/, ''); // Remove trailing dot
        const correctAnswer = inputElement.dataset.answer.toLowerCase().replace(/\s+/g, ' ').replace(/\.$/, ''); // Remove trailing dot

        if (userAnswer === correctAnswer) {
            feedbackElement.textContent = 'To\'g\'ri!';
            feedbackElement.className = 'feedback correct';
        } else {
            feedbackElement.textContent = `Noto'g'ri. To'g'ri javob: ${inputElement.dataset.answer}`;
            feedbackElement.className = 'feedback incorrect';
        }
    }

    // 1. Bo'sh joylarni to'ldirish mashqlari (input type="text")
    const fillBlanksInputs = document.querySelectorAll('#practice-exercises input[type="text"]');
    fillBlanksInputs.forEach(input => {
        const feedback = input.nextElementSibling;
        input.addEventListener('blur', function() {
            checkTextInput(this, feedback);
        });
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkTextInput(this, feedback);
            }
        });
    });

    // 2. Tugma tanlash mashqlari (Multiple Choice)
    const buttonChoiceQuestionsContainers = document.querySelectorAll('#practice-exercises .question .options[data-correct-answer]');

    buttonChoiceQuestionsContainers.forEach(optionsContainer => {
        const feedbackElement = optionsContainer.nextElementSibling;
        const correctAnswerString = optionsContainer.dataset.correctAnswer.toLowerCase().replace(/\s+/g, ' ');

        optionsContainer.addEventListener('click', function(event) {
            if (event.target.tagName === 'BUTTON') {
                const selectedButton = event.target;
                const selectedChoice = selectedButton.dataset.choice.toLowerCase().replace(/\s+/g, ' ');

                const isCorrect = selectedChoice === correctAnswerString;

                optionsContainer.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('correct-answer', 'incorrect-answer');
                    btn.disabled = true; // Disable all buttons after selection
                });

                if (isCorrect) {
                    selectedButton.classList.add('correct-answer');
                    feedbackElement.textContent = 'To\'g\'ri!';
                    feedbackElement.className = 'feedback correct';
                } else {
                    selectedButton.classList.add('incorrect-answer');
                    feedbackElement.textContent = `Noto'g'ri. To'g'ri javob: ${optionsContainer.dataset.correctAnswer}`;
                    feedbackElement.className = 'feedback incorrect';
                    // Highlight the correct answer if the user was wrong
                    optionsContainer.querySelectorAll('button').forEach(btn => {
                        if (btn.dataset.choice.toLowerCase().replace(/\s+/g, ' ') === correctAnswerString) {
                            btn.classList.add('correct-answer');
                        }
                    });
                }
            }
        });
    });

    // 3. Gapni qayta tartiblash mashqlari (Drag & Drop)
    const reorderQuestions = document.querySelectorAll('#practice-exercises .question .answer-area[data-answer]');

    reorderQuestions.forEach(answerArea => {
        const questionContainer = answerArea.closest('.question');
        const wordBank = questionContainer.querySelector('.word-bank');
        const checkButton = questionContainer.querySelector('.check-button');
        const feedback = questionContainer.querySelector('.feedback');

        // Initial setup for draggable words
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

        answerArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        answerArea.addEventListener('drop', function(e) {
            e.preventDefault();
            const draggedElement = document.querySelector('.dragging');

            if (draggedElement) {
                // Determine where to insert: before the target if target is a span, or at the end
                const target = e.target.closest('span');
                if (target && target.parentNode === answerArea) {
                    answerArea.insertBefore(draggedElement, target);
                } else {
                    answerArea.appendChild(draggedElement);
                }
            }
        });

        // Allow dropping words back into the word bank
        wordBank.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        wordBank.addEventListener('drop', function(e) {
            e.preventDefault();
            const draggedElement = document.querySelector('.dragging');
            if (draggedElement && draggedElement.parentNode === answerArea) { // Only move if from answer area
                wordBank.appendChild(draggedElement);
            }
        });

        if (checkButton) {
            checkButton.addEventListener('click', function() {
                const userAnswer = Array.from(answerArea.children)
                                    .map(span => span.textContent.trim())
                                    .join(' ')
                                    .replace(/\.$/, ''); // Remove trailing dot for comparison
                const correctAnswer = answerArea.dataset.answer.trim().replace(/\.$/, ''); // Remove trailing dot from correct answer

                if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                    feedback.textContent = 'To\'g\'ri!';
                    feedback.className = 'feedback correct';
                } else {
                    feedback.textContent = `Noto'g'ri. To'g'ri javob: ${answerArea.dataset.answer}`;
                    feedback.className = 'feedback incorrect';
                }
            });
        }
    });

});
