document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     ELEMENTS
  =============================== */

  const menuButton = document.getElementById("menuButton");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const menuPopup = document.getElementById("menuPopup");
  const contentPopup = document.getElementById("contentPopup");
  const popupContent = document.getElementById("popupContent");

  const closePopup = document.getElementById("closePopup");
  const closeContent = document.getElementById("closeContent");

  const helloBackdrop = document.getElementById("helloBackdrop");
  const helloClose = document.getElementById("helloClose");
  const letsTalk = document.getElementById("letsTalk");


  /* ===============================
     MENU
  =============================== */

  function openMenu() {
    if (!modalBackdrop) return;

    modalBackdrop.classList.add("show");

    if (menuPopup) {
      menuPopup.classList.add("active");
    }

    if (contentPopup) {
      contentPopup.classList.remove("active");
    }
  }

  function closeMenu() {
    if (!modalBackdrop) return;

    modalBackdrop.classList.remove("show");

    if (menuPopup) {
      menuPopup.classList.remove("active");
    }

    if (contentPopup) {
      contentPopup.classList.remove("active");
    }
  }


  if (menuButton) {
    menuButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openMenu();
    });
  }


  if (closePopup) {
    closePopup.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
    });
  }


  if (closeContent) {
    closeContent.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (contentPopup) {
        contentPopup.classList.remove("active");
      }

      if (menuPopup) {
        menuPopup.classList.add("active");
      }
    });
  }


  /* ===============================
     POPUP CONTENT
  =============================== */

  const popupData = {

    home: {
      title: "Home 🏠",
      text: `
        <p>
          Welcome to my little creative world ♡
        </p>

        <p>
          A soft place where ideas, memories,
          and little creations become stories.
        </p>
      `
    },

    works: {
      title: "My Works 🎨",
      text: `
        <p>
          A collection of things I've created
          along my creative journey.
        </p>

        <div class="popup-gallery">

          <img src="images/works-art.jpg" alt="My artwork">

          <img src="images/experiments-cake.jpg" alt="Creative experiment">

        </div>
      `
    },

    notes: {
      title: "Creative Notes ☁️",
      text: `
        <p>
          Little thoughts, ideas, inspirations,
          and random things that make me want to create.
        </p>

        <img
          class="popup-large-image"
          src="images/notes-vintage.jpg"
          alt="Creative notes"
        >
      `
    },

    experiments: {
      title: "Experiments 🪄",
      text: `
        <p>
          Sometimes I just want to try something new.
          No perfect plan — just curiosity.
        </p>

        <img
          class="popup-large-image"
          src="images/experiments-cake.jpg"
          alt="Creative experiment"
        >
      `
    },

    about: {
      title: "About Me 🌷",
      text: `
        <div class="about-popup">

          <img
            class="about-photo"
            src="images/hero-main.jpg"
            alt="NJA"
          >

          <div>
            <h3>NJA ✦</h3>

            <p>
              creative dreamer & maker
            </p>

            <p>
              ☁️ loves turning ideas into visuals
            </p>

            <p>
              ✦ always learning something new
            </p>

            <p>
              ♡ creating little things with big dreams
            </p>
          </div>

        </div>
      `
    },

    secret: {
      title: "Secret ✦",
      text: `
        <p>
          You found the little secret 👀♡
        </p>

        <p>
          Keep creating. Keep dreaming.
          Your little ideas matter.
        </p>
      `
    }

  };


  /* ===============================
     MENU ITEMS
  =============================== */

  const popupButtons = document.querySelectorAll(
    ".popup-nav [data-popup]"
  );


  popupButtons.forEach((button) => {

    button.addEventListener("click", (e) => {

      e.preventDefault();
      e.stopPropagation();

      const type = button.dataset.popup;

      console.log("Popup clicked:", type);

      /* Home langsung ke home */
      if (type === "home") {

        closeMenu();

        setTimeout(() => {
          document.getElementById("home")?.scrollIntoView({
            behavior: "smooth"
          });
        }, 100);

        return;
      }


      const data = popupData[type];

      if (!data || !popupContent) {
        console.log("Popup tidak ditemukan:", type);
        return;
      }


      popupContent.innerHTML = `
        <div class="popup-inner">

          <p class="popup-eyebrow">
            NJAcreative ✦
          </p>

          <h2>
            ${data.title}
          </h2>

          <div class="popup-body">
            ${data.text}
          </div>

        </div>
      `;


      /* Sembunyikan menu */
      if (menuPopup) {
        menuPopup.classList.remove("active");
      }


      /* Tampilkan content */
      if (contentPopup) {
        contentPopup.classList.add("active");
      }

    });

  });


  /* ===============================
     CLICK OUTSIDE
  =============================== */

  if (modalBackdrop) {

    modalBackdrop.addEventListener("click", (e) => {

      if (e.target === modalBackdrop) {
        closeMenu();
      }

    });

  }


  /* ===============================
     ESC
  =============================== */

  document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {
      closeMenu();

      if (helloBackdrop) {
        helloBackdrop.classList.remove("show");
      }
    }

  });


  /* ===============================
     LET'S TALK
  =============================== */

  if (letsTalk) {

    letsTalk.addEventListener("click", (e) => {

      e.preventDefault();

      if (helloBackdrop) {
        helloBackdrop.classList.add("show");
      }

    });

  }


  if (helloClose) {

    helloClose.addEventListener("click", () => {

      if (helloBackdrop) {
        helloBackdrop.classList.remove("show");
      }

    });

  }


  if (helloBackdrop) {

    helloBackdrop.addEventListener("click", (e) => {

      if (e.target === helloBackdrop) {
        helloBackdrop.classList.remove("show");
      }

    });

  }


  /* ===============================
     SLIDER
  =============================== */

  const slides = document.querySelectorAll(".slide");
  const next = document.getElementById("next");
  const prev = document.getElementById("prev");
  const dots = document.getElementById("dots");

  let currentSlide = 0;

  if (slides.length && dots) {

    slides.forEach((_, index) => {

      const dot = document.createElement("span");

      dot.className = "slider-dot";

      if (index === 0) {
        dot.classList.add("active");
      }

      dot.addEventListener("click", () => {
        showSlide(index);
      });

      dots.appendChild(dot);

    });

  }


  function showSlide(index) {

    if (!slides.length) return;

    currentSlide =
      (index + slides.length) % slides.length;


    slides.forEach((slide, i) => {

      slide.classList.toggle(
        "active",
        i === currentSlide
      );

    });


    const allDots =
      document.querySelectorAll(".slider-dot");


    allDots.forEach((dot, i) => {

      dot.classList.toggle(
        "active",
        i === currentSlide
      );

    });

  }


  if (next) {

    next.addEventListener("click", () => {
      showSlide(currentSlide + 1);
    });

  }


  if (prev) {

    prev.addEventListener("click", () => {
      showSlide(currentSlide - 1);
    });

  }


  /* ===============================
     AUTO SLIDER
  =============================== */

  setInterval(() => {

    if (slides.length) {
      showSlide(currentSlide + 1);
    }

  }, 5000);


  /* ===============================
     REVEAL
  =============================== */

  const revealElements =
    document.querySelectorAll(".reveal");


  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

          }

        });

      },
      {
        threshold: 0.15
      }
    );


  revealElements.forEach((element) => {
    observer.observe(element);
  });


  /* ===============================
     AUTO SCROLL DREAMY
  =============================== */

  let lastActivity = Date.now();
  let autoScrolling = false;
  let scrollFrame;


  function userActivity() {

    lastActivity = Date.now();

    if (autoScrolling) {
      autoScrolling = false;

      cancelAnimationFrame(scrollFrame);
    }

  }


  [
    "mousemove",
    "mousedown",
    "touchstart",
    "touchmove",
    "wheel",
    "keydown",
    "scroll"
  ].forEach((eventName) => {

    window.addEventListener(
      eventName,
      userActivity,
      { passive: true }
    );

  });


  function dreamyScroll() {

    if (!autoScrolling) return;


    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;


    if (window.scrollY >= maxScroll - 5) {

      autoScrolling = false;

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });


      setTimeout(() => {

        if (Date.now() - lastActivity >= 2000) {

          autoScrolling = true;
          scrollFrame = requestAnimationFrame(
            dreamyScroll
          );

        }

      }, 1200);

      return;

    }


    window.scrollBy({
      top: 0.35,
      behavior: "auto"
    });


    scrollFrame =
      requestAnimationFrame(dreamyScroll);

  }


  setInterval(() => {

    if (
      !autoScrolling &&
      Date.now() - lastActivity >= 2000
    ) {

      autoScrolling = true;

      scrollFrame =
        requestAnimationFrame(dreamyScroll);

    }

  }, 500);


  /* ===============================
     MUSIC
  =============================== */

  const audio =
    document.getElementById("audio");


  if (audio) {

    audio.loop = true;
    audio.preload = "auto";

    /*
      Browser biasanya memblokir autoplay
      dengan suara sebelum user berinteraksi.

      Jadi musik akan mencoba mulai setelah
      interaksi pertama pengunjung.
    */

    const startMusic = async () => {

      try {

        await audio.play();

      } catch (error) {

        console.log(
          "Music autoplay menunggu interaksi."
        );

      }

      window.removeEventListener(
        "click",
        startMusic
      );

      window.removeEventListener(
        "touchstart",
        startMusic
      );

    };


    window.addEventListener(
      "click",
      startMusic,
      { once: true }
    );

    window.addEventListener(
      "touchstart",
      startMusic,
      { once: true }
    );

  }


  /* ===============================
     CUSTOM CURSOR
  =============================== */

  const cursorDot =
    document.getElementById("cursorDot");

  const cursorRing =
    document.getElementById("cursorRing");


  document.addEventListener(
    "mousemove",
    (e) => {

      if (cursorDot) {

        cursorDot.style.left =
          `${e.clientX}px`;

        cursorDot.style.top =
          `${e.clientY}px`;

      }


      if (cursorRing) {

        cursorRing.style.left =
          `${e.clientX}px`;

        cursorRing.style.top =
          `${e.clientY}px`;

      }

    }
  );


});
