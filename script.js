document.addEventListener("DOMContentLoaded", () => {

  /* ================= SLIDER ================= */

  const slides = [...document.querySelectorAll(".slide")];
  const dots = document.getElementById("dots");

  let current = 0;

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

  slides.forEach((_, i) => {

    const dot = document.createElement("span");

    dot.className =
      "dot" + (i === 0 ? " active" : "");

    dot.addEventListener("click", () => {
      showSlide(i);
      resetActivity();
    });

    dots.appendChild(dot);

  });

  document.getElementById("next")
    ?.addEventListener("click", () => {
      showSlide(current + 1);
      resetActivity();
    });

  document.getElementById("prev")
    ?.addEventListener("click", () => {
      showSlide(current - 1);
      resetActivity();
    });

  setInterval(() => {
    showSlide(current + 1);
  }, 5000);


  /* ================= POPUP MENU ================= */

const backdrop = document.getElementById("modalBackdrop");
const menuButton = document.getElementById("menuButton");
const menuPopup = document.getElementById("menuPopup");
const contentPopup = document.getElementById("contentPopup");

const closePopup = document.getElementById("closePopup");
const closeContent = document.getElementById("closeContent");


/* OPEN MENU */

if (menuButton && backdrop && menuPopup) {

  menuButton.addEventListener("click", (e) => {

    e.preventDefault();
    e.stopPropagation();

    stopAutoScroll();

    backdrop.classList.add("open");

    menuPopup.style.display = "block";

    if (contentPopup) {
      contentPopup.classList.remove("open");
    }

  });

}


/* CLOSE MENU */

if (closePopup) {

  closePopup.addEventListener("click", (e) => {

    e.preventDefault();
    e.stopPropagation();

    backdrop.classList.remove("open");

    if (contentPopup) {
      contentPopup.classList.remove("open");
    }

    resetActivity();

  });

}


/* CLOSE CONTENT */

if (closeContent) {

  closeContent.addEventListener("click", (e) => {

    e.preventDefault();
    e.stopPropagation();

    if (contentPopup) {
      contentPopup.classList.remove("open");
    }

    backdrop.classList.remove("open");

    resetActivity();

  });

}


/* CLICK OUTSIDE POPUP */

if (backdrop) {

  backdrop.addEventListener("click", (e) => {

    if (e.target === backdrop) {

      backdrop.classList.remove("open");

      if (contentPopup) {
        contentPopup.classList.remove("open");
      }

      resetActivity();

    }

  });

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

          — little reminder from NJA

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
            alt="Art"
          >

          <img
            src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=600&q=80"
            alt="Painting"
          >

        </div>
      `
    },

   about: {
  title: "About Me 🌷",

  html: `
    <div class="profile">

    <img
  src="images/about-me.jpg"
  alt="NJA"
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

      ✦ loves turning ideas into visuals
      <br>

      ✦ collects tiny inspirations
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

      button.addEventListener("click", () => {

        const item =
          popupData[button.dataset.popup];

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

      });

    });


  /* ================= JOURNEY BUTTON ================= */

  document
    .querySelector('[data-open="journey"]')
    ?.addEventListener("click", () => {

      document
        .getElementById("journey")
        ?.scrollIntoView({
          behavior: "smooth"
        });

      resetActivity();

    });


  /* ================= MUSIC ================= */

  const audio =
    document.getElementById("audio");

  /*
    Lagu berada di:

    music/
      cozy-jazz.mp3

    Browser modern biasanya memblokir
    autoplay dengan suara sebelum user
    berinteraksi.

    Jadi kita coba autoplay.
    Kalau browser memblokir, musik akan
    dimulai setelah user melakukan klik/touch.
  */

  audio.volume = 0.45;
  audio.loop = true;

  let musicStarted = false;

  async function startMusic() {

    if (musicStarted) return;

    try {

      await audio.play();

      musicStarted = true;

    } catch (error) {

      console.log(
        "Autoplay menunggu interaksi user."
      );

    }

  }

  startMusic();

  const unlockMusic = () => {

    startMusic();

    if (musicStarted) {

      window.removeEventListener(
        "click",
        unlockMusic
      );

      window.removeEventListener(
        "touchstart",
        unlockMusic
      );

    }

  };

  window.addEventListener(
    "click",
    unlockMusic,
    { passive: true }
  );

  window.addEventListener(
    "touchstart",
    unlockMusic,
    { passive: true }
  );


  /* ================= LET'S TALK ================= */

  const letsTalk =
    document.getElementById("letsTalk");

  const helloBackdrop =
    document.getElementById("helloBackdrop");

  const helloClose =
    document.getElementById("helloClose");

  letsTalk?.addEventListener("click", (e) => {

    e.preventDefault();

    helloBackdrop.classList.add("show");

    stopAutoScroll();

  });

  helloClose?.addEventListener("click", () => {

    helloBackdrop.classList.remove("show");

    resetActivity();

  });

  helloBackdrop?.addEventListener("click", (e) => {

    if (e.target === helloBackdrop) {

      helloBackdrop.classList.remove("show");

      resetActivity();

    }

  });


  /* ================= CUSTOM CURSOR ================= */

  const cursorDot =
    document.getElementById("cursorDot");

  const cursorRing =
    document.getElementById("cursorRing");

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


  /* ================= SCROLL REVEAL ================= */

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

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


  /* ================= SPARKLES ================= */

  setInterval(() => {

    const sparkle =
      document.createElement("span");

    sparkle.className = "sparkle";

    sparkle.textContent =
      Math.random() > .5
        ? "✦"
        : "✧";

    sparkle.style.left =
      Math.random() * 100 + "vw";

    sparkle.style.top =
      Math.random() * 100 + "vh";

    document.body.appendChild(sparkle);

    setTimeout(() => {

      sparkle.remove();

    }, 1200);

  }, 650);


  /* ==================================================
     DREAMY AUTO SCROLL
     ================================================== */

  let autoScrollTimer = null;
  let autoScrollFrame = null;

  let lastActivity =
    Date.now();

  let isAutoScrolling = false;
  let isResetting = false;

  const IDLE_TIME = 2000;

  /*
    Kecepatan dasar.
    Angka kecil = lebih pelan.
  */
  const BASE_SPEED = 0.55;


  function stopAutoScroll() {

    isAutoScrolling = false;

    if (autoScrollFrame) {

      cancelAnimationFrame(
        autoScrollFrame
      );

      autoScrollFrame = null;

    }

  }


  function dreamyScroll() {

    if (!isAutoScrolling) return;

    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const currentScroll =
      window.scrollY;

    /*
      Kalau sudah sampai bawah,
      naik cepat dengan efek smooth.
    */

    if (
      currentScroll >= maxScroll - 3
      && !isResetting
    ) {

      isResetting = true;

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      setTimeout(() => {

        isResetting = false;

        if (
          Date.now() - lastActivity
          >= IDLE_TIME
        ) {

          isAutoScrolling = true;

          autoScrollFrame =
            requestAnimationFrame(
              dreamyScroll
            );

        }

      }, 1000);

      return;
    }


    /*
      Floating / dreamy movement.
    */

    const wave =
      Math.sin(Date.now() / 900) * 0.12;

    const speed =
      BASE_SPEED + wave;

    window.scrollBy(
      0,
      Math.max(0.15, speed)
    );


    autoScrollFrame =
      requestAnimationFrame(
        dreamyScroll
      );

  }


  function startAutoScroll() {

    if (
      isAutoScrolling ||
      isResetting
    ) return;

    if (
      document.querySelector(
        ".modal-backdrop.open"
      ) ||
      document.querySelector(
        ".hello-backdrop.show"
      )
    ) return;

    isAutoScrolling = true;

    autoScrollFrame =
      requestAnimationFrame(
        dreamyScroll
      );

  }


  function resetActivity() {

    lastActivity =
      Date.now();

    stopAutoScroll();

    clearTimeout(
      autoScrollTimer
    );

    autoScrollTimer =
      setTimeout(() => {

        startAutoScroll();

      }, IDLE_TIME);

  }


  /*
    User interaction:
    mouse, touch, keyboard, wheel.
  */

  [
    "mousemove",
    "mousedown",
    "wheel",
    "touchstart",
    "touchmove",
    "keydown"
  ].forEach(eventName => {

    window.addEventListener(
      eventName,
      resetActivity,
      {
        passive: true
      }
    );

  });


  /*
    Mulai menghitung 2 detik
    sejak halaman dibuka.
  */

  resetActivity();


});
