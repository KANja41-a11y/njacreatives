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

      dot.className =
        "dot" + (i === 0 ? " active" : "");

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


  /* AUTO SLIDER */

  setInterval(() => {

    showSlide(current + 1);

  }, 5000);



  /* =====================================================
     MENU + CONTENT POPUP
  ===================================================== */

  const backdrop =
    document.getElementById("modalBackdrop");

  const menuButton =
    document.getElementById("menuButton");

  const menuPopup =
    document.getElementById("menuPopup");

  const contentPopup =
    document.getElementById("contentPopup");

  const closePopup =
    document.getElementById("closePopup");

  const closeContent =
    document.getElementById("closeContent");

  const popupContent =
    document.getElementById("popupContent");


  /* =====================================================
     OPEN MENU
  ===================================================== */

  function openMenu() {

    if (!backdrop) return;

    backdrop.classList.add("open");

    /*
      MENU SELALU TETAP TERLIHAT
    */

    if (menuPopup) {
      menuPopup.style.display = "block";
    }

    resetActivity();

  }


  /* =====================================================
     CLOSE SEMUA
  ===================================================== */

  function closeAllPopups() {

    if (!backdrop) return;

    backdrop.classList.remove("open");

    if (contentPopup) {
      contentPopup.classList.remove("open");
    }

    if (menuPopup) {
      menuPopup.style.display = "block";
    }

    resetActivity();

  }


  /* =====================================================
     OPEN MENU BUTTON
  ===================================================== */

  menuButton?.addEventListener("click", (e) => {

    e.preventDefault();
    e.stopPropagation();

    openMenu();

  });


  /* =====================================================
     X PADA MENU
  ===================================================== */

  closePopup?.addEventListener("click", (e) => {

    e.preventDefault();
    e.stopPropagation();

    closeAllPopups();

  });


  /* =====================================================
     X PADA CONTENT
     
     INI CUMA MENUTUP CONTENT.
     MENU TETAP ADA.
  ===================================================== */

  closeContent?.addEventListener("click", (e) => {

    e.preventDefault();
    e.stopPropagation();

    if (contentPopup) {
      contentPopup.classList.remove("open");
    }

    resetActivity();

  });



  /* =====================================================
     POPUP CONTENT DATA
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
songs: {
  title: "My Songs 🎵",

  html: `
    <div class="songs-list">

      <div class="song-item">
        <button class="song-play" data-song="song1">
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
        <button class="song-play" data-song="song2">
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
        <button class="song-play" data-song="song3">
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
  
  /* ====================================================
   MY SONGS PLAYER
===================================================== */

let currentSong = null;

function setupSongPlayers() {

  const songButtons =
    document.querySelectorAll(".song-play");

  const songAudios =
    document.querySelectorAll(".song-audio");

  songButtons.forEach(button => {

    button.addEventListener("click", (e) => {

      e.preventDefault();
      e.stopPropagation();

      const songId = button.dataset.song;

      const audio =
        document.querySelector(
          `.song-audio[data-audio="${songId}"]`
        );

      if (!audio) return;


      /* klik lagu yang sedang dimainkan = PAUSE */

      if (currentSong === audio && !audio.paused) {

        audio.pause();

        button.textContent = "▶";

        button
          .closest(".song-item")
          ?.classList.remove("playing");

        return;
      }


      /* hentikan semua lagu lain */

      songAudios.forEach(otherAudio => {

        if (otherAudio !== audio) {

          otherAudio.pause();
          otherAudio.currentTime = 0;

          const otherButton =
            document.querySelector(
              `.song-play[data-song="${otherAudio.dataset.audio}"]`
            );

          otherButton &&
            (otherButton.textContent = "▶");

          otherAudio
            .closest(".song-item")
            ?.classList.remove("playing");
        }

      });


      /* PLAY */

      audio.play().then(() => {

        currentSong = audio;

        button.textContent = "Ⅱ";

        button
          .closest(".song-item")
          ?.classList.add("playing");

      }).catch(error => {

        console.log("Song tidak bisa dimainkan:", error);

      });


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


    /* =================================================
       ABOUT ME
       GANTI FOTO DI SINI
       ================================================= */

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
     MENU ITEMS
     
     PENTING:
     TIDAK ADA LAGI:
     menuPopup.style.display = "none"
     
     Jadi menu tetap di kiri.
  ===================================================== */

  document
    .querySelectorAll("[data-popup]")
    .forEach(button => {

      button.addEventListener("click", (e) => {

        e.preventDefault();
        e.stopPropagation();

        const key =
          button.dataset.popup;

        const item =
          popupData[key];

        if (
          !item ||
          !popupContent ||
          !contentPopup
        ) {
          return;
        }


        /* MASUKKAN CONTENT */

        popupContent.innerHTML = `

          <h2 class="popup-content-title">
            ${item.title}
          </h2>

          ${item.html}

        `;


        /* =================================================
           MENU TETAP TERBUKA
           CONTENT MUNCUL DI SEBELAHNYA
           ================================================= */

        if (menuPopup) {
          menuPopup.style.display = "block";
        }

        contentPopup.classList.add("open");

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
     JOURNEY BUTTON
  ===================================================== */

  const journeyButton =
    document.querySelector(
      '[data-open="journey"]'
    );


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

    }

  });



  /* =====================================================
     MUSIC
  ===================================================== */

  const audio =
    document.getElementById("audio");


  if (audio) {

    audio.volume = 0.45;
    audio.loop = true;


    function startMusic() {

      audio.play().catch(() => {
        // Browser membutuhkan interaksi user.
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

      cancelAnimationFrame(
        autoScrollFrame
      );

    }


    clearTimeout(
      inactivityTimer
    );


    inactivityTimer = setTimeout(() => {

      startAutoScroll();

    }, AUTO_DELAY);

  }



  function startAutoScroll() {

    if (

      document.querySelector(
        ".modal-backdrop.open"
      )

      ||

      document.querySelector(
        ".hello-backdrop.show"
      )

    ) {

      return;

    }


    autoScrollActive = true;

    dreamyScroll();

  }



  function dreamyScroll() {

    if (!autoScrollActive) return;


    /* Jangan auto-scroll saat popup terbuka */

    if (

      document.querySelector(
        ".modal-backdrop.open"
      )

      ||

      document.querySelector(
        ".hello-backdrop.show"
      )

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


    window.scrollBy(
      0,
      speed
    );


    autoScrollFrame =
      requestAnimationFrame(
        dreamyScroll
      );

  }



  /* =====================================================
     USER ACTIVITY
  ===================================================== */

  [

    "mousemove",
    "mousedown",
    "keydown",
    "touchstart",
    "wheel",
    "scroll"

  ].forEach(event => {

    window.addEventListener(
      event,
      () => {

        if (
          event === "scroll" &&
          autoScrollActive
        ) {

          return;

        }

        resetActivity();

      },
      {
        passive: true
      }
    );

  });



  /* =====================================================
     CUSTOM CURSOR
  ===================================================== */

  const cursorDot =
    document.getElementById(
      "cursorDot"
    );

  const cursorRing =
    document.getElementById(
      "cursorRing"
    );


  if (
    cursorDot &&
    cursorRing
  ) {

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

  }



  /* =====================================================
     SCROLL REVEAL
  ===================================================== */

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "show"
            );

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
