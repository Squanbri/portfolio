import { Camera, Color, Mesh, Plane, Program, Renderer, Transform } from 'ogl';

type CssRgb = [number, number, number];

function parseHex(hex: string): CssRgb | null {
  const raw = hex.trim().replace('#', '');
  if (raw.length === 3) {
    const r = parseInt(raw[0] + raw[0], 16);
    const g = parseInt(raw[1] + raw[1], 16);
    const b = parseInt(raw[2] + raw[2], 16);
    return [r / 255, g / 255, b / 255];
  }
  if (raw.length === 6) {
    const r = parseInt(raw.slice(0, 2), 16);
    const g = parseInt(raw.slice(2, 4), 16);
    const b = parseInt(raw.slice(4, 6), 16);
    return [r / 255, g / 255, b / 255];
  }
  return null;
}

function cssColor(name: string, fallback: string): CssRgb {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return parseHex(value) ?? parseHex(fallback) ?? [0.9, 0.91, 0.91];
}

const LAYER_COUNT = 6;
/** Полный цикл idle-движения: медленно, но заметно глазу. */
const CYCLE_MS = 32000;

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/* Без fwidth: на WebGL1 он требует OES_standard_derivatives и легко ломает
   компиляцию — тогда canvas пустой, а фолбэк уже приглушён. */
const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec3 uLine;
  uniform vec3 uFill;
  uniform float uAlpha;
  uniform float uGrid;

  float gridLine(vec2 uv, float cells) {
    vec2 cell = fract(uv * cells);
    float thickness = 0.035;
    float gx = min(cell.x, 1.0 - cell.x);
    float gy = min(cell.y, 1.0 - cell.y);
    float lineX = 1.0 - smoothstep(0.0, thickness, gx);
    float lineY = 1.0 - smoothstep(0.0, thickness, gy);
    return max(lineX, lineY);
  }

  void main() {
    float border = 0.018;
    float frame = max(
      1.0 - smoothstep(0.0, border, min(vUv.x, 1.0 - vUv.x)),
      1.0 - smoothstep(0.0, border, min(vUv.y, 1.0 - vUv.y))
    );
    float grid = gridLine(vUv, uGrid);
    float mark = max(grid * 0.85, frame);
    vec3 color = mix(uFill, uLine, mark);
    float alpha = uAlpha * (0.12 + mark * 0.88);
    gl_FragColor = vec4(color, alpha);
  }
