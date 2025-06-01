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
  { "english": "villager", "uzbek": "qishloqda yashovchi", "type": "ot", "pronunciation": "/ˈvɪlɪdʒər/" },
  { "english": "switch", "uzbek": "o'zgartirmoq, almashtirmoq", "type": "fe'l", "pronunciation": "/swɪtʃ/" },
  { "english": "channel", "uzbek": "kanal", "type": "ot", "pronunciation": "/ˈtʃænəl/" },
  { "english": "ladder", "uzbek": "narvon", "type": "ot", "pronunciation": "/ˈlædər/" },
  { "english": "serve", "uzbek": "xizmat qilmoq", "type": "fe'l", "pronunciation": "/sɜːrv/" },
  { "english": "ambassador", "uzbek": "elchi", "type": "ot", "pronunciation": "/æmˈbæsədər/" },
  { "english": "protest", "uzbek": "norozilik bildirmoq", "type": "fe'l", "pronunciation": "/prəˈtest/" },
  { "english": "behave", "uzbek": "o'zini tutmoq", "type": "fe'l", "pronunciation": "/bɪˈheɪv/" },
  { "english": "publish", "uzbek": "nashr qilmoq", "type": "fe'l", "pronunciation": "/ˈpʌblɪʃ/" },
  { "english": "cream", "uzbek": "krem", "type": "ot", "pronunciation": "/kriːm/" },
  { "english": "crash", "uzbek": "to'qnashmoq, urilib ketmoq", "type": "fe'l", "pronunciation": "/kræʃ/" },
  { "english": "grass", "uzbek": "o't, maysa", "type": "ot", "pronunciation": "/ɡræs/" },
  { "english": "examine", "uzbek": "tekshirmoq, ko'rikdan o'tkazmoq", "type": "fe'l", "pronunciation": "/ɪɡˈzæmɪn/" },
  { "english": "effect", "uzbek": "ta'sir", "type": "ot", "pronunciation": "/ɪˈfekt/" },
  { "english": "inspect", "uzbek": "tekshirmoq", "type": "fe'l", "pronunciation": "/ɪnˈspekt/" },
  { "english": "twin", "uzbek": "egizak", "type": "ot", "pronunciation": "/twɪn/" },
  { "english": "invitation", "uzbek": "taklif, taklifnoma", "type": "ot", "pronunciation": "/ˌɪnvɪˈteɪʃən/" },
  { "english": "difference", "uzbek": "farq", "type": "ot", "pronunciation": "/ˈdɪfərəns/" },
  { "english": "connect", "uzbek": "ulamoq", "type": "fe'l", "pronunciation": "/kəˈnekt/" },
  { "english": "field", "uzbek": "o'yin maydoni", "type": "ot", "pronunciation": "/fiːld/" },
  { "english": "necklace", "uzbek": "marjon, shoda", "type": "ot", "pronunciation": "/ˈnekləs/" },
  { "english": "immediately", "uzbek": "darhol", "type": "hol", "pronunciation": "/ɪˈmiːdiətli/" },
  { "english": "kick", "uzbek": "tepmoq", "type": "fe'l", "pronunciation": "/kɪk/" },
  { "english": "trader", "uzbek": "savdogar", "type": "ot", "pronunciation": "/ˈtreɪdər/" },
  { "english": "warmly", "uzbek": "iliq munosabatda", "type": "hol", "pronunciation": "/ˈwɔːrmli/" },
  { "english": "rescue", "uzbek": "qutqarmoq", "type": "fe'l", "pronunciation": "/ˈreskjuː/" },
  { "english": "sink", "uzbek": "cho'kmoq, g'arq bo'lmoq", "type": "fe'l", "pronunciation": "/sɪŋk/" },
  { "english": "invade", "uzbek": "bostirib kirmoq", "type": "fe'l", "pronunciation": "/ɪnˈveɪd/" },
  { "english": "remote control", "uzbek": "pult", "type": "ot", "pronunciation": "/rɪˈmoʊt kənˈtroʊl/" },
  { "english": "copy", "uzbek": "nusxa", "type": "ot", "pronunciation": "/ˈkɑːpi/" }
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