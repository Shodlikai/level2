const card = document.querySelector('.card');
const word = document.querySelector('.word');
const type = document.querySelector('.type');
const slider = document.querySelector('.slider input[type="range"]');
const sliderValue = document.getElementById('slider-value');
const sliderMax = document.getElementById('slider-max');
const nextButton = document.getElementById('next-button');
const audioButton = document.getElementById('audio-button');
const frontImage = document.getElementById('front-image');
const backImage = document.getElementById('back-image');
const pronunciationElement = document.querySelector('.pronunciation');
const PIXABAY_API_KEY = "49146347-e05e26bd1aae0010e8163774c";
const learnedWords = []; // Yodlangan so'zlar ro'yxati
let words = [
  { "english": "bury", "uzbek": "dafn etmoq, ko‘mmoq", "type": "fe’l", "pronunciation": "/ˈberi/" },
  { "english": "politician", "uzbek": "siyosatchi", "type": "ot", "pronunciation": "/ˌpɒlɪˈtɪʃən/" },
  { "english": "embassy", "uzbek": "elchixona", "type": "ot", "pronunciation": "/ˈembəsi/" },
  { "english": "politics", "uzbek": "siyosat", "type": "ot", "pronunciation": "/ˈpɒlətɪks/" },
  { "english": "silk", "uzbek": "ipak", "type": "ot", "pronunciation": "/sɪlk/" },
  { "english": "tent", "uzbek": "chodir", "type": "ot", "pronunciation": "/tent/" },
  { "english": "neutral", "uzbek": "neytral, betaraf", "type": "sifat", "pronunciation": "/ˈnjuːtrəl/" },
  { "english": "retire", "uzbek": "nafaqaga chiqmoq", "type": "fe’l", "pronunciation": "/rɪˈtaɪər/" },
  { "english": "reach", "uzbek": "yetmoq, yetib bormoq", "type": "fe’l", "pronunciation": "/riːtʃ/" },
  { "english": "period", "uzbek": "davr, muddat", "type": "ot", "pronunciation": "/ˈpɪəriəd/" },
  { "english": "popularity", "uzbek": "mashhurlik", "type": "ot", "pronunciation": "/ˌpɒpjuˈlærəti/" },
  { "english": "respect", "uzbek": "hurmat", "type": "ot", "pronunciation": "/rɪˈspekt/" },
  { "english": "initial", "uzbek": "dastlabki, boshlang‘ich", "type": "sifat", "pronunciation": "/ɪˈnɪʃəl/" },
  { "english": "image", "uzbek": "tasvir, rasm", "type": "ot", "pronunciation": "/ˈɪmɪdʒ/" },
  { "english": "mark", "uzbek": "belgi, iz; baho", "type": "ot", "pronunciation": "/mɑːk/" },
  { "english": "appreciate", "uzbek": "qadriga yetmoq, minnatdor bo‘lmoq", "type": "fe’l", "pronunciation": "/əˈpriːʃieɪt/" },
  { "english": "shadow", "uzbek": "soya", "type": "ot", "pronunciation": "/ˈʃædəʊ/" },
  { "english": "involve", "uzbek": "jalb qilmoq, o‘z ichiga olmoq", "type": "fe’l", "pronunciation": "/ɪnˈvɒlv/" },
  { "english": "recent", "uzbek": "so‘nggi, yaqindagi", "type": "sifat", "pronunciation": "/ˈriːsənt/" },
  { "english": "set up", "uzbek": "tashkil qilmoq, o‘rnatmoq", "type": "fe’l", "pronunciation": "/set ʌp/" },
  { "english": "inner", "uzbek": "ichki", "type": "sifat", "pronunciation": "/ˈɪnər/" },
  { "english": "charity", "uzbek": "xayriya", "type": "ot", "pronunciation": "/ˈtʃærəti/" },
  { "english": "encourage", "uzbek": "rag‘batlantirmoq, qo‘llab-quvvatlamoq", "type": "fe’l", "pronunciation": "/ɪnˈkʌrɪdʒ/" },
  { "english": "prevent", "uzbek": "oldini olmoq", "type": "fe’l", "pronunciation": "/prɪˈvent/" },
  { "english": "investor", "uzbek": "sarmoyador, investor", "type": "ot", "pronunciation": "/ɪnˈvestər/" },
  { "english": "cathedral", "uzbek": "sobor (katta cherkov)", "type": "ot", "pronunciation": "/kəˈθiːdrəl/" },
  { "english": "succeed", "uzbek": "muvaffaqiyat qozonmoq", "type": "fe’l", "pronunciation": "/səkˈsiːd/" },
  { "english": "particularly", "uzbek": "ayniqsa, xususan", "type": "ravish", "pronunciation": "/pəˈtɪkjələli/" },
  { "english": "lead", "uzbek": "yetaklamoq, boshchilik qilmoq", "type": "fe’l", "pronunciation": "/liːd/" },
  { "english": "one by one", "uzbek": "birin-ketin, birma-bir", "type": "ifoda", "pronunciation": "/wʌn baɪ wʌn/" }
];
// **So‘zlarni har safar yangi tartibda aralashtirish**
function shuffleWords() {
    words = words.sort(() => Math.random() - 0.5);
}
shuffleWords();

