document.addEventListener("DOMContentLoaded", () => {
  
  /* ================= SLIDER ================= */

  const slides = [
    ...document.querySelectorAll(".slide")
  ];

  const dots =
    document.getElementById("dots");

  let current = 0;


  slides.forEach((_, i) => {

    const dot =
      document.createElement("span");

    dot.className =
      "dot" + (i === 0 ? " active" : "");

    dot.onclick = () => {
      showSlide(i);
    };

    dots.appendChild(dot);

  });


  function showSlide(index) {

    current =
      (index + slides.length)
      % slides.length;

    slides.forEach((slide, i) => {

      slide.classList.toggle(
        "active",
        i === current
      );

    });


    [
      ...dots.children
    ].forEach((dot, i) => {

      dot.classList.toggle(
        "active",
        i === current
      );

    });

  }


  document
    .getElementById("next")
    .onclick = () => {
      showSlide(current + 1);
    };


  document
    .getElementById("prev")
    .onclick = () => {
      showSlide(current - 1);
    };


  setInterval(() => {

    showSlide(current + 1);

  }, 5000);



  /* ================= POPUP MENU ================= */

  const backdrop =
    document.getElementById(
      "modalBackdrop"
    );

  const menuButton =
    document.getElementById(
      "menuButton"
    );

  const menuPopup =
    document.getElementById(
      "menuPopup"
    );

  const contentPopup =
    document.getElementById(
      "contentPopup"
    );

  const content =
    document.getElementById(
      "popupContent"
    );


  menuButton.onclick = () => {

    backdrop.classList.add("open");

    menuPopup.style.display =
      "block";

    contentPopup.classList.remove(
      "open"
    );

  };


  document
    .getElementById("closePopup")
    .onclick = () => {

      backdrop.classList.remove(
        "open"
      );

    };


  document
    .getElementById("closeContent")
    .onclick = () => {

      contentPopup.classList.remove(
        "open"
      );

    };


  backdrop.onclick = (e) => {

    if (e.target === backdrop) {

      backdrop.classList.remove(
        "open"
      );

    }

  };



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
            Today’s idea ✦
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
          >

          <img
            src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=600&q=80"
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


        contentPopup.classList.add(
          "open"
        );

      };

    });



  /* ================= JOURNEY BUTTON ================= */

  document
    .querySelector(
      '[data-open="journey"]'
    )
    .onclick = () => {

      document
        .getElementById("journey")
        .scrollIntoView({
          behavior: "smooth"
        });

    };



  /* ================= MUSIC ================= */

  const audio =
    document.getElementById("audio");

audio.src = "music/cozy-jazz.mp3";

  const musicButton =
    document.getElementById(
      "musicButton"
    );


  /*
    NANTI KALAU SUDAH PUNYA LAGU:

    audio.src = "music/cozy-jazz.mp3";

  */


  let playing = false;


  musicButton.onclick = () => {


    if (!audio.src) {

      alert(
        "Masukkan lagu kamu ke folder music/ lalu tambahkan audio.src di script.js"
      );

      return;

    }


    if (playing) {

      audio.pause();

    } else {

      audio.play();

    }


    playing = !playing;


    musicButton
      .querySelector(
        ".play-icon"
      )
      .textContent =
      playing ? "Ⅱ" : "▶";


    musicButton
      .querySelector("small")
      .textContent =
      playing
        ? "now playing"
        : "click to play";

  };



  /* ================= CUSTOM CURSOR ================= */

  const cursorDot =
    document.getElementById(
      "cursorDot"
    );

  const cursorRing =
    document.getElementById(
      "cursorRing"
    );


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
    .querySelectorAll("a,button")
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
        threshold: .12
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
      document.createElement(
        "span"
      );


    sparkle.className =
      "sparkle";


    sparkle.textContent =
      Math.random() > .5
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


});

/* ================= LET'S TALK ================= */

const letsTalk =
  document.getElementById("letsTalk");

const helloBackdrop =
  document.getElementById("helloBackdrop");

const helloClose =
  document.getElementById("helloClose");


if (letsTalk) {

  letsTalk.addEventListener("click", (e) => {

    e.preventDefault();

    helloBackdrop.classList.add("show");

  });

}


if (helloClose) {

  helloClose.addEventListener("click", () => {

    helloBackdrop.classList.remove("show");

  });

}


if (helloBackdrop) {

  helloBackdrop.addEventListener("click", (e) => {

    if (e.target === helloBackdrop) {

      helloBackdrop.classList.remove("show");

    }

  });

}


});
