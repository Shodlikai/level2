// Global Variables
let completedExercises = 0;
let totalExercises = 6;
let draggedElement = null;
let matchingPairs = [];
let selectedMatch = null;

// DOM Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initAnimations();
    initDragAndDrop();
    initMatching();
    updateProgress();
});

// Tab Navigation
function initTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            showTab(targetTab);
        });
    });
}

function showTab(tabName) {
    // Remove active class from all tabs and contents
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding content
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    // Add animation class
    document.getElementById(tabName).classList.add('bounce');
    setTimeout(() => {
        document.getElementById(tabName).classList.remove('bounce');
    }, 600);
}

// Animation Controls
function initAnimations() {
    const animBtns = document.querySelectorAll('.anim-btn');
    const movingBall = document.getElementById('movingBall');
    
    animBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const movement = this.dataset.movement;
            animateMovement(movement, movingBall);
        });
    });
}

function animateMovement(movement, element) {
    // Reset position
    element.style.transition = 'all 0.5s ease-in-out';
    element.style.left = '10%';
    element.style.top = '50%';
    
    setTimeout(() => {
        switch(movement) {
            case 'to':
                element.style.left = '70%';
                showMovementText('Moving TO the car 🚗');
                break;
            case 'from':
                element.style.left = '10%';
                showMovementText('Moving FROM the house 🏠');
                break;
            case 'through':
                element.style.left = '50%';
                element.style.top = '30%';
                showMovementText('Moving THROUGH the tree 🌳');
                break;
            case 'around':
                element.style.left = '50%';
                element.style.top = '20%';
                setTimeout(() => {
                    element.style.left = '60%';
                    element.style.top = '50%';
                    setTimeout(() => {
                        element.style.left = '50%';
                        element.style.top = '80%';
                        setTimeout(() => {
                            element.style.left = '40%';
                            element.style.top = '50%';
                        }, 300);
                    }, 300);
                }, 300);
                showMovementText('Moving AROUND the tree 🌳');
                break;
            case 'across':
                element.style.left = '90%';
                showMovementText('Moving ACROSS to the other side');
                break;
        }
    }, 100);
}

function showMovementText(text) {
    // Create and show movement description
    const existingText = document.querySelector('.movement-text');
    if (existingText) {
        existingText.remove();
    }
    
    const textElement = document.createElement('div');
    textElement.className = 'movement-text';
    textElement.textContent = text;
    textElement.style.cssText = `
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-weight: 600;
        z-index: 100;
        animation: fadeIn 0.5s ease-in;
    `;
    
    document.querySelector('.scene').appendChild(textElement);
    
    setTimeout(() => {
        textElement.remove();
    }, 3000);
}

// Exercise 1: Fill in the blanks
function checkExercise1() {
    const selects = document.querySelectorAll('.exercise-select');
    let correct = 0;
    let total = selects.length;
    
    selects.forEach(select => {
        const answer = select.dataset.answer;
        const selected = select.value;
        
        if (selected === answer) {
            select.classList.add('correct');
            select.classList.remove('incorrect');
            correct++;
        } else if (selected !== '') {
            select.classList.add('incorrect');
            select.classList.remove('correct');
        }
    });
    
    const result = document.getElementById('result1');
    if (correct === total) {
        result.textContent = `🎉 Ajoyib! ${correct}/${total} to'g'ri javob!`;
        result.className = 'result success';
        markExerciseComplete(1);
    } else {
        result.textContent = `😊 ${correct}/${total} to'g'ri. Yana harakat qiling!`;
        result.className = 'result error';
    }
    
    result.classList.add('pulse');
    setTimeout(() => result.classList.remove('pulse'), 800);
}

// Exercise 2: Multiple Choice
function checkExercise2() {
    const questions = ['q1', 'q2', 'q3'];
    let correct = 0;
    let total = questions.length;
    
    questions.forEach(questionName => {
        const radios = document.querySelectorAll(`input[name="${questionName}"]`);
        const selectedRadio = document.querySelector(`input[name="${questionName}"]:checked`);
        
        radios.forEach(radio => {
            const label = radio.parentElement;
            label.style.background = '';
            label.style.color = '';
        });
        
        if (selectedRadio) {
            const label = selectedRadio.parentElement;
            if (selectedRadio.dataset.correct === 'true') {
                label.style.background = '#d5f4e6';
                label.style.color = '#2ecc71';
                correct++;
            } else {
                label.style.background = '#fadbd8';
                label.style.color = '#e74c3c';
            }
        }
    });
    
    const result = document.getElementById('result2');
    if (correct === total) {
        result.textContent = `🎉 Mukammal! ${correct}/${total} to'g'ri javob!`;
        result.className = 'result success';
        markExerciseComplete(2);
    } else {
        result.textContent = `💪 ${correct}/${total} to'g'ri. Davom eting!`;
        result.className = 'result error';
    }
    
    result.classList.add('bounce');
    setTimeout(() => result.classList.remove('bounce'), 600);
}

