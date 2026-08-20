"use client";

import { useEffect, useRef } from "react";
import type * as THREE from "three";
import {
  createRenderer,
  damp,
  observeColorScheme,
  observeSize,
  prefersDark,
  prefersReducedMotion,
  runFrameLoop,
} from "@/lib/webgl";

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uHealth;
  uniform float uLight;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rotate = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = rotate * p;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
    float t = uTime * 0.035;

    // Domain warping: noise sampled through noise, which is what gives the
    // field its slow liquid folds instead of obvious repeating blobs.
    vec2 q = vec2(fbm(p * 1.15 + t), fbm(p * 1.15 + vec2(3.4, 1.7) - t));
    vec2 r = vec2(
      fbm(p * 1.6 + 1.7 * q + vec2(1.7, 9.2) + 0.13 * t),
      fbm(p * 1.6 + 1.7 * q + vec2(8.3, 2.8) - 0.11 * t)
    );
    float f = fbm(p * 1.05 + 1.9 * r);

    float cloud = clamp(f * f * 1.7, 0.0, 1.0);
    float veil = clamp(length(r) * 0.5, 0.0, 1.0) * 0.5;
    float moodMask = clamp(q.x * q.x * 0.95, 0.0, 1.0);

    vec2 pointer = (uPointer - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    float bloom = exp(-length(p - pointer) * 2.6);
    float edge = smoothstep(1.45, 0.15, length(p));

    // Night: ink base lifted by cloud and veil, brightened toward the pointer.
    vec3 night = vec3(0.015, 0.022, 0.052);
    night = mix(night, vec3(0.075, 0.115, 0.40), cloud);
    night = mix(night, vec3(0.06, 0.45, 0.68), veil);
    night = mix(night, mix(vec3(0.52, 0.10, 0.34), vec3(0.05, 0.45, 0.34), uHealth), moodMask * 0.42);
    night += 0.055 * bloom * vec3(0.35, 0.72, 1.0);
    night *= mix(0.42, 1.0, edge);

    // Day: paper base tinted the same way, but darkened where night brightens,
    // so the field keeps its shape instead of bleaching out.
    vec3 day = vec3(0.945, 0.957, 0.980);
    day = mix(day, vec3(0.760, 0.828, 0.960), cloud * 0.85);
    day = mix(day, vec3(0.706, 0.886, 0.925), veil * 0.9);
    day = mix(day, mix(vec3(0.965, 0.812, 0.867), vec3(0.792, 0.925, 0.855), uHealth), moodMask * 0.5);
    day -= 0.05 * bloom * vec3(0.28, 0.16, 0.02);
    day *= mix(0.94, 1.0, edge);

    vec3 color = mix(night, day, uLight);
    color += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.018;

    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * Full-viewport shader backdrop, drawn toward the pointer. `health` (0–1) tints
 * it; pages with nothing to report leave it at the default calm setting.
 */
export function AuroraCanvas({ health = 0.7 }: { health?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const healthRef = useRef(health);

  useEffect(() => {
    healthRef.current = health;
  }, [health]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let teardown = () => {};

    // three is fetched on demand: the numbers paint without waiting on WebGL.
    void import("three").then((three) => {
      if (cancelled) return;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = createRenderer(three, canvas, 1.25);
      } catch {
        return; // No WebGL: the CSS gradient underneath stands in.
      }

      const uniforms = {
        uTime: { value: 0 },
        uResolution: { value: new three.Vector2(1, 1) },
        uPointer: { value: new three.Vector2(0.5, 0.35) },
        uHealth: { value: healthRef.current },
        uLight: { value: prefersDark() ? 0 : 1 },
      };

      const scene = new three.Scene();
      const camera = new three.Camera();
      const geometry = new three.PlaneGeometry(2, 2);
      const material = new three.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
      scene.add(new three.Mesh(geometry, material));

      const target = new three.Vector2(0.5, 0.35);
      let lightTarget = prefersDark() ? 0 : 1;

      const draw = (seconds: number) => {
        uniforms.uTime.value = seconds;
        uniforms.uPointer.value.set(
          damp(uniforms.uPointer.value.x, target.x, 0.035),
          damp(uniforms.uPointer.value.y, target.y, 0.035),
        );
        uniforms.uHealth.value = damp(uniforms.uHealth.value, healthRef.current, 0.02);
        uniforms.uLight.value = damp(uniforms.uLight.value, lightTarget, 0.04);
        renderer.render(scene, camera);
      };

      const resize = (width: number, height: number) => {
        renderer.setSize(width, height, false);
        uniforms.uResolution.value.copy(renderer.getDrawingBufferSize(new three.Vector2()));
        if (prefersReducedMotion()) draw(0);
      };

      const onPointerMove = (event: PointerEvent) => {
        target.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
      };

      const stopWatchingScheme = observeColorScheme((dark) => {
        lightTarget = dark ? 0 : 1;
        if (prefersReducedMotion()) {
          uniforms.uLight.value = lightTarget;
          draw(0);
        }
      });
      const stopObserving = observeSize(canvas, resize);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      const stopLoop = runFrameLoop(draw);

      teardown = () => {
        stopLoop();
        stopObserving();
        stopWatchingScheme();
        window.removeEventListener("pointermove", onPointerMove);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    });

    return () => {
      cancelled = true;
      teardown();
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="aurora-base absolute inset-0" />
      <canvas ref={canvasRef} className="size-full opacity-90" />
      <div className="grain absolute inset-0" />
      <div className="aurora-fade absolute inset-x-0 bottom-0 h-64" />
    </div>
  );
}
