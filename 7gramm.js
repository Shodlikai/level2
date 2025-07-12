// Progress tracking
let completedSections = 0;
const totalSections = 4;

// Tab functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
        
        // Update progress
        updateProgress();
    });
});

// Exercise navigation
document.querySelectorAll('.exercise-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetExercise = btn.dataset.exercise;
        
        // Remove active class from all exercise buttons and contents
        document.querySelectorAll('.exercise-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.exercise-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        document.getElementById(targetExercise).classList.add('active');
    });
});

// Helper function to normalize answers (qisqartma va to'liq shakllarni qabul qilish)
function normalizeAnswer(answer) {
    return answer.toLowerCase().trim()
        .replace(/\s+/g, ' ')  // Multiple spaces to single space
        .replace(/will not/g, "won't")
        .replace(/cannot/g, "can't")
        .replace(/did not/g, "didn't")
        .replace(/do not/g, "don't")
        .replace(/does not/g, "doesn't");
}

// Helper function to check if answers match (multiple variants, e.g., 'will not' vs 'won't')
function checkAnswerMatch(userAnswer, correctAnswer) {
    const normalizedUser = normalizeAnswer(userAnswer);
    const normalizedCorrect = normalizeAnswer(correctAnswer);
    
    // Direct match
    if (normalizedUser === normalizedCorrect) {
        return true;
    }
    
    // Check with expanded forms
    const expandedUser = normalizedUser
        .replace(/won't/g, "will not")
        .replace(/can't/g, "cannot")
        .replace(/didn't/g, "did not")
        .replace(/don't/g, "do not")
        .replace(/doesn't/g, "does not");
    
    const expandedCorrect = normalizedCorrect
        .replace(/won't/g, "will not")
        .replace(/can't/g, "cannot")
        .replace(/didn't/g, "did not")
        .replace(/don't/g, "do not")
        .replace(/doesn't/g, "does not");
    
    // Check if expanded forms match
    if (expandedUser === expandedCorrect) {
        return true;
    }

    // Special check for "shall" when used as the first word (translation exercise)
    if (userAnswer.trim().toLowerCase().startsWith("shall i") || userAnswer.trim().toLowerCase().startsWith("shall we")) {
        const cleanedUser = userAnswer.trim().replace(/[?!]/g, '').toLowerCase();
        const cleanedCorrect = correctAnswer.trim().replace(/[?!]/g, '').toLowerCase();

        return cleanedUser === cleanedCorrect;
    }
    
    return false;
}

// Test checking function
function checkTest() {
    const answers = {
        q1: 'b',
        q2: 'a',
        q3: 'a',
        q4: 'b',
        q5: 'a'
    };
    
    const explanations = {
        q1: "To'g'ri javob: will be studying (Kelajakda aniq vaqtda davom etuvchi harakat)",
        q2: "To'g'ri javob: won't be watching (Kelajak davomiy zamonning inkor shakli)",
        q3: "To'g'ri javob: Will / be eating (Kelajak davomiy zamonning so'roq shakli)",
        q4: "To'g'ri javob: Shall (Taklif qilish uchun 'Shall I' ishlatiladi)",
        q5: "To'g'ri javob: Shall (Birgalikda biror ish qilishni taklif qilish uchun 'Shall we' ishlatiladi)"
    };
    
    let score = 0;
    const total = Object.keys(answers).length;
    let resultHTML = '<div class="test-results">';
    
    Object.keys(answers).forEach(question => {
        const selected = document.querySelector(`input[name="${question}"]:checked`);
        const questionNum = question.replace('q', '');
        
        if (selected && selected.value === answers[question]) {
            score++;
            resultHTML += `<div class="correct-answer">✓ Savol ${questionNum}: To'g'ri!</div>`;
        } else {
            resultHTML += `<div class="wrong-answer">✗ Savol ${questionNum}: Noto'g'ri! ${explanations[question]}</div>`;
        }
    });
    
    const percentage = Math.round((score / total) * 100);
    resultHTML += `<div class="final-score"><strong>Natija: ${score}/${total} (${percentage}%)</strong></div>`;
    resultHTML += '</div>';
    
    document.getElementById('testResult').innerHTML = resultHTML;
}

// Fill in the blanks checking
function checkFill() {
    const inputs = document.querySelectorAll('#fill .fill-input');
    let correct = 0;
    let resultHTML = '<div class="fill-results">';
    
    const fillAnswers = [
        "will be studying",
        "won't be sleeping",
        "Will", "be waiting",
        "Shall",
        "will be playing"
    ];

    inputs.forEach((input, index) => {
        const answer = fillAnswers[index];
        const userAnswer = input.value.trim();
        
        if (checkAnswerMatch(userAnswer, answer)) {
            input.style.backgroundColor = '#d4edda';
            input.style.border = '2px solid #28a745';
            correct++;
            resultHTML += `<div class="correct-answer">✓ ${index + 1}-savol: To'g'ri!</div>`;
        } else {
            input.style.backgroundColor = '#f8d7da';
            input.style.border = '2px solid #dc3545';
            resultHTML += `<div class="wrong-answer">✗ ${index + 1}-savol: Noto'g'ri! To'g'ri javob: <strong>${answer}</strong></div>`;
        }
    });
    
    const percentage = Math.round((correct / inputs.length) * 100);
    resultHTML += `<div class="final-score"><strong>Natija: ${correct}/${inputs.length} (${percentage}%)</strong></div>`;
    resultHTML += '</div>';
    
    document.getElementById('fillResult').innerHTML = resultHTML;
}

// Translation checking
function checkTranslation() {
    const inputs = document.querySelectorAll('#translate .translate-input');
    let correct = 0;
    let resultHTML = '<div class="translate-results">';
    
    inputs.forEach((input, index) => {
        const answer = input.dataset.answer;
        const userAnswer = input.value.trim();
        
        // Remove punctuation for comparison
        const cleanedUser = userAnswer.replace(/[?!]/g, '').toLowerCase().trim();
        const cleanedAnswer = answer.replace(/[?!]/g, '').toLowerCase().trim();

        if (checkAnswerMatch(cleanedUser, cleanedAnswer)) {
            input.style.backgroundColor = '#d4edda';
            input.style.border = '2px solid #28a745';
            correct++;
            resultHTML += `<div class="correct-answer">✓ ${index + 1}-savol: To'g'ri!</div>`;
        } else {
            input.style.backgroundColor = '#f8d7da';
            input.style.border = '2px solid #dc3545';
            resultHTML += `<div class="wrong-answer">✗ ${index + 1}-savol: Noto'g'ri! To'g'ri javob: <strong>${answer}</strong></div>`;
        }
    });
    
    const percentage = Math.round((correct / inputs.length) * 100);
    resultHTML += `<div class="final-score"><strong>Natija: ${correct}/${inputs.length} (${percentage}%)</strong></div>`;
    resultHTML += '</div>';
    
    document.getElementById('translateResult').innerHTML = resultHTML;
}

// Correction checking
function checkCorrection() {
    const inputs = document.querySelectorAll('#correct .correct-input');
    let correct = 0;
    let resultHTML = '<div class="correct-results">';
    
    inputs.forEach((input, index) => {
        const answer = input.dataset.answer;
        const userAnswer = input.value.trim();
        
        if (checkAnswerMatch(userAnswer, answer)) {
            input.style.backgroundColor = '#d4edda';
            input.style.border = '2px solid #28a745';
            correct++;
            resultHTML += `<div class="correct-answer">✓ ${index + 1}-savol: To'g'ri!</div>`;
        } else {
            input.style.backgroundColor = '#f8d7da';
            input.style.border = '2px solid #dc3545';
            resultHTML += `<div class="wrong-answer">✗ ${index + 1}-savol: Noto'g'ri! To'g'ri javob: <strong>${answer}</strong></div>`;
        }
    });
    
    const percentage = Math.round((correct / inputs.length) * 100);
    resultHTML += `<div class="final-score"><strong>Natija: ${correct}/${inputs.length} (${percentage}%)</strong></div>`;
    resultHTML += '</div>';
    
    document.getElementById('correctResult').innerHTML = resultHTML;
}

// Word order checking
function checkOrder() {
    const dropZones = document.querySelectorAll('#order .drop-zone');
    let correct = 0;
    let resultHTML = '<div class="order-results">';
    
    dropZones.forEach((zone, index) => {
        const answer = zone.dataset.answer;
        const userAnswer = zone.textContent.trim();
        
        // Remove punctuation for comparison
        const cleanedUser = userAnswer.replace(/[?!]/g, '').toLowerCase().trim();
        const cleanedAnswer = answer.replace(/[?!]/g, '').toLowerCase().trim();
        
        if (checkAnswerMatch(cleanedUser, cleanedAnswer)) {
            zone.style.backgroundColor = '#d4edda';
            zone.style.border = '2px solid #28a745';
            correct++;
            resultHTML += `<div class="correct-answer">✓ ${index + 1}-savol: To'g'ri!</div>`;
        } else {
            zone.style.backgroundColor = '#f8d7da';
            zone.style.border = '2px solid #dc3545';
            resultHTML += `<div class="wrong-answer">✗ ${index + 1}-savol: Noto'g'ri! To'g'ri javob: <strong>${answer}</strong></div>`;
        }
    });
    
    const percentage = Math.round((correct / dropZones.length) * 100);
    resultHTML += `<div class="final-score"><strong>Natija: ${correct}/${dropZones.length} (${percentage}%)</strong></div>`;
    resultHTML += '</div>';
    
    document.getElementById('orderResult').innerHTML = resultHTML;
}

// Drag and drop functionality
let draggedElement = null;

document.querySelectorAll('.word').forEach(word => {
    word.addEventListener('dragstart', (e) => {
        draggedElement = e.target;
        e.target.style.opacity = '0.5';
    });
    
    word.addEventListener('dragend', (e) => {
        e.target.style.opacity = '1';
    });
});

document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.style.backgroundColor = '#e9ecef';
    });
    
    zone.addEventListener('dragleave', (e) => {
        zone.style.backgroundColor = '';
    });
    
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.style.backgroundColor = '';
        
        if (draggedElement) {
            // Create a clone of the dragged element to place in the drop zone
            const droppedWord = draggedElement.cloneNode(true);
            droppedWord.classList.remove('word');
            droppedWord.removeAttribute('draggable');
            droppedWord.style.opacity = '1'; 
            droppedWord.style.cursor = 'default';
            
            // Add space between words
            if (zone.textContent.trim() !== '') {
                zone.textContent += ' ';
            }

            zone.appendChild(droppedWord);

            // Hide the original word from the word-container
            draggedElement.style.display = 'none';
            draggedElement = null;
        }
    });
});

// Reset button functionality (if needed, although not implemented in HTML)
// function resetOrder() {
//     document.querySelectorAll('.drop-zone').forEach(zone => {
//         zone.innerHTML = '';
//         zone.style.backgroundColor = '';
//         zone.style.border = '';
//     });
    
//     document.querySelectorAll('.word-container .word').forEach(word => {
//         word.style.display = 'inline-block';
//         word.style.opacity = '1';
//     });
// }

// Progress update function
function updateProgress() {
    completedSections++;
    const percentage = Math.min((completedSections / totalSections) * 100, 100);
    
    const progressBar = document.getElementById('progressBar');
    const progressText = document.querySelector('.progress-text');
    
    progressBar.style.width = percentage + '%';
    progressText.textContent = Math.round(percentage) + '%';
}
