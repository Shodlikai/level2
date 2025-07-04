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
  { english: "jubilee", uzbek: "yubiley", type: "ot", pronunciation: "/ˈdʒuː.bɪl.iː/" },
  { english: "ritual", uzbek: "ritual", type: "ot", pronunciation: "/ˈrɪtʃ.u.əl/" },
  { english: "feast", uzbek: "bayram", type: "ot", pronunciation: "/fiːst/" },
  { english: "firework", uzbek: "otishma", type: "ot", pronunciation: "/ˈfaɪə.wɜːrk/" },
  { english: "parade", uzbek: "parad", type: "ot", pronunciation: "/pəˈreɪd/" },
  { english: "honor", uzbek: "hurmat", type: "ot", pronunciation: "/ˈɑː.nɚ/" },
  { english: "blissful", uzbek: "xotirjam", type: "sifat", pronunciation: "/ˈblɪs.fəl/" },
  { english: "sparkling", uzbek: "yaltirab", type: "sifat", pronunciation: "/ˈspɑːr.klɪŋ/" },
  { english: "glorious", uzbek: "shonli", type: "sifat", pronunciation: "/ˈɡlɔːr.i.əs/" },
  { english: "grand", uzbek: "katta", type: "sifat", pronunciation: "/ɡrænd/" },
  { english: "memorable", uzbek: "esda qoladigan", type: "sifat", pronunciation: "/ˈmem.ər.ə.bəl/" },
  { english: "fulfill", uzbek: "bajarish", type: "fe’l", pronunciation: "/fʊlˈfɪl/" },
  { english: "terminal", uzbek: "terminal", type: "ot", pronunciation: "/ˈtɜːr.mɪ.nəl/" },
  { english: "runway", uzbek: "uchish-qo‘nish yo‘lagi", type: "ot", pronunciation: "/ˈrʌn.weɪ/" },
  { english: "parachute", uzbek: "parashyut", type: "ot", pronunciation: "/ˈpær.ə.ʃuːt/" },
  { english: "patrol", uzbek: "patrul", type: "ot", pronunciation: "/pəˈtroʊl/" },
  { english: "starlit", uzbek: "yulduzli", type: "sifat", pronunciation: "/ˈstɑːr.lɪt/" },
  { english: "moonlit", uzbek: "oylana", type: "sifat", pronunciation: "/ˈmuːn.lɪt/" },
  { english: "gloomy", uzbek: "g‘amgin", type: "sifat", pronunciation: "/ˈɡluː.mi/" },
  { english: "restful", uzbek: "tinch", type: "sifat", pronunciation: "/ˈrest.fəl/" },
  { english: "handcuffs", uzbek: "kistlik", type: "ot", pronunciation: "/ˈhænd.kʌfs/" },
  { english: "escort", uzbek: "kuzatuvchi", type: "ot", pronunciation: "/ˈes.kɔːrt/" },
  { english: "academic", uzbek: "akademik", type: "sifat", pronunciation: "/ˌæk.əˈdem.ɪk/" },
  { english: "draft", uzbek: "loyiha", type: "ot", pronunciation: "/dræft/" },
  { english: "outline", uzbek: "kontur", type: "ot", pronunciation: "/ˈaʊt.laɪn/" },
  { english: "logical", uzbek: "mantiqiy", type: "sifat", pronunciation: "/ˈlɑː.dʒɪ.kəl/" },
  { english: "graze", uzbek: "o‘t yemoq", type: "fe’l", pronunciation: "/ɡreɪz/" },
  { english: "leap", uzbek: "sakrash", type: "fe’l", pronunciation: "/liːp/" },
  { english: "howl", uzbek: "uvillash", type: "fe’l", pronunciation: "/haʊl/" },
  { english: "hiss", uzbek: "xishlaydi", type: "fe’l", pronunciation: "/hɪs/" }
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