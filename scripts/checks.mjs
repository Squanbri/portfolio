/**
 * Проверки, которые легко сломать глазами: бюджет JS, переходы между
 * страницами, поведение без JS и при prefers-reduced-motion.
 */
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = process.env.BASE ?? 'http://localhost:4321';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars'],
});

const line = (label, value) => console.log(`${label.padEnd(34)} ${value}`);

// --- бюджет JS -------------------------------------------------------------
{
  const page = await browser.newPage();
  const bytes = new Map();
  page.on('response', async (res) => {
    const type = res.request().resourceType();
    if (type !== 'script') return;
    try {
      const buf = await res.buffer();
      bytes.set(res.url(), buf.length);
    } catch {}
  });
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
  const total = [...bytes.values()].reduce((a, b) => a + b, 0);
  line('внешний JS, всего (без сжатия)', `${(total / 1024).toFixed(1)} КБ`);
  for (const [url, size] of bytes) {
    line(`  ${url.split('/').pop().slice(0, 30)}`, `${(size / 1024).toFixed(1)} КБ`);
  }
  await page.close();
}

// --- совпадение имён для View Transitions ----------------------------------
{
  const page = await browser.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
  const onHome = await page.$$eval('[style*="view-transition-name"]', (els) =>
    els.map((e) => e.style.viewTransitionName)
  );
  await page.goto(BASE + '/projects/letter-box/', { waitUntil: 'networkidle0' });
  const onProject = await page.$$eval('[style*="view-transition-name"]', (els) =>
    els.map((e) => e.style.viewTransitionName)
  );
  const shared = onProject.filter((n) => onHome.includes(n));
  line('общие view-transition-name', shared.join(', ') || 'НЕТ СОВПАДЕНИЙ');
  await page.close();
}

// --- страница без JS -------------------------------------------------------
{
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const state = await page.evaluate(() => 0).catch(() => null);
  const text = await page.$eval('body', (b) => b.innerText);
  const clock = await page.$eval('[data-clock]', (e) => e.textContent.trim());
  const copyHidden = await page.$eval('[data-copy]', (e) => e.hidden);
  line('без JS: длина текста', `${text.length} символов`);
  line('без JS: часы показывают', clock);
  line('без JS: кнопка копирования скрыта', copyHidden ? 'да' : 'НЕТ');
  line('без JS: есть заголовок', /Собираю продукты целиком/.test(text) ? 'да' : 'НЕТ');
  line('без JS: есть контакты', /yandex\.ru/.test(text) ? 'да' : 'НЕТ');
  void state;
  await page.close();
}

// --- выносная линия на скролле ---------------------------------------------
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
  const scaleY = () =>
    page.$eval('.projects__pen', (el) => {
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
      return m.d.toFixed(2);
    });
  const steps = [0, 500, 1000, 1600, 2400];
  const drawn = [];
  for (const y of steps) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await new Promise((r) => setTimeout(r, 250));
    drawn.push(`${y}px→${await scaleY()}`);
  }
  line('выносная линия (scaleY по скроллу)', drawn.join('  '));
  await page.close();
}

// --- скриншоты на странице проекта -----------------------------------------
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(BASE + '/projects/letter-box/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 1500));
  const imgs = await page.$$eval('.shot img', (els) =>
    els.map(
      (i) =>
        `${i.currentSrc.split('/').pop().slice(0, 22)} ${i.naturalWidth}x${i.naturalHeight} attr=${i.getAttribute('width')}x${i.getAttribute('height')}`
    )
  );
  line('картинки проекта', String(imgs.length));
  for (const i of imgs) line('  ', i);
  await page.close();
}

// --- prefers-reduced-motion ------------------------------------------------
{
  const page = await browser.newPage();
  await page.emulateMediaFeatures([
    { name: 'prefers-reduced-motion', value: 'reduce' },
  ]);
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 400));
  const running = await page.evaluate(
    () => document.getAnimations().filter((a) => a.playState === 'running').length
  );
  const clock = await page.$eval('[data-clock]', (e) => e.textContent.trim());
  line('reduced-motion: живых анимаций', String(running));
  line('reduced-motion: часы', `${clock} (без секунд)`);
  await page.close();
}

await browser.close();
