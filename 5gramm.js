/*
 * File: 3gramm.js
 * Description: Interactive functionality for the "To Be Going To" learning page.
 */

// --- Global Variables and Progress Tracking ---
// Total sections: Rules, Usage, Examples, Forms, Difference, Exercises = 6
const totalSections = 6; 
let visitedTabs = new Set(); 

// --- DOMContentLoaded Event Listener ---
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // --- Tab Functionality (Main Navigation) ---
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Update progress only if the tab hasn't been visited before
            if (!visitedTabs.has(targetTab)) {
                visitedTabs.add(targetTab);
                updateProgress();
            }
        });
    });

    // --- Exercise Navigation ---
    document.querySelectorAll('.exercise-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const targetExercise = event.target.dataset.exercise;
            
            // Remove active class from all exercise buttons and contents
            document.querySelectorAll('.exercise-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.exercise-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            event.target.classList.add('active');
            document.getElementById(targetExercise).classList.add('active');
        });
    });

    // Initialize progress bar (set initial state)
    updateProgress();
});

// --- Progress Update Function ---
function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.querySelector('.progress-text');
    
    // Calculate percentage based on unique visited main tabs.
    const percentage = Math.min((visitedTabs.size / totalSections) * 100, 100);
    
    progressBar.style.width = percentage + '%';
    progressText.textContent = `${Math.round(percentage)}%`;
}

// --- Answer Normalization and Checking Helpers ---

// Helper function to normalize answers (lowercase, trim spaces, handle contractions)
function normalizeAnswer(answer) {
    if (typeof answer !== 'string') {
        return '';
    }
    // Remove extra spaces, convert to lowercase. Handle common contractions (e.g., aren't, isn't)
    return answer.toLowerCase().trim().replace(/\s+/g, ' '); 
}

// Helper function to check if answers match
function checkAnswerMatch(userAnswer, correctAnswer) {
    const normalizedUser = normalizeAnswer(userAnswer);
    const normalizedCorrect = normalizeAnswer(correctAnswer);
    
    return normalizedUser === normalizedCorrect;
}

// --- Exercise Checking Functions ---

// Test checking (Will vs Going To)
function checkTest() {
    const correctAnswers = {
        q1: 'b', // I think implies spontaneous decision or general prediction -> will
        q2: 'a', // Bought the paint (evidence/plan) -> going to
        q3: 'a', // Look at that player (evidence) -> going to
        q4: 'b', // Promise -> will
        q5: 'a', // Decided last week (plan) -> going to
    };
    
    let score = 0;
    const total = Object.keys(correctAnswers).length;
    let resultHTML = '<div class="test-results">';
    
    Object.keys(correctAnswers).forEach(question => {
        const selected = document.querySelector(`input[name="${question}"]:checked`);
        const questionNum = question.replace('q', '');
        
        if (selected && selected.value === correctAnswers[question]) {
            score++;
            resultHTML += `<div class="correct-answer">✓ Savol ${questionNum}: To'g'ri!</div>`;
        } else {
            resultHTML += `<div class="wrong-answer">✗ Savol ${questionNum}: Noto'g'ri!</div>`;
        }
    });
    
    const percentage = Math.round((score / total) * 100);
    resultHTML += `<div class="final-score"><strong>Natija: ${score}/${total} (${percentage}%)</strong></div>`;
    resultHTML += '</div>';
    
    document.getElementById('testResult').innerHTML = resultHTML;
}

// Fill in the blanks checking (Going to conjugation)
function checkFill() {
    const inputs = document.querySelectorAll('#fill .fill-input');
    let correct = 0;
    let resultHTML = '<div class="fill-results">';
    
    inputs.forEach((input, index) => {
        // Handle answers with multiple parts (e.g., Are / going to buy)
        const correctAnswers = input.dataset.answer.split('/').map(normalizeAnswer);
        const userAnswers = normalizeAnswer(input.value).split('/').map(normalizeAnswer);

        // Check if all parts match and the number of parts is correct
        let isCorrect = correctAnswers.length === userAnswers.length && 
                        correctAnswers.every((answer, i) => answer === userAnswers[i]);
        
        if (isCorrect) {
            input.style.backgroundColor = '#d4edda';
            input.style.border = '2px solid #28a745';
            correct++;
            resultHTML += `<div class="correct-answer">✓ ${index + 1}-savol: To'g'ri!</div>`;
        } else {
            input.style.backgroundColor = '#f8d7da';
            input.style.border = '2px solid #dc3545';
            resultHTML += `<div class="wrong-answer">✗ ${index + 1}-savol: Noto'g'ri! To'g'ri javob: <strong>${input.dataset.answer}</strong></div>`;
        }
    });
    
    const percentage = Math.round((correct / inputs.length) * 100);
    resultHTML += `<div class="final-score"><strong>Natija: ${correct}/${inputs.length} (${percentage}%)</strong></div>`;
    resultHTML += '</div>';
    
    document.getElementById('fillResult').innerHTML = resultHTML;
}

// Translation checking (Uzbek to English)
function checkTranslation() {
    const inputs = document.querySelectorAll('#translate .translate-input');
    let correct = 0;
    let resultHTML = '<div class="translate-results">';
    
    inputs.forEach((input, index) => {
        // We only check against the hardcoded answer in data-answer
        const isCorrect = checkAnswerMatch(input.value, input.dataset.answer);

        if (isCorrect) {
            input.style.backgroundColor = '#d4edda';
            input.style.border = '2px solid #28a745';
            correct++;
            resultHTML += `<div class="correct-answer">✓ ${index + 1}-savol: To'g'ri!</div>`;
        } else {
            input.style.backgroundColor = '#f8d7da';
            input.style.border = '2px solid #dc3545';
            resultHTML += `<div class="wrong-answer">✗ ${index + 1}-savol: Noto'g'ri! To'g'ri javob: <strong>${input.dataset.answer}</strong></div>`;
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
        // We only check against the hardcoded answer in data-answer
        const isCorrect = checkAnswerMatch(input.value, input.dataset.answer);

        if (isCorrect) {
            input.style.backgroundColor = '#d4edda';
            input.style.border = '2px solid #28a745';
            correct++;
            resultHTML += `<div class="correct-answer">✓ ${index + 1}-savol: To'g'ri!</div>`;
        } else {
            input.style.backgroundColor = '#f8d7da';
            input.style.border = '2px solid #dc3545';
            resultHTML += `<div class="wrong-answer">✗ ${index + 1}-savol: Noto'g'ri! To'g'ri javob: <strong>${input.dataset.answer}</strong></div>`;
        }
    });
    
    const percentage = Math.round((correct / inputs.length) * 100);
    resultHTML += `<div class="final-score"><strong>Natija: ${correct}/${inputs.length} (${percentage}%)</strong></div>`;
    resultHTML += '</div>';
    
    document.getElementById('correctResult').innerHTML = resultHTML;
}

// We expose the check functions to the global scope so the onclick events in HTML work
window.checkTest = checkTest;
window.checkFill = checkFill;
window.checkTranslation = checkTranslation;
window.checkCorrection = checkCorrection;