// Exercise 3: Sentence Building (Drag & Drop)
function initDragAndDrop() {
    const wordItems = document.querySelectorAll('.word-item');
    const sentenceArea = document.getElementById('sentenceArea');
    
    wordItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });
    
    sentenceArea.addEventListener('dragover', handleDragOver);
    sentenceArea.addEventListener('drop', handleDrop);
    sentenceArea.addEventListener('dragenter', handleDragEnter);
    sentenceArea.addEventListener('dragleave', handleDragLeave);
}

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    this.classList.add('drop-zone');
}

function handleDragLeave(e) {
    this.classList.remove('drop-zone');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drop-zone');
    
    if (draggedElement) {
        // Clone the dragged element
        const clone = draggedElement.cloneNode(true);
        clone.draggable = false;
        clone.classList.remove('dragging');
        clone.style.cursor = 'default';
        
        // Add click to remove functionality
        clone.addEventListener('click', function() {
            this.remove();
        });
        
        // Remove the "drag words here" text if it exists
        const placeholder = this.querySelector('p');
        if (placeholder) {
            placeholder.remove();
        }
        
        // Add the word to sentence area
        this.appendChild(clone);
        
        // Remove original word from word bank
        draggedElement.remove();
        draggedElement = null;
    }
}

function checkSentence() {
    const sentenceArea = document.getElementById('sentenceArea');
    const words = Array.from(sentenceArea.querySelectorAll('.word-item')).map(item => item.textContent.toLowerCase());
    const correctSentence = ['the', 'cat', 'jumps', 'onto', 'the', 'table'];
    
    const result = document.getElementById('result3');
    const isCorrect = JSON.stringify(words) === JSON.stringify(correctSentence);
    
    if (isCorrect) {
        result.textContent = '🎉 Ajoyib! Gap to\'g\'ri tuzildi!';
        result.className = 'result success';
        markExerciseComplete(3);
    } else {
        result.textContent = '🤔 Gap noto\'g\'ri. Qayta urinib ko\'ring!';
        result.className = 'result error';
    }
    
    result.classList.add('bounce');
    setTimeout(() => result.classList.remove('bounce'), 600);
}

// Exercise 4: Translation
function checkTranslation() {
    const inputs = document.querySelectorAll('.translation-input');
    let correct = 0;
    let total = inputs.length;
    
    inputs.forEach(input => {
        const userAnswer = input.value.toLowerCase().trim();
        const correctAnswer = input.dataset.answer.toLowerCase();
        
        if (userAnswer === correctAnswer) {
            input.classList.add('correct');
            input.classList.remove('incorrect');
            correct++;
        } else if (userAnswer !== '') {
            input.classList.add('incorrect');
            input.classList.remove('correct');
        }
    });
    
    const result = document.getElementById('result4');
    if (correct === total) {
        result.textContent = `🎉 Zo'r! ${correct}/${total} to'g'ri tarjima!`;
        result.className = 'result success';
        markExerciseComplete(4);
    } else {
        result.textContent = `📝 ${correct}/${total} to'g'ri. Davom eting!`;
        result.className = 'result error';
    }
    
    result.classList.add('pulse');
    setTimeout(() => result.classList.remove('pulse'), 800);
}

// Exercise 5: Listening (Simulated)
function playAudio(audioNumber) {
    const sentences = {
        1: "She comes FROM the library",
        2: "The train goes THROUGH the tunnel"
    };
    
    const sentence = sentences[audioNumber];
    if (sentence) {
        // Simulate audio playback with text-to-speech
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(sentence);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
        } else {
            // Fallback: show text briefly
            showAudioText(sentence);
        }
    }
}

