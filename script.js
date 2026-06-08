const root = document.documentElement;
const cursor = document.querySelector(".cursor");
const header = document.querySelector("[data-header]");
const revealZones = document.querySelectorAll(".reveal-zone");
const projectPanels = document.querySelectorAll(".project-panel");
const contactPanel = document.querySelector("[data-contact-panel]");
const openContact = document.querySelector("[data-open-contact]");
const closeContact = document.querySelector("[data-close-contact]");
const keepSolidHeader = header?.classList.contains("is-solid") && !document.querySelector(".hero");

function installLanguageSwitch() {
  if (!header || header.querySelector(".language-switch")) return;

  const cta = header.querySelector(".header-cta");
  const actions = document.createElement("div");
  actions.className = "header-actions";

  if (cta) {
    cta.replaceWith(actions);
    actions.appendChild(cta);
  } else {
    header.appendChild(actions);
  }

  const path = window.location.pathname;
  const isJapanese = path.includes("/ja/");
  const file = path.split("/").filter(Boolean).pop() || "index.html";
  const englishHref = isJapanese ? `../${file}` : file;
  const japaneseHref = isJapanese ? file : `ja/${file}`;

  const switcher = document.createElement("div");
  switcher.className = "language-switch";
  switcher.setAttribute("aria-label", "Language selector");
  switcher.innerHTML = `
    <a href="${englishHref}" class="${isJapanese ? "" : "is-active"}" lang="en">EN</a>
    <a href="${japaneseHref}" class="${isJapanese ? "is-active" : ""}" lang="ja">JP</a>
  `;
  actions.appendChild(switcher);
}

installLanguageSwitch();

let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let currentX = cursorX;
let currentY = cursorY;

function updateCursor() {
  currentX += (cursorX - currentX) * 0.22;
  currentY += (cursorY - currentY) * 0.22;
  if (cursor) {
    cursor.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
  }
  requestAnimationFrame(updateCursor);
}

function setRevealPosition(event) {
  revealZones.forEach((zone) => {
    const rect = zone.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
      zone.style.setProperty("--mx", `${x}%`);
      zone.style.setProperty("--my", `${y}%`);
      zone.style.setProperty("--r", "17vw");
      cursor?.classList.add("is-large");
    }
  });
}

window.addEventListener("pointermove", (event) => {
  cursorX = event.clientX;
  cursorY = event.clientY;
  cursor?.classList.add("is-visible");
  cursor?.classList.remove("is-large");
  root.style.setProperty("--mx", `${event.clientX}px`);
  root.style.setProperty("--my", `${event.clientY}px`);
  setRevealPosition(event);
});

window.addEventListener("pointerleave", () => {
  cursor?.classList.remove("is-visible");
});

window.addEventListener("scroll", () => {
  if (!keepSolidHeader) {
    header?.classList.toggle("is-solid", window.scrollY > 120);
  }
});

const projectObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-active", entry.isIntersecting);
    });
  },
  {
    root: document.querySelector("[data-project-rail]"),
    threshold: 0.65,
  }
);

projectPanels.forEach((panel) => projectObserver.observe(panel));

function setPanel(open) {
  contactPanel?.classList.toggle("is-open", open);
  contactPanel?.setAttribute("aria-hidden", String(!open));
  document.body.style.overflow = open ? "hidden" : "";
}

openContact?.addEventListener("click", () => setPanel(true));
closeContact?.addEventListener("click", () => setPanel(false));

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setPanel(false);
  }
});

updateCursor();
