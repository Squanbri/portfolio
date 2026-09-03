import { mkdir } from 'node:fs/promises';
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = process.env.BASE ?? 'http://localhost:4321';
const PATHNAME = process.env.PAGE ?? '/';
const WIDTH = Number(process.env.WIDTH ?? 390);
const TAG = process.env.TAG ?? 'slice';

await mkdir('.shots', { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb'],
});

const page = await browser.newPage();
await page.setViewport({
  width: WIDTH,
  height: 900,
  deviceScaleFactor: 2,
  isMobile: WIDTH < 700,
});
await page.goto(BASE + PATHNAME, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 700));

const bands = await page.$$('.band');
let i = 0;
for (const band of bands) {
  i += 1;
  await band.screenshot({ path: `.shots/${TAG}-${i}.png` });
}
console.log(`saved ${i} band screenshots as .shots/${TAG}-N.png`);

await browser.close();
