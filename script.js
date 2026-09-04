const envelope = document.getElementById("envelope");
const letter = document.getElementById("letter");
const timeline = document.getElementById("timeline");
const ending = document.getElementById("ending");
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");

function revealRest() {
  document.body.classList.add("is-open");
  letter.hidden = false;
  timeline.hidden = false;
  ending.hidden = false;
  observeMoments();
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
