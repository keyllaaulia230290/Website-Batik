// ====================
// LOADING
// ====================
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.classList.add("hide");
    startCounters();
    initInfiniteSlider();
  }, 1800);
});


// ====================
// COUNTER
// ====================
function startCounters() {
  const counters = document.querySelectorAll(".counter");

  counters.forEach(counter => {
    const target = +counter.dataset.target;
    let count = 0;
    const increment = target / 100;

    function update() {
      count += increment;

      if (count < target) {
        if (target === 49) {
          counter.innerText = (count / 10).toFixed(1);
        } else {
          counter.innerText = Math.floor(count);
        }
        requestAnimationFrame(update);
      } else {
        if (target === 49) counter.innerText = "4.9";
        else if (target === 5000) counter.innerText = "5000+";
        else counter.innerText = target;
      }
    }

    update();
  });
}


// ====================
// INFINITE PRODUCT SLIDER
// ====================
function initInfiniteSlider() {
  const slider = document.getElementById("productSlider");

  if (!slider) return;

  const cards = slider.querySelectorAll(".product-card");
  const cardWidth = cards[0].offsetWidth + 18; // width + gap
  const originalSetWidth = (cards.length / 2) * cardWidth;

  // mulai dari tengah (set kedua)
  slider.scrollLeft = originalSetWidth;

  slider.addEventListener("scroll", () => {
    if (slider.scrollLeft <= 0) {
      slider.scrollLeft += originalSetWidth;
    }

    if (slider.scrollLeft >= originalSetWidth * 2) {
      slider.scrollLeft -= originalSetWidth;
    }
  });
}