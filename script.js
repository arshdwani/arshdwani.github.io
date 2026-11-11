// Calling card: flip, pointer tilt, email link, and a live commit log from GitHub.
const REPO = "arshdwani/arshdwani.github.io";
const EMAIL = ["arshdwani159", "gmail.com"].join("@");

const card = document.getElementById("card");
const tilt = document.getElementById("tilt");
const stage = document.getElementById("stage");
const flipBtn = document.getElementById("flip");
const front = card.querySelector(".front");
const back = card.querySelector(".back");

// Email is assembled here rather than written in the HTML, to keep simple scrapers off it.
document.querySelectorAll("[data-mail]").forEach((a) => { a.href = "mailto:" + EMAIL; });

function setSide(showBack, animate = true) {
  card.classList.toggle("instant", !animate);
  card.classList.toggle("flipped", showBack);
  front.inert = showBack;
  back.inert = !showBack;
  flipBtn.setAttribute("aria-pressed", String(showBack));
  if (!animate) requestAnimationFrame(() => card.classList.remove("instant"));
}

flipBtn.addEventListener("click", () => setSide(!card.classList.contains("flipped")));
card.addEventListener("click", (e) => {
  if (e.target.closest("a")) return;
  setSide(!card.classList.contains("flipped"));
});

// ?side=back opens the card already flipped (handy for sharing and screenshots); ?theme=light|dark pins the page theme.
const params = new URLSearchParams(location.search);
if (params.get("side") === "back") setSide(true, false);
if (["light", "dark"].includes(params.get("theme"))) document.documentElement.dataset.theme = params.get("theme");

// Gentle 3D tilt and glare on devices with a mouse; skipped for touch and reduced motion.
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (fine && !calm) {
  stage.addEventListener("pointermove", (e) => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    tilt.classList.add("live");
    tilt.style.setProperty("--ry", (x * 10).toFixed(2) + "deg");
    tilt.style.setProperty("--rx", (-y * 8).toFixed(2) + "deg");
    card.style.setProperty("--gx", ((x + 0.5) * 100).toFixed(1) + "%");
    card.style.setProperty("--gy", ((y + 0.5) * 100).toFixed(1) + "%");
  });
  stage.addEventListener("pointerleave", () => {
    tilt.classList.remove("live");
    tilt.style.setProperty("--ry", "0deg");
    tilt.style.setProperty("--rx", "0deg");
  });
}

// ---- where am I? ----
// One repository, three places it runs: GitHub Pages, Vercel, and localhost on my own computer.
// The header and footer say which one is serving this copy.
const HOSTS = [[/\.github\.io$/, "GitHub Pages"], [/\.vercel\.app$/, "Vercel"], [/^(localhost|127\.0\.0\.1|\[::1\])$/, "localhost"]];
const host = HOSTS.find(([re]) => re.test(location.hostname));
if (location.host) document.getElementById("where").textContent = location.host;
if (host) document.getElementById("host").textContent = host[1];

// ---- git log ----
const list = document.getElementById("commits");
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const UNITS = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];

function ago(iso) {
  const s = (new Date(iso) - Date.now()) / 1000;
  for (const [unit, size] of UNITS) if (Math.abs(s) >= size) return rtf.format(Math.round(s / size), unit);
  return "just now";
}

function row(c) {
  const li = document.createElement("li");
  const link = document.createElement("a");
  link.href = c.html_url;
  link.innerHTML = `<code>${c.sha.slice(0, 7)}</code>`;
  link.setAttribute("aria-label", `Commit ${c.sha.slice(0, 7)}`);
  const msg = document.createElement("span");
  msg.className = "msg";
  msg.textContent = c.commit.message.split("\n")[0];
  msg.title = msg.textContent;
  const when = document.createElement("time");
  when.dateTime = c.commit.author.date;
  when.textContent = ago(c.commit.author.date);
  li.append(link, msg, when);
  return li;
}

fetch(`https://api.github.com/repos/${REPO}/commits?per_page=5`)
  .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
  .then((commits) => {
    if (!commits.length) throw new Error("empty");
    list.replaceChildren(...commits.map(row));
  })
  .catch(() => {
    list.innerHTML = `<li class="note">The history couldn't load just now. <a href="https://github.com/${REPO}/commits/main">Read it on GitHub</a>.</li>`;
  });
