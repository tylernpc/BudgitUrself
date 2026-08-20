import type * as THREE from "three";

/**
 * Shared WebGL plumbing for the dashboard's two canvases. Everything here is
 * presentation: renderer setup, a frame loop that idles while the tab is
 * hidden, and a single-frame path for people who ask for reduced motion.
 *
 * `three` is only imported as a type — both canvases pull the library in at
 * runtime with a dynamic `import()`, so the ~1 MB of WebGL never lands in the
 * bundle that renders the numbers.
 */

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const darkQuery = () => window.matchMedia("(prefers-color-scheme: dark)");

export function prefersDark(): boolean {
  return typeof window !== "undefined" && darkQuery().matches;
}

/** Notifies when the system flips between light and dark. */
export function observeColorScheme(onChange: (dark: boolean) => void) {
  const query = darkQuery();
  const handler = (event: MediaQueryListEvent) => onChange(event.matches);
  query.addEventListener("change", handler);
  return () => query.removeEventListener("change", handler);
}

export function createRenderer(
  three: typeof THREE,
  canvas: HTMLCanvasElement,
  maxPixelRatio: number,
) {
  const renderer = new three.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));
  renderer.setClearColor(0x000000, 0);
  return renderer;
}

/**
 * Runs `frame(seconds)` until the returned disposer is called. When motion is
 * reduced the scene is drawn once and left still.
 */
export function runFrameLoop(frame: (seconds: number) => void): () => void {
  if (prefersReducedMotion()) {
    frame(0);
    return () => {};
  }

  const start = performance.now();
  let handle = 0;

  const tick = () => {
    handle = requestAnimationFrame(tick);
    if (document.hidden) return;
    frame((performance.now() - start) / 1000);
  };

  handle = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(handle);
}

/**
 * Calls `onResize` with CSS pixel dimensions now and on every later change.
 * The immediate call matters: ResizeObserver delivery is tied to the rendering
 * lifecycle, so a backgrounded tab would otherwise leave the canvas at three's
 * 300x150 default until it is first painted.
 */
export function observeSize(element: Element, onResize: (width: number, height: number) => void) {
  const initial = element.getBoundingClientRect();
  if (initial.width > 0 && initial.height > 0) onResize(initial.width, initial.height);

  const observer = new ResizeObserver((entries) => {
    const box = entries[0]?.contentRect;
    if (box && box.width > 0 && box.height > 0) onResize(box.width, box.height);
  });
  observer.observe(element);
  return () => observer.disconnect();
}

export const damp = (current: number, target: number, rate: number) =>
  current + (target - current) * rate;
