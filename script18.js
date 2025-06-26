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
  { english: "surprise", uzbek: "ajablanish, hayron qolish", type: "ot", pronunciation: "/sərˈpraɪz/" },
  { english: "outdoors", uzbek: "tashqarida, ochiq havoda", type: "hol", pronunciation: "/ˌaʊtˈdɔːrz/" },
  { english: "passion", uzbek: "yoqtirish, qiziqish", type: "ot", pronunciation: "/ˈpæʃən/" },
  { english: "foundation", uzbek: "asos, negiz", type: "ot", pronunciation: "/faʊnˈdeɪʃən/" },
  { english: "respectful", uzbek: "ehtirom bilan, hurmat qiladigan", type: "sifat", pronunciation: "/rɪˈspektfəl/" },
  { english: "central", uzbek: "asosiy, dolzarb, muhim", type: "sifat", pronunciation: "/ˈsentrəl/" },
  { english: "eager", uzbek: "tashna, o‘ch, juda xohlaydigan", type: "sifat", pronunciation: "/ˈiːɡər/" },
  { english: "diversity", uzbek: "turfa xillik, har xillik", type: "ot", pronunciation: "/daɪˈvɜːrsəti/" },
  { english: "cuisine", uzbek: "taom, ovqat", type: "ot", pronunciation: "/kwɪˈziːn/" },
  { english: "endless", uzbek: "cheksiz, tuganmas", type: "sifat", pronunciation: "/ˈendləs/" },
  { english: "blend", uzbek: "uyg‘unlashmoq, mos kelmoq", type: "fe'l", pronunciation: "/blend/" },
  { english: "ingredient", uzbek: "tarkibiy qism, masalliq", type: "ot", pronunciation: "/ɪnˈɡriːdiənt/" },
  { english: "inspiration", uzbek: "ilhom, ilhomlanish", type: "ot", pronunciation: "/ˌɪnspəˈreɪʃən/" },
  { english: "reflect", uzbek: "aks ettirmoq, namoyon qilmoq", type: "fe'l", pronunciation: "/rɪˈflekt/" },
  { english: "flavour", uzbek: "maza, ta'm", type: "ot", pronunciation: "/ˈfleɪvər/" },
  { english: "indulge", uzbek: "erk bermoq, tallaytirmoq", type: "fe'l", pronunciation: "/ɪnˈdʌldʒ/" },
  { english: "coastline", uzbek: "sohil yonidagi yer", type: "ot", pronunciation: "/ˈkoʊstlaɪn/" },
  { english: "thriving", uzbek: "gullab-yashnayotgan", type: "sifat", pronunciation: "/ˈθraɪvɪŋ/" },
  { english: "kick off", uzbek: "tepib yechmoq", type: "fe'l", pronunciation: "/ˈkɪk ɒf/" },
  { english: "soak up", uzbek: "bahra olmoq", type: "fe'l", pronunciation: "/ˈsoʊk ʌp/" },
  { english: "element", uzbek: "tarkibiy qism, element", type: "ot", pronunciation: "/ˈelɪmənt/" },
  { english: "array", uzbek: "bir qator, bir guruh", type: "ot", pronunciation: "/əˈreɪ/" },
  { english: "wonder", uzbek: "mo‘jiza, ajoyibot", type: "ot", pronunciation: "/ˈwʌndər/" },
  { english: "refreshing", uzbek: "tetiklashtiradigan, kuch beradigan", type: "sifat", pronunciation: "/rɪˈfreʃɪŋ/" },
  { english: "excite", uzbek: "ta'sirlantirmoq, zavqlantirmoq", type: "fe'l", pronunciation: "/ɪkˈsaɪt/" },
  { english: "pour into", uzbek: "oqib kelmoq, ko‘plab kelmoq", type: "fe'l", pronunciation: "/ˈpɔːr ˈɪntuː/" },
  { english: "highlight", uzbek: "eng asosiy jihati, eng muhim qismi", type: "ot", pronunciation: "/ˈhaɪlaɪt/" },
  { english: "technique", uzbek: "metod, uslub", type: "ot", pronunciation: "/tekˈniːk/" },
  { english: "cast", uzbek: "suvga ilmoq tashlamoq", type: "fe'l", pronunciation: "/kɑːst/" },
  { english: "hook", uzbek: "ilmoq bilan baliq tutmoq", type: "fe'l", pronunciation: "/hʊk/" }
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