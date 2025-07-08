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
  { english: "victim", uzbek: "qurbon, aziyat chekuvchi", type: "ot", pronunciation: "/ˈvɪktɪm/" },
  { english: "witness", uzbek: "guvoh, shohid", type: "ot", pronunciation: "/ˈwɪtnəs/" },
  { english: "theft", uzbek: "o‘g‘rilik, tunash", type: "ot", pronunciation: "/θeft/" },
  { english: "workplace", uzbek: "ishxona", type: "ot", pronunciation: "/ˈwɜːkpleɪs/" },
  { english: "peek", uzbek: "mo‘ralamoq, ko‘z uchida qaramoq", type: "fe’l", pronunciation: "/piːk/" },
  { english: "spot", uzbek: "ko‘rib qolmoq, payqamoq", type: "fe’l", pronunciation: "/spɒt/" },
  { english: "supervise", uzbek: "nazorat qilmoq, kuzatmoq", type: "fe’l", pronunciation: "/ˈsuːpəvaɪz/" },
  { english: "loan", uzbek: "kredit, qarz", type: "ot", pronunciation: "/ləʊn/" },
  { english: "warehouse", uzbek: "tovar ombori, mol ombori", type: "ot", pronunciation: "/ˈweəhaʊs/" },
  { english: "mend", uzbek: "tuzatmoq, yamamoq", type: "fe’l", pronunciation: "/mend/" },
  { english: "costume", uzbek: "kostyum, kiyim", type: "ot", pronunciation: "/ˈkɒstjuːm/" },
  { english: "sandal", uzbek: "shippak, basanovka", type: "ot", pronunciation: "/ˈsændl/" },
  { english: "baggy", uzbek: "keng turadigan, ho‘pillab turadigan", type: "sifat", pronunciation: "/ˈbæɡi/" },
  { english: "loose", uzbek: "bo‘sh, mahkam emas", type: "sifat", pronunciation: "/luːs/" },
  { english: "pharmacy", uzbek: "dorixona, apteka", type: "ot", pronunciation: "/ˈfɑːməsi/" },
  { english: "checkout", uzbek: "kassa, pul to‘lash joyi", type: "ot", pronunciation: "/ˈtʃekaʊt/" },
  { english: "deal", uzbek: "bitim, kelishuv", type: "ot", pronunciation: "/diːl/" },
  { english: "bargain", uzbek: "narxini kelishmoq, tortishmoq", type: "fe’l", pronunciation: "/ˈbɑːɡən/" },
  { english: "retail", uzbek: "chakana savdo, donalab sotish", type: "ot", pronunciation: "/ˈriːteɪl/" },
  { english: "mission", uzbek: "vazifa, topshiriq", type: "ot", pronunciation: "/ˈmɪʃən/" },
  { english: "advertise", uzbek: "reklama qilmoq", type: "fe’l", pronunciation: "/ˈædvətaɪz/" },
  { english: "trap", uzbek: "tuzoq, qopqon", type: "ot", pronunciation: "/træp/" },
  { english: "hospitality", uzbek: "mehmondo‘stlik", type: "ot", pronunciation: "/ˌhɒspɪˈtæləti/" },
  { english: "ensure", uzbek: "bo‘lishini ta’minlamoq, mustahkamlamoq", type: "fe’l", pronunciation: "/ɪnˈʃɔː/" },
  { english: "painkiller", uzbek: "og‘riq qoldiruvchi", type: "ot", pronunciation: "/ˈpeɪnˌkɪlər/" },
  { english: "verify", uzbek: "tekshirmoq, tasdiqlamoq", type: "fe’l", pronunciation: "/ˈverɪfaɪ/" },
  { english: "bathe", uzbek: "cho‘milmoq, yuvinmoq", type: "fe’l", pronunciation: "/beɪð/" },
  { english: "herd", uzbek: "poda, gala", type: "ot", pronunciation: "/hɜːd/" },
  { english: "board", uzbek: "taxta, doska", type: "ot", pronunciation: "/bɔːd/" },
  { english: "curriculum", uzbek: "ta’lim dasturi, o‘qiladigan fanlar", type: "ot", pronunciation: "/kəˈrɪkjələm/" }
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