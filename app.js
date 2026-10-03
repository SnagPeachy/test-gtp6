const projects = {
  bouzelouf: {
    number: "01",
    title: "BOUZelOUF",
    kind: "GAME DESIGN / ROBLOX",
    description:
      "A survival game built around one simple rule: keep moving. Players face Bouzelouf together; when someone is caught, they can still watch the remaining survivors. One last player standing takes the win.",
    note: "A game concept in active development. Details and visuals are subject to change.",
    art: "visual-monster",
  },
  snag: {
    number: "02",
    title: "SNAG®",
    kind: "IDENTITY / ONGOING",
    description:
      "Not a company or a studio. A name for the little things that start with a question and become something real: code, games, tools, objects, experiments.",
    note: "An evolving personal identity. This site is part of it.",
    art: "visual-identity",
  },
  automation: {
    number: "03",
    title: "LESS, AGAIN.",
    kind: "PYTHON / AUTOMATION",
    description:
      "Small Python scripts and useful automations, made to remove the repetitive bits from everyday tasks. A collection of experiments, not a packaged product.",
    note: "Ongoing experiments. No public repository linked yet.",
    art: "visual-terminal",
  },
  electronics: {
    number: "04",
    title: "SMALL SIGNALS",
    kind: "ARDUINO / ELECTRONICS",
    description:
      "A place for physical experiments: Arduino, electronics, sensors and the satisfying moment a line of code makes something in the real world move.",
    note: "An experimental thread, not a finished product.",
    art: "visual-hardware",
  },
  web: {
    number: "05",
    title: "OPEN TAB",
    kind: "WEB / INTERACTIVE",
    description:
      "Websites and interfaces treated as places to visit, not just pages to fill. A running set of explorations into interaction, typography and the details that make software feel considered.",
    note: "A creative direction, not a claim of client work.",
    art: "visual-web",
  },
};

const projectButtons = [...document.querySelectorAll("[data-project]")];
const projectDialog = document.querySelector(".project-dialog");
const projectArt = document.querySelector(".dialog-art");
let activeProjectIndex = 0;

function openProject(key) {
  const project = projects[key];
  activeProjectIndex = Object.keys(projects).indexOf(key);
  projectDialog.querySelector(".dialog-kicker span").textContent =
    ` / ${project.number}`;
  projectDialog.querySelector(".dialog-kind").textContent = project.kind;
  projectDialog.querySelector("#dialog-title").textContent = project.title;
  projectDialog.querySelector(".dialog-description").textContent =
    project.description;
  projectDialog.querySelector(".dialog-note").textContent = project.note;
  projectArt.className = `dialog-art ${project.art}`;
  const sourceArt =
    projectButtons[activeProjectIndex].querySelector(".project-visual");
  projectArt.replaceChildren(
    ...[...sourceArt.children].map((element) => element.cloneNode(true)),
  );
  projectDialog.showModal();
  document.body.classList.add("dialog-open");
}

projectButtons.forEach((button) =>
  button.addEventListener("click", () => openProject(button.dataset.project)),
);
projectDialog
  .querySelector(".dialog-close")
  .addEventListener("click", () => projectDialog.close());
projectDialog.querySelector(".dialog-next").addEventListener("click", () => {
  const keys = Object.keys(projects);
  openProject(keys[(activeProjectIndex + 1) % keys.length]);
});

for (const dialog of document.querySelectorAll("dialog")) {
  dialog.addEventListener("close", () =>
    document.body.classList.remove("dialog-open"),
  );
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  siteNav.classList.toggle("is-open", open);
});
siteNav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
  }),
);

const progressBar = document.querySelector(".scroll-progress span");
const navLinks = [...siteNav.querySelectorAll("a")];
let ticking = false;
function updateScrollState() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
  ticking = false;
}
window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  },
  { passive: true },
);

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal:not(.hero .reveal)")
  .forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) =>
          link.classList.toggle(
            "is-active",
            link.hash === `#${entry.target.id}`,
          ),
        );
      }
    });
  },
  { rootMargin: "-35% 0px -55% 0px" },
);
document
  .querySelectorAll("main > section[id]")
  .forEach((section) => sectionObserver.observe(section));

