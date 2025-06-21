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
  { english: "caring", uzbek: "g'amxo'r", type: "sifat", pronunciation: "/'keərɪŋ/" },
  { english: "tolerant", uzbek: "bardoshli, chidamli", type: "sifat", pronunciation: "/'tɒlərənt/" },
  { english: "obvious", uzbek: "aniq, ravshan", type: "sifat", pronunciation: "/'ɒbviəs/" },
  { english: "lock up", uzbek: "qamamoq, qamalmoq", type: "fe'l", pronunciation: "/lɒk ʌp/" },
  { english: "besides", uzbek: "bundan tashqari", type: "olmosha", pronunciation: "/bɪ'saɪdz/" },
  { english: "get on", uzbek: "chiqishmoq, yaxshi munosabatda bo'lmoq", type: "fe'l", pronunciation: "/ɡet ɒn/" },
  { english: "fed up with", uzbek: "joniga teggan, to'yganga", type: "ibora", pronunciation: "/fed ʌp wɪð/" },
  { english: "for the time being", uzbek: "vaqtincha, hozircha", type: "ibora", pronunciation: "/fɔːr ðə taɪm 'biːɪŋ/" },
  { english: "allowance", uzbek: "berilgan pul, ajratilgan mablag'", type: "ot", pronunciation: "/ə'laʊəns/" },
  { english: "claim", uzbek: "da'vo qilmoq, qattiq ta'kidlamoq", type: "fe'l", pronunciation: "/kleɪm/" },
  { english: "can't stand", uzbek: "chidab bo'lmaslik", type: "ibora", pronunciation: "/kɑːnt stænd/" },
  { english: "anymore", uzbek: "bundan buyon, buyog'iga", type: "hol", pronunciation: "/ˌeni'mɔːr/" },
  { english: "yell", uzbek: "baqirmoq, qichqirmoq", type: "fe'l", pronunciation: "/jel/" },
  { english: "secondary school", uzbek: "o'rta maktab", type: "ot", pronunciation: "/'sekəndəri skuːl/" },
  { english: "second-hand", uzbek: "ishlatilgan, ikkinchi qo'l", type: "sifat", pronunciation: "/ˌsekənd'hænd/" },
  { english: "recruit", uzbek: "qabul qilmoq, ishga olmoq", type: "fe'l", pronunciation: "/rɪ'kruːt/" },
  { english: "apply", uzbek: "hujjat topshirmoq", type: "fe'l", pronunciation: "/ə'plaɪ/" },
  { english: "passive", uzbek: "sust, nofaol", type: "sifat", pronunciation: "/'pæsɪv/" },
  { english: "get", uzbek: "bo'lmoq, biror holatga o'tmoq", type: "fe'l", pronunciation: "/ɡet/" },
  { english: "in need of", uzbek: "muhtoj, kerak", type: "ibora", pronunciation: "/ɪn niːd əv/" },
  { english: "mine", uzbek: "kon, shaxta", type: "ot", pronunciation: "/maɪn/" },
  { english: "settle", uzbek: "biror joyga o'rnashmoq", type: "fe'l", pronunciation: "/'setl/" },
  { english: "make up", uzbek: "tashkil qilmoq, tashkil topmoq", type: "fe'l", pronunciation: "/meɪk ʌp/" },
  { english: "tension", uzbek: "qarama-qarshilik, ziddiyat", type: "ot", pronunciation: "/'tenʃn/" },
  { english: "in reality", uzbek: "asilda, real hayotda", type: "ibora", pronunciation: "/ɪn ri'æləti/" },
  { english: "rivalry", uzbek: "raqobat, kurash", type: "ot", pronunciation: "/'raɪvlri/" },
  { english: "generally speaking", uzbek: "umuman aytganda", type: "ibora", pronunciation: "/'dʒenrəli 'spiːkɪŋ/" },
  { english: "inspire", uzbek: "ruhlanmoq, ilhomlanmoq", type: "fe'l", pronunciation: "/ɪn'spaɪər/" },
  { english: "movement", uzbek: "harakat, xatti-harakat", type: "ot", pronunciation: "/'muːvmənt/" },
  { english: "encourage", uzbek: "ruhlantirmoq, qo'llab-quvvatlamoq", type: "fe'l", pronunciation: "/ɪn'kʌrɪdʒ/" }
];
let currentIndex = 0;
let startX, endX; // Surish (swipe) uchun o'zgaruvchilar

// 1. YANGI QO'SHILGAN: Fisher-Yates algoritmi bilan aralashtirish funksiyasi
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// 2. O'ZGARTIRILGAN: Dasturni ishga tushirish (random qo'shildi)
function initializeApp() {
  words = shuffleArray(words); // Dastur boshlanganda aralashtirish
  slider.max = words.length;
  slider.value = 1;
  sliderMax.textContent = words.length;
  currentIndex = 0;
  updateCard(currentIndex);
}

// 3. Avvalgi funksiyalar (o'zgarmagan)
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

async function updateCard(index) {
  word.textContent = words[index].english;
  pronunciationElement.textContent = words[index].pronunciation;
  type.textContent = words[index].type;
  document.querySelector('.card-back .word').textContent = words[index].uzbek;
  document.querySelector('.card-back .type').textContent = words[index].type;

  slider.value = index + 1;
  sliderValue.textContent = `${index + 1} / ${words.length}`;
  currentIndex = index;

  const imageUrl = await getPixabayImage(words[index].english);
  backImage.src = imageUrl;
}

// 4. O'ZGARTIRILGAN: Keyingi so'zga o'tish (random qo'shildi)
nextButton.addEventListener('click', function() {
  currentIndex++;
  if (currentIndex >= words.length) {
    words = shuffleArray(words); // Oxiriga yetganda aralashtirish
    currentIndex = 0;
  }
  updateCard(currentIndex);
});

// 5. Avvalgi audio funksiyalari (o'zgarmagan)
function speak(text) {
  responsiveVoice.speak(text, "US English Male", { rate: 0.9 });
}

audioButton.addEventListener('click', function() {
  speak(words[currentIndex].english);
});

// 6. Karta aylanishi (o'zgarmagan)
card.addEventListener('click', function() {
  this.classList.toggle('flipped');
  if (this.classList.contains('flipped')) {
    speak(words[currentIndex].english);
  }
});

// 7. Slider boshqaruvi (o'zgarmagan)
slider.addEventListener('input', function() {
  updateCard(this.value - 1);
});

// 8. Surish (swipe) funksiyalari (o'zgarmagan)
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
        words = shuffleArray(words); // Oxiriga yetganda aralashtirish
        currentIndex = 0;
      }
      updateCard(currentIndex);
      card.classList.remove('swiping-right');
    }, 300);
  } else if (deltaX < -50) { // Chapga surish (yodlash)
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
    }, 300);
  }
}

// 9. Modal oynasi boshqaruvi (o'zgarmagan)
document.addEventListener("DOMContentLoaded", function() {
  const modal = document.getElementById("instruction-modal");
  const closeModal = document.getElementById("close-modal");

  nextButton.addEventListener("click", function() {
    modal.style.display = "flex";
  });

  closeModal.addEventListener("click", function() {
    modal.style.display = "none";
  });
});

// 10. Dasturni ishga tushirish
document.addEventListener("DOMContentLoaded", initializeApp);