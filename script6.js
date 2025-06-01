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
  { "english": "developed", "uzbek": "rivojlangan", "type": "sifat", "pronunciation": "/dɪˈvɛləpt/" },
  { "english": "populous", "uzbek": "aholisi zich", "type": "sifat", "pronunciation": "/ˈpɒpjʊləs/" },
  { "english": "well-paid", "uzbek": "yaxshi haq to‘lanadigan", "type": "sifat", "pronunciation": "/ˌwel ˈpeɪd/" },
  { "english": "flight", "uzbek": "parvoz, reys", "type": "ot", "pronunciation": "/flaɪt/" },
  { "english": "waitress", "uzbek": "ofitsiant qiz", "type": "ot", "pronunciation": "/ˈweɪtrəs/" },
  { "english": "attractive", "uzbek": "jozibador", "type": "sifat", "pronunciation": "/əˈtræktɪv/" },
  { "english": "frightening", "uzbek": "qo‘rqinchli", "type": "sifat", "pronunciation": "/ˈfraɪtnɪŋ/" },
  { "english": "peaceful", "uzbek": "tinch, osoyishta", "type": "sifat", "pronunciation": "/ˈpiːsfəl/" },
  { "english": "messy", "uzbek": "tartibsiz, iflos", "type": "sifat", "pronunciation": "/ˈmesi/" },
  { "english": "muddy", "uzbek": "loyqa, loyli", "type": "sifat", "pronunciation": "/ˈmʌdi/" },
  { "english": "greasy", "uzbek": "yog‘li, yog‘langan", "type": "sifat", "pronunciation": "/ˈɡriːsi/" },
  { "english": "go by", "uzbek": "yonidan o‘tmoq, o‘tib ketmoq", "type": "fe’l (phrasal verb)", "pronunciation": "/ɡəʊ baɪ/" },
  { "english": "dim", "uzbek": "xira, qorong‘i", "type": "sifat", "pronunciation": "/dɪm/" },
  { "english": "towel", "uzbek": "sochiq", "type": "ot", "pronunciation": "/ˈtaʊəl/" },
  { "english": "fascinating", "uzbek": "hayratlanarli, maftunkor", "type": "sifat", "pronunciation": "/ˈfæsɪneɪtɪŋ/" },
  { "english": "silver", "uzbek": "kumush, kumushrang", "type": "ot/sifat", "pronunciation": "/ˈsɪlvə(r)/" },
  { "english": "aggressive", "uzbek": "tajovuzkor", "type": "sifat", "pronunciation": "/əˈɡresɪv/" },
  { "english": "shallow", "uzbek": "sayoz, yuzaki", "type": "sifat", "pronunciation": "/ˈʃæləʊ/" },
  { "english": "careful", "uzbek": "ehtiyotkor, sinchkov", "type": "sifat", "pronunciation": "/ˈkeəfəl/" },
  { "english": "generous", "uzbek": "saxiy, qo‘l ochiq", "type": "sifat", "pronunciation": "/ˈdʒenərəs/" },
  { "english": "buyer", "uzbek": "xaridor, sotib oluvchi", "type": "ot", "pronunciation": "/ˈbaɪə(r)/" },
  { "english": "holy", "uzbek": "muqaddas", "type": "sifat", "pronunciation": "/ˈhəʊli/" },
  { "english": "lively", "uzbek": "jo‘shqin, quvnoq, faol", "type": "sifat", "pronunciation": "/ˈlaɪvli/" },
  { "english": "yacht", "uzbek": "yaxta, hashamatli qayiq", "type": "ot", "pronunciation": "/jɒt/" },
  { "english": "pants", "uzbek": "shim", "type": "ot", "pronunciation": "/pænts/" },
  { "english": "comfortable", "uzbek": "qulay, shinam", "type": "sifat", "pronunciation": "/ˈkʌmf(ə)təbl/" },
  { "english": "juicy", "uzbek": "shirali, suvli", "type": "sifat", "pronunciation": "/ˈdʒuːsi/" },
  { "english": "mosquito", "uzbek": "chivin", "type": "ot", "pronunciation": "/məˈskiːtəʊ/" },
  { "english": "link", "uzbek": "bog‘lanish, havola", "type": "ot/fe’l", "pronunciation": "/lɪŋk/" },
  { "english": "heritage", "uzbek": "meros, boylik", "type": "ot", "pronunciation": "/ˈherɪtɪdʒ/" }
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