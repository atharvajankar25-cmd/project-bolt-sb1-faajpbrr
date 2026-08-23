import { Suspense, useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text3D, Center, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import fontJson from '@/assets/helvetiker_bold.typeface.json';

/**
 * IntroSplash — Full-screen 3D intro animation.
 *
 * Each letter of "ITSA" flies in from a different direction with
 * rotation and scaling, settles into place with metallic glowing
 * materials, and is surrounded by orbiting energy rings and sparks.
 * Particles morph from a scattered cloud into an icosahedron behind.
 */

const PARTICLE_COUNT = 800;
const MORPH_DURATION = 2500;
const HOLD_DURATION = 2000;
const EXPAND_DURATION = 1200;

// ─── Per-letter animation data ───────────────────────────────────

const LETTERS = ['I', 'T', 'S', 'A'];
const LETTER_SPACING = 1.4;

const letterAnims = LETTERS.map((_, i) => ({
  startX: [-4, 4, -5, 5][i],
  startY: [3, -3, 2, -2][i],
  startZ: [-6, -5, -7, -4][i],
  startRotX: Math.PI * (i % 2 === 0 ? 1 : -1),
  startRotY: Math.PI * (i % 2 === 0 ? -0.8 : 0.6),
  startRotZ: Math.PI * 0.5 * (i % 2 === 0 ? 1 : -1),
  delay: i * 0.25,
  duration: 1.0,
  color: ['#00f0ff', '#3b82f6', '#00ff9d', '#00f0ff'][i],
  emissive: ['#00f0ff', '#1e40af', '#00cc7d', '#00cccc'][i],
}));

// ─── 3D ITSA Letters ─────────────────────────────────────────────

function ITSA3D({ visible }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const letterRefs = useRef<(THREE.Group | null)[]>([]);
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);
  const { viewport } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Gentle floating of the whole group
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.08;
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.06;
    }

    // Per-letter entrance + idle animation
    letterAnims.forEach((anim, i) => {
      const ref = letterRefs.current[i];
      if (!ref) return;

      const localT = Math.max(0, t - anim.delay);
      const progress = Math.min(localT / anim.duration, 1);
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Entrance: fly from offset to target
      const targetX = (i - (LETTERS.length - 1) / 2) * LETTER_SPACING;
      ref.position.x = anim.startX + (targetX - anim.startX) * ease;
      ref.position.y = anim.startY + (0 - anim.startY) * ease;
      ref.position.z = anim.startZ + (0 - anim.startZ) * ease;

      // Rotation: spin to upright
      ref.rotation.x = anim.startRotX * (1 - ease);
      ref.rotation.y = anim.startRotY * (1 - ease);
      ref.rotation.z = anim.startRotZ * (1 - ease);

      // Scale: pop-in with overshoot
      const scaleEase = progress < 0.7
        ? (progress / 0.7) * 1.15
        : 1.15 - 0.15 * ((progress - 0.7) / 0.3);
      ref.scale.setScalar(Math.max(0.01, scaleEase * ease));

      // Idle wobble after settled
      if (progress >= 1) {
        ref.rotation.z = Math.sin(t * 1.5 + i) * 0.03;
        ref.position.y = Math.sin(t * 0.8 + i * 0.5) * 0.04;
      }
    });

    // Orbiting rings
    ringRefs.current.forEach((ring, i) => {
      if (!ring) return;
      ring.rotation.z = t * (0.3 + i * 0.1) * (i % 2 === 0 ? 1 : -1);
      ring.rotation.x = Math.PI / 2 + Math.sin(t * 0.2 + i) * 0.3;
    });
  });

  const baseScale = Math.min(viewport.width / 7, 1);

  if (!visible) return null;

  return (
    <group ref={groupRef} scale={baseScale}>
      {LETTERS.map((letter, i) => {
        const anim = letterAnims[i];
        return (
          <group key={i} ref={(el) => { letterRefs.current[i] = el; }}>
            <Center>
              <Text3D
                font={fontJson as unknown as string}
                size={1.1}
                height={0.35}
                curveSegments={16}
                bevelEnabled
                bevelThickness={0.04}
                bevelSize={0.04}
                bevelSegments={6}
              >
                {letter}
                <meshStandardMaterial
                  color={anim.color}
                  emissive={anim.emissive}
                  emissiveIntensity={0.5}
                  metalness={0.95}
                  roughness={0.08}
                />
              </Text3D>
            </Center>

            {/* Orbiting energy ring per letter */}
            <mesh
              ref={(el) => { ringRefs.current[i] = el; }}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <torusGeometry args={[0.9, 0.015, 8, 64]} />
              <meshBasicMaterial
                color={anim.color}
                transparent
                opacity={0.4}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        );
      })}

      {/* Sparkles around letters */}
      <Sparkles count={40} scale={6} size={4} speed={0.3} color="#00f0ff" opacity={0.7} />
    </group>
  );
}

