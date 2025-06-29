const words = [
  { word: "join in", pronunciation: "dʒɔɪn ɪn", translation: "qo'shilmoq, birga vaqt o'tkazmoq" },
  { word: "twist", pronunciation: "twɪst", translation: "eshmoq, qayilmoq" },
  { word: "aside from", pronunciation: "əˈsaɪd frəm", translation: "-dan tashqari, -ni hisobga olmaganda" },
  { word: "barbeque", pronunciation: "ˈbɑːrbɪkjuː", translation: "barbekyu" },
  { word: "lamb", pronunciation: "læm", translation: "qo'zi, qo'zichoq" },
  { word: "sample", pronunciation: "ˈsæmpl", translation: "tatib ko‘rmoq, sinab ko‘rmoq" },
  { word: "smash", pronunciation: "smæʃ", translation: "urmoq, urilib sinmoq" },
  { word: "found", pronunciation: "faʊnd", translation: "asos solmoq, tashkil qilmoq" },
  { word: "contractor", pronunciation: "ˈkɒntræktər", translation: "shartnomachi, bitim tuzgan tomon" },
  { word: "furnish", pronunciation: "ˈfɜːrnɪʃ", translation: "jihozlamoq" },
  { word: "fragile", pronunciation: "ˈfrædʒaɪl", translation: "mo‘rt, tez sinadigan" },
  { word: "luxury", pronunciation: "ˈlʌkʃəri", translation: "dabdaba, hashamat" },
  { word: "portion", pronunciation: "ˈpɔːʃən", translation: "qism, bo‘lak, parcha" },
  { word: "nourishing", pronunciation: "ˈnɜːrɪʃɪŋ", translation: "to‘yimli, sog‘lom tutadigan" },
  { word: "abolish", pronunciation: "əˈbɒlɪʃ", translation: "bekor qilmoq, to‘xtatmoq" },
  { word: "dictate", pronunciation: "ˈdɪkteɪt", translation: "aytib yozdirmoq" },
  { word: "infect", pronunciation: "ɪnˈfekt", translation: "yuqtirmoq, yuqtmoq" },
  { word: "circulate", pronunciation: "ˈsɜːrkjəleɪt", translation: "aylantirmoq, aylantmoq" },
  { word: "declutter", pronunciation: "diːˈklʌtər", translation: "keraksiz narsalarni olib tashlamoq" },
  { word: "dishwasher", pronunciation: "ˈdɪʃˌwɒʃər", translation: "idish yuvish mashinasi" },
  { word: "utility", pronunciation: "ˈjuːtɪlɪti", translation: "kommunal xizmatlar" },
  { word: "driveway", pronunciation: "ˈdraɪvweɪ", translation: "ko‘cha yo‘li" },
  { word: "porch", pronunciation: "pɔːrtʃ", translation: "eshik oldi, ayvon, pod’yezd" },
  { word: "deck", pronunciation: "dek", translation: "paluba" },
  { word: "basement", pronunciation: "ˈbeɪsmənt", translation: "yer to‘la, podval" },
  { word: "pantry", pronunciation: "ˈpæntri", translation: "ombor, omborxona" },
  { word: "spacious", pronunciation: "ˈspeɪʃəs", translation: "keng, bo‘sh joyi ko‘p" },
  { word: "elegant", pronunciation: "ˈeləɡənt", translation: "nafis, nozik did bilan qilingan" },
  { word: "charming", pronunciation: "ˈtʃɑːrmɪŋ", translation: "maftunkor, jozibali" },
  { word: "secure", pronunciation: "sɪˈkjʊr", translation: "bexavotir, xavfsiz" }
];
let remainingWords = shuffleArray([...words]); // So‘zlar random tartibda
let currentWord = null;
let totalAttempts = 0;
let correctAnswers = 0;
let timeLeft = 15;
let timer;
let timeMode = false;
let attemptsLeft = 2;
let audioCache = {}; // Saqlangan audio fayllar

// **Saqlangan audiolarni yuklash**
function loadCachedAudio() {
    for (let i = 0; i < localStorage.length; i++) {
        let word = localStorage.key(i);
        let audioURL = localStorage.getItem(word);
        let audio = new Audio(audioURL);
        audioCache[word] = audio;
    }
}

// **So‘zni yuklash**
function loadWord() {
    clearInterval(timer);

    if (remainingWords.length === 0) {
        remainingWords = shuffleArray([...words]); // So‘zlar tugasa, qayta aralashtiramiz
    }

    currentWord = remainingWords.pop();
    attemptsLeft = 2;

    document.getElementById("question").innerText = `"${currentWord.translation}" so‘zining inglizchasini yozing`;
    document.getElementById("answer").value = "";
    document.getElementById("result").innerText = "";

    playAudio(currentWord.word); // So‘zni eshittirish

    updateStats();

    if (timeMode) startTimer();
}

