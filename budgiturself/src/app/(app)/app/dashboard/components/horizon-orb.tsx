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
} from "../lib/three-scene";

const vertexShader = /* glsl */ `
  attribute vec3 aNormal;
  attribute float aSeed;
  attribute float aSize;

  uniform float uTime;
  uniform float uHealth;
  uniform float uPointScale;

  varying float vPulse;

  void main() {
    float pulse = sin(uTime * 0.9 + aSeed * 6.2831 + position.x * 2.4) * 0.5 + 0.5;
    vec3 displaced = position + aNormal * pulse * (0.05 + uHealth * 0.09);

    vec4 viewPosition = modelViewMatrix * vec4(displaced, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = aSize * (0.45 + pulse) * (uPointScale / max(-viewPosition.z, 0.001));

    vPulse = pulse;
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;

  uniform float uHealth;
  uniform float uLight;
  varying float vPulse;

  vec3 toneFor(vec3 shortfall, vec3 middle, vec3 surplus) {
    return mix(
      mix(shortfall, middle, smoothstep(0.35, 0.55, uHealth)),
      surplus,
      smoothstep(0.5, 0.9, uHealth)
    );
  }

  void main() {
    float distance = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.0, distance);

    // Night draws additively, so its colours are bright; day composites
    // normally over paper, so its colours are the deeper end of each hue.
    vec3 night = mix(
      vec3(0.32, 0.74, 1.0),
      toneFor(vec3(1.0, 0.32, 0.44), vec3(0.42, 0.62, 1.0), vec3(0.36, 0.97, 0.71)),
      0.5 + 0.4 * vPulse
    );
    vec3 day = mix(
      vec3(0.10, 0.42, 0.62),
      toneFor(vec3(0.75, 0.07, 0.24), vec3(0.05, 0.36, 0.63), vec3(0.02, 0.47, 0.34)),
      0.5 + 0.4 * vPulse
    );

    vec3 color = mix(night, day, uLight);
    gl_FragColor = vec4(color, alpha * (0.18 + 0.72 * vPulse) * mix(1.0, 0.8, uLight));
  }
`;

interface OrbUniforms {
  [name: string]: THREE.IUniform<number>;
  uTime: THREE.IUniform<number>;
  uHealth: THREE.IUniform<number>;
  uPointScale: THREE.IUniform<number>;
  uLight: THREE.IUniform<number>;
}

interface Cloud {
  positions: Float32Array;
  normals: Float32Array;
  seeds: Float32Array;
  sizes: Float32Array;
}

function emptyCloud(count: number): Cloud {
  return {
    positions: new Float32Array(count * 3),
    normals: new Float32Array(count * 3),
    seeds: new Float32Array(count),
    sizes: new Float32Array(count),
  };
}

/** Fibonacci sphere — even coverage without the pole clustering of lat/long. */
function sphereCloud(count: number, radius: number): Cloud {
  const cloud = emptyCloud(count);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(Math.max(1 - y * y, 0));
    const theta = golden * i;
    const normal = [Math.cos(theta) * ring, y, Math.sin(theta) * ring];

    for (let axis = 0; axis < 3; axis++) {
      cloud.normals[i * 3 + axis] = normal[axis] ?? 0;
      cloud.positions[i * 3 + axis] = (normal[axis] ?? 0) * radius;
    }
    cloud.seeds[i] = Math.random();
    cloud.sizes[i] = 0.018 + Math.random() * 0.022;
  }

  return cloud;
}

/** A flattened torus of points — the ring the core sits inside. */
function ringCloud(count: number, radius: number, tube: number): Cloud {
  const cloud = emptyCloud(count);

  for (let i = 0; i < count; i++) {
    const around = Math.random() * Math.PI * 2;
    const through = Math.random() * Math.PI * 2;
    const spread = radius + tube * Math.cos(through) * Math.sqrt(Math.random());

    const x = Math.cos(around) * spread;
    const y = tube * Math.sin(through) * 0.45;
    const z = Math.sin(around) * spread;

    // Normal points away from the centre of the tube, not the centre of the ring.
    const offset = [x - Math.cos(around) * radius, y, z - Math.sin(around) * radius];
    const length = Math.hypot(offset[0] ?? 0, offset[1] ?? 0, offset[2] ?? 0) || 1;

    cloud.positions[i * 3] = x;
    cloud.positions[i * 3 + 1] = y;
    cloud.positions[i * 3 + 2] = z;
    for (let axis = 0; axis < 3; axis++) {
      cloud.normals[i * 3 + axis] = (offset[axis] ?? 0) / length;
    }
    cloud.seeds[i] = Math.random();
    cloud.sizes[i] = 0.012 + Math.random() * 0.018;
  }

  return cloud;
}

