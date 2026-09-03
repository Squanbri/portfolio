import { mkdir } from 'node:fs/promises';
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = process.env.BASE ?? 'http://localhost:4321';
const OUT = '.shots';

const pages = [
  { name: 'home', path: '/' },
  { name: 'project', path: '/projects/letter-box/' },
];

const viewports = [
  { name: '320', width: 320, height: 720, dsf: 2, mobile: true },
  { name: '390', width: 390, height: 844, dsf: 2, mobile: true },
  { name: '1440', width: 1440, height: 900, dsf: 1, mobile: false },
];

const overflowProbe = () => {
  const limit = document.documentElement.clientWidth;
  const bad = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.right > limit + 0.5 || r.left < -0.5) {
      bad.push(
        `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} ` +
          `left=${Math.round(r.left)} right=${Math.round(r.right)}`
      );
    }
  }
  return {
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: limit,
    bodyScrollWidth: document.body.scrollWidth,
    offenders: bad.slice(0, 12),
  };
};

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb'],
});

for (const p of pages) {
  for (const v of viewports) {
    const page = await browser.newPage();
    await page.setViewport({
      width: v.width,
      height: v.height,
      deviceScaleFactor: v.dsf,
      isMobile: v.mobile,
      hasTouch: v.mobile,
    });
    await page.goto(BASE + p.path, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));

    const probe = await page.evaluate(overflowProbe);
    const ok =
      probe.scrollWidth <= probe.clientWidth && probe.offenders.length === 0;
    console.log(
      `\n${p.name} @ ${v.name}px  ${ok ? 'OK' : 'OVERFLOW'}  ` +
        `scrollWidth=${probe.scrollWidth} client=${probe.clientWidth}`
    );
    for (const o of probe.offenders) console.log('   ', o);

    await page.screenshot({
      path: `${OUT}/${p.name}-${v.name}.png`,
      fullPage: true,
    });
    await page.close();
  }
}

await browser.close();
