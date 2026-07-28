function initThemeToggle() {
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!button) return;

  button.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* ignore */
    }
  });
}

function initMobileMenu() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-mobile-nav]');
  if (!toggle || !panel) return;

  const setOpen = (open: boolean) => {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  };

  toggle.addEventListener('click', () => {
    setOpen(panel.hidden);
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
}

type GalleryImage = { src: string; alt: string };

function ensureLightbox() {
  let dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');
  if (dialog) return dialog;

  dialog = document.createElement('dialog');
  dialog.setAttribute('data-lightbox', '');
  dialog.className = 'lightbox';
  dialog.innerHTML = `
    <div class="lightbox-panel">
      <button type="button" class="lightbox-close" data-lightbox-close aria-label="Закрыть">×</button>
      <button type="button" class="lightbox-nav prev" data-lightbox-prev aria-label="Предыдущий">←</button>
      <figure class="lightbox-figure">
        <img data-lightbox-image alt="" />
        <figcaption data-lightbox-caption></figcaption>
      </figure>
      <button type="button" class="lightbox-nav next" data-lightbox-next aria-label="Следующий">→</button>
    </div>
  `;
  document.body.appendChild(dialog);
  return dialog;
}

function createLightboxController() {
  const dialog = ensureLightbox();
  const imageEl = dialog.querySelector<HTMLImageElement>('[data-lightbox-image]')!;
  const captionEl = dialog.querySelector<HTMLElement>('[data-lightbox-caption]')!;
  const closeBtn = dialog.querySelector<HTMLButtonElement>('[data-lightbox-close]')!;
  const prevBtn = dialog.querySelector<HTMLButtonElement>('[data-lightbox-prev]')!;
  const nextBtn = dialog.querySelector<HTMLButtonElement>('[data-lightbox-next]')!;

  let images: GalleryImage[] = [];
  let index = 0;
  let touchStartX = 0;

  const render = () => {
    const current = images[index];
    if (!current) return;
    imageEl.src = current.src;
    imageEl.alt = current.alt;
    captionEl.textContent = current.alt;
    const multi = images.length > 1;
    prevBtn.hidden = !multi;
    nextBtn.hidden = !multi;
  };

  const goTo = (nextIndex: number) => {
    if (!images.length) return;
    index = (nextIndex + images.length) % images.length;
    render();
  };

  const close = () => {
    if (dialog.open) dialog.close();
  };

  const open = (nextImages: GalleryImage[], nextIndex: number) => {
    images = nextImages;
    index = nextIndex;
    render();
    if (!dialog.open) dialog.showModal();
  };

  closeBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    close();
  });
  prevBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    goTo(index - 1);
  });
  nextBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    goTo(index + 1);
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });

  window.addEventListener('keydown', (event) => {
    if (!dialog.open) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') goTo(index - 1);
    if (event.key === 'ArrowRight') goTo(index + 1);
  });

  dialog.addEventListener(
    'touchstart',
    (event) => {
      touchStartX = event.changedTouches[0]?.clientX ?? 0;
    },
    { passive: true },
  );

  dialog.addEventListener(
    'touchend',
    (event) => {
      const endX = event.changedTouches[0]?.clientX ?? 0;
      const delta = endX - touchStartX;
      if (Math.abs(delta) < 40) return;
      goTo(delta < 0 ? index + 1 : index - 1);
    },
    { passive: true },
  );

  return { open };
}

function parseImages(root: HTMLElement): GalleryImage[] {
  const raw = root.dataset.images;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as GalleryImage[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch {
      /* fall through */
    }
  }

  return Array.from(root.querySelectorAll<HTMLImageElement>('[data-slide-image]')).map((img) => ({
    src: img.currentSrc || img.src,
    alt: img.alt,
  }));
}

