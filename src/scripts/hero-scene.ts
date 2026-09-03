import { Camera, Color, Mesh, Plane, Program, Renderer, Transform } from 'ogl';

type CssRgb = [number, number, number];

type Layer = {
  mesh: Mesh;
  program: Program;
  baseY: number;
};

type Profile = {
  layers: number;
  step: number;
  cell: number;
  amplitude: number;
  fov: number;
  /** Непрозрачности сверху вниз — нелинейное затухание */
  opacities: number[];
};

const DESKTOP: Profile = {
  layers: 5,
  step: 1.2,
  cell: 1.0,
  amplitude: 0.12,
  fov: 45,
  opacities: [0.45, 0.28, 0.16, 0.09, 0.05],
};

const MOBILE: Profile = {
  layers: 3,
  step: 1.6,
  cell: 1.5,
  amplitude: 0.08,
  fov: 55,
  opacities: [0.45, 0.22, 0.08],
};

const PLANE_SIZE = 40;
const SEGMENTS = 48;
const CAMERA_HEIGHT = 2.5;
const TILT_DEG = 18;
const TIME_SPEED = 0.15;
/** Периоды волн — взаимно некратные, чтобы цикл не читался */
const WAVE_FX = 0.37;
const WAVE_FZ = 0.23;
const WAVE_SZ = 0.097;
const POINTER_YAW_MAX = (2.5 * Math.PI) / 180;
const POINTER_PITCH_MAX = (1.5 * Math.PI) / 180;
const POINTER_LERP = 0.04;
const EDGE_INNER = 6;
const EDGE_OUTER = 18;

function parseHex(hex: string): CssRgb | null {
  const raw = hex.trim().replace('#', '');
  if (raw.length === 3) {
    return [
      parseInt(raw[0] + raw[0], 16) / 255,
      parseInt(raw[1] + raw[1], 16) / 255,
      parseInt(raw[2] + raw[2], 16) / 255,
    ];
  }
  if (raw.length === 6) {
    return [
      parseInt(raw.slice(0, 2), 16) / 255,
      parseInt(raw.slice(2, 4), 16) / 255,
      parseInt(raw.slice(4, 6), 16) / 255,
    ];
  }
  return null;
}

function cssColor(name: string, fallback: string): CssRgb {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return parseHex(value) ?? parseHex(fallback) ?? [0.08, 0.12, 0.12];
}

