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
  { english: "commute", uzbek: "uydan ishgacha bornoq", type: "fe'l", pronunciation: "/kə'mjuːt/" },
  { english: "rubbish", uzbek: "axlat, chiqindi", type: "ot", pronunciation: "/'rʌbɪʃ/" },
  { english: "dump", uzbek: "axlatxona", type: "ot", pronunciation: "/dʌmp/" },
  { english: "move over", uzbek: "joy bermoq, yo'l bermoq", type: "fe'l", pronunciation: "/muːv 'oʊvər/" },
  { english: "get rid of", uzbek: "qutulmoq, yo'qotmoq", type: "fe'l", pronunciation: "/ɡet rɪd ʌv/" },
  { english: "nuclear", uzbek: "yadroviy", type: "sifat", pronunciation: "/'njuːkliər/" },
  { english: "essential", uzbek: "muhim, ahamiyatli", type: "sifat", pronunciation: "/ɪ'senʃəl/" },
  { english: "balance", uzbek: "muvozanat, balans", type: "ot", pronunciation: "/'bæləns/" },
  { english: "properly", uzbek: "to'g'ri, muvofiq tarzda", type: "hol", pronunciation: "/'prɒpərli/" },
  { english: "waste", uzbek: "chiqindi", type: "ot", pronunciation: "/weɪst/" },
  { english: "effectively", uzbek: "samarali", type: "hol", pronunciation: "/ɪ'fektɪvli/" },
  { english: "go ahead", uzbek: "boshlamoq", type: "fe'l", pronunciation: "/ɡoʊ ə'hed/" },
  { english: "put up", uzbek: "qurmoq, tikkalamoq", type: "fe'l", pronunciation: "/pʊt ʌp/" },
  { english: "power line", uzbek: "elektr simi", type: "ot", pronunciation: "/'paʊər laɪn/" },
  { english: "bit", uzbek: "qism, parcha, bo'lak", type: "ot", pronunciation: "/bɪt/" },
  { english: "cool", uzbek: "zo'r, ajoyib, juda yaxshi", type: "sifat", pronunciation: "/kuːl/" },
  { english: "apparently", uzbek: "afildan, ko'rinishidan", type: "hol", pronunciation: "/ə'pærəntli/" },
  { english: "complicated", uzbek: "murakkab", type: "sifat", pronunciation: "/'kɒmplɪkeɪtɪd/" },
  { english: "dilemma", uzbek: "arosat, dilemma", type: "ot", pronunciation: "/dɪ'lemə/" },
  { english: "desire", uzbek: "xohish, istak", type: "ot", pronunciation: "/dɪ'zaɪər/" },
  { english: "difficulty", uzbek: "qiyinchilik, mushkullik", type: "ot", pronunciation: "/'dɪfɪkəlti/" },
  { english: "off and on", uzbek: "onda-sonda, goh-goh", type: "hol", pronunciation: "/ɒf ænd ɒn/" },
  { english: "dream of", uzbek: "orzu qilmoq", type: "fe'l", pronunciation: "/driːm ʌv/" },
  { english: "conflict", uzbek: "ziddiyat, mojaro", type: "ot", pronunciation: "/'kɒnflɪkt/" },
  { english: "grow up", uzbek: "ulg'aymoq, voyaga yetmoq", type: "fe'l", pronunciation: "/ɡroʊ ʌp/" },
  { english: "run out", uzbek: "tugab qolmoq, tugamoq", type: "fe'l", pronunciation: "/rʌn aʊt/" },
  { english: "get out", uzbek: "tark etmoq", type: "fe'l", pronunciation: "/ɡet aʊt/" },
  { english: "break", uzbek: "tanaffus", type: "ot", pronunciation: "/breɪk/" },
  { english: "scene", uzbek: "manzara, holat", type: "ot", pronunciation: "/siːn/" },
  { english: "poverty", uzbek: "qashshoqlik, kambag'allik", type: "ot", pronunciation: "/'pɒvəti/" }
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