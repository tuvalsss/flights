// Generates self-contained, World-Cup-themed SVG poster images into public/images.
// No network needed — everything ships inside the repo.
import { mkdirSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "images");
mkdirSync(OUT, { recursive: true });

const W = 1200;
const H = 675;

// deterministic pseudo-random
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function skyline(x0, x1, baseY, maxH, color, seed, windows = true) {
  const r = rng(seed);
  let out = "";
  let x = x0;
  while (x < x1) {
    const bw = 26 + Math.floor(r() * 46);
    const bh = 60 + Math.floor(r() * maxH);
    const y = baseY - bh;
    out += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${color}" rx="2"/>`;
    if (windows) {
      for (let wy = y + 12; wy < baseY - 8; wy += 16) {
        for (let wx = x + 6; wx < x + bw - 6; wx += 12) {
          if (r() > 0.45)
            out += `<rect x="${wx}" y="${wy}" width="4" height="6" fill="#fde68a" opacity="${0.4 + r() * 0.5}"/>`;
        }
      }
    }
    x += bw + 6 + Math.floor(r() * 10);
  }
  return out;
}

function confetti(seed, colors, count = 70) {
  const r = rng(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = r() * W;
    const y = r() * H * 0.7;
    const s = 4 + r() * 7;
    const c = colors[Math.floor(r() * colors.length)];
    const rot = Math.floor(r() * 360);
    out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${s.toFixed(1)}" height="${(s * 0.5).toFixed(1)}" fill="${c}" opacity="${(0.5 + r() * 0.5).toFixed(2)}" transform="rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }
  return out;
}

function stadium(cx, cy, rx, ry, rim, glow) {
  return `
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${rim}" opacity="0.9"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx - 18}" ry="${ry - 12}" fill="#0b3d2e"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx - 26}" ry="${ry - 18}" fill="#0f5132"/>
    <rect x="${cx - (rx - 26)}" y="${cy - 1}" width="${(rx - 26) * 2}" height="2" fill="#e5e7eb" opacity="0.5"/>
    <circle cx="${cx}" cy="${cy}" r="${ry - 18}" fill="none" stroke="#e5e7eb" stroke-width="1.5" opacity="0.4"/>
    <ellipse cx="${cx}" cy="${cy - ry}" rx="${rx}" ry="${ry}" fill="${glow}" opacity="0.18"/>`;
}