let currentIndex = 0;

// **Slayderni moslashtirish**
slider.max = words.length;
slider.value = 1;
sliderMax.textContent = words.length;

// **So‘zga tegishli rasmni Pixabay’dan olish**
async function getPixabayImage(query) {
    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${query}&image_type=photo`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return (data.hits.length > 0) ? data.hits[0].webformatURL : "placeholder.png";
    } catch (error) {
        console.error("Pixabay API error:", error);
        return "placeholder.png";
    }
}

// **Kartani yangilash va ekranga chiqarish**
async function updateCard(index) {
    word.textContent = words[index].english;
    pronunciationElement.textContent = words[index].pronunciation;
    type.textContent = words[index].type;
    document.querySelector('.card-back .word').textContent = words[index].uzbek;
    document.querySelector('.card-back .type').textContent = words[index].type;

    slider.value = index + 1; // Sliderni yangilash
    sliderValue.textContent = `${index + 1} / ${words.length}`; // So‘z tartib raqami
    currentIndex = index;

    // **Rasmni yuklash**
    const imageUrl = await getPixabayImage(words[index].english);
    backImage.src = imageUrl;

    // **Audio mavjudligini tekshirish**
    checkAndDownloadAudio(words[index].audio);
}

// **Audio mavjudligini tekshirish va yuklash**
async function checkAndDownloadAudio(audioFile) {
    if (localStorage.getItem(audioFile)) {
        console.log("Saqlangan audio ishlatilmoqda:", audioFile);
    } else {
        console.log("Audio yuklanmoqda:", audioFile);
        try {
            const response = await fetch(`audios/${audioFile}`);
            if (response.ok) {
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = function () {
                    localStorage.setItem(audioFile, reader.result);
                };
                reader.readAsDataURL(blob);
            } else {
                console.error("Audio topilmadi:", audioFile);
            }
        } catch (error) {
            console.error("Audio yuklashda xatolik:", error);
        }
    }
}

// **Kartani bosganda ovoz chiqarish**
card.addEventListener('click', function () {
    this.classList.toggle('flipped');
    if (this.classList.contains('flipped')) {
        speak(words[currentIndex].english);
    }
});

// **Sliderni boshqarish**
slider.addEventListener('input', function () {
    updateCard(this.value - 1);
});

// **Keyingi so‘zga o‘tish**
nextButton.addEventListener('click', function () {
    currentIndex++;
    if (currentIndex >= words.length) {
        shuffleWords(); // So‘zlar yana aralashtiriladi
        currentIndex = 0;
    }
    updateCard(currentIndex);
});

// **Ovoz chiqarish**
function speak(text) {
    const audioFile = words[currentIndex].audio;
    const storedAudio = localStorage.getItem(audioFile);

    if (storedAudio) {
        const audio = new Audio(storedAudio);
        audio.play();
    } else {
        console.warn("Audio fayli yo‘q, text-to-speech ishlatilmoqda.");
        responsiveVoice.speak(text, "US English Male", { rate: 0.9 });
    }
}

// **Audio tugmasi bosilganda ovoz chiqarish**
audioButton.addEventListener('click', function () {
    speak(words[currentIndex].english);
});
// Surish (swipe) funksiyasi
card.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

card.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
});

function handleSwipe() {
    const deltaX = endX - startX;
    if (deltaX > 50) { // O'ngga surish
        card.classList.add('swiping-right');
        setTimeout(() => {
            currentIndex++;
            if (currentIndex >= words.length) {
                currentIndex = 0;
            }
            updateCard(currentIndex);
            card.classList.remove('swiping-right');
            card.style.left = '';
            card.style.transform = '';
        }, 300);
    } else if (deltaX < -50) { // Chapga surish
        const learnedWord = words.splice(currentIndex, 1)[0];
        learnedWords.push(learnedWord);
        console.log("Yodlangan so'zlar:", learnedWords);

        if (currentIndex >= words.length) {
            currentIndex = 0;
        }
        updateCard(currentIndex);

        card.classList.add('swiping-left');
        setTimeout(() => {
            card.classList.remove('swiping-left');
            card.style.left = '';
            card.style.transform = '';
        }, 300);
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const nextButton = document.getElementById("next-button");
    const modal = document.getElementById("instruction-modal");
    const closeModal = document.getElementById("close-modal");

    // "Keyingi" tugmasi bosilganda modal chiqsin
    nextButton.addEventListener("click", function () {
        modal.style.display = "flex";
    });

    // "Tushunarli" tugmasi bosilganda modal yopilsin
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });
});
// **Ilk so‘zni ekranga chiqarish**
updateCard(0);