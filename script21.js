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
  { english: "bay", uzbek: "ko'rfaz, bo'g'iz", type: "ot", pronunciation: "/bei/" },
  { english: "glacier", uzbek: "muzlik, muz qatlami", type: "ot", pronunciation: "/'glaesiar/" },
  { english: "waterfall", uzbek: "sharshara", type: "ot", pronunciation: "/'wo tarfo:l/" },
  { english: "fragrant", uzbek: "xushbo'y, muattar hidli", type: "sifat", pronunciation: "/'freigrant/" },
  { english: "breathtaking", uzbek: "juda hayratlanarli, lol qoldiradigan", type: "sifat", pronunciation: "/'breθteikɪŋ/" },
  { english: "emergency", uzbek: "favqulodda vaziyat", type: "ot", pronunciation: "/i'mərdʒənsi/" },
  { english: "therapy", uzbek: "muolaja, davolash", type: "ot", pronunciation: "/'θerəpi/" },
  { english: "diagnose", uzbek: "tashxis qo'ymoq", type: "fe'l", pronunciation: "/'daiagnouz/" },
  { english: "heal", uzbek: "tuzalmoq, bitmoq (yara)", type: "fe'l", pronunciation: "/hi:l/" },
  { english: "grill", uzbek: "qo'rada pishirmoq, grilda pishirmoq", type: "fe'l", pronunciation: "/gril/" },
  { english: "burnt", uzbek: "kuygan, yong'an", type: "sifat", pronunciation: "/bə:nt/" },
  { english: "tender", uzbek: "yumshoq, mayin", type: "sifat", pronunciation: "/'tendar/" },
  { english: "sour", uzbek: "nordon, taxir", type: "sifat", pronunciation: "/saor/" },
  { english: "juicy", uzbek: "serxuv, shirali", type: "sifat", pronunciation: "/'dʒu:si/" },
  { english: "bitter", uzbek: "achchiq, o'tkir", type: "sifat", pronunciation: "/'bitə/" },
  { english: "pan", uzbek: "tova, skovorotka", type: "ot", pronunciation: "/pæn/" },
  { english: "overcast", uzbek: "bulutli, bulut qoplagan", type: "sifat", pronunciation: "/'ouvərkæst/" },
  { english: "frost", uzbek: "sovuq, ayoz", type: "ot", pronunciation: "/frɔst/" },
  { english: "rainbow", uzbek: "kamalak", type: "ot", pronunciation: "/'reinbou/" },
  { english: "mist", uzbek: "tuman, quyuq tuman", type: "ot", pronunciation: "/mist/" },
  { english: "scooter", uzbek: "skuter, samokat", type: "ot", pronunciation: "/'sku:tə/" },
  { english: "tram", uzbek: "tramvay", type: "ot", pronunciation: "/træm/" },
  { english: "hail", uzbek: "ishora qilmoq (taksga to'xtash uchun)", type: "fe'l", pronunciation: "/heil/" },
  { english: "embark", uzbek: "kemaga yuklamoq, kemaga chiqmoq", type: "fe'l", pronunciation: "/im'bɑ:rk/" },
  { english: "merge", uzbek: "birlashtirmoq, burlashmoq", type: "fe'l", pronunciation: "/mə:rdʒ/" },
  { english: "steer", uzbek: "rulni boshqarmoq, yetaklamoq", type: "fe'l", pronunciation: "/stiə/" },
  { english: "lightweight", uzbek: "yengil vazn", type: "sifat", pronunciation: "/'lait-weet/" },
  { english: "hybrid", uzbek: "gibrid, chatishma", type: "ot", pronunciation: "/'haibrid/" },
  { english: "jungle", uzbek: "changalzor, chang'illikzor", type: "ot", pronunciation: "/'dʒʌŋgl/" },
  { english: "pond", uzbek: "hovuz, havza", type: "ot", pronunciation: "/pɑnd/" }
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