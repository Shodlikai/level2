document.addEventListener('DOMContentLoaded', function() {

    // Helper function for checking text input
    function checkTextInput(inputElement, feedbackElement) {
        // Convert to lowercase and remove extra spaces for robust comparison
        const userAnswer = inputElement.value.trim().toLowerCase().replace(/\s+/g, ' ');
        const correctAnswer = inputElement.dataset.answer.toLowerCase().replace(/\s+/g, ' ');

        if (userAnswer === correctAnswer) {
            feedbackElement.textContent = 'To\'g\'ri!';
            feedbackElement.className = 'feedback correct';
        } else {
            feedbackElement.textContent = `Noto'g'ri. To'g'ri javob: ${inputElement.dataset.answer}`;
            feedbackElement.className = 'feedback incorrect';
        }
    }

    // 1. Bo'sh joylarni to'ldirish mashqlari (input type="text")
    // Bu qism barcha input[type="text"] elementlari uchun ishlaydi
    const fillBlanksInputs = document.querySelectorAll('#practice-exercises input[type="text"]');
    fillBlanksInputs.forEach(input => {
        const feedback = input.nextElementSibling; // Feedback element is usually right after the input
        input.addEventListener('blur', function() { // Check on blur (when input loses focus)
            checkTextInput(this, feedback);
        });
        input.addEventListener('keypress', function(e) { // Check on Enter key press
            if (e.key === 'Enter') {
                checkTextInput(this, feedback);
            }
        });
    });

    // 2. Tugma tanlash mashqlari (Both, Each, Every, etc.)
    const buttonChoiceQuestionsContainers = document.querySelectorAll('#practice-exercises .question .options[data-correct-answer]');

    buttonChoiceQuestionsContainers.forEach(optionsContainer => {
        const feedbackElement = optionsContainer.nextElementSibling; // Feedback element is after the options div
        const correctAnswerString = optionsContainer.dataset.correctAnswer.toLowerCase(); // Get the correct answer from the parent div

        optionsContainer.addEventListener('click', function(event) {
            if (event.target.tagName === 'BUTTON') {
                const selectedButton = event.target;
                const selectedChoice = selectedButton.dataset.choice.toLowerCase(); // Get the chosen value from the button's data-choice

                const isCorrect = selectedChoice === correctAnswerString; // Compare chosen value with the correct answer

                // Reset styles and disable all buttons in this question
                optionsContainer.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('correct-answer', 'incorrect-answer');
                    btn.disabled = true; // Disable buttons after a choice is made
                });

                if (isCorrect) {
                    selectedButton.classList.add('correct-answer');
                    feedbackElement.textContent = 'To\'g\'ri!';
                    feedbackElement.className = 'feedback correct';
                } else {
                    selectedButton.classList.add('incorrect-answer');
                    feedbackElement.textContent = `Noto'g'ri. To'g'ri javob: ${optionsContainer.dataset.correctAnswer}`; // Show original case answer
                    feedbackElement.className = 'feedback incorrect';
                    // Highlight the correct answer button
                    optionsContainer.querySelectorAll('button').forEach(btn => {
                        if (btn.dataset.choice.toLowerCase() === correctAnswerString) {
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

        // Make words in word-bank draggable
        Array.from(wordBank.children).forEach(span => {
            span.setAttribute('draggable', 'true');
            span.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', this.textContent); // Data to be transferred
                e.dataTransfer.effectAllowed = 'move'; // Visual effect
                this.classList.add('dragging'); // Add class for styling during drag
            });
            span.addEventListener('dragend', function() {
                this.classList.remove('dragging'); // Remove class after drag ends
            });
        });

        // Add drag/drop listeners to answer-area
        answerArea.addEventListener('dragover', function(e) {
            e.preventDefault(); // Allow drop
            e.dataTransfer.dropEffect = 'move';
        });

        answerArea.addEventListener('drop', function(e) {
            e.preventDefault();
            const draggedElement = document.querySelector('.dragging'); // Get the currently dragged element

            if (draggedElement && draggedElement.parentNode === wordBank) {
                // If dragging from word bank to answer area
                // Find where to insert to maintain order (optional, but good for reorder)
                const target = e.target.closest('span');
                if (target && target.parentNode === answerArea) {
                    answerArea.insertBefore(draggedElement, target);
                } else {
                    answerArea.appendChild(draggedElement); // Append to end if no specific target
                }
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

        // Add drop listeners to word-bank to allow returning words
        wordBank.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        wordBank.addEventListener('drop', function(e) {
            e.preventDefault();
            const draggedElement = document.querySelector('.dragging');
            if (draggedElement && draggedElement.parentNode === answerArea) {
                wordBank.appendChild(draggedElement); // Move back to word bank
            }
        });

        // Check button logic for reorder exercise
        if (checkButton) { // Ensure check button exists
            checkButton.addEventListener('click', function() {
                const userAnswer = Array.from(answerArea.children) // Get all child spans
                                    .map(span => span.textContent.trim()) // Get text content
                                    .join(' '); // Join with spaces
                const correctAnswer = answerArea.dataset.answer.trim();

                if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) { // Case-insensitive comparison
                    feedback.textContent = 'To\'g\'ri!';
                    feedback.className = 'feedback correct';
                } else {
                    feedback.textContent = `Noto'g'ri. To'g'ri javob: ${correctAnswer}`;
                    feedback.className = 'feedback incorrect';
                }
            });
        }
    });

});
