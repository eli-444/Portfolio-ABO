document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.querySelector(".toggle-btn");
    const techContent = document.querySelector(".tech-content");

    toggleBtn.addEventListener("click", function () {
        techContent.classList.toggle("active");
        toggleBtn.classList.toggle("active");
    });
});