// **Taymer boshlash**
function startTimer() {
    timeLeft = 15;
    document.getElementById("timer").innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            showCorrectAnswer();
        }
    }, 1000);
}

// **Enter bosilganda javobni tekshirish**
document.getElementById("answer").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});

// **Javobni tekshirish**
function checkAnswer() {
    const userAnswer = document.getElementById("answer").value.trim().toLowerCase();
    
    totalAttempts++; // Har bir javob urinishga qo‘shiladi

    if (userAnswer === currentWord.word) {
        correctAnswers++;
        document.getElementById("result").innerText = "✅ To‘g‘ri!";
        document.getElementById("result").style.color = "green";
        
        updateStats(); // Statistikani yangilash
        
        // Faqat to‘g‘ri javob yozilganda keyingi so‘zga o‘tish
        setTimeout(() => {
            loadWord();
        }, 1000);
    } else {
        attemptsLeft--;

        if (attemptsLeft > 0) {
            document.getElementById("result").innerText = `❌ Xato! Yana urinib ko‘ring (${attemptsLeft} ta imkoniyat qoldi)`;
            document.getElementById("result").style.color = "red";
        } else if (attemptsLeft === 0) {
            // 2 marta xato qilingandan keyin to‘g‘ri javobni ko‘rsatish
            document.getElementById("result").innerText = `ℹ️ To‘g‘ri javob: ${currentWord.word}`;
            document.getElementById("result").style.color = "blue";

            // To‘g‘ri javob yozilguncha foydalanuvchidan yana kiritish talab qilinadi
            document.getElementById("answer").value = "";
            attemptsLeft = -1; // Keyingi so‘zga o‘tish bloklanadi
        }

        updateStats(); // **Noto‘g‘ri javoblarni ham statistikaga qo‘shish**
    }
}

// **Statistikani yangilash**  
function updateStats() {
    let incorrectAnswers = totalAttempts - correctAnswers; // Noto‘g‘ri javoblar soni
    let percentage = totalAttempts > 0 ? ((correctAnswers / totalAttempts) * 100).toFixed(2) : 0;
    
    document.getElementById("attempts").innerText = totalAttempts; // Umumiy urinishlar soni
    document.getElementById("correct").innerText = correctAnswers; // To‘g‘ri javoblar
    document.getElementById("percentage").innerText = percentage + "%"; // To‘g‘ri javob foizi
}

// **Statistikani yangilash**
function updateStats() {
    let percentage = totalAttempts > 0 ? ((correctAnswers / totalAttempts) * 100).toFixed(2) : 0;
    document.getElementById("attempts").innerText = totalAttempts;
    document.getElementById("correct").innerText = correctAnswers;
    document.getElementById("percentage").innerText = percentage + "%";
}

// **So‘zning audio faylini o‘qib berish**
function playAudio(word) {
    if (audioCache[word]) {
        audioCache[word].play();
    } else {
        let savedAudio = localStorage.getItem(word);

        if (savedAudio) {
            let audio = new Audio(savedAudio);
            audioCache[word] = audio;
            audio.play();
        } else {
            responsiveVoice.speak(word, "UK English Male", {
                onend: function () {
                    saveAudio(word);
                }
            });
        }
    }
}

// **Audio faylni saqlash**
function saveAudio(word) {
    let audio = new Audio();
    let audioURL = `https://code.responsivevoice.org/getvoice.php?t=${word}&tl=en-GB&key=ftro4Sxr`;

    audio.src = audioURL;
    audioCache[word] = audio;

    // Local Storage-ga saqlash
    localStorage.setItem(word, audioURL);
}

// **Tasodifiy aralashtirish funksiyasi**
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// **Time Mode toggleni sozlash**
document.getElementById("toggleMode").addEventListener("click", function () {
    timeMode = !timeMode;
    const elements = document.getElementById("timeModeElements");

    if (timeMode) {
        elements.style.display = "block";
        this.innerText = "⏳ Time Mode: Yoqilgan";
    } else {
        elements.style.display = "none";
        this.innerText = "⏳ Time Mode: O‘chiq";
    }
});

// **Sahifa yuklanganda saqlangan audiolarni yuklash**
window.addEventListener("load", loadCachedAudio);

// **O‘yinni boshlash**
loadWord();