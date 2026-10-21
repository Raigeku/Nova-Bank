"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, PresentationControls, RoundedBox } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";

const palettes = {
  violet: ["#5b3bff", "#2e8bff", "#00d4ff"],
  sunset: ["#ff4fd8", "#ff7a59", "#ffc24b"],
  graphite: ["#1b1c26", "#2c2f45", "#4b3bff"],
} as const;

export type SceneVariant = keyof typeof palettes;

const W = 3.37;
const H = 2.125;
const D = 0.04;
const R = 0.08;

// Card art drawn on a 2D canvas: no font or image downloads needed
function drawFace(colors: readonly string[], back: boolean) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = Math.round((1024 * H) / W);
  const g = c.getContext("2d")!;
  const r = (R / W) * c.width;

  g.beginPath();
  g.roundRect(0, 0, c.width, c.height, r);
  g.clip();

  const grad = g.createLinearGradient(0, 0, c.width, c.height);
  colors.forEach((col, i) => grad.addColorStop(i / (colors.length - 1), col));
  g.fillStyle = grad;
  g.fillRect(0, 0, c.width, c.height);

  const sheen = g.createRadialGradient(c.width * 0.8, 0, 0, c.width * 0.8, 0, c.width * 0.7);
  sheen.addColorStop(0, "rgba(255,255,255,0.35)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = sheen;
  g.fillRect(0, 0, c.width, c.height);

  g.fillStyle = "#fff";
  if (back) {
    g.fillStyle = "rgba(0,0,0,0.75)";
    g.fillRect(0, 70, c.width, 110);
    g.fillStyle = "rgba(255,255,255,0.85)";
    g.fillRect(70, 240, 600, 70);
    g.fillStyle = "#fff";
    g.font = "600 28px system-ui, sans-serif";
    g.fillText("nova", 70, c.height - 60);
  } else {
    g.font = "700 76px system-ui, sans-serif";
    g.fillText("nova", 70, 130);
    g.fillStyle = "#e9c46a";
    g.beginPath();
    g.roundRect(70, 220, 120, 92, 16);
    g.fill();
    g.fillStyle = "#fff";
    g.font = "500 46px ui-monospace, monospace";
    g.fillText("••••  ••••  ••••  2048", 70, 450);
    g.globalAlpha = 0.75;
    g.font = "600 28px system-ui, sans-serif";
    g.fillText("DEBIT", 70, 560);
    g.globalAlpha = 0.9;
    g.beginPath();
    g.arc(c.width - 170, 540, 48, 0, Math.PI * 2);
    g.fill();
    g.globalAlpha = 0.6;
    g.beginPath();
    g.arc(c.width - 110, 540, 48, 0, Math.PI * 2);
    g.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

type CardProps = { variant: SceneVariant; dark: boolean; animate: boolean; onGrab?: () => void };

function Card({ variant, dark, animate, onGrab }: CardProps) {
  const ref = useRef<THREE.Group>(null!);
  const front = useMemo(() => drawFace(palettes[variant], false), [variant]);
  const back = useMemo(() => drawFace(palettes[variant], true), [variant]);
  const spin = useRef(animate ? Math.PI * 2 : 0);
  const hovered = useRef(false);
  const edge = useRef<THREE.MeshPhysicalMaterial>(null!);
  const edgeTarget = useMemo(() => new THREE.Color(dark ? "#1c1d27" : "#dcdce6"), [dark]);
  // Fixed initial color: if the prop changed, R3F would snap to it and skip the fade
  const [edgeInitial] = useState(() => edgeTarget.clone());

  useFrame((_, dt) => {
    // Fade the edge color on theme change, in step with the CSS transition
    edge.current.color.lerp(edgeTarget, 1 - Math.exp(-6 * dt));
    // Intro spin eases out; drag rotation is handled by PresentationControls
    spin.current = THREE.MathUtils.damp(spin.current, 0, 2.2, dt);
    ref.current.rotation.set(0.12, -0.35 + spin.current, -0.08);
    // Grows a little on hover to show it can be grabbed
    const s = THREE.MathUtils.damp(ref.current.scale.x, hovered.current ? 1.05 : 1, 8, dt);
    ref.current.scale.setScalar(s);
  });

  const face = { transparent: true, clearcoat: 1, clearcoatRoughness: 0.15, roughness: 0.35, metalness: 0.25 };

  return (
    <group
      ref={ref}
      onPointerOver={() => (hovered.current = true)}
      onPointerOut={() => (hovered.current = false)}
      onPointerDown={onGrab}
    >
      <RoundedBox args={[W, H, D]} radius={R} smoothness={6}>
        <meshPhysicalMaterial ref={edge} color={edgeInitial} metalness={0.8} roughness={0.3} />
      </RoundedBox>
      <mesh position-z={D / 2 + 0.001}>
        <planeGeometry args={[W, H]} />
        <meshPhysicalMaterial map={front} {...face} />
      </mesh>
      <mesh position-z={-D / 2 - 0.001} rotation-y={Math.PI}>
        <planeGeometry args={[W, H]} />
        <meshPhysicalMaterial map={back} {...face} />
      </mesh>
    </group>
  );
}

const coins: { p: [number, number, number]; s: number; speed: number }[] = [
  { p: [-2.6, 1.3, -1], s: 0.42, speed: 1.2 },
  { p: [2.5, 1.5, -0.5], s: 0.34, speed: -1.6 },
  { p: [-2.2, -1.4, 0.4], s: 0.3, speed: 1.9 },
  { p: [2.3, -1.2, 0.8], s: 0.45, speed: -1.1 },
  { p: [0.4, 2.1, -1.6], s: 0.26, speed: 2.2 },
  { p: [-0.6, -2.1, -1.2], s: 0.32, speed: -1.4 },
];

function Coin({ p, s, speed, animate }: (typeof coins)[number] & { animate: boolean }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    if (animate) ref.current.rotation.y += dt * speed;
  });
  return (
    <Float speed={animate ? 2 : 0} floatIntensity={1.2} rotationIntensity={0.6}>
      <group ref={ref} position={p} scale={s}>
        <mesh rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[1, 1, 0.16, 48]} />
          <meshStandardMaterial color="#f2c14e" metalness={1} roughness={0.22} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.78, 0.05, 12, 48]} />
          <meshStandardMaterial color="#ffe08a" metalness={1} roughness={0.15} />
        </mesh>
      </group>
    </Float>
  );
}

