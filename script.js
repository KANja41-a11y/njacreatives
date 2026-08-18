document.addEventListener("DOMContentLoaded", () => {

  /* ================= SLIDER ================= */

  const slides = [
    ...document.querySelectorAll(".slide")
  ];

  const dots = document.getElementById("dots");

  let current = 0;

  slides.forEach((_, i) => {

    const dot = document.createElement("span");

    dot.className =
      "dot" + (i === 0 ? " active" : "");

    dot.onclick = () => {
      showSlide(i);
    };

    dots.appendChild(dot);

  });


  function showSlide(index) {

    if (!slides.length) return;

    current =
      (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {

      slide.classList.toggle(
        "active",
        i === current
      );

    });


    [...dots.children].forEach((dot, i) => {

      dot.classList.toggle(
        "active",
        i === current
      );

    });

  }


  const nextButton =
    document.getElementById("next");

  const prevButton =
    document.getElementById("prev");


  if (nextButton) {

    nextButton.onclick = () => {
      showSlide(current + 1);
    };

  }


  if (prevButton) {

    prevButton.onclick = () => {
      showSlide(current - 1);
    };

  }


  setInterval(() => {

    showSlide(current + 1);

  }, 5000);



  /* ================= POPUP MENU ================= */

  const backdrop =
    document.getElementById("modalBackdrop");

  const menuButton =
    document.getElementById("menuButton");

  const menuPopup =
    document.getElementById("menuPopup");

  const contentPopup =
    document.getElementById("contentPopup");

  const content =
    document.getElementById("popupContent");


  if (menuButton) {

    menuButton.onclick = () => {

      backdrop.classList.add("open");

      menuPopup.style.display = "block";

      contentPopup.classList.remove("open");

    };

  }


  const closePopup =
    document.getElementById("closePopup");


  if (closePopup) {

    closePopup.onclick = () => {

      backdrop.classList.remove("open");

    };

  }


  const closeContent =
    document.getElementById("closeContent");


  if (closeContent) {

    closeContent.onclick = () => {

      contentPopup.classList.remove("open");

    };

  }


  if (backdrop) {

    backdrop.onclick = (e) => {

      if (e.target === backdrop) {

        backdrop.classList.remove("open");

      }

    };

  }



  /* ================= POPUP CONTENT ================= */

  const popupData = {

    home: {

      title: "Welcome home ✦",

      text:
        "A tiny corner for my ideas, memories, and creative chaos. Stay awhile ♡"

    },


    works: {

      title: "My Works 🎨",

      html: `

        <div class="works-list">

          <div class="work-pill">
            🎨 Graphic Design
          </div>

          <div class="work-pill">
            📸 Photography
          </div>

          <div class="work-pill">
            🎬 Video
          </div>

          <div class="work-pill">
            💻 Web Design
          </div>

        </div>

      `

    },


    notes: {

      title: "Creative Notes 💭",

      html: `

        <div class="sticky">

          <strong>
            Today's idea ✦
          </strong>

          <br><br>

          <em>
            Create something
            that feels like you.
          </em>

          <br><br>

          — little reminder
          from NJA

        </div>

      `

    },


    experiments: {

      title: "Little Experiments 🪄",

      html: `

        <p class="popup-content-text">

          A scrapbook of random ideas,
          visual tests & things I made
          just because I was curious.

        </p>

        <div class="scrapbook">

          <img
            src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80"
            alt="Creative experiment"
          >

          <img
            src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=600&q=80"
            alt="Art experiment"
          >

        </div>

      `

    },


    about: {

      title: "About Me 🌷",

      html: `

        <div class="profile">

          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
            alt="Profile"
          >

          <div>

            <strong>
              NJA ✦
            </strong>

            <p class="popup-content-text">
              creative dreamer & maker
            </p>

          </div>

        </div>


        <div class="funfacts">

          ☁️ loves turning ideas into visuals
          <br>

          🎀 collects tiny inspirations
          <br>

          ✦ learning, creating, becoming

        </div>

      `

    },


    secret: {

      title: "pssst... 👀",

      html: `

        <div class="sticky">

          <strong>
            Secret message ✦
          </strong>

          <br><br>

          “You don't need to have it
          all figured out.

          Just make the next little thing.”

          ♡

        </div>

      `

    }

  };


  document
    .querySelectorAll("[data-popup]")
    .forEach(button => {

      button.onclick = () => {

        const item =
          popupData[
            button.dataset.popup
          ];


        if (!item) return;


        content.innerHTML = `

          <h2 class="popup-content-title">

            ${item.title}

          </h2>

          ${
            item.html ||
            `<p class="popup-content-text">
              ${item.text}
            </p>`
          }

        `;


        contentPopup.classList.add("open");

      };

    });



  /* ================= JOURNEY BUTTON ================= */

  const journeyButton =
    document.querySelector(
      '[data-open="journey"]'
    );


  if (journeyButton) {

    journeyButton.onclick = () => {

      document
        .getElementById("journey")
        .scrollIntoView({
          behavior: "smooth"
        });

    };

  }
  
  /* ================= AUTO MUSIC ================= */

const audio = document.getElementById("audio");

if (audio) {

  audio.volume = 0.45;

  const startMusic = () => {

    audio.play().catch(() => {});

    document.removeEventListener("click", startMusic);
    document.removeEventListener("touchstart", startMusic);

  };

  document.addEventListener("click", startMusic);
  document.addEventListener("touchstart", startMusic);

}
  /* ================= CUSTOM CURSOR ================= */

  const cursorDot =
    document.getElementById("cursorDot");

  const cursorRing =
    document.getElementById("cursorRing");


  if (cursorDot && cursorRing) {

    window.addEventListener(
      "mousemove",
      (e) => {

        cursorDot.style.left =
          e.clientX + "px";

        cursorDot.style.top =
          e.clientY + "px";


        cursorRing.style.left =
          e.clientX + "px";

        cursorRing.style.top =
          e.clientY + "px";

      }
    );


    document
      .querySelectorAll("a, button")
      .forEach(element => {

        element.addEventListener(
          "mouseenter",
          () => {

            cursorRing.style.width =
              "44px";

            cursorRing.style.height =
              "44px";

            cursorRing.style.borderColor =
              "var(--purple)";

          }
        );


        element.addEventListener(
          "mouseleave",
          () => {

            cursorRing.style.width =
              "30px";

            cursorRing.style.height =
              "30px";

            cursorRing.style.borderColor =
              "var(--pink)";

          }
        );

      });

  }



  /* ================= SCROLL REVEAL ================= */

  const observer =
    new IntersectionObserver(

      entries => {

        entries.forEach(entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target
              .classList
              .add("show");

          }

        });

      },

      {
        threshold: 0.12
      }

    );


  document
    .querySelectorAll(".reveal")
    .forEach(element => {

      observer.observe(element);

    });



  /* ================= SPARKLE ================= */

  setInterval(() => {

    const sparkle =
      document.createElement("span");


    sparkle.className =
      "sparkle";


    sparkle.textContent =
      Math.random() > 0.5
        ? "✦"
        : "✧";


    sparkle.style.left =
      Math.random() * 100 + "vw";


    sparkle.style.top =
      Math.random() * 100 + "vh";


    document.body.appendChild(
      sparkle
    );


    setTimeout(() => {

      sparkle.remove();

    }, 1200);

  }, 650);



  /* ================= LET'S TALK ================= */

  const letsTalk =
    document.getElementById("letsTalk");

  const helloBackdrop =
    document.getElementById("helloBackdrop");

  const helloClose =
    document.getElementById("helloClose");


  if (letsTalk && helloBackdrop) {

    letsTalk.addEventListener(
      "click",
      (e) => {

        e.preventDefault();

        helloBackdrop.classList.add("show");

      }
    );

  }


  if (helloClose && helloBackdrop) {

    helloClose.addEventListener(
      "click",
      () => {

        helloBackdrop.classList.remove(
          "show"
        );

      }
    );

  }


  if (helloBackdrop) {

    helloBackdrop.addEventListener(
      "click",
      (e) => {

        if (
          e.target === helloBackdrop
        ) {

          helloBackdrop.classList.remove(
            "show"
          );

        }

      }
    );

  }

});
/* ================= DREAMY AUTO SCROLL ================= */

