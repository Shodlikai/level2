// DOM elementlarini olish
        const navBtns = document.querySelectorAll('.nav-btn');
        const contentSections = document.querySelectorAll('.content-section');
        const helpBtn = document.getElementById('helpBtn');
        const helpContent = document.getElementById('helpContent');
        const startQuizBtn = document.getElementById('startQuiz');
        const nextQuestionBtn = document.getElementById('nextQuestion');
        const restartQuizBtn = document.getElementById('restartQuiz');

        // Navigation funksiyasi
        function switchSection(targetSection) {
            // Barcha section'larni yashirish
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Barcha nav tugmalarini deaktivlashtirish
            navBtns.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Kerakli section'ni ko'rsatish
            document.getElementById(targetSection).classList.add('active');
            
            // Kerakli nav tugmasini aktivlashtirish
            document.querySelector(`[data-section="${targetSection}"]`).classList.add('active');
        }

        // Navigation event listenerlari
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetSection = e.target.dataset.section;
                switchSection(targetSection);
                
                // Bounce animatsiyasi
                e.target.classList.add('bounce');
                setTimeout(() => {
                    e.target.classList.remove('bounce');
                }, 1000);
            });
        });

        // Interactive exercise funksiyasi
        function setupExercises() {
            const exerciseItems = document.querySelectorAll('.exercise-item');
            
            exerciseItems.forEach(item => {
                const options = item.querySelectorAll('.option-btn');
                const feedback = item.querySelector('.feedback');
                let answered = false;
                
                options.forEach(option => {
                    option.addEventListener('click', (e) => {
                        if (answered) return;
                        
                        answered = true;
                        const isCorrect = e.target.dataset.answer === 'correct';
                        
                        // Barcha tugmalarni rangga bo'yash
                        options.forEach(btn => {
                            if (btn.dataset.answer === 'correct') {
                                btn.classList.add('correct');
                            } else {
                                btn.classList.add('wrong');
                            }
                            btn.style.pointerEvents = 'none';
                        });
                        
                        // Feedback ko'rsatish
                        if (isCorrect) {
                            feedback.textContent = '✓ To\'g\'ri! Ajoyib!';
                            feedback.classList.add('correct');
                            playSuccessSound();
                        } else {
                            feedback.textContent = '✗ Noto\'g\'ri. To\'g\'ri javob belgilandi.';
                            feedback.classList.add('wrong');
                            playErrorSound();
                        }
                        
                        feedback.style.display = 'block';
                        feedback.classList.add('bounce');
                    });
                });
            });
        }

        // Audio feedback (Web Audio API)
        function playSuccessSound() {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }

        function playErrorSound() {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }

        // Quiz savollar ma'lumotlari
        const quizQuestions = [
            {
                question: "I need to take care of _____ health.",
                options: ["me", "myself", "I", "mine"],
                correct: 1,
                explanation: "Reflexive pronoun 'myself' ishlatiladi, chunki harakat o'zi ustiga qaytmoqda."
            },
            {
                question: "The children enjoyed _____ at the party.",
                options: ["them", "themselves", "their", "they"],
                correct: 1,
                explanation: "Ko'plikdagi reflexive pronoun 'themselves' ishlatiladi."
            },
            {
                question: "Tom and Mary love _____.",
                options: ["each other", "one another", "themselves", "them"],
                correct: 0,
                explanation: "Ikki kishi uchun 'each other' ishlatiladi."
            },
            {
                question: "All students in the class help _____.",
                options: ["each other", "one another", "themselves", "them"],
                correct: 1,
                explanation: "Uch yoki ko'p kishi uchun 'one another' ishlatiladi."
            },
            {
                question: "I don't know _____ about this topic.",
                options: ["something", "anything", "nothing", "everything"],
                correct: 1,
                explanation: "Inkor gapda 'anything' ishlatiladi."
            },
            {
                question: "_____ wants to come to the party.",
                options: ["Anyone", "Everyone", "Someone", "No one"],
                correct: 1,
                explanation: "'Everyone' - hamma, tasdiqlash gapida ishlatiladi."
            },
            {
                question: "She looked at _____ in the mirror.",
                options: ["her", "herself", "she", "hers"],
                correct: 1,
                explanation: "Reflexive pronoun 'herself' - o'ziga qarab."
            },
            {
                question: "Did you see _____ at the concert?",
                options: ["someone", "anyone", "everyone", "no one"],
                correct: 1,
                explanation: "Savol gapida 'anyone' ishlatiladi."
            },
            {
                question: "The couple talked to _____ for hours.",
                options: ["each other", "one another", "themselves", "them"],
                correct: 0,
                explanation: "Ikki kishi o'rtasida 'each other' ishlatiladi."
            },
            {
                question: "_____ is ready for the exam.",
                options: ["Anyone", "Someone", "Everyone", "No one"],
                correct: 2,
                explanation: "'Everyone' - hamma tayyor."
            }
        ];

        // Quiz o'zgaruvchilari
        let currentQuestionIndex = 0;
        let score = 0;
        let quizStarted = false;

        // Quiz funksiyalari
        function startQuiz() {
            currentQuestionIndex = 0;
            score = 0;
            quizStarted = true;
            
            startQuizBtn.style.display = 'none';
            nextQuestionBtn.style.display = 'inline-block';
            document.querySelector('.quiz-result').style.display = 'none';
            
            showQuestion();
            updateProgress();
        }

        function showQuestion() {
            const question = quizQuestions[currentQuestionIndex];
            const questionElement = document.querySelector('.quiz-question h3');
            const optionsContainer = document.querySelector('.quiz-options');
            
            questionElement.textContent = `${currentQuestionIndex + 1}. ${question.question}`;
            
            optionsContainer.innerHTML = '';
            question.options.forEach((option, index) => {
                const optionElement = document.createElement('button');
                optionElement.classList.add('quiz-option');
                optionElement.textContent = option;
                optionElement.dataset.index = index;
                optionsContainer.appendChild(optionElement);
                
                optionElement.addEventListener('click', selectOption);
            });
            
            nextQuestionBtn.style.display = 'none';
        }

        function selectOption(e) {
            const selectedIndex = parseInt(e.target.dataset.index);
            const question = quizQuestions[currentQuestionIndex];
            const options = document.querySelectorAll('.quiz-option');
            
            // Barcha tugmalarni o'chirish
            options.forEach(option => {
                option.style.pointerEvents = 'none';
            });
            
            // To'g'ri javobni belgilash
            options[question.correct].classList.add('correct');
            
            // Agar noto'g'ri javob tanlangan bo'lsa
            if (selectedIndex !== question.correct) {
                e.target.classList.add('wrong');
                playErrorSound();
            } else {
                score++;
                playSuccessSound();
            }
            
            // Keyingi savol tugmasini ko'rsatish
            setTimeout(() => {
                if (currentQuestionIndex < quizQuestions.length - 1) {
                    nextQuestionBtn.style.display = 'inline-block';
                    nextQuestionBtn.textContent = 'Keyingi savol';
                } else {
                    nextQuestionBtn.style.display = 'inline-block';
                    nextQuestionBtn.textContent = 'Natijani ko\'rish';
                }
            }, 1000);
        }

        function nextQuestion() {
            if (currentQuestionIndex < quizQuestions.length - 1) {
                currentQuestionIndex++;
                showQuestion();
                updateProgress();
            } else {
                showResult();
            }
        }

        function updateProgress() {
            const progressFill = document.querySelector('.progress-fill');
            const progressText = document.querySelector('.progress-text');
            
            const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
            progressFill.style.width = progress + '%';
            progressText.textContent = `${currentQuestionIndex + 1}/${quizQuestions.length}`;
        }

        function showResult() {
            const percentage = Math.round((score / quizQuestions.length) * 100);
            const resultElement = document.querySelector('.quiz-result');
            const scoreElement = document.querySelector('.result-score');
            const messageElement = document.querySelector('.result-message');
            
            scoreElement.textContent = `${score}/${quizQuestions.length} (${percentage}%)`;
            
            let message = '';
            if (percentage >= 90) {
                message = 'Zo\'r! Siz mavzuni juda yaxshi o\'zlashtirdingiz! 🎉';
                scoreElement.style.color = '#4caf50';
            } else if (percentage >= 70) {
                message = 'Yaxshi! Lekin yana bir oz mashq qilishingiz kerak. 👍';
                scoreElement.style.color = '#ff9800';
            } else if (percentage >= 50) {
                message = 'Yomon emas, lekin mavzuni qayta o\'rganishingiz kerak. 📚';
                scoreElement.style.color = '#f44336';
            } else {
                message = 'Mavzuni qayta o\'rganishingiz kerak. Mashq qiling! 💪';
                scoreElement.style.color = '#f44336';
            }
            
            messageElement.textContent = message;
            
            document.querySelector('.quiz-question').style.display = 'none';
            nextQuestionBtn.style.display = 'none';
            restartQuizBtn.style.display = 'inline-block';
            resultElement.style.display = 'block';
            
            // Animatsiya
            resultElement.classList.add('bounce');
        }

        function restartQuiz() {
            document.querySelector('.quiz-question').style.display = 'block';
            restartQuizBtn.style.display = 'none';
            startQuiz();
        }

        // Help tugmasi funksiyasi
        function toggleHelp() {
            const isVisible = helpContent.style.display === 'block';
            helpContent.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                helpContent.classList.add('pulse');
                setTimeout(() => {
                    helpContent.classList.remove('pulse');
                }, 2000);
            }
        }

        // Klaviatura qo'llab-quvvatlash
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                helpContent.style.display = 'none';
            }
            
            if (e.key === 'h' || e.key === 'H') {
                toggleHelp();
            }
            
            // Quiz davomida raqamli tugmalar
            if (quizStarted && currentQuestionIndex < quizQuestions.length) {
                const num = parseInt(e.key);
                if (num >= 1 && num <= 4) {
                    const options = document.querySelectorAll('.quiz-option');
                    if (options[num - 1] && options[num - 1].style.pointerEvents !== 'none') {
                        options[num - 1].click();
                    }
                }
            }
        });

        // Sayfa yuklanganda animatsiyalar
        function addLoadAnimations() {
            const cards = document.querySelectorAll('.theory-block, .pronouns-table, .usage-rules, .interactive-exercise');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'fadeIn 0.6s ease-in-out';
                        entry.target.style.animationDelay = '0.1s';
                    }
                });
            }, {
                threshold: 0.1
            });
            
            cards.forEach(card => {
                observer.observe(card);
            });
        }

        // Typing effect
        function typeWriter(element, text, speed = 100) {
            let i = 0;
            element.innerHTML = '';
            
            function type() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            
            type();
        }

        // Progress tracking
        function trackProgress() {
            const completedExercises = JSON.parse(localStorage.getItem('completedExercises') || '[]');
            const totalExercises = document.querySelectorAll('.exercise-item').length;
            
            // Progress bar yaratish
            const progressContainer = document.createElement('div');
            progressContainer.className = 'learning-progress';
            progressContainer.innerHTML = `
                <h3>O'rganish jarayoni</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(completedExercises.length / totalExercises) * 100}%"></div>
                </div>
                <span>${completedExercises.length}/${totalExercises} mashq bajarildi</span>
            `;
            
            document.querySelector('.header').appendChild(progressContainer);
        }

        // Local storage uchun funksiyalar
        function saveProgress(exerciseId) {
            const completedExercises = JSON.parse(localStorage.getItem('completedExercises') || '[]');
            if (!completedExercises.includes(exerciseId)) {
                completedExercises.push(exerciseId);
                localStorage.setItem('completedExercises', JSON.stringify(completedExercises));
            }
        }

        // Scroll to top funksiyasi
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Sahifa yuklanganda
        document.addEventListener('DOMContentLoaded', () => {
            // Boshlang'ich sozlamalar
            setupExercises();
            addLoadAnimations();
            
            // Event listenerlarni qo'shish
            helpBtn.addEventListener('click', toggleHelp);
            startQuizBtn.addEventListener('click', startQuiz);
            nextQuestionBtn.addEventListener('click', nextQuestion);
            restartQuizBtn.addEventListener('click', restartQuiz);
            
            // Tashqi clickda help yopish
            document.addEventListener('click', (e) => {
                if (!helpBtn.contains(e.target) && !helpContent.contains(e.target)) {
                    helpContent.style.display = 'none';
                }
            });
            
            // Smooth scrolling
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // Welcome animatsiyasi
            const header = document.querySelector('.header');
            typeWriter(header.querySelector('h1'), 'Ingliz tili - Pronouns Darsi', 50);
            
            // Tooltip qo'shish
            const tooltips = document.querySelectorAll('[data-tooltip]');
            tooltips.forEach(element => {
                element.addEventListener('mouseenter', showTooltip);
                element.addEventListener('mouseleave', hideTooltip);
            });
            
            console.log('🎉 Pronouns Tutorial yuklandi!');
            console.log('💡 Yordam uchun "H" tugmasini bosing yoki yordam tugmasini clicking qiling');
        });

// Tooltip funksiyalari
        function showTooltip(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = e.target.dataset.tooltip;
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - 30) + 'px';
        }

        function hideTooltip() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        }

        // Performance monitoring
        function logPerformance() {
            if (performance.mark) {
                performance.mark('tutorial-loaded');
                console.log('⚡ Tutorial yuklash vaqti:', performance.now(), 'ms');
            }
        }

        // Congratulations effect
        function showCongratulations() {
            const congratsDiv = document.createElement('div');
            congratsDiv.className = 'congratulations';
            congratsDiv.innerHTML = '🎉 Tabriklaymiz! 🎉';
            document.body.appendChild(congratsDiv);
            
            setTimeout(() => {
                congratsDiv.remove();
            }, 3000);
        }

        // Global funksiyalar
        window.switchToQuiz = () => switchSection('quiz');
        window.showCongratulations = showCongratulations;
        window.logPerformance = logPerformance;
        
        // Debug rejim
        if (window.location.hash === '#debug') {
            console.log('🔧 Debug rejim yoqilgan');
            window.quizQuestions = quizQuestions;
            window.currentQuestionIndex = currentQuestionIndex;
            window.score = score;
        }