// ─── Background Particle System ───────────────────────────────────

function ParticleField({ progressRef }: { progressRef: React.MutableRefObject<HTMLDivElement | null> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const icoRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const { positions, startPositions, targetPositions } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const startPositions = new Float32Array(PARTICLE_COUNT * 3);
    const targetPositions = new Float32Array(PARTICLE_COUNT * 3);

    const icoGeo = new THREE.IcosahedronGeometry(3.5, 2);
    const vertCount = icoGeo.attributes.position.count;
    const verts = icoGeo.attributes.position.array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 10 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      startPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      startPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      startPositions[i * 3 + 2] = r * Math.cos(phi);

      const vi = (i % vertCount) * 3;
      const jitter = 0.2;
      targetPositions[i * 3] = verts[vi] + (Math.random() - 0.5) * jitter;
      targetPositions[i * 3 + 1] = verts[vi + 1] + (Math.random() - 0.5) * jitter;
      targetPositions[i * 3 + 2] = verts[vi + 2] + (Math.random() - 0.5) * jitter;

      positions[i * 3] = startPositions[i * 3];
      positions[i * 3 + 1] = startPositions[i * 3 + 1];
      positions[i * 3 + 2] = startPositions[i * 3 + 2];
    }

    icoGeo.dispose();
    return { positions, startPositions, targetPositions };
  }, []);

  const colors = useMemo(() => {
    const c = new Float32Array(PARTICLE_COUNT * 3);
    const cyan = new THREE.Color('#00f0ff');
    const blue = new THREE.Color('#3b82f6');
    const green = new THREE.Color('#00ff9d');
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = i / PARTICLE_COUNT;
      const col = t < 0.5 ? cyan.clone().lerp(blue, t * 2) : blue.clone().lerp(green, (t - 0.5) * 2);
      c[i * 3] = col.r;
      c[i * 3 + 1] = col.g;
      c[i * 3 + 2] = col.b;
    }
    return c;
  }, []);

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    grad.addColorStop(0.6, 'rgba(255,255,255,0.2)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime * 1000;
    const pos = pointsRef.current?.geometry.attributes.position;
    if (!pos) return;

    const morphT = Math.min(elapsed / MORPH_DURATION, 1);
    const easeMorph = morphT < 0.5 ? 2 * morphT * morphT : 1 - Math.pow(-2 * morphT + 2, 2) / 2;

    const expandT = Math.max(0, Math.min((elapsed - MORPH_DURATION - HOLD_DURATION) / EXPAND_DURATION, 1));
    const easeExpand = expandT * expandT * expandT;

    const totalProgress = Math.min(elapsed / (MORPH_DURATION + HOLD_DURATION), 1);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const sx = startPositions[i3], sy = startPositions[i3 + 1], sz = startPositions[i3 + 2];
      const tx = targetPositions[i3], ty = targetPositions[i3 + 1], tz = targetPositions[i3 + 2];

      let x = sx + (tx - sx) * easeMorph;
      let y = sy + (ty - sy) * easeMorph;
      let z = sz + (tz - sz) * easeMorph;

      if (expandT > 0) {
        const expand = 1 + easeExpand * 6;
        x = tx * expand + (x - tx) * (1 - easeExpand);
        y = ty * expand + (y - ty) * (1 - easeExpand);
        z = tz * expand + (z - tz) * (1 - easeExpand);
      }

      pos.array[i3] = x;
      pos.array[i3 + 1] = y;
      pos.array[i3 + 2] = z;
    }
    pos.needsUpdate = true;

    if (pointsRef.current) {
      pointsRef.current.rotation.y = elapsed * 0.00012;
      pointsRef.current.rotation.x = Math.sin(elapsed * 0.00008) * 0.08;
    }

    if (icoRef.current) {
      const mat = icoRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = easeMorph * 0.15 * (1 - easeExpand);
      icoRef.current.rotation.y -= 0.002;
      icoRef.current.rotation.x += 0.001;
    }

    if (progressRef.current) {
      progressRef.current.style.width = `${totalProgress * 100}%`;
    }
  });

  const scale = Math.min(viewport.width / 6, 1.2);

  return (
    <group scale={scale}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          map={particleTexture}
          vertexColors
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      <mesh ref={icoRef}>
        <icosahedronGeometry args={[3.5, 1]} />
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0} />
      </mesh>
    </group>
  );
}