function sun(cx, cy, r, c) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 1.7}" fill="${c}" opacity="0.25"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 2.6}" fill="${c}" opacity="0.12"/>`;
}

function palm(x, baseY, h, c) {
  return `<rect x="${x - 3}" y="${baseY - h}" width="6" height="${h}" fill="${c}" rx="3"/>
    ${Array.from({ length: 6 }, (_, i) => {
      const a = -60 + i * 24;
      return `<path d="M${x} ${baseY - h} q ${Math.cos((a * Math.PI) / 180) * 60} ${-30 + i * 4} ${Math.cos((a * Math.PI) / 180) * 90} ${10}" stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    }).join("")}`;
}

function pyramid(cx, baseY, w, h, c) {
  const steps = 5;
  let out = "";
  for (let i = 0; i < steps; i++) {
    const sw = w * (1 - i / steps);
    const sh = h / steps;
    const y = baseY - (i + 1) * sh;
    out += `<rect x="${cx - sw / 2}" y="${y}" width="${sw}" height="${sh}" fill="${c}" opacity="${0.8 - i * 0.08}"/>`;
  }
  return out;
}

function trophy(cx, cy, c, glow) {
  return `
    ${sun(cx, cy - 20, 120, glow)}
    <path d="M${cx - 55} ${cy - 90} h110 v22 q0 60 -55 78 q-55 -18 -55 -78 z" fill="${c}"/>
    <path d="M${cx - 55} ${cy - 82} q-34 0 -34 -30 q0 -16 22 -16" fill="none" stroke="${c}" stroke-width="9"/>
    <path d="M${cx + 55} ${cy - 82} q34 0 34 -30 q0 -16 -22 -16" fill="none" stroke="${c}" stroke-width="9"/>
    <rect x="${cx - 14}" y="${cy - 6}" width="28" height="30" fill="${c}"/>
    <rect x="${cx - 42}" y="${cy + 22}" width="84" height="16" rx="4" fill="${c}"/>
    <rect x="${cx - 56}" y="${cy + 36}" width="112" height="14" rx="4" fill="${c}" opacity="0.85"/>`;
}

function mountains(baseY, color, seed) {
  const r = rng(seed);
  let out = "";
  let x = -50;
  while (x < W + 50) {
    const w = 200 + r() * 240;
    const h = 120 + r() * 160;
    out += `<path d="M${x} ${baseY} L${x + w / 2} ${baseY - h} L${x + w} ${baseY} Z" fill="${color}" opacity="0.9"/>
      <path d="M${x + w / 2 - 18} ${baseY - h + 28} l18 -28 l18 28 l-12 6 l-6 -8 l-6 8 z" fill="#e2e8f0" opacity="0.85"/>`;
    x += w * 0.62;
  }
  return out;
}

function water(y, color) {
  let out = `<rect x="0" y="${y}" width="${W}" height="${H - y}" fill="${color}"/>`;
  for (let i = 0; i < 40; i++) {
    const yy = y + 10 + Math.random() * (H - y - 10);
    const xx = Math.random() * W;
    out += `<rect x="${xx}" y="${yy}" width="${20 + Math.random() * 60}" height="2" fill="#ffffff" opacity="0.08"/>`;
  }
  return out;
}

function frame(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" font-family="sans-serif">${inner}</svg>`;
}

function base(c1, c2, glowC, glowX = W * 0.7, glowY = H * 0.25) {
  return `
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${c1}"/>
        <stop offset="1" stop-color="${c2}"/>
      </linearGradient>
      <radialGradient id="glow" cx="${(glowX / W) * 100}%" cy="${(glowY / H) * 100}%" r="70%">
        <stop offset="0" stop-color="${glowC}" stop-opacity="0.55"/>
        <stop offset="1" stop-color="${glowC}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>`;
}

const ground = (y, c) => `<rect x="0" y="${y}" width="${W}" height="${H - y}" fill="${c}"/>`;
const pitchLines = (y) =>
  Array.from({ length: 8 }, (_, i) => `<rect x="0" y="${y + i * ((H - y) / 8)}" width="${W}" height="1" fill="#10b981" opacity="0.10"/>`).join("");

const posters = {
  hero: () =>
    frame(
      base("#1e1b4b", "#062a22", "#f59e0b", W * 0.5, H * 0.18) +
        sun(W * 0.5, 120, 70, "#fbbf24") +
        skyline(0, W, 470, 150, "#10203a", 11) +
        stadium(W * 0.5, 470, 360, 120, "#1f2937", "#fbbf24") +
        ground(560, "#06231b") +
        pitchLines(560) +
        confetti(7, ["#10b981", "#fbbf24", "#6366f1", "#f97316", "#ffffff"], 110) +
        `<g transform="translate(${W / 2 - 90} 600)">
           <text x="0" y="0" font-size="40">🇲🇽</text>
           <text x="70" y="0" font-size="40">🇺🇸</text>
           <text x="140" y="0" font-size="40">🇨🇦</text>
         </g>`,
    ),
  azteca: () =>
    frame(
      base("#4c1d95", "#f97316", "#fde68a", W * 0.75, H * 0.3) +
        sun(W * 0.74, 170, 64, "#fde68a") +
        skyline(0, W, 500, 120, "#5b2a86", 21) +
        pyramid(W * 0.3, 500, 230, 150, "#7c3f10") +
        stadium(W * 0.72, 500, 250, 92, "#3b1f5e", "#fde68a") +
        ground(560, "#3a1d10") +
        confetti(2, ["#fde68a", "#f97316", "#ef4444"], 50),
    ),
  la: () =>
    frame(
      base("#0ea5e9", "#f97316", "#fde68a", W * 0.7, H * 0.32) +
        sun(W * 0.7, 180, 70, "#fff7ed") +
        skyline(120, W, 500, 170, "#0c4a6e", 31) +
        stadium(W * 0.35, 505, 220, 84, "#0b3a52", "#fde68a") +
        ground(560, "#7c2d12") +
        palm(120, 560, 150, "#143")+ palm(W - 90, 560, 175, "#143") + palm(W - 150, 560, 120, "#0b3324") +
        confetti(5, ["#fde68a", "#38bdf8", "#f97316"], 40),
    ),
  explorer: () =>
    frame(
      base("#065f46", "#10b981", "#fde68a", W * 0.5, H * 0.25) +
        sun(W * 0.5, 150, 60, "#fef9c3") +
        skyline(0, 360, 470, 120, "#064e3b", 41) +
        skyline(820, W, 470, 130, "#064e3b", 42) +
        stadium(W * 0.5, 470, 200, 78, "#0b3d2e", "#fde68a") +
        ground(500, "#0a3a2c") +
        `<path d="M${W / 2 - 30} 675 L${W / 2 + 30} 675 L${W / 2 + 110} 505 L${W / 2 - 110} 505 Z" fill="#1f2937"/>
         ${Array.from({ length: 5 }, (_, i) => `<rect x="${W / 2 - 6}" y="${510 + i * 34}" width="12" height="18" fill="#fde68a" opacity="0.8"/>`).join("")}` +
        confetti(9, ["#fde68a", "#34d399", "#ffffff"], 35),
    ),
  boston: () =>
    frame(
      base("#1e293b", "#4338ca", "#a5b4fc", W * 0.3, H * 0.25) +
        sun(W * 0.28, 150, 52, "#c7d2fe") +
        skyline(0, W, 520, 200, "#0f172a", 51) +
        ground(560, "#111827") +
        confetti(6, ["#a5b4fc", "#fde68a", "#6366f1"], 30),
    ),
  dallas: () =>
    frame(
      base("#7c2d12", "#f59e0b", "#fde68a", W * 0.6, H * 0.3) +
        sun(W * 0.6, 175, 72, "#fff7ed") +
        skyline(60, W, 510, 210, "#5b2410", 61) +
        stadium(W * 0.42, 515, 280, 96, "#3a1c0c", "#fde68a") +
        ground(565, "#3a1c0c") +
        confetti(3, ["#fde68a", "#f59e0b", "#ef4444"], 36),
    ),
  metlife: () =>
    frame(
      base("#0b0f1a", "#1e40af", "#60a5fa", W * 0.5, H * 0.2) +
        sun(W * 0.82, 110, 40, "#dbeafe") +
        skyline(0, W, 500, 230, "#0a1426", 71) +
        stadium(W * 0.5, 500, 320, 110, "#111827", "#ffffff") +
        ground(560, "#070b14") +
        confetti(8, ["#60a5fa", "#fde68a", "#ffffff"], 80),
    ),
  vip: () =>
    frame(
      base("#111827", "#b45309", "#fcd34d", W * 0.5, H * 0.4) +
        confetti(12, ["#fcd34d", "#f59e0b", "#fde68a"], 60) +
        `<rect x="0" y="430" width="${W}" height="${H - 430}" fill="#1f1405" opacity="0.85"/>
         <g transform="translate(${W / 2} 430)">
           <path d="M-70 0 q70 70 70 70 q0 0 70 -70 z" fill="#fcd34d" opacity="0.9"/>
           <rect x="-4" y="60" width="8" height="70" fill="#fcd34d"/>
           <rect x="-34" y="130" width="68" height="10" rx="3" fill="#fcd34d"/>
           <path d="M70 -10 q60 70 60 70 q0 0 60 -70 z" fill="#fde68a" opacity="0.85"/>
           <rect x="96" y="50" width="8" height="70" fill="#fde68a"/>
           <rect x="66" y="120" width="68" height="10" rx="3" fill="#fde68a"/>
         </g>` +
        sun(W * 0.5, 150, 60, "#fcd34d"),
    ),
  series: () =>
    frame(
      base("#0b0f1a", "#064e3b", "#fcd34d", W * 0.5, H * 0.3) +
        confetti(10, ["#fcd34d", "#10b981", "#ffffff", "#f59e0b"], 90) +
        skyline(0, W, 540, 90, "#08251c", 81) +
        trophy(W * 0.5, 330, "#fcd34d", "#f59e0b") +
        ground(560, "#06140f"),
    ),
  "region-west": () =>
    frame(
      base("#0ea5e9", "#0f766e", "#bae6fd", W * 0.5, H * 0.22) +
        sun(W * 0.78, 150, 58, "#fff") +
        mountains(430, "#0c4a6e", 91) +
        water(430, "#0e7490") +
        skyline(60, 360, 430, 110, "#0b3a52", 92) +
        confetti(14, ["#bae6fd", "#fde68a"], 18),
    ),
  "region-central": () =>
    frame(
      base("#f59e0b", "#b45309", "#fed7aa", W * 0.5, H * 0.25) +
        sun(W * 0.5, 175, 78, "#fff7ed") +
        `<path d="M120 470 h220 v-120 h-40 v-40 h-100 v40 h-40 z" fill="#7c2d12" opacity="0.85"/>` +
        skyline(560, W, 470, 150, "#7c2d12", 101) +
        ground(470, "#5b2410") +
        confetti(15, ["#fed7aa", "#fde68a"], 18),
    ),
  "region-east": () =>
    frame(
      base("#0b1e3a", "#1e3a8a", "#93c5fd", W * 0.5, H * 0.2) +
        sun(W * 0.2, 120, 44, "#dbeafe") +
        skyline(0, W, 420, 220, "#0a1730", 111) +
        water(420, "#13294b") +
        confetti(16, ["#93c5fd", "#fde68a", "#fff"], 22),
    ),
};

for (const [name, fn] of Object.entries(posters)) {
  writeFileSync(join(OUT, `${name}.svg`), fn());
  console.log("wrote", `${name}.svg`);
}
console.log("Done:", Object.keys(posters).length, "images");
