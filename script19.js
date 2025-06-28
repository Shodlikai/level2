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
  { english: "join in", uzbek: "qo'shilmoq, birga vaqt o'tkazmoq", type: "fe'l", pronunciation: "/dʒɔɪn ɪn/" },
  { english: "twist", uzbek: "burmoq, aylantirmoq", type: "fe'l", pronunciation: "/twɪst/" },
  { english: "aside from", uzbek: "bundan tashqari", type: "ifoda", pronunciation: "/əˈsaɪd frɒm/" },
  { english: "barbeque", uzbek: "barbekyu, mangal", type: "ot", pronunciation: "/ˈbɑːrbɪkjuː/" },
  { english: "lamb", uzbek: "qo'zichoq", type: "ot", pronunciation: "/læm/" },
  { english: "sample", uzbek: "namuna, sinov", type: "ot", pronunciation: "/ˈsɑːmpəl/" },
  { english: "smash", uzbek: "sindirmoq, parchalamoq", type: "fe'l", pronunciation: "/smæʃ/" },
  { english: "found", uzbek: "asos solmoq, tashkil qilmoq", type: "fe'l", pronunciation: "/faʊnd/" },
  { english: "contractor", uzbek: "shartnoma tuzuvchi", type: "ot", pronunciation: "/kənˈtræktər/" },
  { english: "furnish", uzbek: "jihozlamoq", type: "fe'l", pronunciation: "/ˈfɜːnɪʃ/" },
  { english: "fragile", uzbek: "mo'rt, sinuvchan", type: "sifat", pronunciation: "/ˈfrædʒaɪl/" },
  { english: "luxury", uzbek: "hashamat, hashamatli", type: "ot", pronunciation: "/ˈlʌkʃəri/" },
  { english: "portion", uzbek: "poriya, qism", type: "ot", pronunciation: "/ˈpɔːrʃən/" },
  { english: "nourishing", uzbek: "to'yimli", type: "sifat", pronunciation: "/ˈnʌrɪʃɪŋ/" },
  { english: "abolish", uzbek: "bekor qilmoq", type: "fe'l", pronunciation: "/əˈbɒlɪʃ/" },
  { english: "dictate", uzbek: "aytib yozdirmoq", type: "fe'l", pronunciation: "/dɪkˈteɪt/" },
  { english: "infect", uzbek: "yuqtirmoq", type: "fe'l", pronunciation: "/ɪnˈfekt/" },
  { english: "circulate", uzbek: "aylantirmoq, tarqatmoq", type: "fe'l", pronunciation: "/ˈsɜːrkjəleɪt/" },
  { english: "declutter", uzbek: "tozalamoq, tartibga solmoq", type: "fe'l", pronunciation: "/diːˈklʌtər/" },
  { english: "dishwasher", uzbek: "idish yuvish mashinasi", type: "ot", pronunciation: "/ˈdɪʃwɒʃər/" },
  { english: "deck", uzbek: "paluba", type: "ot", pronunciation: "/dek/" },
  { english: "basement", uzbek: "podval", type: "ot", pronunciation: "/ˈbeɪsmənt/" },
  { english: "pantry", uzbek: "omborxona", type: "ot", pronunciation: "/ˈpæntri/" },
  { english: "spacious", uzbek: "keng", type: "sifat", pronunciation: "/ˈspeɪʃəs/" },
  { english: "elegant", uzbek: "nofis", type: "sifat", pronunciation: "/ˈelɪɡənt/" },
  { english: "charming", uzbek: "jo'zibali", type: "sifat", pronunciation: "/ˈtʃɑːrmɪŋ/" },
  { english: "secure", uzbek: "xavfsiz", type: "sifat", pronunciation: "/sɪˈkjʊər/" },
  { english: "surprise", uzbek: "ajablanish, hayron qolish", type: "ot", pronunciation: "/sərˈpraɪz/" },
  { english: "delicate", uzbek: "nozik", type: "sifat", pronunciation: "/ˈdelɪkət/" },
  { english: "vibrant", uzbek: "yorqin, jonli", type: "sifat", pronunciation: "/ˈvaɪbrənt/" }
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