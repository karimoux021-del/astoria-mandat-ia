#!/usr/bin/env node
// Studio Astoria : transforme les photos d'un produit en visuels TikTok Shop (1080×1080, et 1080×1440 pour la principale).
// Usage : node studio/render.cjs studio/briefs/<produit>.json
// Le brief décrit le produit, ses photos (chemins relatifs au dépôt) et les textes en français.
const fs = require("fs"), path = require("path");
let chromium;
for (const p of ["playwright", "@playwright/test", require("child_process").execSync("npm root -g").toString().trim() + "/playwright"]) {
  try { ({ chromium } = require(p)); break; } catch (_) {}
}
if (!chromium) { console.error("Playwright introuvable : npm i -D playwright"); process.exit(1); }

const ROOT = path.resolve(__dirname, "..");
const briefPath = path.resolve(process.argv[2] || "");
if (!fs.existsSync(briefPath)) { console.error("Brief introuvable : " + briefPath); process.exit(1); }
const brief = JSON.parse(fs.readFileSync(briefPath, "utf8"));
const outDir = brief.sortie && path.isAbsolute(brief.sortie) ? brief.sortie : path.join(ROOT, brief.sortie || `visuels/${brief.produit}`);
fs.mkdirSync(outDir, { recursive: true });

const mime = f => ({ ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" })[path.extname(f).toLowerCase()] || "image/png";
const photos = {};
for (const [k, v] of Object.entries(brief.photos || {})) {
  const file = typeof v === "string" ? v : v.fichier;
  const abs = path.isAbsolute(file) ? file : path.join(ROOT, file);
  if (!fs.existsSync(abs)) { console.warn(`Photo absente (${k}) : ${file}`); continue; }
  photos[k] = { src: `data:${mime(abs)};base64,${fs.readFileSync(abs).toString("base64")}`, crop: v.crop || null, detourer: v.detourer !== false };
}
if (!photos.principale) { console.error("Il faut au moins une photo « principale » du produit."); process.exit(1); }

const template = fs.readFileSync(path.join(__dirname, "templates", "visuels.html"), "utf8");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  await page.setContent(template, { waitUntil: "load" });
  const slides = await page.evaluate(async ({ brief, photos }) => window.preparer(brief, photos), { brief, photos });
  for (const s of slides) {
    await page.setViewportSize({ width: s.w, height: s.h });
    await page.evaluate(id => window.afficher(id), s.id);
    await page.waitForTimeout(80);
    const file = path.join(outDir, `${s.ordre}-${s.id}.jpg`);
    await page.screenshot({ path: file, type: "jpeg", quality: 92, clip: { x: 0, y: 0, width: s.w, height: s.h } });
    const kb = Math.round(fs.statSync(file).size / 1024);
    console.log(`✓ ${path.relative(ROOT, file)} (${s.w}×${s.h}, ${kb} Ko)`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