// ─── Intro Splash Component ─────────────────────────────────────

export default function IntroSplash({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [lettersVisible, setLettersVisible] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setLettersVisible(true), 400);
    const totalDuration = MORPH_DURATION + HOLD_DURATION + EXPAND_DURATION + 300;
    const autoTimer = setTimeout(() => setAutoMode(true), totalDuration);
    return () => { clearTimeout(showTimer); clearTimeout(autoTimer); };
  }, []);

  const handleEnter = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setExiting(true);
    setTimeout(() => onComplete(), 800);
  }, [onComplete]);

  useEffect(() => {
    if (autoMode && !exiting) handleEnter();
  }, [autoMode, exiting, handleEnter]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleEnter(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleEnter]);

  return (
    <div
      className={`fixed inset-0 z-[10001] flex items-center justify-center overflow-hidden transition-opacity duration-800 ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, #0a1a2e 0%, #05060f 60%, #02030a 100%)',
      }}
    >
      {/* 3D Canvas — particles behind + ITSA letters in front */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 55 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1.2} color="#00f0ff" />
          <pointLight position={[-10, -10, 5]} intensity={0.8} color="#00ff9d" />
          <pointLight position={[0, 5, 5]} intensity={0.6} color="#3b82f6" />
          <spotLight position={[0, 8, 3]} intensity={1} angle={0.4} penumbra={1} color="#ffffff" />
          <Suspense fallback={null}>
            <ParticleField progressRef={progressRef} />
            <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
              <ITSA3D visible={lettersVisible} />
            </Float>
          </Suspense>
        </Canvas>
      </div>

      {/* Content Overlay — only progress bar + subtitle (3D handles the title) */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center pointer-events-none" style={{ marginTop: '14vh' }}>
        {/* Full Name */}
        <p className="font-display text-xs sm:text-sm md:text-base tracking-[0.3em] uppercase text-neon-cyan/60 transition-all duration-700">
          Information Technology Student Association
        </p>

        {/* Progress Bar */}
        <div className="mt-8 w-48 sm:w-64 h-[3px] rounded-full bg-white/10 overflow-hidden">
          <div
            ref={progressRef}
            className="h-full rounded-full transition-none"
            style={{
              width: '0%',
              background: 'linear-gradient(90deg, #00f0ff, #3b82f6, #00ff9d)',
              boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
            }}
          />
        </div>

        {/* Status Text */}
        <p className="mt-3 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/40 font-mono">
          Initializing Experience
        </p>
      </div>

      {/* Click-to-enter hint */}
      <div
        className="absolute inset-0 z-5 cursor-pointer"
        onClick={handleEnter}
        aria-label="Click to enter"
      />

      {/* Skip Button */}
      <button
        onClick={handleEnter}
        className="clickable absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 text-xs sm:text-sm text-white/40 hover:text-neon-cyan border border-white/10 hover:border-neon-cyan/40 rounded-full px-4 py-2 transition-all duration-300 pointer-events-auto"
      >
        Skip Intro →
      </button>
    </div>
  );
}
