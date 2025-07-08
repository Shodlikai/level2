document.addEventListener('DOMContentLoaded', () => {
    // Navigatsiya uchun active class berish
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Skroll bo'lganda active linkni belgilash
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 70; // Header balandligini hisobga olish
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Animatsiyalarni boshlash funksiyasi
    function startAnimation(elementId, animationName, delay = 0) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.animation = 'none'; // Oldingi animatsiyani o'chirish
            void element.offsetWidth; // Reflowni majburlash
            element.style.animation = `${animationName} forwards`; // Yangi animatsiyani qo'shish
            if (delay > 0) {
                 setTimeout(() => {
                    element.style.animationPlayState = 'running';
                }, delay);
            } else {
                element.style.animationPlayState = 'running';
            }
        }
    }

    // Har bir bo'limga skroll bo'lganda animatsiyani ishga tushirish
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Elementning 50% ko'ringanda
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                switch (sectionId) {
                    case 'to':
                        startAnimation('to-object', 'moveToDestination 3s');
                        break;
                    case 'across':
                        startAnimation('across-swimmer', 'moveAcross 3s');
                        break;
                    case 'around':
                        startAnimation('around-walker', 'moveAround 5s infinite linear');
                        break;
                    case 'down':
                        startAnimation('down-climber', 'moveDown 2s');
                        break;
                    case 'up':
                        startAnimation('up-runner', 'moveUp 2s');
                        break;
                    case 'from':
                        startAnimation('from-traveler', 'moveFrom 3s');
                        break;
                    case 'into':
                        startAnimation('into-water', 'moveInto 2s');
                        const glass = document.querySelector('#into .glass');
                        if (glass) setTimeout(() => glass.classList.add('filled'), 1000);
                        break;
                    case 'onto':
                        startAnimation('onto-cat', 'jumpOnto 2s');
                        break;
                    case 'outof':
                        startAnimation('outof-book', 'moveOutOf 2s');
                        break;
                    case 'over':
                        startAnimation('over-bird', 'flyOver 3s');
                        break;
                    case 'past':
                        startAnimation('past-person', 'walkPast 3s');
                        break;
                    case 'through':
                        startAnimation('through-car', 'driveThrough 4s');
                        break;
                    case 'towards':
                        startAnimation('towards-person', 'walkTowards 3s');
                        break;
                    // Umumiy mashqlardagi animatsiyalar alohida tekshiriladi
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Mashqlarni tekshirish funksiyasi
    window.checkAnswer = function(inputId, correctAnswer) {
        const inputElement = document.getElementById(inputId);
        const feedbackElement = document.getElementById(inputId.replace('-ex', '-feedback'));
        const userAnswer = inputElement.value.toLowerCase().trim();

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

    window.checkSelectAnswer = function(selectId, correctAnswer) {
        const selectElement = document.getElementById(selectId);
        const feedbackElement = document.getElementById(selectId.replace('select-ex', 'select-feedback'));
        const userAnswer = selectElement.value.toLowerCase().trim();

        if (userAnswer === correctAnswer.toLowerCase()) {
            feedbackElement.textContent = "To'g'ri! 👍";
            feedbackElement.classList.remove('incorrect');
            feedbackElement.classList.add('correct');
            // Animatsiyani ishga tushirish
            const animElementId = selectId.replace('select-', 'anim-');
            let animName = '';
            if (animElementId === 'anim-ex1') animName = 'flyOverEx 3s forwards';
            else if (animElementId === 'anim-ex2') animName = 'jumpIntoEx 2s forwards';
            else if (animElementId === 'anim-ex3') animName = 'driveThroughEx 4s forwards';
            startAnimation(animElementId, animName);
        } else {
            feedbackElement.textContent = `Noto'g'ri. To'g'ri javob: "${correctAnswer}" 👎`;
            feedbackElement.classList.remove('correct');
            feedbackElement.classList.add('incorrect');
            // Noto'g'ri bo'lsa, animatsiyani to'xtatish (yoki reset qilish)
            const animElement = document.getElementById(selectId.replace('select-', 'anim-'));
            if (animElement) {
                animElement.style.animationPlayState = 'paused';
                animElement.style.animation = 'none'; // Animatsiyani reset qilish
                void animElement.offsetWidth; // Reflow
            }
        }
    };
});