function initSliders() {
  const lightbox = createLightboxController();

  document.querySelectorAll<HTMLElement>('[data-slider]').forEach((root) => {
    const viewport = root.querySelector<HTMLElement>('[data-viewport]');
    const track = root.querySelector<HTMLElement>('[data-track]');
    const slides = root.querySelectorAll('.slide');
    const dots = root.querySelectorAll<HTMLButtonElement>('[data-dot]');
    const prev = root.querySelector<HTMLButtonElement>('[data-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-next]');
    if (!viewport || !track || slides.length === 0) return;

    const images = parseImages(root);
    let index = 0;
    let activePointer: number | null = null;
    let startX = 0;
    let deltaX = 0;
    let dragging = false;

    const paint = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    };

    const goTo = (nextIndex: number) => {
      index = (nextIndex + slides.length) % slides.length;
      track.classList.remove('is-dragging');
      paint();
    };

    const openCurrent = () => {
      lightbox.open(images, index);
    };

    prev?.addEventListener('click', () => goTo(index - 1));
    next?.addEventListener('click', () => goTo(index + 1));

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const i = Number(dot.dataset.dot);
        if (!Number.isNaN(i)) goTo(i);
      });
    });

    // Double-click / double-tap friendly open without fighting drag.
    viewport.addEventListener('dblclick', openCurrent);

    viewport.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      activePointer = event.pointerId;
      startX = event.clientX;
      deltaX = 0;
      dragging = false;
    });

    viewport.addEventListener('pointermove', (event) => {
      if (activePointer !== event.pointerId) return;
      deltaX = event.clientX - startX;

      if (!dragging && Math.abs(deltaX) > 8) {
        dragging = true;
        track.classList.add('is-dragging');
        viewport.classList.add('is-dragging');
        try {
          viewport.setPointerCapture(event.pointerId);
        } catch {
          /* ignore */
        }
      }

      if (!dragging) return;
      const width = viewport.clientWidth || 1;
      const percent = (deltaX / width) * 100;
      track.style.transform = `translateX(calc(-${index * 100}% + ${percent}%))`;
    });

    const endPointer = (event: PointerEvent) => {
      if (activePointer !== event.pointerId) return;
      activePointer = null;
      viewport.classList.remove('is-dragging');

      const width = viewport.clientWidth || 1;
      const threshold = Math.min(70, width * 0.16);

      if (dragging) {
        if (Math.abs(deltaX) > threshold) {
          goTo(deltaX < 0 ? index + 1 : index - 1);
        } else {
          goTo(index);
        }
      } else if (Math.abs(deltaX) < 8) {
        // Tap / click opens lightbox.
        openCurrent();
      }

      dragging = false;
      deltaX = 0;
    };

    viewport.addEventListener('pointerup', endPointer);
    viewport.addEventListener('pointercancel', endPointer);
  });
}

type TerminalTone = 'cmd' | 'ok' | 'err' | 'warn' | 'muted' | 'dim' | 'plain';

type TerminalStep =
  | { kind: 'type'; text: string; delay?: number }
  | { kind: 'line'; text: string; tone?: TerminalTone; delay?: number }
  | { kind: 'progress'; label: string; delay?: number }
  | { kind: 'pause'; delay: number };

const terminalScript: TerminalStep[] = [
  { kind: 'type', text: 'npm install', delay: 280 },
  { kind: 'line', text: 'npm warn deprecated inflight@1.0.6', tone: 'warn', delay: 120 },
  { kind: 'line', text: 'npm warn deprecated rimraf@3.0.2', tone: 'warn', delay: 100 },
  { kind: 'progress', label: 'fetching packages', delay: 60 },
  { kind: 'line', text: 'added 247 packages in 3.8s', tone: 'ok', delay: 180 },
  { kind: 'line', text: '24 packages are looking for funding', tone: 'muted', delay: 90 },
  { kind: 'pause', delay: 220 },
  { kind: 'type', text: 'npm run build', delay: 200 },
  { kind: 'line', text: '> portfolio@1.0.0 build', tone: 'dim', delay: 80 },
  { kind: 'line', text: '> astro build', tone: 'dim', delay: 70 },
  { kind: 'line', text: '✓ 38 modules transformed.', tone: 'ok', delay: 140 },
  { kind: 'line', text: 'dist/index.html                   12.4 kB', tone: 'muted', delay: 70 },
  { kind: 'line', text: 'dist/assets/index-a3f2.css         8.1 kB', tone: 'muted', delay: 70 },
  { kind: 'line', text: '✓ built in 1.84s', tone: 'ok', delay: 200 },
  { kind: 'pause', delay: 240 },
  { kind: 'type', text: 'npm run test', delay: 180 },
  { kind: 'line', text: ' FAIL  src/utils/format.spec.ts', tone: 'err', delay: 140 },
  { kind: 'line', text: '  Expected: "5y 10m"', tone: 'err', delay: 90 },
  { kind: 'line', text: '  Received: "5 years"', tone: 'err', delay: 90 },
  { kind: 'line', text: 'Tests: 1 failed, 11 passed', tone: 'warn', delay: 180 },
  { kind: 'pause', delay: 260 },
  { kind: 'type', text: 'git push origin main', delay: 200 },
  { kind: 'line', text: 'error: failed to push some refs', tone: 'err', delay: 160 },
  { kind: 'line', text: 'hint: Updates were rejected (non-fast-forward)', tone: 'muted', delay: 120 },
  { kind: 'pause', delay: 240 },
  { kind: 'type', text: 'npm run deploy', delay: 180 },
  { kind: 'line', text: '▲ Deploying to production…', tone: 'dim', delay: 120 },
  { kind: 'progress', label: 'uploading', delay: 50 },
  { kind: 'line', text: '✓ Deployment complete', tone: 'ok', delay: 160 },
  { kind: 'line', text: 'https://markitan.dev', tone: 'ok', delay: 320 },
  { kind: 'pause', delay: 900 },
];

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function createLine(html: string) {
  const line = document.createElement('p');
  line.className = 'line';
  line.innerHTML = html;
  return line;
}

