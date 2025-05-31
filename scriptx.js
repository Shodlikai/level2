// Modal oynani chaqirish uchun o‘zgaruvchilar
const modal = document.getElementById("modal");
const option1Btn = document.getElementById("option1-btn");
const option2Btn = document.getElementById("option2-btn");
const closeBtn = document.getElementById("close-btn");

let selectedLesson = 1; // Foydalanuvchi tanlagan dars raqami

// Tugma bosilganda modal oynani ochish
function showOptions(lessonNumber) {
    selectedLesson = lessonNumber; // Tanlangan darsni saqlash
    modal.style.display = "flex";  // Modal oynani ko‘rsatish

    // Har bir dars uchun kerakli sahifalarni o'rnatish
    option1Btn.onclick = function() {
    window.location.href = `index${selectedLesson}.html`; // Fleshcard uchun
};

option2Btn.onclick = function() {
    window.location.href = `index-${selectedLesson}.html`; // Word uchun
};
}

// Modalni yopish tugmasi
closeBtn.addEventListener("click", function() {
    modal.style.display = "none";
});
function showDasturchi() {
    window.location.href = "dastur.html"; // Dastur sahifasiga yo‘naltirish
}