const thoughts = [
  "is still a good place to start.",
  "The interesting part is around the corner.",
  "Someone, somewhere will get it.",
  "Even the side quest teaches you something.",
  "Clarity tends to show up after the first step.",
  "Not everything needs a reason.",
];
let lastThought = -1;
document.querySelector(".machine-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#thought-input");
  const output = document.querySelector(".machine-output p");
  const outputIndex = document.querySelector(".output-index span");
  const state = document.querySelector(".machine-state");
  const idea = input.value.trim();
  if (!idea) {
    input.focus();
    return;
  }
  let thoughtIndex =
    [...idea.toLowerCase()].reduce(
      (total, character) => total + character.charCodeAt(0),
      0,
    ) % thoughts.length;
  if (thoughtIndex === lastThought)
    thoughtIndex = (thoughtIndex + 1) % thoughts.length;
  lastThought = thoughtIndex;
  const prompt = document.createElement("span");
  prompt.textContent = `“${idea}”`;
  const response = document.createElement("em");
  response.textContent = thoughts[thoughtIndex];
  output.replaceChildren(prompt, document.createElement("br"), response);
  outputIndex.textContent = "GENERATED";
  state.innerHTML = "<i></i> THINKING";
  window.setTimeout(() => {
    state.innerHTML = "<i></i> IDLE";
  }, 900);
  input.value = "";
});

const terminalDialog = document.querySelector(".terminal-dialog");
const terminalInput = document.querySelector("#terminal-input");
const terminalLog = document.querySelector(".terminal-log");
function openTerminal() {
  if (!terminalDialog.open) {
    terminalDialog.showModal();
    document.body.classList.add("dialog-open");
    window.setTimeout(() => terminalInput.focus(), 30);
  }
}
document
  .querySelectorAll(".terminal-trigger, .footer-terminal")
  .forEach((button) => button.addEventListener("click", openTerminal));
terminalDialog
  .querySelector(".terminal-close")
  .addEventListener("click", () => terminalDialog.close());

const commands = {
  help: "Try: snag, whoami, about, projects, lab, contact, clear, sudo snag.",
  snag: "SNAG is a name behind things made out of curiosity. That's the whole brief.",
  whoami: "visitor@snag / independent maker / currently following a side quest",
  about:
    "Games, tools, interfaces, hardware experiments. Not a company. Just someone who can't leave an idea alone.",
  projects:
    "Five open threads: BOUZelOUF / SNAG / LESS, AGAIN. / SMALL SIGNALS / OPEN TAB. Scroll up to find them.",
  lab: "The thought engine is open. Give it a word and see what comes back.",
  contact:
    "Email: hello@snag.dev (placeholder; replace with a real address before publishing).",
  "sudo snag": "Nice try. Root access is a state of mind. Try `help` instead.",
  pwd: "/home/visitor/snag/unfinished-ideas",
  ls: "games/  experiments/  little-tools/  things-that-might-work/",
};
document.querySelector(".terminal-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const command = terminalInput.value.trim().toLowerCase();
  if (!command) return;
  const prompt = document.createElement("p");
  prompt.className = "terminal-dim";
  prompt.textContent = `visitor@snag:~$ ${command}`;
  terminalLog.append(prompt);
  if (command === "clear") {
    terminalLog.replaceChildren();
  } else {
    const response = document.createElement("p");
    response.textContent =
      commands[command] ||
      `No command called "${command}". The machine is mostly decorative. Try help.`;
    terminalLog.append(response);
  }
  terminalInput.value = "";
  terminalLog.scrollTop = terminalLog.scrollHeight;
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") return;
  if (
    event.key === "~" &&
    !terminalDialog.open &&
    !projectDialog.open &&
    !/INPUT|TEXTAREA/.test(document.activeElement.tagName)
  ) {
    event.preventDefault();
    openTerminal();
  }
});

const cursorDot = document.querySelector(".cursor-dot");
if (
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  document.body.classList.add("has-cursor");
  window.addEventListener(
    "mousemove",
    (event) => {
      cursorDot.style.left = `${event.clientX}px`;
      cursorDot.style.top = `${event.clientY}px`;
      cursorDot.classList.add("is-active");
    },
    { passive: true },
  );
  document.addEventListener("mouseout", (event) => {
    if (!event.relatedTarget) cursorDot.classList.remove("is-active");
  });
}

document
  .querySelectorAll("[data-placeholder]")
  .forEach((link) =>
    link.addEventListener("click", (event) => event.preventDefault()),
  );
document.querySelector("#year").textContent = String(new Date().getFullYear());
