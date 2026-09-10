const envelope = document.getElementById("envelope");
const letter = document.getElementById("letter");
const quiz = document.getElementById("quiz");
const timeline = document.getElementById("timeline");
const ending = document.getElementById("ending");
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");
const toQuiz = document.getElementById("toQuiz");
const quizProgress = document.getElementById("quizProgress");
const quizSay = document.getElementById("quizSay");
const stickerBeomgyu = document.getElementById("stickerBeomgyu");
const stickerKai = document.getElementById("stickerKai");
const stickerFriend = document.getElementById("stickerFriend");

const beomgyuSrc = {
  wave: "stickers/cui-cool.png",
  heart: "stickers/cui-shout.png",
};
const kaiSrc = {
  plush: "stickers/kai-smile.png",
  peace: "stickers/kai-meme.png",
};

let quizStep = 0;
const quizPanels = [...document.querySelectorAll(".quiz-panel")];
const quizTotal = quizPanels.length;
let quizLocked = false;

function revealRest() {
  document.body.classList.add("is-open");
  letter.hidden = false;
  window.setTimeout(() => {
    letter.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 280);
}

function openEnvelope() {
  if (envelope.classList.contains("open")) return;
  envelope.classList.add("open");
  envelope.setAttribute("aria-expanded", "true");
  const wait = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 0
    : 900;
  window.setTimeout(revealRest, wait);
}

envelope.addEventListener("click", openEnvelope);
envelope.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openEnvelope();
  }
});

function showQuizStep(index) {
  quizStep = index;
  quizPanels.forEach((panel, i) => {
    panel.hidden = i !== index;
  });
  quizProgress.textContent = `${index + 1} / ${quizTotal}`;
  quizSay.hidden = true;
  quizSay.textContent = "";
  quizLocked = false;
}

function startQuiz(event) {
  event.preventDefault();
  document.body.classList.add("in-quiz");
  quiz.hidden = false;
  showQuizStep(0);
  window.scrollTo({ top: 0, behavior: "instant" });
}

toQuiz.addEventListener("click", startQuiz);

function showStickers(who, poses) {
  const names = who.split(",").map((item) => item.trim());
  if (names.includes("friend")) {
    stickerFriend.classList.add("in");
    stickerBeomgyu.classList.remove("in");
    stickerKai.classList.remove("in");
    document.body.classList.add("has-friend-sticker");
    document.body.classList.remove("has-cui-sticker", "has-kai-sticker");
    return;
  }
  stickerFriend.classList.remove("in");
  document.body.classList.remove("has-friend-sticker");
  if (names.includes("beomgyu")) {
    stickerBeomgyu.src = beomgyuSrc[poses.beomgyu] || beomgyuSrc.wave;
    stickerBeomgyu.classList.add("in");
    document.body.classList.add("has-cui-sticker");
  }
  if (names.includes("kai")) {
    stickerKai.src = kaiSrc[poses.kai] || kaiSrc.plush;
    stickerKai.classList.add("in");
    document.body.classList.add("has-kai-sticker");
  }
}

function finishQuiz() {
  document.body.classList.remove(
    "in-quiz",
    "has-cui-sticker",
    "has-kai-sticker",
    "has-friend-sticker"
  );
  quiz.hidden = true;
  timeline.hidden = false;
  ending.hidden = false;
  observeMoments();
  window.setTimeout(() => {
    timeline.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);
}

quiz.addEventListener("click", (event) => {
  const button = event.target.closest(".quiz-options button");
  if (!button || quizLocked) return;
  quizLocked = true;
  button.parentElement.querySelectorAll("button").forEach((item) => {
    item.disabled = true;
  });
  showStickers(button.dataset.show || "", {
    beomgyu: button.dataset.beomgyu,
    kai: button.dataset.kai,
  });
  quizSay.textContent = button.dataset.say || "";
  quizSay.hidden = false;

  const wait = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 200
    : 1100;
  window.setTimeout(() => {
    if (button.dataset.finish) {
      finishQuiz();
      return;
    }
    const next = quizStep + 1;
    if (next < quizTotal) {
      quizPanels[quizStep]
        .querySelectorAll("button")
        .forEach((item) => {
          item.disabled = false;
        });
      showQuizStep(next);
    } else {
      finishQuiz();
    }
  }, wait);
});

function observeMoments() {
  const moments = document.querySelectorAll(".moment");
  if (!("IntersectionObserver" in window)) {
    moments.forEach((item) => item.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );
  moments.forEach((item) => io.observe(item));
}

document.querySelectorAll(".frame img").forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  });
});

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = "";
  document.body.style.overflow = "";
}

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox || event.target.classList.contains("lightbox-close")) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
});