function showAudioText(text) {
    const audioText = document.createElement('div');
    audioText.textContent = `🔊 "${text}"`;
    audioText.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        font-size: 1.2em;
        z-index: 1000;
        animation: fadeIn 0.5s ease-in;
    `;
    
    document.body.appendChild(audioText);
    
    setTimeout(() => {
        audioText.remove();
    }, 3000);
}

function checkListening() {
    const audio1 = document.querySelector('input[name="audio1"]:checked');
    const audio2 = document.querySelector('input[name="audio2"]:checked');
    
    let correct = 0;
    let total = 2;
    
    if (audio1 && audio1.dataset.correct === 'true') {
        correct++;
        audio1.parentElement.style.background = '#d5f4e6';
        audio1.parentElement.style.color = '#2ecc71';
    } else if (audio1) {
        audio1.parentElement.style.background = '#fadbd8';
        audio1.parentElement.style.color = '#e74c3c';
    }
    
    if (audio2 && audio2.dataset.correct === 'true') {
        correct++;
        audio2.parentElement.style.background = '#d5f4e6';
        audio2.parentElement.style.color = '#2ecc71';
    } else if (audio2) {
        audio2.parentElement.style.background = '#fadbd8';
        audio2.parentElement.style.color = '#e74c3c';
    }
    
    const result = document.getElementById('result5');
    if (correct === total) {
        result.textContent = `🎉 Ajoyib! ${correct}/${total} to'g'ri eshitdingiz!`;
        result.className = 'result success';
        markExerciseComplete(5);
    } else {
        result.textContent = `👂 ${correct}/${total} to'g'ri. Qayta tinglang!`;
        result.className = 'result error';
    }
    
    result.classList.add('bounce');
    setTimeout(() => result.classList.remove('bounce'), 600);
}

// Exercise 6: Matching
function initMatching() {
    const matchItems = document.querySelectorAll('.match-item');
    const matchTargets = document.querySelectorAll('.match-target');
    
    matchItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove previous selection
            matchItems.forEach(mi => mi.classList.remove('selected'));
            // Select current item
            this.classList.add('selected');
            selectedMatch = this.dataset.match;
        });
    });
    
    matchTargets.forEach(target => {
        target.addEventListener('click', function() {
            if (selectedMatch && selectedMatch === this.dataset.target) {
                // Correct match
                this.classList.add('matched');
                document.querySelector(`[data-match="${selectedMatch}"]`).classList.add('matched');
                
                // Store the match
                matchingPairs.push({
                    item: selectedMatch,
                    target: this.dataset.target
                });
                
                selectedMatch = null;
                
                // Check if all matches are complete
                if (matchingPairs.length === 4) {
                    setTimeout(() => {
                        checkMatching();
                    }, 500);
                }
            } else if (selectedMatch) {
                // Wrong match - shake animation
                this.classList.add('shake');
                setTimeout(() => this.classList.remove('shake'), 600);
            }
        });
    });
}

function checkMatching() {
    const result = document.getElementById('result6');
    const correctMatches = 4;
    
    if (matchingPairs.length === correctMatches) {
        result.textContent = '🎉 Mukammal! Barcha juftliklar to\'g\'ri!';
        result.className = 'result success';
        markExerciseComplete(6);
    } else {
        result.textContent = `🔄 ${matchingPairs.length}/${correctMatches} to'g'ri. Davom eting!`;
        result.className = 'result error';
    }
    
    result.classList.add('pulse');
    setTimeout(() => result.classList.remove('pulse'), 800);
}

// Progress Management
function markExerciseComplete(exerciseNumber) {
    const exercises = JSON.parse(localStorage.getItem('completedExercises') || '[]');
    if (!exercises.includes(exerciseNumber)) {
        exercises.push(exerciseNumber);
        localStorage.setItem('completedExercises', JSON.stringify(exercises));
        completedExercises = exercises.length;
        updateProgress();
        
        // Show celebration animation
        showCelebration();
    }
}

function updateProgress() {
    const exercises = JSON.parse(localStorage.getItem('completedExercises') || '[]');
    completedExercises = exercises.length;
    
    const percentage = (completedExercises / totalExercises) * 100;
    progressFill.style.width = percentage + '%';
    progressText.textContent = `${completedExercises}/${totalExercises} mashiq bajarildi`;
    
    // Add completion message
    if (completedExercises === totalExercises) {
        progressText.textContent += ' 🎉 Barcha mashiqlar bajarildi!';
        progressText.style.color = '#2ecc71';
        progressText.style.fontWeight = 'bold';
    }
}

function showCelebration() {
    // Create celebration effect
    const celebration = document.createElement('div');
    celebration.innerHTML = '🎉';
    celebration.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 5em;
        z-index: 1000;
        animation: celebrationBounce 1s ease-out;
        pointer-events: none;
    `;
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        celebration.remove();
    }, 1000);
}

