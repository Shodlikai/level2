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
  { "english": "history", "uzbek": "tarix", "type": "ot", "pronunciation": "hɪstri" },
  { "english": "origin", "uzbek": "kelib chiqish, paydo bo‘lish", "type": "ot", "pronunciation": "ˈɒrɪdʒɪn" },
  { "english": "chef", "uzbek": "boshliq, rahbar", "type": "ot", "pronunciation": "ʃef" },
  { "english": "distinguish", "uzbek": "farq qilmoq, ajratmoq", "type": "fe’l", "pronunciation": "dɪˈstɪŋɡwɪʃ" },
  { "english": "clan", "uzbek": "qabila, urug‘", "type": "ot", "pronunciation": "klæn" },
  { "english": "tribe", "uzbek": "qabila", "type": "ot", "pronunciation": "traɪb" },
  { "english": "merely", "uzbek": "faqatgina", "type": "ravish", "pronunciation": "ˈmɪrli" },
  { "english": "in spite of", "uzbek": "ga qaramasdan, sal ham", "type": "bog‘lovchi", "pronunciation": "ɪn spaɪt əv" },
  { "english": "sort", "uzbek": "tartibga solmoq, saralamoq", "type": "fe’l", "pronunciation": "sɔːrt" },
  { "english": "expel", "uzbek": "haydab yubormoq, chiqarib yubormoq", "type": "fe’l", "pronunciation": "ɪkˈspel" },
  { "english": "equal", "uzbek": "teng, bir xil", "type": "sifat", "pronunciation": "ˈiːkwəl" },
  { "english": "sink", "uzbek": "rakovina", "type": "ot", "pronunciation": "sɪŋk" },
  { "english": "dais", "uzbek": "to‘rtburchak qilib to‘g‘ramoq", "type": "fe’l", "pronunciation": "ˈdeɪs" },
  { "english": "economize", "uzbek": "tejamoq, iqtisod qilmoq", "type": "fe’l", "pronunciation": "ɪˈkɒnəmaɪz" },
  { "english": "descendant", "uzbek": "davomchisi, avlodi", "type": "ot", "pronunciation": "dɪˈsendənt" },
  { "english": "shopkeeper", "uzbek": "do‘kondor, sotuvchi", "type": "ot", "pronunciation": "ˈʃɒpˌkiːpər" },
  { "english": "territory", "uzbek": "territoriya, hudud", "type": "ot", "pronunciation": "ˈterɪtəri" },
  { "english": "lead", "uzbek": "boshqarmoq, rahbarlik qilmoq", "type": "fe’l", "pronunciation": "liːd" },
  { "english": "succeed", "uzbek": "muvaffaqiyatga erishmoq", "type": "fe’l", "pronunciation": "səkˈsiːd" },
  { "english": "estate", "uzbek": "mulk, ko‘chmas mulk", "type": "ot", "pronunciation": "ɪˈsteɪt" },
  { "english": "neutral", "uzbek": "betaraf, xolis", "type": "sifat", "pronunciation": "ˈnjuːtrəl" },
  { "english": "circumstance", "uzbek": "holat, vaziyat", "type": "ot", "pronunciation": "ˈsɜːrkəmstæns" },
  { "english": "undertake", "uzbek": "bo‘yniga olmoq, zimmasiga olmoq", "type": "fe’l", "pronunciation": "ˌʌndərˈteɪk" },
  { "english": "strictly", "uzbek": "qat’iylik bilan, qat’iy", "type": "ravish", "pronunciation": "ˈstrɪktli" },
  { "english": "timeless", "uzbek": "vaqt ta’sir qilmaydigan, zamonbilmas", "type": "sifat", "pronunciation": "ˈtaɪmləs" },
  { "english": "relevant", "uzbek": "aloqador, bog‘liq", "type": "sifat", "pronunciation": "ˈreləvənt" },
  { "english": "souvenir", "uzbek": "suvenir", "type": "ot", "pronunciation": "ˌsuːvəˈnɪr" },
  { "english": "skating rink", "uzbek": "konkida uchish maydoni", "type": "ot", "pronunciation": "ˈskeɪtɪŋ rɪŋk" },
  { "english": "appoint", "uzbek": "tayinlamoq", "type": "fe’l", "pronunciation": "əˈpɔɪnt" },
  { "english": "appetite", "uzbek": "ishtaha", "type": "ot", "pronunciation": "ˈæpɪtaɪt" }
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