function toPoints(three: typeof THREE, cloud: Cloud, uniforms: OrbUniforms, dark: boolean) {
  const geometry = new three.BufferGeometry();
  geometry.setAttribute("position", new three.BufferAttribute(cloud.positions, 3));
  geometry.setAttribute("aNormal", new three.BufferAttribute(cloud.normals, 3));
  geometry.setAttribute("aSeed", new three.BufferAttribute(cloud.seeds, 1));
  geometry.setAttribute("aSize", new three.BufferAttribute(cloud.sizes, 1));

  const material = new three.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: dark ? three.AdditiveBlending : three.NormalBlending,
  });

  return new three.Points(geometry, material);
}

/**
 * The particle body in the Horizon panel. `health` (0–1) shifts its colour from
 * red through blue to green and how far the surface breathes — a mood ring for
 * the month, not a chart.
 */
export function HorizonOrb({ health }: { health: number }) {
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

    // three is fetched on demand so the numbers paint without waiting on WebGL.
    void import("three").then((three) => {
      if (cancelled) return;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = createRenderer(three, canvas, 2);
      } catch {
        return;
      }

      const uniforms: OrbUniforms = {
        uTime: { value: 0 },
        uHealth: { value: healthRef.current },
        uPointScale: { value: 300 },
        uLight: { value: prefersDark() ? 0 : 1 },
      };

      let lightTarget = prefersDark() ? 0 : 1;

      const scene = new three.Scene();
      const camera = new three.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0.35, 3.4);
      camera.lookAt(0, 0, 0);

      const core = toPoints(three, sphereCloud(1500, 0.62), uniforms, prefersDark());
      const ring = toPoints(three, ringCloud(2600, 1.18, 0.17), uniforms, prefersDark());

      const group = new three.Group();
      group.rotation.x = -0.38;
      group.add(core, ring);
      scene.add(group);

      const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

      const draw = (seconds: number) => {
        uniforms.uTime.value = seconds;
        uniforms.uHealth.value = damp(uniforms.uHealth.value, healthRef.current, 0.03);
        uniforms.uLight.value = damp(uniforms.uLight.value, lightTarget, 0.05);

        core.rotation.y = seconds * 0.11;
        ring.rotation.y = -seconds * 0.07;
        ring.rotation.z = Math.sin(seconds * 0.22) * 0.06;

        pointer.x = damp(pointer.x, pointer.targetX, 0.05);
        pointer.y = damp(pointer.y, pointer.targetY, 0.05);
        group.rotation.z = pointer.x * 0.12;
        group.rotation.x = -0.38 + pointer.y * 0.14;

        renderer.render(scene, camera);
      };

      const resize = (width: number, height: number) => {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        uniforms.uPointScale.value = renderer.getDrawingBufferSize(new three.Vector2()).y * 0.5;
        if (prefersReducedMotion()) draw(0);
      };

      const onPointerMove = (event: PointerEvent) => {
        const box = canvas.getBoundingClientRect();
        pointer.targetX = ((event.clientX - box.left) / box.width) * 2 - 1;
        pointer.targetY = ((event.clientY - box.top) / box.height) * 2 - 1;
      };

      // Additive light on paper reads as nothing at all, so the blend mode
      // has to follow the theme, not just the palette.
      const stopWatchingScheme = observeColorScheme((dark) => {
        lightTarget = dark ? 0 : 1;
        for (const points of [core, ring]) {
          points.material.blending = dark ? three.AdditiveBlending : three.NormalBlending;
          points.material.needsUpdate = true;
        }
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
        for (const points of [core, ring]) {
          points.geometry.dispose();
          (points.material as THREE.Material).dispose();
        }
        renderer.dispose();
      };
    });

    return () => {
      cancelled = true;
      teardown();
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none relative size-full">
      <div className="absolute inset-[18%] rounded-full bg-tone-cyan/15 blur-3xl" />
      <canvas ref={canvasRef} className="relative size-full" />
    </div>
  );
}