let dreamyTimer = null;
let dreamyAnimation = null;
let dreamyRunning = false;
let goingToTop = false;

const IDLE_TIME = 2000; // 2 detik
const MIN_SPEED = 0.35;
const MAX_SPEED = 1.15;


/* ================= TIMER ================= */

function startDreamyTimer() {

  clearTimeout(dreamyTimer);

  dreamyTimer = setTimeout(() => {

    if (!goingToTop) {
      startDreamyScroll();
    }

  }, IDLE_TIME);

}


/* ================= START SCROLL ================= */

function startDreamyScroll() {

  if (dreamyRunning || goingToTop) return;

  dreamyRunning = true;

  dreamyAnimation =
    requestAnimationFrame(dreamyStep);

}


/* ================= DREAMY MOVEMENT ================= */

function dreamyStep(time) {

  if (!dreamyRunning) return;

  const current =
    window.scrollY;

  const pageHeight =
    document.documentElement.scrollHeight;

  const screenHeight =
    window.innerHeight;

  const maxScroll =
    pageHeight - screenHeight;


  /* Kalau halaman pendek, tidak perlu scroll */

  if (maxScroll <= 5) {

    dreamyRunning = false;

    return;

  }


  /* ================= BOTTOM ================= */

  if (current >= maxScroll - 3) {

    dreamyRunning = false;

    cancelAnimationFrame(
      dreamyAnimation
    );

    scrollBackToTop();

    return;

  }


  /* ================= FLOATING SPEED ================= */

  const floating =
    (Math.sin(time * 0.0015) + 1) / 2;


  const speed =
    MIN_SPEED +
    (MAX_SPEED - MIN_SPEED) *
    floating;


  window.scrollBy(
    0,
    speed
  );


  dreamyAnimation =
    requestAnimationFrame(
      dreamyStep
    );

}


