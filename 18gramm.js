document.addEventListener('DOMContentLoaded', () => {
    // Animatsiyalarni boshlash funksiyasi
    function startAnimation(elementId, animationName, playState = 'running') {
        const element = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
        if (element) {
            element.style.animation = 'none'; // Oldingi animatsiyani o'chirish
            void element.offsetWidth; // Reflowni majburlash
            element.style.animation = animationName;
            element.style.animationPlayState = playState;
        }
    }

    // Har bir bo'limga skroll bo'lganda animatsiyani ishga tushirish
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Elementning 30% ko'ringanda
    };

    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                switch (sectionId) {
                    case 'reflexive-pronouns':
                        // Reflexive pronoun animatsiyasini ishga tushirish
                        startAnimation(document.querySelector('#reflexive-pronouns .reflexive-action-arrow.action-right'), 'reflexiveAction 4s infinite ease-in-out');
                        startAnimation(document.querySelector('#reflexive-pronouns .reflexive-action-arrow.action-left'), 'reflexiveAction 4s infinite ease-in-out reverse');
                        break;
                    case 'reciprocal-pronouns':
                        // Reciprocal pronoun animatsiyasini ishga tushirish
                        startAnimation('personA', 'reciprocalPulse 2s infinite alternate');
                        startAnimation('personB', 'reciprocalPulse 2s infinite alternate reverse');
                        break;
                    case 'indefinite-pronouns':
                        // Indefinite pronoun animatsiyasini ishga tushirish
                        startAnimation(document.querySelector('.person-indefinite'), 'indefiniteWiggle 3s infinite ease-in-out');
                        startAnimation(document.querySelector('.thing-indefinite'), 'indefiniteWiggle 3.2s infinite ease-in-out reverse');
                        startAnimation(document.querySelector('.place-indefinite'), 'indefiniteWiggle 2.8s infinite ease-in-out');
                        break;
                }
            } else {
                // Seksiyadan chiqqanda animatsiyalarni to'xtatish (ixtiyoriy)
                const sectionId = entry.target.id;
                switch (sectionId) {
                    case 'reflexive-pronouns':
                        const arrows = document.querySelectorAll('#reflexive-pronouns .reflexive-action-arrow');
                        arrows.forEach(arrow => startAnimation(arrow, 'none', 'paused'));
                        break;
                    case 'reciprocal-pronouns':
                        startAnimation('personA', 'none', 'paused');
                        startAnimation('personB', 'none', 'paused');
                        break;
                    case 'indefinite-pronouns':
                        const indefiniteElements = document.querySelectorAll('.indefinite-group > div');
                        indefiniteElements.forEach(el => startAnimation(el, 'none', 'paused'));
                        break;
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Mashqlarni tekshirish funksiyasi
    window.checkAnswer = function(inputId, correctAnswers) {
        // correctAnswers endi string yoki stringlar massivi bo'lishi mumkin
        const inputElement = document.getElementById(inputId);
        const feedbackElement = document.getElementById(inputId.replace('-ex', '-feedback'));
        const explanationElement = document.getElementById(inputId.replace('-ex', '-explanation')); // Izoh elementi
        const userAnswer = inputElement.value.toLowerCase().trim();

        let isCorrect = false;
        let explanationText = '';

        if (Array.isArray(correctAnswers)) {
            isCorrect = correctAnswers.some(answer => answer.toLowerCase() === userAnswer);
            if (!isCorrect) {
                 explanationText = `(Qo'shimcha izoh: ${correctAnswers.join(' yoki ')} ham to'g'ri bo'lishi mumkin edi.)`;
            }
        } else {
            isCorrect = (userAnswer === correctAnswers.toLowerCase());
        }

        if (isCorrect) {
            feedbackElement.textContent = "To'g'ri! 👍";
            feedbackElement.classList.remove('incorrect');
            feedbackElement.classList.add('correct');
            if (explanationElement) explanationElement.textContent = ''; // Oldingi izohni tozalash
        } else {
            const displayCorrect = Array.isArray(correctAnswers) ? correctAnswers.join(' / ') : correctAnswers;
            feedbackElement.textContent = `Noto'g'ri. To'g'ri javob: "${displayCorrect}" 👎`;
            feedbackElement.classList.remove('correct');
            feedbackElement.classList.add('incorrect');
            if (explanationElement) explanationElement.textContent = explanationText;
        }
    };

    window.checkSelectAnswer = function(selectId, correctAnswer) {
        const selectElement = document.getElementById(selectId);
        const feedbackElement = document.getElementById(selectId.replace('-ex', '-feedback'));
        const userAnswer = selectElement.value.toLowerCase().trim();

        if (userAnswer === correctAnswer.toLowerCase()) {
            feedbackElement.textContent = "To'g'ri! 👍";
            feedbackElement.classList.remove('incorrect');
            feedbackElement.classList.add('correct');
        } else {
            feedbackElement.textContent = `Noto'g'ri. To'g'ri javob: "${correctAnswer}" 👎`;
            feedbackElement.classList.remove('correct');
            feedbackElement.classList.add('incorrect');
        }
    };

    // Drag and Drop mashqi uchun funksiyalar
    const dragDropContainers = document.querySelectorAll('.drag-drop-container');

    dragDropContainers.forEach(container => {
        const draggables = container.querySelectorAll('.draggable');
        const droppables = container.querySelectorAll('.droppable');

        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.word);
                setTimeout(() => {
                    e.target.classList.add('hide'); // Elementni yashirish
                }, 0);
            });

            draggable.addEventListener('dragend', (e) => {
                e.target.classList.remove('hide'); // Yashirilgan elementni ko'rsatish (agar joylashmagan bo'lsa)
            });
        });

        droppables.forEach(droppable => {
            droppable.addEventListener('dragenter', (e) => {
                e.preventDefault();
                droppable.classList.add('drag-over');
            });

            droppable.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            droppable.addEventListener('dragleave', () => {
                droppable.classList.remove('drag-over');
            });

            droppable.addEventListener('drop', (e) => {
                e.preventDefault();
                droppable.classList.remove('drag-over');
                const draggedWord = e.dataTransfer.getData('text/plain');
                
                // Faqat bo'sh droppablega joylashishga ruxsat berish
                if (droppable.textContent.trim() === '') {
                    droppable.textContent = draggedWord;
                    droppable.classList.add('dropped');
                    // Dragged elementni yashirish (joylashganda)
                    const originalDraggable = Array.from(draggables).find(d => d.dataset.word === draggedWord);
                    if (originalDraggable) {
                        originalDraggable.style.display = 'none'; // Elementni olib tashlash
                    }
                }
            });
        });
    });

    window.checkDragAndDrop = function(containerId) {
        const container = document.getElementById(containerId);
        const droppables = container.querySelectorAll('.droppable');
        const feedbackElement = document.getElementById(containerId + '-feedback');
        let allCorrect = true;

        droppables.forEach(droppable => {
            const userAnswer = droppable.textContent.toLowerCase().trim();
            const correctAnswer = droppable.dataset.correct.toLowerCase();

            droppable.classList.remove('dropped', 'incorrect-drop');

            if (userAnswer === correctAnswer) {
                droppable.classList.add('dropped');
            } else {
                droppable.classList.add('incorrect-drop');
                allCorrect = false;
            }
        });

        if (allCorrect) {
            feedbackElement.textContent = "Ajoyib! Barcha javoblar to'g'ri! 👍";
            feedbackElement.classList.remove('incorrect');
            feedbackElement.classList.add('correct');
        } else {
            feedbackElement.textContent = "Ayrim xatolar bor. Qayta urinib ko'ring. 👎";
            feedbackElement.classList.remove('correct');
            feedbackElement.classList.add('incorrect');
        }
    };


    // Topishmachoq (Puzzle) mashqini tekshirish
    window.checkPuzzle = function() {
        const inputElement = document.getElementById('ref-puzzle-ans');
        const feedbackElement = document.getElementById('ref-puzzle-feedback');
        const userAnswer = inputElement.value.toLowerCase().trim();

        if (userAnswer === 'incorrect' || userAnswer === "yo'q") {
            feedbackElement.textContent = "To'g'ri! 👍 'Enjoy myself' emas, balki 'enjoyed ourselves' bo'lishi kerak edi. Chunki partiyada 'siz' va 'men' kabi ko'plab odamlar bor, shuning uchun 'myself' (birlik) emas, balki 'ourselves' (ko'plik) yoki 'yourselves' (agar o'sha odamlarga murojaat bo'lsa) ishlatiladi. Yoki shunchaki 'enjoyed' fe'lining o'zi yetarli, chunki 'enjoy' fe'li reflexive pronoun siz ham ishlatilishi mumkin, ayniqsa umumiy holatda.";
            feedbackElement.classList.remove('incorrect');
            feedbackElement.classList.add('correct');
        } else if (userAnswer === 'correct' || userAnswer === "ha") {
            feedbackElement.textContent = "Noto'g'ri. Noto'g'ri qo'llanilgan. Yuqoridagi 'enjoy' fe'li bilan bog'liq izohga qarang. 👎";
            feedbackElement.classList.remove('correct');
            feedbackElement.classList.add('incorrect');
        } else {
            feedbackElement.textContent = "Javobingizni 'Correct' / 'Incorrect' yoki 'Ha' / 'Yo'q' deb kiriting.";
            feedbackElement.classList.remove('correct', 'incorrect');
        }
    };

    // Umumiy mashqlardagi Ha/Yo'q uchun izohlar
    const generalEx3aFeedback = document.getElementById('general-feedback3a');
    if (generalEx3aFeedback) {
        generalEx3aFeedback.addEventListener('DOMSubtreeModified', () => {
            const explanationElement = document.getElementById('general-explanation3a');
            if (generalEx3aFeedback.classList.contains('incorrect')) {
                explanationElement.textContent = "Izoh: 'Everyone' doimo birlik fe'li bilan keladi. Shuning uchun 'Everyone is here.' bo'lishi kerak.";
            } else {
                explanationElement.textContent = '';
            }
        });
    }

    const generalEx3bFeedback = document.getElementById('general-feedback3b');
    if (generalEx3bFeedback) {
        generalEx3bFeedback.addEventListener('DOMSubtreeModified', () => {
            const explanationElement = document.getElementById('general-explanation3b');
            if (generalEx3bFeedback.classList.contains('correct')) {
                explanationElement.textContent = "Izoh: To'g'ri! 'They' uchun o'zlik olmoshi 'themselves' bo'lib, bu yerda ular mashinani o'zlari uchun sotib olishganini bildiradi.";
            } else {
                explanationElement.textContent = '';
            }
        });
    }


});
