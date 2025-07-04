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
  { english: "ritual", uzbek: "udum, marosim", type: "ot", pronunciation: "/ˈrɪtʃ.u.əl/" },
  { english: "feast", uzbek: "bazm, ziyofat, banket", type: "ot", pronunciation: "/fiːst/" },
  { english: "firework", uzbek: "mushakbozlik", type: "ot", pronunciation: "/ˈfaɪə.wɜːk/" },
  { english: "parade", uzbek: "parad, nishonlash", type: "ot", pronunciation: "/pəˈreɪd/" },
  { english: "honor", uzbek: "hurmat, ehtirom, sharaf", type: "ot", pronunciation: "/ˈɒn.ər/" },
  { english: "blissful", uzbek: "shodu-hurramli, baxtli", type: "sifat", pronunciation: "/ˈblɪs.fəl/" },
  { english: "sparkling", uzbek: "yaltiroq, porloq", type: "sifat", pronunciation: "/ˈspɑː.klɪŋ/" },
  { english: "glorious", uzbek: "shonli, sharafli", type: "sifat", pronunciation: "/ˈɡlɔː.ri.əs/" },
  { english: "grand", uzbek: "ulug‘vor, muhtasham", type: "sifat", pronunciation: "/ɡrænd/" },
  { english: "memorable", uzbek: "unutilmas, yodda qolari", type: "sifat", pronunciation: "/ˈmem.ər.ə.bəl/" },
  { english: "fulfill", uzbek: "bajarmoq (vazifa, majburiyat)", type: "fe’l", pronunciation: "/fʊlˈfɪl/" },
  { english: "terminal", uzbek: "terminal, aeroport bekati", type: "ot", pronunciation: "/ˈtɜː.mɪ.nəl/" },
  { english: "runway", uzbek: "uchish va qo‘nish yo‘lagi", type: "ot", pronunciation: "/ˈrʌn.weɪ/" },
  { english: "parachute", uzbek: "parashut", type: "ot", pronunciation: "/ˈpær.ə.ʃuːt/" },
  { english: "patrol", uzbek: "posbonlik qilmoq, qo‘riqlamoq", type: "fe’l", pronunciation: "/pəˈtrəʊl/" },
  { english: "starlit", uzbek: "yulduz chaqnagan, yulduzli", type: "sifat", pronunciation: "/ˈstɑː.lɪt/" },
  { english: "moonlit", uzbek: "oy nuri tushgan, oy yoritgan", type: "sifat", pronunciation: "/ˈmuːn.lɪt/" },
  { english: "gloomy", uzbek: "dim, bulutli (ob-havo)", type: "sifat", pronunciation: "/ˈɡluː.mi/" },
  { english: "restful", uzbek: "tinchlantiradigan, orombaxsh", type: "sifat", pronunciation: "/ˈrest.fəl/" },
  { english: "handcuffs", uzbek: "kishan, qo‘l kishan", type: "ot", pronunciation: "/ˈhænd.kʌfs/" },
  { english: "escort", uzbek: "qo‘riqlab bormoq, kuzatib bormoq", type: "fe’l", pronunciation: "/ɪˈskɔːt/" },
  { english: "academic", uzbek: "ilmiy, o‘quv", type: "sifat", pronunciation: "/ˌæk.əˈdem.ɪk/" },
  { english: "draft", uzbek: "eskiz, qoralama", type: "ot", pronunciation: "/drɑːft/" },
  { english: "outline", uzbek: "tushuncha bermoq, yoritib bermoq", type: "fe’l", pronunciation: "/ˈaʊt.laɪn/" },
  { english: "logical", uzbek: "mantiqiy, mantiqqa to‘g‘ri keladigan", type: "sifat", pronunciation: "/ˈlɒdʒ.ɪ.kəl/" },
  { english: "hiss", uzbek: "vishillamoq, pishillamoq", type: "fe’l", pronunciation: "/hɪs/" },
  { english: "howl", uzbek: "uvullamoq, uvlamoq", type: "fe’l", pronunciation: "/haʊl/" },
  { english: "leap", uzbek: "sakramoq, irg‘imoq", type: "fe’l", pronunciation: "/liːp/" },
  { english: "graze", uzbek: "o‘tlamoq, o‘tyemoq", type: "fe’l", pronunciation: "/ɡreɪz/" }
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