/* ================= RETURN TO TOP ================= */

function scrollBackToTop() {

  goingToTop = true;

  const startPosition =
    window.scrollY;

  const duration = 700;

  const startTime =
    performance.now();


  function animateTop(currentTime) {

    const elapsed =
      currentTime - startTime;

    const progress =
      Math.min(
        elapsed / duration,
        1
      );


    /* smooth easing */

    const eased =
      1 -
      Math.pow(
        1 - progress,
        3
      );


    window.scrollTo(
      0,
      startPosition * (1 - eased)
    );


    if (progress < 1) {

      requestAnimationFrame(
        animateTop
      );

    } else {

      window.scrollTo(
        0,
        0
      );

      goingToTop = false;

      startDreamyTimer();

    }

  }


  requestAnimationFrame(
    animateTop
  );

}


/* ================= USER ACTIVITY ================= */

function stopDreamyScroll() {

  /*
    Kalau user sedang scroll,
    klik, touch, atau tekan keyboard,
    auto-scroll berhenti.
  */

  if (dreamyRunning) {

    dreamyRunning = false;

    cancelAnimationFrame(
      dreamyAnimation
    );

  }


  if (goingToTop) return;


  startDreamyTimer();

}


/* ================= USER ACTIONS ================= */

/*
  TIDAK menggunakan mousemove
  supaya custom cursor kamu
  tidak terus mereset timer.
*/

window.addEventListener(
  "wheel",
  stopDreamyScroll,
  { passive: true }
);

window.addEventListener(
  "mousedown",
  stopDreamyScroll
);

window.addEventListener(
  "touchstart",
  stopDreamyScroll,
  { passive: true }
);

window.addEventListener(
  "touchmove",
  stopDreamyScroll,
  { passive: true }
);

window.addEventListener(
  "keydown",
  stopDreamyScroll
);


/* ================= START ================= */

startDreamyTimer();
