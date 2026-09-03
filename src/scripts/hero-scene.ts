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
const CYCLE_MS = 48000;

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

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec3 uLine;
  uniform vec3 uFill;
  uniform float uAlpha;
  uniform float uGrid;

  float gridLine(vec2 uv, float cells) {
    vec2 g = abs(fract(uv * cells - 0.5) - 0.5);
    vec2 fw = fwidth(uv * cells);
    vec2 line = 1.0 - smoothstep(vec2(0.0), max(fw * 1.15, vec2(0.02)), g);
    return max(line.x, line.y);
  }

  void main() {
    float edge = max(
      smoothstep(0.0, 0.012, min(vUv.x, vUv.y)),
      smoothstep(0.0, 0.012, min(1.0 - vUv.x, 1.0 - vUv.y))
    );
    float frame = 1.0 - edge;
    float grid = gridLine(vUv, uGrid);
    float mark = max(grid * 0.92, frame);
    vec3 color = mix(uFill, uLine, mark);
    float alpha = uAlpha * (0.08 + mark * 0.9);
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

  const renderer = new Renderer({
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    alpha: true,
    antialias: true,
    depth: true,
  });
  const { gl } = renderer;
  gl.clearColor(paper[0], paper[1], paper[2], 0);
  host.appendChild(gl.canvas);
  gl.canvas.className = 'hero__canvas';

  const camera = new Camera(gl, { fov: 36, near: 0.1, far: 40 });
  camera.position.set(0, 1.35, 4.2);
  camera.lookAt([0, 0, 0]);

  const scene = new Transform();
  const geometry = new Plane(gl, { width: 2.4, height: 1.7 });

  const layers: { mesh: Mesh; baseZ: number; program: Program }[] = [];

  for (let i = 0; i < LAYER_COUNT; i++) {
    const depth = i / (LAYER_COUNT - 1);
    const line =
      depth < 0.35
        ? new Color(
            plotter[0] * (1 - depth) + graphite[0] * depth,
            plotter[1] * (1 - depth) + graphite[1] * depth,
            plotter[2] * (1 - depth) + graphite[2] * depth
          )
        : new Color(
            graphite[0] * (1 - (depth - 0.35)) + paper[0] * (depth - 0.35),
            graphite[1] * (1 - (depth - 0.35)) + paper[1] * (depth - 0.35),
            graphite[2] * (1 - (depth - 0.35)) + paper[2] * (depth - 0.35)
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
            paper[0] * 0.92 + ink[0] * 0.08,
            paper[1] * 0.92 + ink[1] * 0.08,
            paper[2] * 0.92 + ink[2] * 0.08
          ),
        },
        uAlpha: { value: 0.72 - depth * 0.5 },
        uGrid: { value: 10 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    const baseZ = -i * 0.48;
    mesh.position.set(0, -0.15 - i * 0.04, baseZ);
    mesh.rotation.x = -1.02;
    mesh.setParent(scene);
    layers.push({ mesh, baseZ, program });
  }

  let raf = 0;
  let visible = true;
  let pageVisible = document.visibilityState !== 'hidden';
  let running = false;
  let scrollPush = 0;
  let width = 0;
  let height = 0;

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    renderer.setSize(width, height);
    camera.perspective({ aspect: width / height });
  };

  const readScroll = () => {
    const rect = stage.getBoundingClientRect();
    const travel = Math.max(rect.height, 1);
    scrollPush = Math.min(1.35, Math.max(0, -rect.top / travel));
  };

  const frame = (t: number) => {
    if (!running) return;
    raf = requestAnimationFrame(frame);

    const phase = (t % CYCLE_MS) / CYCLE_MS;
    const drift = Math.sin(phase * Math.PI * 2) * 0.08;
    const sway = Math.cos(phase * Math.PI * 2) * 0.045;

    camera.position.x = sway;
    camera.position.y = 1.35 + drift * 0.25;
    camera.position.z = 4.2 - scrollPush * 2.4;
    camera.lookAt([0, -0.05 - scrollPush * 0.2, -scrollPush * 0.9]);

    for (const layer of layers) {
      layer.mesh.position.z = layer.baseZ + scrollPush * 0.35;
      layer.mesh.rotation.z = sway * 0.08;
    }

    renderer.render({ scene, camera });
  };

  const play = () => {
    if (running || !visible || !pageVisible) return;
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
  stage.classList.add('hero__stage--live');
  play();

  return () => {
    pause();
    io.disconnect();
    window.removeEventListener('resize', resize);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', onVisibility);
    stage.classList.remove('hero__stage--live');
    gl.canvas.remove();
    const ext = gl.getExtension('WEBGL_lose_context');
    ext?.loseContext();
  };
}
