"use client";

import { Player } from "@remotion/player";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* ── Orb ── */
type OrbProps = {
  color: string;
  size: number;
  baseX: number; // % from left
  baseY: number; // % from top
  driftX: number; // amplitude in %
  driftY: number;
  speed: number; // freq multiplier
  phaseX: number;
  phaseY: number;
  opacity: number;
};

function Orb({
  color,
  size,
  baseX,
  baseY,
  driftX,
  driftY,
  speed,
  phaseX,
  phaseY,
  opacity,
}: OrbProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = (frame / fps) * speed;
  const x = baseX + Math.sin(t + phaseX) * driftX;
  const y = baseY + Math.cos(t + phaseY) * driftY;

  const pulse = interpolate(
    Math.sin(t * 0.7 + phaseX),
    [-1, 1],
    [opacity * 0.7, opacity],
  );

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        background: color,
        filter: `blur(${size * 0.38}px)`,
        opacity: pulse,
        pointerEvents: "none",
      }}
    />
  );
}

/* ── Floating music notes ── */
function Note({
  x,
  delay,
  symbol,
}: {
  x: number;
  delay: number;
  symbol: string;
}) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const loopFrame = (frame + delay * fps) % durationInFrames;

  const progress = loopFrame / durationInFrames;
  const y = interpolate(progress, [0, 1], [90, -10]);
  const opacity = interpolate(progress, [0, 0.1, 0.8, 1], [0, 0.25, 0.25, 0]);
  const rotate = interpolate(progress, [0, 1], [-15, 15]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        opacity,
        transform: `rotate(${rotate}deg)`,
        fontSize: 22,
        color: "rgba(251,146,60,0.6)",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {symbol}
    </div>
  );
}

/* ── Composition ── */
function BackgroundComp() {
  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      {/* Orbs */}
      <Orb
        color="radial-gradient(ellipse, rgba(251,146,60,0.18) 0%, transparent 70%)"
        size={900}
        baseX={50}
        baseY={-5}
        driftX={12}
        driftY={8}
        speed={0.18}
        phaseX={0}
        phaseY={1}
        opacity={1}
      />
      <Orb
        color="radial-gradient(ellipse, rgba(192,38,211,0.13) 0%, transparent 70%)"
        size={700}
        baseX={88}
        baseY={70}
        driftX={8}
        driftY={10}
        speed={0.14}
        phaseX={2}
        phaseY={0.5}
        opacity={1}
      />
      <Orb
        color="radial-gradient(ellipse, rgba(244,63,94,0.1) 0%, transparent 70%)"
        size={600}
        baseX={10}
        baseY={45}
        driftX={6}
        driftY={12}
        speed={0.2}
        phaseX={4}
        phaseY={2}
        opacity={1}
      />
      <Orb
        color="radial-gradient(ellipse, rgba(168,85,247,0.09) 0%, transparent 70%)"
        size={500}
        baseX={70}
        baseY={20}
        driftX={10}
        driftY={7}
        speed={0.16}
        phaseX={1.5}
        phaseY={3}
        opacity={1}
      />
      <Orb
        color="radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, transparent 70%)"
        size={400}
        baseX={25}
        baseY={80}
        driftX={7}
        driftY={6}
        speed={0.12}
        phaseX={3}
        phaseY={1}
        opacity={1}
      />

      {/* Floating music notes */}
      <Note x={8} delay={0} symbol="♪" />
      <Note x={18} delay={3} symbol="♫" />
      <Note x={32} delay={7} symbol="♩" />
      <Note x={55} delay={1.5} symbol="♪" />
      <Note x={68} delay={5} symbol="♫" />
      <Note x={78} delay={9} symbol="♩" />
      <Note x={90} delay={2.5} symbol="♪" />
    </AbsoluteFill>
  );
}

/* ── Player exported as component ── */
export default function LandingBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <Player
        component={BackgroundComp}
        durationInFrames={600}
        fps={30}
        compositionWidth={1920}
        compositionHeight={1080}
        loop
        autoPlay
        controls={false}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "177.78vh",
          height: "100vh",
          minWidth: "100vw",
          minHeight: "56.25vw",
        }}
      />
    </div>
  );
}
