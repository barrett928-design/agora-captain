// Generates icon-192.png and icon-512.png using Playwright
import { chromium } from '@playwright/test';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const iconHtml = (size) => `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: ${size}px; height: ${size}px; background: transparent; }
  .icon {
    width: ${size}px;
    height: ${size}px;
    background: linear-gradient(145deg, #081d2b 0%, #133d58 60%, #0e3a54 100%);
    border-radius: ${Math.round(size * 0.22)}px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
</style>
</head>
<body>
<div class="icon">
  <svg width="${size * 0.62}" height="${size * 0.62}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Outer dashed ring -->
    <circle cx="50" cy="50" r="44" stroke="#C8472A" stroke-width="2.5" stroke-dasharray="5 4"/>
    <!-- Inner ring -->
    <circle cx="50" cy="50" r="36" stroke="rgba(200,71,42,0.25)" stroke-width="1"/>
    <!-- North pointer (cream/bright) -->
    <polygon points="50,8 55,44 50,40 45,44" fill="#F0EAD8"/>
    <!-- South pointer (muted) -->
    <polygon points="50,92 45,56 50,60 55,56" fill="#9BAAB4"/>
    <!-- East pointer (small, subtle) -->
    <polygon points="92,50 56,55 60,50 56,45" fill="rgba(155,170,180,0.5)"/>
    <!-- West pointer (small, subtle) -->
    <polygon points="8,50 44,45 40,50 44,55" fill="rgba(155,170,180,0.5)"/>
    <!-- Center dot -->
    <circle cx="50" cy="50" r="5" fill="#C8472A"/>
    <circle cx="50" cy="50" r="2.5" fill="#F0EAD8"/>
    <!-- Cardinal tick marks -->
    <line x1="50" y1="3" x2="50" y2="9" stroke="#C8472A" stroke-width="2" stroke-linecap="round"/>
    <line x1="97" y1="50" x2="91" y2="50" stroke="rgba(200,71,42,0.4)" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="50" y1="97" x2="50" y2="91" stroke="rgba(200,71,42,0.4)" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="3" y1="50" x2="9" y2="50" stroke="rgba(200,71,42,0.4)" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
</div>
</body>
</html>`;

async function generateIcon(size, outputPath) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(iconHtml(size));
  await page.waitForTimeout(100);
  const screenshot = await page.screenshot({
    clip: { x: 0, y: 0, width: size, height: size },
    omitBackground: true,
  });
  writeFileSync(outputPath, screenshot);
  await browser.close();
  console.log(`Generated ${outputPath} (${size}x${size})`);
}

const publicDir = join(__dirname, '..', 'public');
await generateIcon(192, join(publicDir, 'icon-192.png'));
await generateIcon(512, join(publicDir, 'icon-512.png'));
await generateIcon(180, join(publicDir, 'apple-touch-icon.png'));
console.log('Done.');
