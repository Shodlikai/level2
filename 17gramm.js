document.addEventListener('DOMContentLoaded', function() {
    // Text Input Questions
    document.querySelectorAll('.question input[type="text"]').forEach(input => {
        input.addEventListener('blur', function() {
            const correctAnswer = this.dataset.answer.toLowerCase().trim();
            const userAnswer = this.value.toLowerCase().trim();
            const feedbackElement = this.nextElementSibling; // Get the next sibling for feedback

            if (userAnswer === correctAnswer) {
                feedbackElement.textContent = "To'g'ri! ✅";
                feedbackElement.style.color = 'green';
            } else {
                feedbackElement.textContent = `Noto'g'ri. To'g'ri javob: "${correctAnswer}" ❌`;
                feedbackElement.style.color = 'red';
            }
        });
    });

    // Multiple Choice Questions
    document.querySelectorAll('.question .options').forEach(optionsContainer => {
        optionsContainer.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function() {
                const correctAnswer = optionsContainer.dataset.correctAnswer.toLowerCase().trim();
                const userAnswer = this.dataset.choice.toLowerCase().trim();
                const feedbackElement = optionsContainer.nextElementSibling; // Get the next sibling for feedback

                // Disable all buttons in this question after selection
                optionsContainer.querySelectorAll('button').forEach(btn => btn.disabled = true);

                if (userAnswer === correctAnswer) {
                    feedbackElement.textContent = "To'g'ri! ✅";
                    feedbackElement.style.color = 'green';
                    this.style.backgroundColor = '#d4edda'; // Light green
                } else {
                    feedbackElement.textContent = `Noto'g'ri. To'g'ri javob: "${correctAnswer}" ❌`;
                    feedbackElement.style.color = 'red';
                    this.style.backgroundColor = '#f8d7da'; // Light red
                    // Highlight the correct answer if a wrong one was chosen
                    optionsContainer.querySelector(`button[data-choice="${correctAnswer}"]`).style.backgroundColor = '#d4edda';
                }
            });
        });
    });

    // Drag & Drop Questions
    document.querySelectorAll('.question .word-bank').forEach(wordBank => {
        const words = Array.from(wordBank.children);
        const answerArea = wordBank.nextElementSibling; // The answer-area div
        const checkButton = answerArea.nextElementSibling; // The check button
        const feedbackElement = checkButton.nextElementSibling; // The feedback element

        words.forEach(word => {
            word.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', e.target.textContent);
                e.dataTransfer.effectAllowed = 'move';
            });
        });

        answerArea.addEventListener('dragover', function(e) {
            e.preventDefault(); // Allow drop
            e.dataTransfer.dropEffect = 'move';
        });

        answerArea.addEventListener('drop', function(e) {
            e.preventDefault();
            const data = e.dataTransfer.getData('text/plain');
            const droppedWord = document.createElement('span');
            droppedWord.textContent = data;
            droppedWord.classList.add('dropped-word');
            droppedWord.draggable = true; // Make dropped words draggable to reorder
            answerArea.appendChild(droppedWord);

            // Remove the word from the word bank
            const originalWord = Array.from(wordBank.children).find(word => word.textContent === data && !answerArea.contains(word));
            if (originalWord) {
                originalWord.style.display = 'none'; // Hide it instead of removing
            }
        });

        // Add event listener for dropping words back to word bank (optional but good UX)
        wordBank.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        wordBank.addEventListener('drop', function(e) {
            e.preventDefault();
            const data = e.dataTransfer.getData('text/plain');
            const droppedWordInAnswerArea = Array.from(answerArea.children).find(span => span.textContent === data);
            if (droppedWordInAnswerArea) {
                droppedWordInAnswerArea.remove(); // Remove from answer area
                const originalWordInBank = Array.from(wordBank.children).find(word => word.textContent === data);
                if (originalWordInBank) {
                    originalWordInBank.style.display = 'inline-block'; // Show it again
                }
            }
        });


        checkButton.addEventListener('click', function() {
            const enteredSentence = Array.from(answerArea.children).map(span => span.textContent).join(' ').trim();
            const correctAnswer = answerArea.dataset.answer.trim();

            if (enteredSentence === correctAnswer) {
                feedbackElement.textContent = "To'g'ri! ✅";
                feedbackElement.style.color = 'green';
            } else {
                feedbackElement.textContent = `Noto'g'ri. To'g'ri javob: "${correctAnswer}" ❌`;
                feedbackElement.style.color = 'red';
            }
        });
    });

    // Error Correction Questions
    document.querySelectorAll('.question input[type="text"][data-answer]').forEach(input => {
        input.addEventListener('blur', function() {
            const correctAnswer = this.dataset.answer.toLowerCase().trim();
            const userAnswer = this.value.toLowerCase().trim();
            const feedbackElement = this.nextElementSibling;

            if (userAnswer === correctAnswer) {
                feedbackElement.textContent = "To'g'ri! ✅";
                feedbackElement.style.color = 'green';
            } else {
                feedbackElement.textContent = `Noto'g'ri. To'g'ri javob: "${correctAnswer}" ❌`;
                feedbackElement.style.color = 'red';
            }
        });
    });
});
