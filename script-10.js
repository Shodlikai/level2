const words = [
  { word: "incredibly", pronunciation: "ɪnˈkrɛdəbli", translation: "ishonish qiyin, aqlga sig'maydigan" },
  { word: "trendy", pronunciation: "ˈtrɛndi", translation: "urf bo‘lgan, ommalashgan" },
  { word: "matter", pronunciation: "ˈmætər", translation: "ahamiyati bo‘lmoq, qizig‘i bo‘lmoq" },
  { word: "legend", pronunciation: "ˈlɛʤənd", translation: "afsona" },
  { word: "invention", pronunciation: "ɪnˈvɛnʃən", translation: "ixtiro, kashfiyot" },
  { word: "stay on", pronunciation: "steɪ ɒn", translation: "ko‘proq qolmoq, uzoqroq qolmoq" },
  { word: "continental", pronunciation: "ˌkɒntɪˈnɛntl", translation: "qitaga doir, qita" },
  { word: "the rest", pronunciation: "ðə rɛst", translation: "qolgan qismi, qolgani" },
  { word: "union", pronunciation: "ˈjuːniən", translation: "ittifoq, birlik" },
  { word: "litre", pronunciation: "ˈliːtər", translation: "litr" },
  { word: "takeaway", pronunciation: "ˈteɪkəˌweɪ", translation: "olib ketish uchun tayyorlangan taom" },
  { word: "series", pronunciation: "ˈsɪəriːz", translation: "serial, bir necha qismli film" },
  { word: "wool", pronunciation: "wʊl", translation: "jun, yung" },
  { word: "inhabitant", pronunciation: "ɪnˈhæbɪtənt", translation: "yashovchi, istiqomat qiluvchi" },
  { word: "habitation", pronunciation: "ˌhæbɪˈteɪʃən", translation: "maskan, turar joy" },
  { word: "misty", pronunciation: "ˈmɪsti", translation: "tumanli" },
  { word: "haunted", pronunciation: "ˈhɔːntɪd", translation: "arvohlar kezib yuradigan" },
  { word: "occasion", pronunciation: "əˈkeɪʒən", translation: "tadbir, marosim" },
  { word: "ceremony", pronunciation: "ˈsɛrɪməni", translation: "marosim, tadbir" },
  { word: "counterpart", pronunciation: "ˈkaʊntəpɑːt", translation: "hamkasb, sherik" },
  { word: "unemployment", pronunciation: "ˌʌnɪmˈplɔɪmənt", translation: "ishsizlik" },
  { word: "prospect", pronunciation: "ˈprɒspɛkt", translation: "istiqbol kelajak" },
  { word: "hostel", pronunciation: "ˈhɒstəl", translation: "yotoqxona" },
  { word: "hospitality", pronunciation: "ˌhɒspɪˈtælɪti", translation: "mehmondo‘stlik" },
  { word: "obtain", pronunciation: "əbˈteɪn", translation: "erishmoq, qo‘lga kiritmoq" },
  { word: "grade", pronunciation: "ɡreɪd", translation: "baho" },
  { word: "opportunity", pronunciation: "ˌɒpəˈtjuːnɪti", translation: "imkoniyat, fursat" },
  { word: "lifestyle", pronunciation: "ˈlaɪfstaɪl", translation: "hayot tarzi, yashash tarzi" },
  { word: "nightlife", pronunciation: "ˈnaɪtˌlaɪf", translation: "tungi hayot" },
  { word: "isolated", pronunciation: "ˈaɪsəleɪtɪd", translation: "alohida, boshqalardan" }
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