// Progress tracking
let completedSections = 0;
const totalSections = 6; // rules, structure, usage, shall, examples, exercises

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

// Example tabs functionality
document.querySelectorAll('.example-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.exampleTab;
        
        // Remove active class from all example tabs and contents
        document.querySelectorAll('.example-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.example-tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
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

// Helper function to normalize answers
function normalizeAnswer(answer) {
    return answer.toLowerCase().trim()
        .replace(/\s+/g, ' ')  // Multiple spaces to single space
        .replace(/did not/g, "didn't")
        .replace(/do not/g, "don't")
        .replace(/does not/g, "doesn't")
        .replace(/will not/g, "won't")
        .replace(/cannot/g, "can't")
        .replace(/would not/g, "wouldn't")
        .replace(/should not/g, "shouldn't")
        .replace(/could not/g, "couldn't")
        .replace(/[.,?]/g, ''); // Remove punctuation
}

// Helper function to check if answers match
function checkAnswerMatch(userAnswer, correctAnswer) {
    const normalizedUser = normalizeAnswer(userAnswer);
    const normalizedCorrect = normalizeAnswer(correctAnswer);
    
    // Direct match
    if (normalizedUser === normalizedCorrect) {
        return true;
    }
    
    // Check with expanded forms
    const expandedUser = normalizedUser
        .replace(/didn't/g, "did not")
        .replace(/don't/g, "do not")
        .replace(/doesn't/g, "does not")
        .replace(/won't/g, "will not")
        .replace(/can't/g, "cannot")
        .replace(/wouldn't/g, "would not")
        .replace(/shouldn't/g, "should not")
                .replace(/couldn't/g, "could not");
    
    const expandedCorrect = normalizedCorrect
        .replace(/didn't/g, "did not")
        .replace(/don't/g, "do not")
        .replace(/doesn't/g, "does not")
        .replace(/won't/g, "will not")
        .replace(/can't/g, "cannot")
        .replace(/wouldn't/g, "would not")
        .replace(/shouldn't/g, "should not")
        .replace(/couldn't/g, "could not");
    
    return expandedUser === expandedCorrect;
}

// Test checking function
function checkTest() {
    const answers = {
        q1: 'b',
        q2: 'b',
        q3: 'b',
        q4: 'c',
        q5: 'b'
    };
    
    const explanations = {
        q1: "To'g'ri javob: will be watching (kelajakdagi aniq vaqtda davom etayotgan harakat)",
        q2: "To'g'ri javob: Shall (taklif qilish uchun)",
        q3: "To'g'ri javob: will be lying (kelajakdagi davomiy harakat)",
        q4: "To'g'ri javob: Shall (yordam taklif qilish uchun)",
        q5: "To'g'ri javob: will be having (kelajakdagi aniq vaqt oralig'ida davom etayotgan harakat)"
    };
    
    let score = 0;
    const total = Object.keys(answers).length;
    let resultHTML = '<div class="test-results">';
    
    Object.keys(answers).forEach(question => {
        const selected = document.querySelector(`input[name="${question}"]:checked`);
        const questionNum = question.replace('q', '');
        
        if (selected && selected.value === answers[question]) {
            score++;
            resultHTML += `<div class="correct-answer">✓ Savol ${questionNum}: To'g'ri! ${explanations[question]}</div>`;
        } else {
            const selectedValue = selected ? selected.value : 'Javob belgilanmagan';
            resultHTML += `<div class="wrong-answer">✗ Savol ${questionNum}: Noto'g'ri! Siz "${selectedValue}" deb belgiladingiz. ${explanations[question]}</div>`;
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
            resultHTML += `<div class="wrong-answer">✗ ${index + 1}-savol: Noto'g'ri! Siz "${userAnswer}" deb yozdingiz. To'g'ri javob: <strong>${answer}</strong></div>`;
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
        
        if (checkAnswerMatch(userAnswer, answer)) {
            input.style.backgroundColor = '#d4edda';
            input.style.border = '2px solid #28a745';
            correct++;
            resultHTML += `<div class="correct-answer">✓ ${index + 1}-savol: To'g'ri!</div>`;
        } else {
            input.style.backgroundColor = '#f8d7da';
            input.style.border = '2px solid #dc3545';
            resultHTML += `<div class="wrong-answer">✗ ${index + 1}-savol: Noto'g'ri! Siz "${userAnswer}" deb tarjima qildingiz. To'g'ri javob: <strong>${answer}</strong></div>`;
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
            resultHTML += `<div class="correct-answer">✓ ${index + 1}-savol: To'g'ri! Siz xatoni to'g'ri tuzatdingiz.</div>`;
        } else {
            input.style.backgroundColor = '#f8d7da';
            input.style.border = '2px solid #dc3545';
            resultHTML += `<div class="wrong-answer">✗ ${index + 1}-savol: Noto'g'ri tuzatdingiz. To'g'ri tuzatish: <strong>${answer}</strong></div>`;
        }
    });
    
    const percentage = Math.round((correct / inputs.length) * 100);
    resultHTML += `<div class="final-score"><strong>Natija: ${correct}/${inputs.length} (${percentage}%)</strong></div>`;
    resultHTML += '</div>';
    
    document.getElementById('correctResult').innerHTML = resultHTML;
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
            // Add space between words
            if (zone.textContent.trim()) {
                zone.textContent += ' ';
            }
            zone.textContent += draggedElement.textContent;
            draggedElement.style.display = 'none';
            draggedElement = null;
        }
    });
});

// Reset button for word order exercise
function resetOrder() {
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.textContent = '';
        zone.style.backgroundColor = '';
        zone.style.border = '';
    });
    
    document.querySelectorAll('.word').forEach(word => {
        word.style.display = 'inline-block';
        word.style.opacity = '1';
    });
    
    document.getElementById('orderResult').innerHTML = '';
}

// Word order checking
function checkOrder() {
    const dropZones = document.querySelectorAll('#order .drop-zone');
    let correct = 0;
    let resultHTML = '<div class="order-results">';
    
    dropZones.forEach((zone, index) => {
        const answer = zone.dataset.answer;
        const userAnswer = zone.textContent.trim();
        
        if (checkAnswerMatch(userAnswer, answer)) {
            zone.style.backgroundColor = '#d4edda';
            zone.style.border = '2px solid #28a745';
            correct++;
            resultHTML += `<div class="correct-answer">✓ ${index + 1}-savol: To'g'ri!</div>`;
        } else {
            zone.style.backgroundColor = '#f8d7da';
            zone.style.border = '2px solid #dc3545';
            resultHTML += `<div class="wrong-answer">✗ ${index + 1}-savol: Noto'g'ri! Siz "${userAnswer}" deb tartibladingiz. To'g'ri javob: <strong>${answer}</strong></div>`;
        }
    });
    
    const percentage = Math.round((correct / dropZones.length) * 100);
    resultHTML += `<div class="final-score"><strong>Natija: ${correct}/${dropZones.length} (${percentage}%)</strong></div>`;
    resultHTML += '</div>';
    
    document.getElementById('orderResult').innerHTML = resultHTML;
}

// Progress update function
function updateProgress() {
    completedSections++;
    const percentage = Math.min((completedSections / totalSections) * 100, 100);
    
    const progressBar = document.getElementById('progressBar');
    const progressText = document.querySelector('.progress-text');
    
    progressBar.style.width = percentage + '%';
    progressText.textContent = Math.round(percentage) + '%';
}

// Initialize progress bar
updateProgress();

// Responsive Design
function handleResize() {
    if (window.innerWidth < 768) {
        document.querySelectorAll('.structure-grid, .shall-grid, .usage-grid, .alternatives-grid').forEach(grid => {
            grid.style.gridTemplateColumns = '1fr';
        });
    } else {
        document.querySelectorAll('.structure-grid, .shall-grid, .usage-grid').forEach(grid => {
            grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
        });
        document.querySelector('.alternatives-grid').style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
    }
}

window.addEventListener('resize', handleResize);
handleResize();

// Animation Effects
function animateElements() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    animateElements();
});