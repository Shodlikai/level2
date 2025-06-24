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
  { english: "call for", uzbek: "chaqirmoq, talab qilmoq", type: "fe'l", pronunciation: "/koːl fɔːr/" },
  { english: "district", uzbek: "tuman, okrug", type: "ot", pronunciation: "/'dɪstrɪkt/" },
  { english: "profit", uzbek: "foyda ko'rmoq, foydalanmoq", type: "fe'l/ot", pronunciation: "/'prɒfɪt/" },
  { english: "existence", uzbek: "mavjudlik, borlik", type: "ot", pronunciation: "/ɪɡ'zɪstəns/" },
  { english: "incident", uzbek: "noqulay voqea, mojaro", type: "ot", pronunciation: "/'ɪnsɪdənt/" },
  { english: "individual", uzbek: "shaxs, bir kishi", type: "ot/sifat", pronunciation: "/ˌɪndɪ'vɪdʒuəl/" },
  { english: "judge", uzbek: "baho bermoq, xulosa qilmoq", type: "fe'l", pronunciation: "/dʒʌdʒ/" },
  { english: "side by side", uzbek: "yonma-yon", type: "ifoda", pronunciation: "/saɪd baɪ saɪd/" },
  { english: "murder", uzbek: "o'ldirmoq, qotillik", type: "fe'l/ot", pronunciation: "/'mɜːrdər/" },
  { english: "reputation", uzbek: "obro', e'tibor", type: "ot", pronunciation: "/ˌrepjʊ'teɪʃən/" },
  { english: "tend to", uzbek: "odatlanmoq", type: "fe'l", pronunciation: "/tend tuː/" },
  { english: "justified", uzbek: "asosli, o'rinli", type: "sifat", pronunciation: "/'dʒʌstɪfaɪd/" },
  { english: "state", uzbek: "bildirmoq, bayon etmoq", type: "fe'l", pronunciation: "/steɪt/" },
  { english: "widespread", uzbek: "keng tarqalgan", type: "sifat", pronunciation: "/'waɪdspred/" },
  { english: "plenty", uzbek: "juda ko'p", type: "ot", pronunciation: "/'plenti/" },
  { english: "handy", uzbek: "qulay, kerakli", type: "sifat", pronunciation: "/'hændi/" },
  { english: "diverse", uzbek: "turli-tuman", type: "sifat", pronunciation: "/daɪ'vɜːrs/" },
  { english: "incredibly", uzbek: "aql bovar qilmaydigan", type: "hol", pronunciation: "/ɪn'kredəbli/" },
  { english: "truly", uzbek: "rostdan ham", type: "hol", pronunciation: "/'truːli/" },
  { english: "unique", uzbek: "yagona, takrorlanmas", type: "sifat", pronunciation: "/juː'niːk/" },
  { english: "spirit", uzbek: "ruhiyat", type: "ot", pronunciation: "/'spɪrɪt/" },
  { english: "laid-back", uzbek: "xotirjam", type: "sifat", pronunciation: "/ˌleɪd'bæk/" },
  { english: "easy-going", uzbek: "bag'ri keng", type: "sifat", pronunciation: "/ˌiːzi'ɡəʊɪŋ/" },
  { english: "vital", uzbek: "hayotiy ahamiyatga ega", type: "sifat", pronunciation: "/'vaɪtl/" },
  { english: "outlook", uzbek: "dunyoqarash", type: "ot", pronunciation: "/'aʊtlʊk/" },
  { english: "turn up", uzbek: "kelmoq, ko'rinmoq", type: "fe'l", pronunciation: "/tɜːrn ʌp/" },
  { english: "exchange", uzbek: "almashmoq", type: "fe'l/ot", pronunciation: "/ɪks'tʃeɪndʒ/" },
  { english: "appreciate", uzbek: "qadrlamoq", type: "fe'l", pronunciation: "/ə'priːʃieɪt/" },
  { english: "mate", uzbek: "o'rtoq", type: "ot", pronunciation: "/meɪt/" },
  { english: "welcoming", uzbek: "mehribon", type: "sifat", pronunciation: "/'welkəmɪŋ/" }
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