/*
 * File: 3gramm.js
 * Description: Interactive functionality for the Both, All, Each, Every learning page.
 */

// --- Global Variables and Progress Tracking ---
// There are 6 main tabs in the HTML structure: Rules, Usage, Examples, Placement, Comparison, Exercises.
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
    return answer.toLowerCase().trim().replace(/\s+/g, ' '); // Replace multiple spaces with single space
}

// Helper function to check if answers match (simple normalization based check)
function checkAnswerMatch(userAnswer, correctAnswer) {
    const normalizedUser = normalizeAnswer(userAnswer);
    const normalizedCorrect = normalizeAnswer(correctAnswer);
    
    // For translation and correction exercises, we check if the user's normalized answer matches any of the normalized correct answers.
    return normalizedUser === normalizedCorrect;
}

// --- Exercise Checking Functions ---

// Test checking function
function checkTest() {
    const correctAnswers = {
        q1: 'c', // All (3+ students implied, 'students' is plural)
        q2: 'b', // Both (Implies exactly two dogs)
        q3: 'b', // Each (Singular verb 'received', implies focus on individual)
        q4: 'a', // every (Singular noun 'chapter', generally used for 3+ items/chapters)
        q5: 'b', // Each (Singular verb 'is broken', implies focusing on individual chairs within the group)
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

// Fill in the blanks checking
function checkFill() {
    const inputs = document.querySelectorAll('#fill .fill-input');
    let correct = 0;
    let resultHTML = '<div class="fill-results">';
    
    inputs.forEach((input, index) => {
        const answers = normalizeAnswer(input.dataset.answer).split(','); 
        const userAnswer = normalizeAnswer(input.value);
        
        let isCorrect = answers.includes(userAnswer);
        
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

// Translation checking
function checkTranslation() {
    const inputs = document.querySelectorAll('#translate .translate-input');
    let correct = 0;
    let resultHTML = '<div class="translate-results">';
    
    inputs.forEach((input, index) => {
        const answers = normalizeAnswer(input.dataset.answer).split(',');
        const userAnswer = normalizeAnswer(input.value);
        
        let isCorrect = answers.includes(userAnswer);

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
        const answers = normalizeAnswer(input.dataset.answer).split(',');
        const userAnswer = normalizeAnswer(input.value);
        
        let isCorrect = answers.includes(userAnswer);

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

// Usage comparison checking (Each vs Every)
function checkUsage() {
    const correctAnswers = {
        q6: 'b', // 'Every' - used for recurring events ("every time")
        q7: 'a', // 'Each' - focus on individual items in a specific group (5 children)
        q8: 'b', // 'Every' - general truth about all people ("every person")
        q9: 'b', // 'Every' - used for regularity ("every hour")
    };
    
    let score = 0;
    const total = Object.keys(correctAnswers).length;
    let resultHTML = '<div class="usage-results">';
    
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
    
    document.getElementById('usageResult').innerHTML = resultHTML;
}

// Word order checking
function checkOrder() {
    const dropZones = document.querySelectorAll('#order .drop-zone');
    let correct = 0;
    let resultHTML = '<div class="order-results">';
    
    dropZones.forEach((zone, index) => {
        const answer = normalizeAnswer(zone.dataset.answer);
        // We get the combined text content from the drop zone, normalize it, and remove the trailing period/question mark if present.
        const userAnswer = normalizeAnswer(zone.textContent.replace(/[\.\?]$/g, '')); 

        if (userAnswer === answer) {
            zone.style.backgroundColor = '#d4edda';
            zone.style.border = '2px solid #28a745';
            correct++;
            resultHTML += `<div class="correct-answer">✓ ${index + 1}-savol: To'g'ri!</div>`;
        } else {
            zone.style.backgroundColor = '#f8d7da';
            zone.style.border = '2px solid #dc3545';
            resultHTML += `<div class="wrong-answer">✗ ${index + 1}-savol: Noto'g'ri! To'g'ri javob: <strong>${zone.dataset.answer}</strong></div>`;
        }
    });
    
    const percentage = Math.round((correct / dropZones.length) * 100);
    resultHTML += `<div class="final-score"><strong>Natija: ${correct}/${dropZones.length} (${percentage}%)</strong></div>`;
    resultHTML += '</div>';
    
    document.getElementById('orderResult').innerHTML = resultHTML;
}

// --- Drag and Drop Functionality (Word Ordering) ---

let draggedElement = null;

document.querySelectorAll('.order-exercise').forEach(exercise => {
    // Drag Start
    exercise.querySelectorAll('.word').forEach(word => {
        word.addEventListener('dragstart', (e) => {
            draggedElement = e.target;
            e.target.style.opacity = '0.5';
            e.dataTransfer.setData('text/plain', e.target.textContent);
        });
        
        // Drag End
        word.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1';
        });
    });

    // Drop Zone Events
    exercise.querySelectorAll('.drop-zone').forEach(zone => {
        // Allow dropping
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.style.backgroundColor = '#e9ecef';
        });
        
        // Visual feedback when dragging leaves
        zone.addEventListener('dragleave', () => {
            zone.style.backgroundColor = '';
        });
        
        // Handle the drop
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.style.backgroundColor = '';
            
            if (draggedElement) {
                const wordClone = draggedElement.cloneNode(true);
                wordClone.style.opacity = '1';
                wordClone.draggable = false; 

                // Remove the word from the original container
                draggedElement.parentNode.removeChild(draggedElement);

                // Add space if the zone already has content and the dropped item is not punctuation
                if (zone.textContent.trim() !== '' && wordClone.textContent.trim() !== '.') {
                    zone.appendChild(document.createTextNode(' '));
                }

                zone.appendChild(wordClone);
                draggedElement = null;
            }
        });
    });
});


// We expose the check functions to the global scope so the onclick events in HTML work
window.checkTest = checkTest;
window.checkFill = checkFill;
window.checkTranslation = checkTranslation;
window.checkCorrection = checkCorrection;
window.checkUsage = checkUsage;
window.checkOrder = checkOrder;
