// Generates a 120-frame placeholder assembly sequence (+ 60 half-res mobile
// frames) so the motion can be reviewed before real renders exist.
//
//   npm i -D sharp        # one-time, dev only
//   npm run gen:sequence
//
// A simple silhouette on a dark ground "grows" a shirt → waistcoat → jacket
// as the frame index climbs, mirroring the real sequence's three acts.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("This script needs `sharp`. Run: npm i -D sharp");
  process.exit(1);
}

const COUNT = 120;
const OUT = "public/sequence";
const OUT_SM = "public/sequence/sm";
await mkdir(OUT, { recursive: true });
await mkdir(OUT_SM, { recursive: true });

const pad = (n) => String(n).padStart(3, "0");
const clamp01 = (x) => Math.max(0, Math.min(1, x));
// smooth reveal of a garment over a frame window [a,b]
const grow = (i, a, b) => clamp01((i - a) / (b - a));

function svg(i, size) {
  const shirt = grow(i, 0, 39);
  const vest = grow(i, 40, 71);
  const jacket = grow(i, 72, 119);
  const cx = 800;
  const s = size / 1600;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1600 1600">
    <rect width="1600" height="1600" fill="#0A0A0B"/>
    <ellipse cx="${cx}" cy="300" rx="${420 * jacket + 40}" ry="360" fill="#141416" opacity="${0.5 * jacket}"/>
    <!-- form -->
    <path d="M600,420 Q800,360 1000,420 L1040,1200 Q800,1260 560,1200 Z" fill="#1c1d20"/>
    <!-- shirt -->
    <path d="M640,440 Q800,400 960,440 L985,${440 + 740 * shirt} Q800,${440 + 780 * shirt} 615,${440 + 740 * shirt} Z" fill="#EDE7DC" opacity="${shirt}"/>
    <!-- waistcoat -->
    <path d="M690,470 Q800,450 910,470 L935,${470 + 560 * vest} L800,${470 + 600 * vest} L665,${470 + 560 * vest} Z" fill="#26272b" opacity="${vest}"/>
    <!-- jacket -->
    <path d="M580,430 Q800,380 1020,430 L1060,${430 + 780 * jacket} Q800,${430 + 820 * jacket} 540,${430 + 780 * jacket} Z" fill="#16171A" opacity="${jacket}"/>
    <path d="M780,430 L800,${430 + 300 * jacket} L820,430 Z" fill="#0d0d0f" opacity="${jacket}"/>
    <circle cx="${cx}" cy="250" r="${300 * (1 - 0.6 * jacket) * s + 120}" fill="url(#g)" opacity="0.10"/>
    <defs><radialGradient id="g"><stop offset="0" stop-color="#B08D4F"/><stop offset="1" stop-color="transparent"/></radialGradient></defs>
  </svg>`;
}

async function render(dir, size, count, everyN) {
  for (let k = 0; k < count; k++) {
    const i = k * everyN;
    const buf = Buffer.from(svg(i, size));
    const file = `${dir}/frame-${pad(k)}.webp`;
    await mkdir(dirname(file), { recursive: true });
    await sharp(buf).webp({ quality: 78 }).toFile(file);
  }
  console.log(`wrote ${count} frames → ${dir}`);
}

await render(OUT, 960, COUNT, 1);
await render(OUT_SM, 800, 60, 2);
console.log("Placeholder sequence complete. Replace with real renders at the same paths.");
