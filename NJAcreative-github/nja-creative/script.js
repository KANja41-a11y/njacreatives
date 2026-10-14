document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     SLIDER
  ===================================================== */

  const slides = [...document.querySelectorAll(".slide")];
  const dots = document.getElementById("dots");
  const nextButton = document.getElementById("next");
  const prevButton = document.getElementById("prev");

  let current = 0;

  function showSlide(index) {

    if (!slides.length) return;

    current = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === current);
    });

    if (dots) {
      [...dots.children].forEach((dot, i) => {
        dot.classList.toggle("active", i === current);
      });
    }
  }

  if (dots) {

    slides.forEach((_, i) => {

      const dot = document.createElement("span");

      dot.className = "dot" + (i === 0 ? " active" : "");

      dot.addEventListener("click", () => {
        showSlide(i);
        resetActivity();
      });

      dots.appendChild(dot);
    });
  }

  nextButton?.addEventListener("click", () => {
    showSlide(current + 1);
    resetActivity();
  });

  prevButton?.addEventListener("click", () => {
    showSlide(current - 1);
    resetActivity();
  });

  setInterval(() => {
    showSlide(current + 1);
  }, 5000);


  /* =====================================================
     MENU + CONTENT POPUP
  ===================================================== */

  const backdrop = document.getElementById("modalBackdrop");
  const menuButton = document.getElementById("menuButton");
  const menuPopup = document.getElementById("menuPopup");
  const contentPopup = document.getElementById("contentPopup");

  const closePopup = document.getElementById("closePopup");
  const closeContent = document.getElementById("closeContent");
  const popupContent = document.getElementById("popupContent");


  function openMenu() {

    if (!backdrop || !menuPopup) return;

    backdrop.classList.add("open");

    menuPopup.style.display = "block";

    if (contentPopup) {
      contentPopup.classList.remove("open");
    }

    resetActivity();
  }


  function closeAllPopups() {

    if (!backdrop) return;

    backdrop.classList.remove("open");

    if (contentPopup) {
      contentPopup.classList.remove("open");
    }

    if (menuPopup) {
      menuPopup.style.display = "block";
    }

    stopSongPlayers();

    resetActivity();
  }


  menuButton?.addEventListener("click", (e) => {

    e.preventDefault();
    e.stopPropagation();

    openMenu();
  });


  closePopup?.addEventListener("click", (e) => {

    e.preventDefault();
    e.stopPropagation();

    closeAllPopups();
  });


  /*
    X CONTENT:
    hanya menutup isi,
    MENU TETAP TERBUKA.
  */

  closeContent?.addEventListener("click", (e) => {

    e.preventDefault();
    e.stopPropagation();

    if (contentPopup) {
      contentPopup.classList.remove("open");
    }

    stopSongPlayers();

    resetActivity();
  });


  /* =====================================================
     POPUP DATA
  ===================================================== */

  const popupData = {

    home: {
      title: "Welcome Home ✦",
      html: `
        <p class="popup-content-text">
          A tiny corner for my ideas, memories,
          creative chaos, and little things
          that make me happy. ♡
        </p>
      `
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
            🎬 Video & Creative Content
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
            Today's little thought ✦
          </strong>

          <br><br>

          <em>
            Create something
            that feels like you.
          </em>

          <br><br>

          — little reminder from NJA ♡

        </div>
      `
    },


    songs: {
      title: "My Songs 🎵",

      html: `
        <div class="songs-list">

          <div class="song-item">

            <button
              class="song-play"
              data-song="song1"
              type="button"
            >
              ▶
            </button>

            <div class="song-info">
              <strong>(name)</strong>
              <small>my little song ♡</small>
            </div>

            <span class="song-note">♫</span>

            <audio
              class="song-audio"
              data-audio="song1"
              src="music/song-1.mp3"
              preload="metadata"
            ></audio>

          </div>


          <div class="song-item">

            <button
              class="song-play"
              data-song="song2"
              type="button"
            >
              ▶
            </button>

            <div class="song-info">
              <strong>(name)</strong>
              <small>my little song ♡</small>
            </div>

            <span class="song-note">♫</span>

            <audio
              class="song-audio"
              data-audio="song2"
              src="music/song-2.mp3"
              preload="metadata"
            ></audio>

          </div>


          <div class="song-item">

            <button
              class="song-play"
              data-song="song3"
              type="button"
            >
              ▶
            </button>

            <div class="song-info">
              <strong>(name)</strong>
              <small>my little song ♡</small>
            </div>

            <span class="song-note">♫</span>

            <audio
              class="song-audio"
              data-audio="song3"
              src="music/song-3.mp3"
              preload="metadata"
            ></audio>

          </div>

        </div>

        <p class="songs-message">
          everyone can make a music by self ♡
        </p>
      `
    },


    experiments: {
      title: "Little Experiments 🪄",

      html: `
        <p class="popup-content-text">
          A scrapbook of random ideas,
          visual experiments, and things
          I created just because I was curious. ♡
        </p>

        <div class="scrapbook">

          <img
            src="images/works-art.jpg"
            alt="Creative experiment"
          >

          <img
            src="images/experiments-cake.jpg"
            alt="Creative experiment"
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
          <br>

          ✦ always dreaming up something new

        </div>
      `
    },


    secret: {
      title: "Pssst... 👀",

      html: `
        <div class="sticky">

          <strong>
            Secret message ✦
          </strong>

          <br><br>

          “You don't need to have it
          all figured out.

          Just make the next little thing.”

          <br><br>

          ♡

        </div>
      `
    }

  };


  /* =====================================================
     SONG PLAYER
  ===================================================== */

  let currentSong = null;


  function setupSongPlayers() {

    const buttons =
      popupContent?.querySelectorAll(".song-play") || [];

    const audios =
      popupContent?.querySelectorAll(".song-audio") || [];


    buttons.forEach(button => {

      button.addEventListener("click", async (e) => {

        e.preventDefault();
        e.stopPropagation();

        const songId = button.dataset.song;

        const audio =
          popupContent.querySelector(
            `.song-audio[data-audio="${songId}"]`
          );

        if (!audio) return;


        /* PAUSE */

        if (currentSong === audio && !audio.paused) {

          audio.pause();

          button.textContent = "▶";

          button
            .closest(".song-item")
            ?.classList.remove("playing");

          return;
        }


        /* STOP LAGU LAIN */

        audios.forEach(otherAudio => {

          if (otherAudio !== audio) {

            otherAudio.pause();
            otherAudio.currentTime = 0;

            const otherButton =
              popupContent.querySelector(
                `.song-play[data-song="${otherAudio.dataset.audio}"]`
              );

            if (otherButton) {
              otherButton.textContent = "▶";
            }

            otherAudio
              .closest(".song-item")
              ?.classList.remove("playing");
          }

        });


        try {

          await audio.play();

          currentSong = audio;

          button.textContent = "Ⅱ";

          button
            .closest(".song-item")
            ?.classList.add("playing");

        } catch (error) {

          console.log("Lagu tidak bisa dimainkan:", error);

        }


        audio.onended = () => {

          button.textContent = "▶";

          button
            .closest(".song-item")
            ?.classList.remove("playing");

          currentSong = null;

        };

      });

    });
  }


  function stopSongPlayers() {

    if (!popupContent) return;

    popupContent
      .querySelectorAll(".song-audio")
      .forEach(audio => {

        audio.pause();
        audio.currentTime = 0;

      });

    currentSong = null;
  }


  /* =====================================================
     MENU BUTTONS
  ===================================================== */

  document
    .querySelectorAll("[data-popup]")
    .forEach(button => {

      button.addEventListener("click", (e) => {

        e.preventDefault();
        e.stopPropagation();

        const key = button.dataset.popup;
        const item = popupData[key];

        if (!item || !popupContent || !contentPopup) {
          return;
        }


        /* ISI CONTENT */

        popupContent.innerHTML = `
          <h2 class="popup-content-title">
            ${item.title}
          </h2>

          ${item.html}
        `;


        /*
          MENU TETAP ADA.
          CONTENT MUNCUL DI SEBELAH.
        */

        menuPopup.style.display = "block";

        contentPopup.classList.add("open");


        /*
          Kalau yang dibuka My Songs,
          pasang player setelah HTML dibuat.
        */

        if (key === "songs") {
          setupSongPlayers();
        }


        resetActivity();

      });

    });


  /* =====================================================
     CLICK OUTSIDE
  ===================================================== */

  backdrop?.addEventListener("click", (e) => {

    if (e.target === backdrop) {
      closeAllPopups();
    }

  });


  /* =====================================================
     JOURNEY
  ===================================================== */

  const journeyButton =
    document.querySelector('[data-open="journey"]');

  journeyButton?.addEventListener("click", () => {

    document
      .getElementById("journey")
      ?.scrollIntoView({
        behavior: "smooth"
      });

    resetActivity();

  });


  /* =====================================================
     LET'S TALK
  ===================================================== */

  const letsTalk =
    document.getElementById("letsTalk");

  const helloBackdrop =
    document.getElementById("helloBackdrop");

  const helloClose =
    document.getElementById("helloClose");


  letsTalk?.addEventListener("click", (e) => {

    e.preventDefault();

    helloBackdrop?.classList.add("show");

    resetActivity();

  });


  helloClose?.addEventListener("click", () => {

    helloBackdrop?.classList.remove("show");

    resetActivity();

  });


  helloBackdrop?.addEventListener("click", (e) => {

    if (e.target === helloBackdrop) {
      helloBackdrop.classList.remove("show");
      resetActivity();
    }

  });


  /* =====================================================
     MAIN MUSIC
  ===================================================== */

  const audio =
    document.getElementById("audio");

  if (audio) {

    audio.volume = 0.45;
    audio.loop = true;

    function startMusic() {

      audio.play().catch(() => {
        // Browser bisa menunggu interaksi user.
      });

    }

    startMusic();

    document.addEventListener(
      "click",
      startMusic,
      { once: true }
    );

    document.addEventListener(
      "touchstart",
      startMusic,
      { once: true }
    );

  }


  /* =====================================================
     AUTO SCROLL
  ===================================================== */

  let inactivityTimer;
  let autoScrollActive = false;
  let autoScrollFrame;

  const AUTO_DELAY = 2000;


  function resetActivity() {

    autoScrollActive = false;

    if (autoScrollFrame) {
      cancelAnimationFrame(autoScrollFrame);
    }

    clearTimeout(inactivityTimer);

    inactivityTimer = setTimeout(() => {
      startAutoScroll();
    }, AUTO_DELAY);

  }


  function startAutoScroll() {

    if (
      document.querySelector(".modal-backdrop.open") ||
      document.querySelector(".hello-backdrop.show")
    ) {
      return;
    }

    autoScrollActive = true;

    dreamyScroll();

  }


  function dreamyScroll() {

    if (!autoScrollActive) return;


    if (
      document.querySelector(".modal-backdrop.open") ||
      document.querySelector(".hello-backdrop.show")
    ) {

      autoScrollActive = false;

      return;
    }


    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const currentScroll =
      window.scrollY;


    if (currentScroll >= maxScroll - 5) {

      autoScrollActive = false;

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      setTimeout(() => {

        if (!autoScrollActive) {

          autoScrollActive = true;

          dreamyScroll();

        }

      }, 1000);

      return;
    }


    const speed =
      0.35 +
      Math.sin(Date.now() / 900) * 0.12;

    window.scrollBy(0, speed);

    autoScrollFrame =
      requestAnimationFrame(dreamyScroll);

  }


  /* =====================================================
     USER ACTIVITY
  ===================================================== */

  [
    "mousemove",
    "mousedown",
    "keydown",
    "touchstart",
    "wheel"
  ].forEach(event => {

    window.addEventListener(
      event,
      () => {
        resetActivity();
      },
      { passive: true }
    );

  });


  /* =====================================================
     CUSTOM CURSOR
  ===================================================== */

  const cursorDot =
    document.getElementById("cursorDot");

  const cursorRing =
    document.getElementById("cursorRing");


  if (cursorDot && cursorRing) {

    window.addEventListener("mousemove", (e) => {

      cursorDot.style.left =
        e.clientX + "px";

      cursorDot.style.top =
        e.clientY + "px";

      cursorRing.style.left =
        e.clientX + "px";

      cursorRing.style.top =
        e.clientY + "px";

    });

  }


  /* =====================================================
     SCROLL REVEAL
  ===================================================== */

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add("show");

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


  /* =====================================================
     START
  ===================================================== */

  showSlide(0);

  resetActivity();

});