// Utility Functions
function resetExercise(exerciseNumber) {
    // Reset specific exercise
    const exercises = JSON.parse(localStorage.getItem('completedExercises') || '[]');
    const index = exercises.indexOf(exerciseNumber);
    if (index > -1) {
        exercises.splice(index, 1);
        localStorage.setItem('completedExercises', JSON.stringify(exercises));
        updateProgress();
    }
}

function resetAllExercises() {
    localStorage.removeItem('completedExercises');
    completedExercises = 0;
    updateProgress();
    
    // Reset all visual indicators
    document.querySelectorAll('.exercise-select').forEach(select => {
        select.classList.remove('correct', 'incorrect');
        select.selectedIndex = 0;
    });
    
    document.querySelectorAll('.translation-input').forEach(input => {
        input.classList.remove('correct', 'incorrect');
        input.value = '';
    });
    
    document.querySelectorAll('.result').forEach(result => {
        result.textContent = '';
        result.className = 'result';
    });
    
    // Reset matching exercise
    matchingPairs = [];
    selectedMatch = null;
    document.querySelectorAll('.match-item, .match-target').forEach(item => {
        item.classList.remove('selected', 'matched');
    });
}

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Tab navigation with arrow keys
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const activeBtnIndex = Array.from(tabBtns).findIndex(btn => btn.classList.contains('active'));
        let newIndex;
        
        if (e.key === 'ArrowRight') {
            newIndex = (activeBtnIndex + 1) % tabBtns.length;
        } else {
            newIndex = (activeBtnIndex - 1 + tabBtns.length) % tabBtns.length;
        }
        
        tabBtns[newIndex].click();
        e.preventDefault();
    }
    
    // Reset exercises with Ctrl+R
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        resetAllExercises();
    }
});

// Preposition Practice Mode

// Preposition Practice Mode
function startPracticeMode() {
    const prepositions = ['to', 'from', 'into', 'out of', 'onto', 'off', 'through', 'across', 'along', 'around', 'up', 'down'];
    const randomPrep = prepositions[Math.floor(Math.random() * prepositions.length)];
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 500px;">
            <h2>Amaliyot rejimi</h2>
            <p style="font-size: 1.2em; margin: 20px 0;">Bu predlog bilan gap tuzing:</p>
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 10px; font-size: 2em; font-weight: bold; margin: 20px 0;">
                ${randomPrep.toUpperCase()}
            </div>
            <input type="text" placeholder="Gapingizni yozing..." style="width: 100%; padding: 15px; border: 2px solid #ddd; border-radius: 10px; font-size: 1.1em; margin: 20px 0;">
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="padding: 10px 20px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;">Yopish</button>
                <button onclick="checkPracticeAnswer(this)" style="padding: 10px 20px; background: #2ecc71; color: white; border: none; border-radius: 5px; cursor: pointer;">Tekshirish</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function checkPracticeAnswer(button) {
    const input = button.parentElement.parentElement.querySelector('input');
    const answer = input.value.toLowerCase();
    const preposition = button.parentElement.parentElement.querySelector('div').textContent.toLowerCase().trim();
    
    if (answer.includes(preposition)) {
        input.style.border = '2px solid #2ecc71';
        input.style.background = '#d5f4e6';
        button.textContent = '✓ To\'g\'ri!';
        button.style.background = '#2ecc71';
    } else {
        input.style.border = '2px solid #e74c3c';
        input.style.background = '#fadbd8';
        button.textContent = '✗ Qayta urinib ko\'ring';
        button.style.background = '#e74c3c';
    }
}

// Add practice mode button
document.addEventListener('DOMContentLoaded', function() {
    const practiceBtn = document.createElement('button');
    practiceBtn.textContent = '🎯 Amaliyot rejimi';
    practiceBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
        color: white;
        border: none;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 999;
        transition: all 0.3s ease;
    `;
    
    practiceBtn.addEventListener('click', startPracticeMode);
    practiceBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
    });
    
    practiceBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    });
    
    document.body.appendChild(practiceBtn);
});

// CSS Animations (added via JavaScript)
const style = document.createElement('style');
style.textContent = `
    @keyframes celebrationBounce {
        0% { transform: translate(-50%, -50%) scale(0); }
        50% { transform: translate(-50%, -50%) scale(1.2); }
        100% { transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Initialize on page load
updateProgress();