document.addEventListener("DOMContentLoaded", function () {
    const sliderItems = document.querySelectorAll(".slider--item");
    let currentIndex = 0;

    function updateSlider() {
        sliderItems.forEach((item, index) => {
            item.classList.remove("slider--item-center", "slider--item-left", "slider--item-right");
            item.style.opacity = "0";

            if (index === currentIndex) {
                item.classList.add("slider--item-center");
                item.style.opacity = "1";
            } else if (index === (currentIndex - 1 + sliderItems.length) % sliderItems.length) {
                item.classList.add("slider--item-left");
                item.style.opacity = "0.5";
            } else if (index === (currentIndex + 1) % sliderItems.length) {
                item.classList.add("slider--item-right");
                item.style.opacity = "0.5";
            }
        });
    }

    document.querySelector(".slider--prev").addEventListener("click", function () {
        currentIndex = (currentIndex - 1 + sliderItems.length) % sliderItems.length;
        updateSlider();
    });

    document.querySelector(".slider--next").addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % sliderItems.length;
        updateSlider();
    });

    updateSlider();
});