`;

export function mountHeroScene(stage: HTMLElement): () => void {
  const host = stage.querySelector<HTMLElement>('[data-hero-canvas-host]');
  if (!host) return () => {};

  const paper = cssColor('--paper', '#e6eae8');
  const ink = cssColor('--ink', '#15201e');
  const plotter = cssColor('--plotter', '#c42d18');
  const graphite = cssColor('--graphite', '#5a6764');

  let renderer: Renderer;
  try {
    renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      alpha: true,
      antialias: true,
      depth: true,
    });
  } catch {
    return () => {};
  }

  const { gl } = renderer;
  if (!gl) return () => {};

  gl.clearColor(paper[0], paper[1], paper[2], 0);
  host.appendChild(gl.canvas);
  gl.canvas.className = 'hero__canvas';

  const camera = new Camera(gl, { fov: 36, near: 0.1, far: 40 });
  camera.position.set(1.35, 1.1, 3.8);
  camera.lookAt([-0.2, 0.05, -0.8]);

  const scene = new Transform();
  const geometry = new Plane(gl, { width: 2.35, height: 1.55 });

  const layers: { mesh: Mesh; baseZ: number; baseX: number; baseY: number }[] =
    [];

  for (let i = 0; i < LAYER_COUNT; i++) {
    const depth = i / (LAYER_COUNT - 1);
    const near = 1 - depth;
    const line = new Color(
      plotter[0] * (0.55 + near * 0.45) + graphite[0] * depth * 0.35,
      plotter[1] * (0.55 + near * 0.45) + graphite[1] * depth * 0.35,
      plotter[2] * (0.55 + near * 0.45) + graphite[2] * depth * 0.35
    );

    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      cullFace: false,
      uniforms: {
        uLine: { value: line },
        uFill: {
          value: new Color(
            paper[0] * 0.82 + ink[0] * 0.18,
            paper[1] * 0.82 + ink[1] * 0.18,
            paper[2] * 0.82 + ink[2] * 0.18
          ),
        },
        uAlpha: { value: 0.9 - depth * 0.58 },
        uGrid: { value: 8 },
      },
    });

    if (!program.program) {
      gl.canvas.remove();
      return () => {};
    }

    const mesh = new Mesh(gl, { geometry, program });
    const baseZ = -i * 0.72;
    const baseX = -0.15 + i * 0.06;
    const baseY = 0.15 - i * 0.08;
    mesh.position.set(baseX, baseY, baseZ);
    // Меньший наклон: читаются как стопка панелей, а не как пол
    mesh.rotation.x = -0.62;
    mesh.rotation.y = 0.28;
    mesh.setParent(scene);
    layers.push({ mesh, baseZ, baseX, baseY });
  }

  let raf = 0;
  let visible = true;
  let pageVisible = document.visibilityState !== 'hidden';
  let running = false;
  let scrollPush = 0;
  let failed = false;

  const teardownCanvas = () => {
    stage.classList.remove('hero__stage--live');
    gl.canvas.remove();
  };

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    renderer.setSize(width, height);
    camera.perspective({ aspect: width / height });
  };

  const readScroll = () => {
    const rect = stage.getBoundingClientRect();
    const travel = Math.max(rect.height, 1);
    scrollPush = Math.min(1.2, Math.max(0, -rect.top / travel));
  };

  const frame = (t: number) => {
    if (!running || failed) return;
    raf = requestAnimationFrame(frame);

    try {
      const phase = (t % CYCLE_MS) / CYCLE_MS;
      const drift = Math.sin(phase * Math.PI * 2);
      const sway = Math.cos(phase * Math.PI * 2);

      camera.position.x = 1.35 + sway * 0.35;
      camera.position.y = 1.1 + drift * 0.18;
      camera.position.z = 3.8 - scrollPush * 2.6;
      camera.lookAt([
        -0.2 + sway * 0.1,
        0.05 - scrollPush * 0.2,
        -0.8 - scrollPush * 1.2,
      ]);

      for (const layer of layers) {
        layer.mesh.position.x = layer.baseX + sway * 0.04;
        layer.mesh.position.y = layer.baseY + drift * 0.03;
        layer.mesh.position.z = layer.baseZ + scrollPush * 0.55;
        layer.mesh.rotation.z = sway * 0.03;
      }

      renderer.render({ scene, camera });
    } catch {
      failed = true;
      pause();
      teardownCanvas();
    }
  };

  const play = () => {
    if (running || failed || !visible || !pageVisible) return;
    running = true;
    raf = requestAnimationFrame(frame);
  };

  const pause = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const onScroll = () => {
    readScroll();
  };

  const onVisibility = () => {
    pageVisible = document.visibilityState !== 'hidden';
    if (pageVisible) play();
    else pause();
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) play();
      else pause();
    },
    { rootMargin: '8% 0px', threshold: 0.02 }
  );

  resize();
  readScroll();
  io.observe(stage);
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);

  // Класс live — только после первого удачного кадра
  requestAnimationFrame((t) => {
    if (failed) return;
    try {
      renderer.render({ scene, camera });
      stage.classList.add('hero__stage--live');
      play();
    } catch {
      failed = true;
      teardownCanvas();
    }
    void t;
  });

  return () => {
    pause();
    io.disconnect();
    window.removeEventListener('resize', resize);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', onVisibility);
    teardownCanvas();
    const ext = gl.getExtension('WEBGL_lose_context');
    ext?.loseContext();
  };
}