function isMobileProfile() {
  return (
    window.innerWidth < 768 ||
    matchMedia('(pointer: coarse)').matches
  );
}

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec2 uv;

  uniform mat4 modelMatrix;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uAmplitude;

  varying vec3 vWorldPos;
  varying vec2 vPlane;

  void main() {
    // Плоскость OGL лежит в XY; после rotation.x = -PI/2 локальный XY → мировой XZ,
    // локальный Z → мировой Y. Колыхание смещает по нормали (локальный Z).
    float wave =
      sin(position.x * ${WAVE_FX.toFixed(3)} + uTime * ${TIME_SPEED.toFixed(3)}) * 0.5 +
      sin(position.y * ${WAVE_FZ.toFixed(3)} + uTime * ${WAVE_SZ.toFixed(3)}) * 0.5;

    vec3 pos = position;
    pos.z += wave * uAmplitude;

    vec4 world = modelMatrix * vec4(pos, 1.0);
    vWorldPos = world.xyz;
    vPlane = position.xy;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragment = /* glsl */ `
  #extension GL_OES_standard_derivatives : enable
  precision highp float;

  varying vec3 vWorldPos;
  varying vec2 vPlane;

  uniform vec3 uLine;
  uniform vec3 uAccent;
  uniform float uAccentMix;
  uniform float uAlpha;
  uniform float uCell;
  uniform float uGridPhase;
  uniform vec3 uCameraPos;

  float gridLine(vec2 coord) {
    vec2 grid = abs(fract(coord - 0.5) - 0.5);
    // На первом кадре fwidth может быть 0 → smoothstep(0,0,x) даёт мусор и пустой кадр
    vec2 fw = max(fwidth(coord), vec2(0.0015));
    vec2 line = 1.0 - smoothstep(vec2(0.0), fw * 1.25, grid);
    return max(line.x, line.y);
  }

  void main() {
    float r = length(vPlane);
    float edge = 1.0 - smoothstep(${EDGE_INNER.toFixed(1)}, ${EDGE_OUTER.toFixed(1)}, r);

    vec3 viewDir = normalize(uCameraPos - vWorldPos);
    // Нормаль горизонтальной плоскости — (0,1,0). У горизонта ndotv → 0.
    float ndotv = abs(dot(vec3(0.0, 1.0, 0.0), viewDir));
    float grazing = smoothstep(0.04, 0.28, ndotv);

    float grid = gridLine((vPlane + vec2(uGridPhase, uGridPhase * 1.31)) / uCell);
    float mark = grid * grazing;
    if (mark < 0.004 || edge < 0.004) discard;

    vec3 color = mix(uLine, uAccent, uAccentMix);
    float alpha = uAlpha * edge * mark;
    gl_FragColor = vec4(color, alpha);
  }
`;

export function mountHeroScene(stage: HTMLElement): () => void {
  const host = stage.querySelector<HTMLElement>('[data-hero-canvas-host]');
  if (!host) return () => {};

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let profile = isMobileProfile() ? MOBILE : DESKTOP;
  let layerCount = profile.layers;

  const ink = cssColor('--ink', '#15201e');
  const plotter = cssColor('--plotter', '#c42d18');

  let renderer: Renderer;
  try {
    // WebGL1: fwidth доступен через OES_standard_derivatives.
    // На WebGL2 расширение в GLSL ES 1.00 часто «not supported», а OGL
    // пишет шейдеры именно в ES 1.00 — поэтому явно берём WebGL1.
    renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      alpha: true,
      antialias: true,
      depth: true,
      premultipliedAlpha: false,
      webgl: 1,
    });
  } catch {
    return () => {};
  }

  const { gl } = renderer;
  if (!gl) return () => {};

  const derivatives = gl.getExtension('OES_standard_derivatives');
  if (!derivatives) {
    // Без экранных производных сетка даст муар — лучше статичный фолбэк
    return () => {};
  }

  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  host.appendChild(gl.canvas);
  gl.canvas.className = 'hero__canvas';

  const camera = new Camera(gl, {
    fov: profile.fov,
    near: 0.1,
    far: 80,
  });
  const scene = new Transform();
  const geometry = new Plane(gl, {
    width: PLANE_SIZE,
    height: PLANE_SIZE,
    widthSegments: SEGMENTS,
    heightSegments: SEGMENTS,
  });

  let layers: Layer[] = [];

  const buildLayers = (count: number) => {
    for (const layer of layers) {
      layer.mesh.setParent(null);
    }
    layers = [];

    // Добавляем от дальнего к ближнему — прозрачность рисуется back-to-front
    for (let i = count - 1; i >= 0; i--) {
      const program = new Program(gl, {
        vertex,
        fragment,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        cullFace: false,
        uniforms: {
          uTime: { value: 0 },
          uAmplitude: { value: reduced ? 0 : profile.amplitude },
          uLine: { value: new Color(ink[0], ink[1], ink[2]) },
          uAccent: { value: new Color(plotter[0], plotter[1], plotter[2]) },
          uAccentMix: { value: i === 0 ? 0.18 : 0 },
          uAlpha: { value: profile.opacities[i] ?? 0.05 },
          uCell: { value: profile.cell },
          uGridPhase: { value: i * 0.37 },
          uCameraPos: { value: [0, 0, 0] },
        },
      });

      if (!program.program) {
        throw new Error('hero shader failed');
      }

      const mesh = new Mesh(gl, { geometry, program });
      const baseY = -i * profile.step;
      mesh.position.set(0, baseY, 0);
      mesh.rotation.x = -Math.PI / 2;
      mesh.setParent(scene);
      layers.push({ mesh, program, baseY });
    }
  };

  try {
    buildLayers(layerCount);
  } catch {
    gl.canvas.remove();
    return () => {};
  }

  let raf = 0;
  let running = false;
  let visible = true;
  let pageVisible = document.visibilityState !== 'hidden';
  let failed = false;
  let scrollPush = 0;
  let pointerYaw = 0;
  let pointerPitch = 0;
  let targetYaw = 0;
  let targetPitch = 0;
  let frameSamples: number[] = [];
  let lastT = 0;
  let degradeClock = 0;

  const applyCamera = (timeSec: number) => {
    const nearest = layers.reduce(
      (max, layer) => Math.max(max, layer.mesh.position.y),
      -Infinity
    );
    // Базовая высота: 2.5 над ближним листом, плюс прокрутка вниз
    const baseY = nearest + CAMERA_HEIGHT - scrollPush * profile.step * 2;
    const tilt = (TILT_DEG * Math.PI) / 180;
    const dist = 10;

    const yaw = pointerYaw;
    const pitch = tilt + pointerPitch;

    const dirX = Math.sin(yaw) * Math.cos(pitch);
    const dirY = -Math.sin(pitch);
    const dirZ = -Math.cos(yaw) * Math.cos(pitch);

    camera.position.set(0, baseY, 4.5);
    camera.lookAt([
      camera.position.x + dirX * dist,
      camera.position.y + dirY * dist,
      camera.position.z + dirZ * dist,
    ]);

    const nextInk = cssColor('--ink', '#15201e');
    const nextPlotter = cssColor('--plotter', '#c42d18');

    for (const layer of layers) {
      layer.program.uniforms.uTime.value = timeSec;
      layer.program.uniforms.uCameraPos.value = [
        camera.position.x,
        camera.position.y,
        camera.position.z,
      ];
      const line = layer.program.uniforms.uLine.value as Color;
      line.r = nextInk[0];
      line.g = nextInk[1];
      line.b = nextInk[2];
      const accent = layer.program.uniforms.uAccent.value as Color;
      accent.r = nextPlotter[0];
      accent.g = nextPlotter[1];
      accent.b = nextPlotter[2];
    }
  };

  const recyclePlanes = () => {
    if (layers.length === 0) return;
    // Ближайший к камере сверху уходит за кадр — переставляем вниз
    const sorted = [...layers].sort(
      (a, b) => b.mesh.position.y - a.mesh.position.y
    );
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];
    const limit = camera.position.y + 1.2;
    if (highest.mesh.position.y > limit) {
      highest.mesh.position.y = lowest.mesh.position.y - profile.step;
      // Акцент только у текущей верхней (ближайшей к взгляду сверху)
      for (const layer of layers) {
        const isTop =
          layer.mesh.position.y >=
          Math.max(...layers.map((l) => l.mesh.position.y)) - 0.001;
        layer.program.uniforms.uAccentMix.value = isTop ? 0.18 : 0;
      }
    }
  };

  const resize = () => {
    const next = isMobileProfile() ? MOBILE : DESKTOP;
    const changed =
      next.layers !== profile.layers ||
      next.step !== profile.step ||
      next.cell !== profile.cell ||
      next.fov !== profile.fov;

    profile = next;
    if (changed && layerCount === next.layers) {
      // Профиль сменился при том же числе слоёв — обновить униформы
      for (let i = 0; i < layers.length; i++) {
        layers[i].program.uniforms.uCell.value = profile.cell;
        layers[i].program.uniforms.uAmplitude.value = reduced
          ? 0
          : profile.amplitude;
        layers[i].program.uniforms.uAlpha.value =
          profile.opacities[i] ?? 0.05;
      }
      camera.perspective({ fov: profile.fov });
    } else if (changed && !reduced) {
      layerCount = Math.min(layerCount, profile.layers);
      try {
        buildLayers(layerCount);
      } catch {
        failed = true;
        teardown();
        return;
      }
      camera.perspective({ fov: profile.fov });
    }

    const rect = host.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    renderer.setSize(width, height);
    camera.perspective({
      aspect: width / height,
      fov: profile.fov,
    });

    // setSize очищает буфер — в reduced-mode петли нет, нужен явный кадр
    if (reduced || !running) {
      try {
        applyCamera(0);
        renderer.render({ scene, camera });
      } catch {
        /* ignore during early init */
      }
    }
  };

  const readScroll = () => {
    const rect = stage.getBoundingClientRect();
    const travel = Math.max(rect.height, 1);
    scrollPush = Math.min(1, Math.max(0, -rect.top / travel));
  };

  const onPointer = (event: PointerEvent) => {
    if (isMobileProfile() || reduced) return;
    const nx = (event.clientX / window.innerWidth) * 2 - 1;
    const ny = (event.clientY / window.innerHeight) * 2 - 1;
    targetYaw = nx * POINTER_YAW_MAX;
    targetPitch = -ny * POINTER_PITCH_MAX;
  };

  const frame = (t: number) => {
    if (!running || failed) return;
    raf = requestAnimationFrame(frame);

    const dt = lastT ? t - lastT : 16.7;
    lastT = t;

    if (!reduced) {
      frameSamples.push(dt);
      if (frameSamples.length > 120) frameSamples.shift();
      const avg =
        frameSamples.reduce((a, b) => a + b, 0) / frameSamples.length;
      if (avg > 20) {
        degradeClock += dt;
        if (degradeClock > 2000 && layerCount > 2) {
          layerCount -= 1;
          degradeClock = 0;
          frameSamples = [];
          try {
            buildLayers(layerCount);
          } catch {
            failed = true;
            pause();
            teardown();
            return;
          }
        }
      } else {
        degradeClock = 0;
      }
    }

    try {
      pointerYaw += (targetYaw - pointerYaw) * POINTER_LERP;
      pointerPitch += (targetPitch - pointerPitch) * POINTER_LERP;

      const timeSec = reduced ? 0 : t * 0.001;
      applyCamera(timeSec);
      recyclePlanes();
      renderer.render({ scene, camera });
    } catch {
      failed = true;
      pause();
      teardown();
    }
  };

  const play = () => {
    if (running || failed || !visible || !pageVisible || reduced) return;
    running = true;
    lastT = 0;
    raf = requestAnimationFrame(frame);
  };

  const pause = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const renderOnce = () => {
    applyCamera(0);
    renderer.render({ scene, camera });
  };

  const teardown = () => {
    stage.classList.remove('hero__stage--live');
    gl.canvas.remove();
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
    { rootMargin: '10% 0px', threshold: 0.02 }
  );

  resize();
  readScroll();
  io.observe(stage);
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', readScroll, { passive: true });
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);

  try {
    // Два кадра подряд: после первого fwidth стабилен (важно для reduced-motion)
    renderOnce();
    requestAnimationFrame(() => {
      if (failed) return;
      try {
        renderOnce();
        stage.classList.add('hero__stage--live');
        if (!reduced) play();
      } catch {
        failed = true;
        teardown();
      }
    });
  } catch {
    failed = true;
    teardown();
  }

  return () => {
    pause();
    io.disconnect();
    window.removeEventListener('resize', resize);
    window.removeEventListener('scroll', readScroll);
    window.removeEventListener('pointermove', onPointer);
    document.removeEventListener('visibilitychange', onVisibility);
    teardown();
    const ext = gl.getExtension('WEBGL_lose_context');
    ext?.loseContext();
  };
}
