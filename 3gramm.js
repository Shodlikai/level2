/*
 * File: 3gramm.js
 * Description: Interactive functionality for the Future Simple learning page.
 */

// --- Global Variables and Progress Tracking ---
let completedSections = 0;
// We define sections as 'rules', 'structure', 'examples', 'whquestions', 'comparison'. 
const totalSections = 5; 

// --- Tab Functionality (Main Navigation) ---
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    let visitedTabs = new Set();
    
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

    // Initialize progress bar (set initial state)
    updateProgress();
});

// --- Progress Update Function ---
function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.querySelector('.progress-text');
    
    // We count the number of unique tabs visited.
    // Note: The totalSections value (5) should correspond to the number of main tabs.
    const visitedTabsCount = document.querySelectorAll('.nav-tabs .tab-btn.active').length;
    
    // Calculate percentage based on main tabs ('rules', 'structure', 'examples', 'whquestions', 'comparison')
    const percentage = Math.min((visitedTabsCount / totalSections) * 100, 100);
    
    progressBar.style.width = percentage + '%';
    progressText.textContent = `${Math.round(percentage)}%`;
}

// --- Answer Normalization and Checking ---

// Helper function to normalize answers (lowercase, trim spaces, handle contractions)
function normalizeAnswer(answer) {
    if (typeof answer !== 'string') {
        return '';
    }
    return answer.toLowerCase().trim()
        .replace(/\s+/g, ' '); // Replace multiple spaces with single space
}

// Helper function to check if answers match (allowing for 'will not' and 'won't')
function checkAnswerMatch(userAnswer, correctAnswer) {
    const normalizedUser = normalizeAnswer(userAnswer);
    const normalizedCorrect = normalizeAnswer(correctAnswer);
    
    // Check direct match
    if (normalizedUser === normalizedCorrect) {
        return true;
    }
    
    // Handle specific 'will/won't' variations
    if (normalizedUser === 'will not' && normalizedCorrect === 'won\'t') return true;
    if (normalizedUser === 'won\'t' && normalizedCorrect === 'will not') return true;
    
    return false;
}

// --- Exercise Checking Functions ---

// Test checking function
function checkTest() {
    // Note: The provided HTML has questions 1-6. We need the correct answers here.
    const correctAnswers = {
        q1: 'a', // I think she will pass... (Future Simple for predictions/opinions)
        q2: 'b', // We will not (won't) arrive... (Future Simple for future actions/promises)
        q3: 'c', // Will you help me... (Future Simple structure for questions)
        q4: 'b', // They will probably visit... (Future Simple with probability indicators)
        q5: 'b', // The weather forecast says it will snow... (Future Simple for predictions, although "is going to" is also common here based on 'forecast', 'will' is typical for general predictions)
        q6: 'a'  // I promise I will not tell... (Future Simple for promises)
    };
    
    let score = 0;
    const total = Object.keys(correctAnswers).length;
    let resultHTML = '<div class="test-results">';
    
    Object.keys(correctAnswers).forEach(question => {
        const selected = document.querySelector(`input[name="${question}"]:checked`);
        const questionNum = question.replace('q', '');
        
        // Skip usage questions (q7-q10) if they are not part of the standard test block check
        if (questionNum > 6) return; 

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
        const answers = input.dataset.answer.split(',').map(a => a.trim()); // Handle multiple possible answers if defined in dataset
        const userAnswer = input.value.trim();
        
        let isCorrect = answers.some(answer => checkAnswerMatch(userAnswer, answer));
        
        // Special handling for question 4 where there are two inputs
        if (index === 3 || index === 4) { // Input 4 (index 3) and Input 5 (index 4)
            // If the user filled the 4th input with "will" and the 5th input with "help"
            // The provided HTML doesn't allow for a single check function to read multiple inputs easily for a single question.
            // We assume a simple 1-to-1 input-to-answer check as structured in the HTML.
        }

        if (isCorrect) {
            input.style.backgroundColor = '#d4edda';
            input.style.border = '2px solid #28a745';
            correct++;
            resultHTML += `<div class="correct-answer">✓ ${index + 1}-savol: To'g'ri!</div>`;
        } else {
            input.style.backgroundColor = '#f8d7da';
            input.style.border = '2px solid #dc3545';
            resultHTML += `<div class="wrong-answer">✗ ${index + 1}-savol: Noto'g'ri! To'g'ri javob: <strong>${answers.join(' yoki ')}</strong></div>`;
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
        const answers = input.dataset.answer.split(',').map(a => a.trim());
        const userAnswer = input.value.trim();
        
        let isCorrect = answers.some(answer => checkAnswerMatch(userAnswer, answer));

        if (isCorrect) {
            input.style.backgroundColor = '#d4edda';
            input.style.border = '2px solid #28a745';
            correct++;
            resultHTML += `<div class="correct-answer">✓ ${index + 1}-savol: To'g'ri!</div>`;
        } else {
            input.style.backgroundColor = '#f8d7da';
            input.style.border = '2px solid #dc3545';
            resultHTML += `<div class="wrong-answer">✗ ${index + 1}-savol: Noto'g'ri! To'g'ri javob: <strong>${answers.join(' yoki ')}</strong></div>`;
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
        const answers = input.dataset.answer.split(',').map(a => a.trim());
        const userAnswer = input.value.trim();
        
        let isCorrect = answers.some(answer => checkAnswerMatch(userAnswer, answer));

        if (isCorrect) {
            input.style.backgroundColor = '#d4edda';
            input.style.border = '2px solid #28a745';
            correct++;
            resultHTML += `<div class="correct-answer">✓ ${index + 1}-savol: To'g'ri!</div>`;
        } else {
            input.style.backgroundColor = '#f8d7da';
            input.style.border = '2px solid #dc3545';
            resultHTML += `<div class="wrong-answer">✗ ${index + 1}-savol: Noto'g'ri! To'g'ri javob: <strong>${answers.join(' yoki ')}</strong></div>`;
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
        const answer = normalizeAnswer(zone.dataset.answer);
        // We normalize the content of the drop zone by removing extra spaces and potential question marks
        const userAnswer = normalizeAnswer(zone.textContent.replace(/\?/g, '').trim());

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

// Usage comparison checking (Future Simple vs Going To)
function checkUsage() {
    // Note: These questions (q7-q10) are in the 'usage' section, not the main 'test' section.
    const correctAnswers = {
        q7: 'b', // 'is going to' - Look at the clouds (clear evidence)
        q8: 'b', // 'am going to' - I've decided (prior plan/intention)
        q9: 'a', // 'will' - Spontaneous decision
        q10: 'a' // 'will' - General prediction about the future (often used for broad speculation)
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
                // Clone the dragged element (or move it if preferred, but cloning is safer for drag-and-drop games)
                const wordClone = draggedElement.cloneNode(true);
                wordClone.style.opacity = '1';
                wordClone.draggable = false; // Prevent dragging the cloned word

                // Remove the word from the original container
                draggedElement.parentNode.removeChild(draggedElement);

                // Add space if the zone already has content and the dropped item is not a punctuation mark
                if (zone.textContent.trim() !== '' && wordClone.textContent.trim() !== '?') {
                    zone.appendChild(document.createTextNode(' '));
                }

                zone.appendChild(wordClone);
                draggedElement = null;
            }
        });
    });
});


// We need to expose the check functions to the global scope so the onclick events in HTML work
window.checkTest = checkTest;
window.checkFill = checkFill;
window.checkTranslation = checkTranslation;
window.checkCorrection = checkCorrection;
window.checkOrder = checkOrder;
window.checkUsage = checkUsage;
