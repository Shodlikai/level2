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
  { "english": "spread", "uzbek": "tarqalmoq", "type": "fe’l", "pronunciation": "/spred/" },
  { "english": "weapon", "uzbek": "qurol", "type": "ot", "pronunciation": "/ˈwepən/" },
  { "english": "meaning", "uzbek": "ma’nosi", "type": "ot", "pronunciation": "/ˈmiːnɪŋ/" },
  { "english": "politician", "uzbek": "siyosatchi", "type": "ot", "pronunciation": "/ˌpɒləˈtɪʃən/" },
  { "english": "promise", "uzbek": "va’da bermoq", "type": "fe’l", "pronunciation": "/ˈprɒmɪs/" },
  { "english": "election", "uzbek": "saylov", "type": "ot", "pronunciation": "/ɪˈlekʃən/" },
  { "english": "price", "uzbek": "narx", "type": "ot", "pronunciation": "/praɪs/" },
  { "english": "special", "uzbek": "maxsus", "type": "sifat", "pronunciation": "/ˈspeʃəl/" },
  { "english": "customer", "uzbek": "mijoz", "type": "ot", "pronunciation": "/ˈkʌstəmər/" },
  { "english": "appetite", "uzbek": "ishtaha", "type": "ot", "pronunciation": "/ˈæpɪtaɪt/" },
  { "english": "loss", "uzbek": "yo‘qotish", "type": "ot", "pronunciation": "/lɒs/" },
  { "english": "gradual", "uzbek": "asta-sekin", "type": "sifat", "pronunciation": "/ˈɡrædʒuəl/" },
  { "english": "decline", "uzbek": "pasaymoq", "type": "fe’l", "pronunciation": "/dɪˈklaɪn/" },
  { "english": "growth", "uzbek": "o‘sish", "type": "ot", "pronunciation": "/ɡroʊθ/" },
  { "english": "debt", "uzbek": "qarz", "type": "ot", "pronunciation": "/det/" },
  { "english": "owe", "uzbek": "qarzdor bo‘lmoq", "type": "fe’l", "pronunciation": "/oʊ/" },
  { "english": "colleague", "uzbek": "hamkasb", "type": "ot", "pronunciation": "/ˈkɒliːɡ/" },
  { "english": "independent", "uzbek": "mustaqil", "type": "sifat", "pronunciation": "/ˌɪndɪˈpendənt/" },
  { "english": "split", "uzbek": "bo‘linmoq, ajratmoq", "type": "fe’l", "pronunciation": "/splɪt/" },
  { "english": "express", "uzbek": "ifodalamoq", "type": "fe’l", "pronunciation": "/ɪkˈspres/" },
  { "english": "benefit", "uzbek": "foyda", "type": "ot", "pronunciation": "/ˈbenɪfɪt/" },
  { "english": "quit", "uzbek": "tark etmoq", "type": "fe’l", "pronunciation": "/kwɪt/" },
  { "english": "especially", "uzbek": "ayniqsa", "type": "ravish", "pronunciation": "/ɪˈspeʃəli/" },
  { "english": "footpath", "uzbek": "piyoda yo‘li", "type": "ot", "pronunciation": "/ˈfʊtpæθ/" },
  { "english": "narrow", "uzbek": "tor", "type": "sifat", "pronunciation": "/ˈnærəʊ/" },
  { "english": "passage", "uzbek": "yo‘lak, koridor", "type": "ot", "pronunciation": "/ˈpæsɪdʒ/" },
  { "english": "collect", "uzbek": "to‘plamoq, yig‘moq", "type": "fe’l", "pronunciation": "/kəˈlekt/" },
  { "english": "discover", "uzbek": "kashf qilmoq", "type": "fe’l", "pronunciation": "/dɪˈskʌvər/" },
  { "english": "yell", "uzbek": "baqirmoq", "type": "fe’l", "pronunciation": "/jel/" },
  { "english": "journey", "uzbek": "sayohat", "type": "ot", "pronunciation": "/ˈdʒɜːrni/" }
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