function toneClass(tone: TerminalTone = 'plain') {
  return tone === 'plain' ? '' : tone;
}

async function typeCommand(
  root: HTMLElement,
  text: string,
  reducedMotion: boolean,
) {
  const line = createLine(`<span class="prompt">$</span> <span class="cmd"></span>`);
  const cmd = line.querySelector('.cmd')!;
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  line.appendChild(cursor);
  root.appendChild(line);
  root.scrollTop = root.scrollHeight;

  if (reducedMotion) {
    cmd.textContent = text;
    cursor.remove();
    return;
  }

  for (let i = 1; i <= text.length; i += 1) {
    cmd.textContent = text.slice(0, i);
    root.scrollTop = root.scrollHeight;
    await sleep(28 + Math.random() * 42);
  }

  cursor.remove();
}

async function appendProgress(
  root: HTMLElement,
  label: string,
  reducedMotion: boolean,
) {
  const line = createLine(`<span class="dim">${label}</span> <span class="ok"></span>`);
  const bar = line.querySelector('.ok')!;
  root.appendChild(line);

  if (reducedMotion) {
    bar.textContent = '[██████████] 100%';
    return;
  }

  const frames = [
    '[█·········] 12%',
    '[███·······] 28%',
    '[█████·····] 51%',
    '[███████···] 74%',
    '[█████████·] 91%',
    '[██████████] 100%',
  ];

  for (const frame of frames) {
    bar.textContent = frame;
    root.scrollTop = root.scrollHeight;
    await sleep(110 + Math.random() * 80);
  }
}

async function initTerminal() {
  const root = document.querySelector<HTMLElement>('[data-terminal-log]');
  if (!root) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const maxLines = 14;

  const trim = () => {
    while (root.children.length > maxLines) {
      root.firstElementChild?.remove();
    }
  };

  const runCycle = async () => {
    for (const step of terminalScript) {
      if (step.kind === 'pause') {
        await sleep(reducedMotion ? Math.min(step.delay, 120) : step.delay);
        continue;
      }

      if (step.kind === 'type') {
        await typeCommand(root, step.text, reducedMotion);
        trim();
        await sleep(reducedMotion ? 40 : (step.delay ?? 160));
        continue;
      }

      if (step.kind === 'progress') {
        await appendProgress(root, step.label, reducedMotion);
        trim();
        await sleep(reducedMotion ? 40 : (step.delay ?? 80));
        continue;
      }

      const cls = toneClass(step.tone);
      root.appendChild(createLine(cls ? `<span class="${cls}">${step.text}</span>` : step.text));
      trim();
      root.scrollTop = root.scrollHeight;
      await sleep(reducedMotion ? 30 : (step.delay ?? 140));
    }
  };

  // Keep looping so the terminal never feels empty.
  for (;;) {
    await runCycle();
  }
}

initThemeToggle();
initMobileMenu();
initSliders();
void initTerminal();
