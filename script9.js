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
  { "english": "queue", "uzbek": "navbat", "type": "ot", "pronunciation": "/kjuː/" },
  { "english": "violin", "uzbek": "skripka", "type": "ot", "pronunciation": "/ˌvaɪəˈlɪn/" },
  { "english": "fierce", "uzbek": "yovuz, yirtqich, qo'rqinchli", "type": "sifat", "pronunciation": "/fɪərs/" },
  { "english": "proud", "uzbek": "faxrli, g'ururli", "type": "sifat", "pronunciation": "/praʊd/" },
  { "english": "theory", "uzbek": "nazariya", "type": "ot", "pronunciation": "/ˈθɪəri/" },
  { "english": "highly", "uzbek": "yuqori darajada, nihoyatda", "type": "hol", "pronunciation": "/ˈhaɪli/" },
  { "english": "frequent", "uzbek": "tez-tez, ko'p bo'ladigan", "type": "sifat", "pronunciation": "/ˈfriːkwənt/" },
  { "english": "version", "uzbek": "versiya, tur", "type": "ot", "pronunciation": "/ˈvɜːrʒən/" },
  { "english": "exception", "uzbek": "istisno, mustasno", "type": "ot", "pronunciation": "/ɪkˈsɛpʃən/" },
  { "english": "question", "uzbek": "savol, muammo", "type": "ot", "pronunciation": "/ˈkwɛstʃən/" },
  { "english": "unlike", "uzbek": "farqli o'laroq", "type": "hol", "pronunciation": "/ʌnˈlaɪk/" },
  { "english": "permanent", "uzbek": "doimiy, uzluksiz", "type": "sifat", "pronunciation": "/ˈpɜːrmənənt/" },
  { "english": "regional", "uzbek": "mintaqaviy, regional", "type": "sifat", "pronunciation": "/ˈriːdʒənəl/" },
  { "english": "region", "uzbek": "o'lka, mintaqa", "type": "ot", "pronunciation": "/ˈriːdʒən/" },
  { "english": "obvious", "uzbek": "ochiq-oydin, aniq", "type": "sifat", "pronunciation": "/ˈɒbviəs/" },
  { "english": "institution", "uzbek": "tashkilot, institut", "type": "ot", "pronunciation": "/ˌɪnstɪˈtjuːʃən/" },
  { "english": "originally", "uzbek": "aslida, dastlab", "type": "hol", "pronunciation": "/əˈrɪdʒɪnəli/" },
  { "english": "trade", "uzbek": "savdo, savdo-sotiq", "type": "ot", "pronunciation": "/treɪd/" },
  { "english": "represent", "uzbek": "vakil bo'lmoq, nomidan", "type": "fe'l", "pronunciation": "/ˌrɛprɪˈzɛnt/" },
  { "english": "aim", "uzbek": "maqsad", "type": "ot", "pronunciation": "/eɪm/" },
  { "english": "televise", "uzbek": "efirga uzatmoq", "type": "fe'l", "pronunciation": "/ˈtɛlɪvaɪz/" },
  { "english": "thunder", "uzbek": "chagmog, momaqaldiroq", "type": "ot", "pronunciation": "/ˈθʌndər/" },
  { "english": "lightning", "uzbek": "chagmog, yashin", "type": "ot", "pronunciation": "/ˈlaɪtnɪŋ/" },
  { "english": "mustache", "uzbek": "mo'ylab", "type": "ot", "pronunciation": "/ˈmʌstæʃ/" },
  { "english": "helmet", "uzbek": "dubulg'a, kaska", "type": "ot", "pronunciation": "/ˈhɛlmɪt/" },
  { "english": "bean", "uzbek": "loviya, mosh", "type": "ot", "pronunciation": "/biːn/" },
  { "english": "open-minded", "uzbek": "dunyogarashi keng", "type": "sifat", "pronunciation": "/ˌoʊpənˈmaɪndɪd/" },
  { "english": "educated", "uzbek": "o'qimishli, ziyoli", "type": "sifat", "pronunciation": "/ˈɛdʒʊkeɪtɪd/" },
  { "english": "fantastic", "uzbek": "ajoyib, zo'r", "type": "sifat", "pronunciation": "/fænˈtæstɪk/" },
  { "english": "guard", "uzbek": "soqchi, qorovul", "type": "ot", "pronunciation": "/ɡɑːrd/" }
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