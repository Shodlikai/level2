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
  { english: "flexible", uzbek: "moslashuvchan", type: "sifat", pronunciation: "/ˈfleksəbl/" },
  { english: "voyage", uzbek: "sayohat, safar", type: "ot", pronunciation: "/ˈvɔɪ.ɪdʒ/" },
  { english: "backpack", uzbek: "ryukzak, orqa sumka", type: "ot", pronunciation: "/ˈbækpæk/" },
  { english: "roam", uzbek: "tentirmoq, daydimoq", type: "fe'l", pronunciation: "/rəʊm/" },
  { english: "sightseeing", uzbek: "diqqatga sazovor joylarni tomosha qilish", type: "ot", pronunciation: "/ˈsaɪtˌsiː.ɪŋ/" },
  { english: "unpack", uzbek: "sumkadan olmoq, sumkani bo‘shatmoq", type: "fe'l", pronunciation: "/ʌnˈpæk/" },
  { english: "pack", uzbek: "narsalarni joylamoq, yuklarni joylashtirmoq", type: "fe'l", pronunciation: "/pæk/" },
  { english: "resort", uzbek: "oromgoh, ko‘ngilochar joy", type: "ot", pronunciation: "/rɪˈzɔːrt/" },
  { english: "spectacular", uzbek: "ko‘z quvnaydigan, ko‘zni quvnatadigan", type: "sifat", pronunciation: "/spekˈtækjələr/" },
  { english: "serene", uzbek: "bosiq, sokin, tiniq", type: "sifat", pronunciation: "/səˈriːn/" },
  { english: "bustling", uzbek: "gavjum, jo‘shqin", type: "sifat", pronunciation: "/ˈbʌslɪŋ/" },
  { english: "picturesque", uzbek: "manzarali, chiroyli", type: "sifat", pronunciation: "/ˌpɪktʃəˈresk/" },
  { english: "spray", uzbek: "sepmoq", type: "fe'l", pronunciation: "/spreɪ/" },
  { english: "nurture", uzbek: "parvarish qilmoq, boqmoq", type: "fe'l", pronunciation: "/ˈnɜːrtʃər/" },
  { english: "suburb", uzbek: "shahar atrofi", type: "ot", pronunciation: "/ˈsʌbɜːrb/" },
  { english: "intersection", uzbek: "chorraha", type: "ot", pronunciation: "/ˌɪntəˈsekʃən/" },
  { english: "crosswalk", uzbek: "piyodalar o‘tish joyi", type: "ot", pronunciation: "/ˈkrɔswɔːk/" },
  { english: "plaza", uzbek: "keng ochiq maydon", type: "ot", pronunciation: "/ˈplɑːzə/" },
  { english: "boulevard", uzbek: "xiyobon, avenyu", type: "ot", pronunciation: "/ˈbuːləvɑːrd/" },
  { english: "skyscraper", uzbek: "osmono‘par bino", type: "ot", pronunciation: "/ˈskaɪˌskreɪpər/" },
  { english: "demolish", uzbek: "buzmoq, vayron qilmoq", type: "fe'l", pronunciation: "/dɪˈmɒlɪʃ/" },
  { english: "contemporary", uzbek: "hozirgi, zamonaviy", type: "sifat", pronunciation: "/kənˈtempərəri/" },
  { english: "dynamic", uzbek: "g‘ayratli, shijoatli", type: "sifat", pronunciation: "/daɪˈnæmɪk/" },
  { english: "vibrant", uzbek: "jo‘shqin, zavqli", type: "sifat", pronunciation: "/ˈvaɪbrənt/" },
  { english: "bucket", uzbek: "chelak, paqir", type: "ot", pronunciation: "/ˈbʌkɪt/" },
  { english: "trash can", uzbek: "axlat qutisi", type: "ot", pronunciation: "/træʃ kæn/" },
  { english: "lifeboat", uzbek: "qutqaruv kemasi", type: "ot", pronunciation: "/ˈlaɪfbəʊt/" },
  { english: "cargo", uzbek: "mol, yuk, mahsulot", type: "ot", pronunciation: "/ˈkɑːrɡəʊ/" },
  { english: "ferry", uzbek: "parom, yo‘lovchilar kemasi", type: "ot", pronunciation: "/ˈferi/" },
  { english: "ambulance", uzbek: "tez yordam (mashinasi)", type: "ot", pronunciation: "/ˈæmbjələns/" }
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