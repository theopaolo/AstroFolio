import { fragmentSource, vertexSource } from './soft-colors-shader';

const palettes = {
  blue: ['#5a60d3', '#dceef8', '#e2e8ff'],
  rose: ['#b26caa', '#fff0f5', '#eee0fa'],
  mint: ['#548c89', '#e7f6dd', '#d9edee'],
};
const defaults = { speed: 1, orbitRadius: .7, frequency: .7, intensity: .85 };
type Parameter = keyof typeof defaults;

function oklab(hex: string) {
  const value = parseInt(hex.slice(1), 16);
  const [r, g, b] = [value >> 16, value >> 8 & 255, value & 255].map(v => {
    const c = v / 255;
    return c < .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b);
  const m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b);
  const s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
  return [.2104542553 * l + .793617785 * m - .0040720468 * s, 1.9779984951 * l - 2.428592205 * m + .4505937099 * s, .0259040371 * l + .7827717662 * m - .808675766 * s];
}

function mountSoftColors(stage: HTMLElement) {
  const hero = stage.closest<HTMLElement>('.hero')!;
  const canvas = stage.querySelector<HTMLCanvasElement>('canvas')!;
  const controls = stage.querySelector<HTMLElement>('.soft-controls')!;
  const panel = stage.querySelector<HTMLElement>('.soft-panel')!;
  const toggle = stage.querySelector<HTMLButtonElement>('.soft-toggle')!;
  const pause = stage.querySelector<HTMLButtonElement>('.soft-pause')!;
  const select = stage.querySelector<HTMLSelectElement>('select')!;
  const grain = stage.querySelector<HTMLInputElement>('#soft-grain')!;
  const sliders = [...stage.querySelectorAll<HTMLInputElement>('[data-soft-param]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const params = { ...defaults };
  const abort = new AbortController();
  const { signal } = abort;
  let gl: WebGLRenderingContext | null;
  try {
    gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
  } catch { return; }
  if (!gl) return;
  const gpu = gl;
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  let locations: Record<string, WebGLUniformLocation | null> = {};
  let ready = false;
  let visible = false;
  let lost = false;
  let paused = reduced.matches;
  let dirty = true;
  let frame = 0;
  let previousTime = 0;
  let phase = 4;
  let mouseX = .5;
  let mouseY = .5;
  let targetX = .5;
  let targetY = .5;

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    stage.dataset.running = 'false';
  }

  function moving() {
    return !paused && (params.speed > 0 || Math.abs(targetX - mouseX) + Math.abs(targetY - mouseY) > .0001);
  }

  function schedule() {
    if (!ready || lost || !visible || document.hidden || frame || (!dirty && !moving())) return;
    frame = requestAnimationFrame(draw);
  }

  function draw(timestamp: number) {
    frame = 0;
    if (!ready || lost || !visible || document.hidden) return;
    if (previousTime && timestamp - previousTime < 1000 / 30 - 1) {
      schedule();
      return;
    }
    const delta = previousTime ? Math.min((timestamp - previousTime) / 1000, .1) : 0;
    previousTime = timestamp;
    if (!paused) {
      phase += delta * params.speed;
      const ease = 1 - Math.exp(-8 * delta);
      mouseX += (targetX - mouseX) * ease;
      mouseY += (targetY - mouseY) * ease;
    }
    gpu.uniform1f(locations.time, phase);
    gpu.uniform2f(locations.mouse, mouseX, mouseY);
    gpu.drawArrays(gpu.TRIANGLES, 0, 3);
    dirty = false;
    stage.dataset.running = String(moving());
    if (!moving()) previousTime = 0;
    schedule();
  }

  function setPalette() {
    const colors = palettes[select.value as keyof typeof palettes] ?? palettes.blue;
    gpu.uniform3fv(locations.waveColors, new Float32Array([...colors, colors[0]].flatMap(oklab)));
  }

  function syncUniforms() {
    setPalette();
    gpu.uniform1f(locations.frequency, params.frequency);
    gpu.uniform1f(locations.intensity, params.intensity);
    gpu.uniform1f(locations.orbitRadius, params.orbitRadius);
    gpu.uniform1f(locations.grainAmount, grain.checked ? .01 : 0);
    gpu.uniform1f(locations.mouseInfluence, .3);
    dirty = true;
    schedule();
  }

  function resize() {
    if (!ready || lost) return;
    const { width, height } = stage.getBoundingClientRect();
    const scale = Math.min(1, Math.sqrt(1_300_000 / Math.max(width * height, 1)));
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    gpu.viewport(0, 0, canvas.width, canvas.height);
    gpu.uniform2f(locations.resolution, canvas.width, canvas.height);
    dirty = true;
    schedule();
  }

  function compile(type: number, source: string) {
    const shader = gpu.createShader(type);
    if (!shader) throw new Error('Shader unavailable');
    gpu.shaderSource(shader, source);
    gpu.compileShader(shader);
    if (!gpu.getShaderParameter(shader, gpu.COMPILE_STATUS)) {
      gpu.deleteShader(shader);
      throw new Error('Shader compilation failed');
    }
    return shader;
  }

  function initialize() {
    const shaders: WebGLShader[] = [];
    try {
      shaders.push(compile(gpu.VERTEX_SHADER, vertexSource));
      shaders.push(compile(gpu.FRAGMENT_SHADER, fragmentSource));
      program = gpu.createProgram();
      if (!program) throw new Error('Program unavailable');
      shaders.forEach(shader => gpu.attachShader(program!, shader));
      gpu.linkProgram(program);
      if (!gpu.getProgramParameter(program, gpu.LINK_STATUS)) throw new Error('Program linking failed');
      gpu.useProgram(program);
      buffer = gpu.createBuffer();
      if (!buffer) throw new Error('Buffer unavailable');
      gpu.bindBuffer(gpu.ARRAY_BUFFER, buffer);
      gpu.bufferData(gpu.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gpu.STATIC_DRAW);
      const position = gpu.getAttribLocation(program, 'position');
      gpu.enableVertexAttribArray(position);
      gpu.vertexAttribPointer(position, 2, gpu.FLOAT, false, 0, 0);
      locations = Object.fromEntries(['time', 'resolution', 'mouse', 'mouseInfluence', 'waveColors', 'frequency', 'intensity', 'orbitRadius', 'grainAmount'].map(name => [name, gpu.getUniformLocation(program!, name)]));
      ready = true;
      canvas.hidden = false;
      controls.hidden = false;
      const headerEntrance = document.querySelector('.site-header')?.getAnimations()
        .find(animation => animation instanceof CSSAnimation && animation.animationName === 'header-enter');
      for (const button of [pause, toggle]) {
        for (const animation of button.getAnimations()) {
          if (!headerEntrance) animation.finish();
          else if (headerEntrance.startTime !== null) animation.startTime = headerEntrance.startTime;
          else animation.currentTime = headerEntrance.currentTime ?? 0;
        }
      }
      stage.dataset.ready = 'true';
      syncUniforms();
      resize();
    } catch {
      gpu.deleteBuffer(buffer);
      gpu.deleteProgram(program);
      ready = false;
      canvas.hidden = true;
      controls.hidden = true;
      stage.dataset.ready = 'false';
    } finally { shaders.forEach(shader => gpu.deleteShader(shader)); }
  }

  function closePanel(restoreFocus = false) {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (restoreFocus) toggle.focus({ preventScroll: true });
  }

  function syncPause() {
    stage.dataset.paused = String(paused);
    pause.setAttribute('aria-pressed', String(paused));
    pause.setAttribute('aria-label', paused ? 'Animer le fond' : 'Mettre le fond en pause');
    stop();
    schedule();
  }

  toggle.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    toggle.setAttribute('aria-expanded', String(!panel.hidden));
    if (!panel.hidden) {
      const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0;
      const topLimit = Math.max(12, headerBottom + 12);
      panel.style.maxHeight = `${Math.max(0, innerHeight - topLimit - 12)}px`;
      const anchor = controls.getBoundingClientRect();
      const { width, height } = panel.getBoundingClientRect();
      panel.style.left = `${Math.max(12, Math.min(anchor.right - width, innerWidth - width - 12))}px`;
      panel.style.top = `${Math.max(topLimit, Math.min(anchor.top - height - 12, innerHeight - height - 12))}px`;
    }
  }, { signal });
  stage.querySelector('.soft-close')!.addEventListener('click', () => closePanel(true), { signal });
  pause.addEventListener('click', () => { paused = !paused; syncPause(); }, { signal });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) closePanel(true);
  }, { signal });
  document.addEventListener('pointerdown', event => {
    if (event.target instanceof Node && !controls.contains(event.target)) closePanel();
  }, { signal });
  controls.addEventListener('focusout', event => {
    if (event.relatedTarget instanceof Node && !controls.contains(event.relatedTarget)) closePanel();
  }, { signal });
  window.addEventListener('scroll', () => closePanel(), { passive: true, signal });
  window.addEventListener('resize', () => closePanel(), { signal });
  select.addEventListener('change', syncUniforms, { signal });
  grain.addEventListener('change', syncUniforms, { signal });
  sliders.forEach(input => input.addEventListener('input', () => {
    params[input.dataset.softParam as Parameter] = Number(input.value);
    input.closest('label')!.querySelector('output')!.value = input.value.replace('.', ',');
    syncUniforms();
  }, { signal }));
  stage.querySelector('.soft-reset')!.addEventListener('click', () => {
    Object.assign(params, defaults);
    select.value = 'blue';
    grain.checked = true;
    sliders.forEach(input => {
      input.value = String(params[input.dataset.softParam as Parameter]);
      input.closest('label')!.querySelector('output')!.value = input.value.replace('.', ',');
    });
    syncUniforms();
  }, { signal });

  hero.addEventListener('pointermove', event => {
    if (paused || reduced.matches || !pointer.matches || event.pointerType !== 'mouse' || controls.contains(event.target as Node)) return;
    const rect = stage.getBoundingClientRect();
    targetX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    targetY = 1 - Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    schedule();
  }, { passive: true, signal });
  hero.addEventListener('pointerleave', () => { targetX = .5; targetY = .5; schedule(); }, { signal });
  reduced.addEventListener('change', () => { paused = reduced.matches; syncPause(); }, { signal });
  document.addEventListener('visibilitychange', () => { stop(); schedule(); }, { signal });
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    lost = true;
    stop();
    closePanel();
    canvas.hidden = true;
    controls.hidden = true;
    stage.dataset.ready = 'false';
  }, { signal });
  canvas.addEventListener('webglcontextrestored', () => { lost = false; initialize(); }, { signal });
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    stop();
    schedule();
  });
  const sizeObserver = new ResizeObserver(resize);
  observer.observe(stage);
  sizeObserver.observe(stage);
  window.addEventListener('pagehide', event => {
    stop();
    if (!event.persisted) {
      observer.disconnect();
      sizeObserver.disconnect();
      abort.abort();
      gpu.deleteBuffer(buffer);
      gpu.deleteProgram(program);
    }
  }, { signal });
  window.addEventListener('pageshow', schedule, { signal });
  initialize();
  syncPause();
}

document.querySelectorAll<HTMLElement>('[data-soft-colors]').forEach(mountSoftColors);