function Ambient({ dark }: { dark: boolean }) {
  const ref = useRef<THREE.AmbientLight>(null!);
  useFrame((_, dt) => {
    ref.current.intensity = THREE.MathUtils.damp(ref.current.intensity, dark ? 0.4 : 0.8, 6, dt);
  });
  // No intensity prop: a changing prop would snap instead of easing
  return <ambientLight ref={ref} />;
}

type SceneProps = { variant?: SceneVariant; withCoins?: boolean; onGrab?: () => void };

export default function BankScene({ variant = "violet", withCoins = false, onGrab }: SceneProps) {
  const animate = !useReducedMotion();
  const dark = useTheme().resolvedTheme === "dark";

  return (
    <Canvas
      aria-hidden
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 38 }}
      gl={{ alpha: true, antialias: true }}
      // Vertical swipes still scroll the page on touch screens; horizontal ones spin the card
      style={{ touchAction: "pan-y" }}
    >
      <Ambient dark={dark} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} />
      <Float speed={animate ? 1.6 : 0} rotationIntensity={0.3} floatIntensity={0.8}>
        {/* Drag to rotate (full turns sideways, limited tilt); stays where it's released */}
        <PresentationControls speed={1.6} polar={[-Math.PI / 4, Math.PI / 4]} azimuth={[-Infinity, Infinity]}>
          <Card variant={variant} dark={dark} animate={animate} onGrab={onGrab} />
        </PresentationControls>
      </Float>
      {withCoins && coins.map((c, i) => <Coin key={i} {...c} animate={animate} />)}
      <ContactShadows position={[0, -2, 0]} opacity={dark ? 0.6 : 0.35} scale={10} blur={2.6} far={4} />
      <Environment resolution={256}>
        <Lightformer intensity={2} position={[0, 5, -2]} scale={[10, 4, 1]} />
        <Lightformer intensity={3} color="#8a72ff" position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer intensity={3} color="#2cc7ff" position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
      </Environment>
    </Canvas>
  );
}
