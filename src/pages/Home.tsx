import { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text3D, Center, Float, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users, Trophy, Sparkles as SparklesIcon } from 'lucide-react';
import ParticleNetwork from '@/components/ParticleNetwork';
import ScrollReveal from '@/components/ScrollReveal';
import fontJson from '@/assets/helvetiker_bold.typeface.json';

/**
 * Home Page — The 3D Launch Experience.
 *
 * Hero sequence:
 *   1. Each letter of "ITSA" flies in from a different screen corner
 *      with its own unique colored light (cyan, blue, green, amber)
 *   2. Letters rotate and settle into place with orbiting energy rings
 *   3. On merge, all letters unify into one attractive gradient color
 *      with pulsing glow and halo effect
 *   4. Full name renders below
 *
 * Background: interactive particle network following cursor / scroll.
 */

const LETTERS = ['I', 'T', 'S', 'A'];
const LETTER_SPACING = 1.5;
const FLY_DURATION = 1.8;

// Smooth easing helpers
const smoothstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const easeOutElastic = (t: number) => {
  if (t === 0 || t === 1) return t;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

// Each letter starts from a different corner with a different color
const letterData = [
  { startX: -7, startY: 5, startZ: -4, startRotX: Math.PI, startRotY: -Math.PI * 0.7, startRotZ: Math.PI * 0.4, flyColor: '#00f0ff', flyEmissive: '#00f0ff', delay: 0.3 },
  { startX: 7, startY: 5, startZ: -4, startRotX: -Math.PI, startRotY: Math.PI * 0.7, startRotZ: -Math.PI * 0.4, flyColor: '#3b82f6', flyEmissive: '#1e40af', delay: 0.65 },
  { startX: -7, startY: -5, startZ: -4, startRotX: Math.PI * 0.8, startRotY: Math.PI * 0.5, startRotZ: Math.PI * 0.3, flyColor: '#00ff9d', flyEmissive: '#00cc7d', delay: 1.0 },
  { startX: 7, startY: -5, startZ: -4, startRotX: -Math.PI * 0.8, startRotY: -Math.PI * 0.5, startRotZ: -Math.PI * 0.3, flyColor: '#fbbf24', flyEmissive: '#f59e0b', delay: 1.35 },
];

// Unified merge color — attractive cyan-blue gradient feel
const MERGE_COLOR = '#00f0ff';
const MERGE_EMISSIVE = '#3b82f6';

// ─── Particle Trail per letter ──────────────────────────────────

function TrailParticles({ color, count = 30 }: { color: string; count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => new Float32Array(count * 3 * 10), [count]);
  const velocities = useMemo(() => new Float32Array(count * 3 * 10), [count]);
  const ages = useMemo(() => new Float32Array(count * 10), [count]);
  const spawnIdx = useRef(0);
  const parentPos = useRef(new THREE.Vector3());

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.6)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((_, delta) => {
    const pos = pointsRef.current?.geometry.attributes.position;
    if (!pos) return;

    for (let i = 0; i < count * 10; i++) {
      ages[i] += delta;
      if (ages[i] > 0) {
        positions[i * 3] += velocities[i * 3] * delta;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;
        ages[i] -= delta;
        if (ages[i] <= 0) {
          positions[i * 3] = 9999;
          positions[i * 3 + 1] = 9999;
          positions[i * 3 + 2] = 9999;
        }
      }
    }
    pos.needsUpdate = true;
  });

  const spawn = (x: number, y: number, z: number) => {
    const i = spawnIdx.current % (count * 10);
    spawnIdx.current++;
    positions[i * 3] = x + (Math.random() - 0.5) * 0.2;
    positions[i * 3 + 1] = y + (Math.random() - 0.5) * 0.2;
    positions[i * 3 + 2] = z + (Math.random() - 0.5) * 0.2;
    velocities[i * 3] = (Math.random() - 0.5) * 0.5;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    ages[i] = 0.6 + Math.random() * 0.4;
  };

  // Expose spawn via ref-like callback
  (pointsRef as unknown as { current: { spawn: typeof spawn } | null }).current ??= null;
  // Attach spawn function to the points object via a custom property
  useMemo(() => {
    (spawn as unknown as { _ref?: typeof pointsRef })._ref = pointsRef;
  }, [pointsRef]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        map={texture}
        color={color}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Orbiting Energy Ring ───────────────────────────────────────

function EnergyRing({ color, radius, speed, tilt }: { color: string; radius: number; speed: number; tilt: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    angleRef.current += dt * speed;
    const angle = angleRef.current;

    if (ringRef.current) {
      ringRef.current.rotation.z = angle;
      ringRef.current.rotation.x = tilt + Math.sin(angle * 0.3) * 0.15;
    }
    if (orbRef.current) {
      orbRef.current.position.x = Math.cos(angle * 1.5) * radius;
      orbRef.current.position.y = Math.sin(angle * 1.5) * radius;
      const scale = 1 + Math.sin(angle * 3) * 0.3;
      orbRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      <mesh ref={ringRef} rotation={[tilt, 0, 0]}>
        <torusGeometry args={[radius, 0.012, 8, 80]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={orbRef}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ─── 3D Hero Scene ──────────────────────────────────────────────

function FlyingLettersHero({ replayKey }: { replayKey: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const letterRefs = useRef<(THREE.Group | null)[]>([]);
  const matRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const haloMatRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const fullNameRef = useRef<THREE.Group>(null);
  const lightRefs = useRef<(THREE.PointLight | null)[]>([]);
  const mergeLightRef = useRef<THREE.PointLight>(null);
  const startTime = useRef<number>(0);
  const { viewport } = useThree();

  // Reset animation clock whenever replayKey changes
  useEffect(() => {
    startTime.current = 0;
  }, [replayKey]);

  // Mouse reactivity
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 0.5;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((state) => {
    if (startTime.current === 0) startTime.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - startTime.current;

    if (groupRef.current) {
      groupRef.current.rotation.y += (mouse.current.x - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-mouse.current.y - groupRef.current.rotation.x) * 0.05;
    }

    letterData.forEach((data, i) => {
      const ref = letterRefs.current[i];
      const mat = matRefs.current[i];
      const haloMat = haloMatRefs.current[i];
      const light = lightRefs.current[i];
      if (!ref) return;

      const localT = Math.max(0, t - data.delay);
      const progress = Math.min(localT / FLY_DURATION, 1);

      // Smooth position easing — ease-out-quart for graceful deceleration
      const posEase = easeOutQuart(progress);
      // Rotation uses a different, gentler curve so it feels organic
      const rotEase = easeInOutSine(progress);
      // Scale uses elastic ease for a soft bounce settle
      const scaleEase = easeOutElastic(progress);

      const targetX = (i - (LETTERS.length - 1) / 2) * LETTER_SPACING;

      // Fly from corner to center
      ref.position.x = data.startX + (targetX - data.startX) * posEase;
      ref.position.y = data.startY + (0 - data.startY) * posEase;
      ref.position.z = data.startZ + (0 - data.startZ) * posEase;

      // Rotation: spin to upright
      ref.rotation.x = data.startRotX * (1 - rotEase);
      ref.rotation.y = data.startRotY * (1 - rotEase);
      ref.rotation.z = data.startRotZ * (1 - rotEase);

      // Scale: smooth elastic pop-in
      ref.scale.setScalar(Math.max(0.01, scaleEase));

      // Color transition: starts at 60% of fly, uses smoothstep for buttery blend
      const mergeStart = FLY_DURATION * 0.6;
      const mergeDuration = 1.2;
      const mergeRaw = Math.max(0, Math.min((localT - mergeStart) / mergeDuration, 1));
      const mergeT = smoothstep(mergeRaw);

      // Blur phase: when all letters have joined, they go blurry for ~1s then sharpen
      const blurStart = letterData[3].delay + FLY_DURATION;
      const blurDuration = 1.0;
      const blurRaw = Math.max(0, Math.min((t - blurStart) / blurDuration, 1));
      // 0 = fully blurry, 1 = fully sharp (smoothstep for buttery transition)
      const sharpness = 1 - smoothstep(blurRaw);
      // sharpness is 1 (blurry) at start, 0 (sharp) at end — invert
      const blurAmount = 1 - smoothstep(blurRaw);

      if (mat) {
        const flyCol = new THREE.Color(data.flyColor);
        const mergeCol = new THREE.Color(MERGE_COLOR);
        const flyEm = new THREE.Color(data.flyEmissive);
        const mergeEm = new THREE.Color(MERGE_EMISSIVE);
        mat.color.lerpColors(flyCol, mergeCol, mergeT);
        mat.emissive.lerpColors(flyEm, mergeEm, mergeT);
        // Gentle pulsing emissive that fades in smoothly after merge
        const settleT = Math.max(0, Math.min((localT - FLY_DURATION) / 1.0, 1));
        const pulse = 0.4 + mergeT * 0.3 + settleT * (0.15 + Math.sin(t * 1.8 + i * 0.8) * 0.12);
        // Boost emissive during blur phase for a glowing, unfocused look
        mat.emissiveIntensity = pulse + blurAmount * 0.8;
        // Roughness increases during blur (diffuse/blurry), returns to sharp after
        mat.roughness = 0.05 + blurAmount * 0.7;
      }

      // Halo opacity ramps up smoothly as letter settles, boosted during blur
      if (haloMat) {
        const haloEase = smoothstep(progress);
        haloMat.opacity = haloEase * (0.15 + blurAmount * 0.25) * (0.6 + mergeT * 0.4);
        const haloCol = new THREE.Color(data.flyColor);
        const mergeCol = new THREE.Color(MERGE_COLOR);
        haloCol.lerp(mergeCol, mergeT);
        haloMat.color = haloCol;
      }

      // Per-letter light follows the letter and fades smoothly as it merges
      if (light) {
        light.position.set(
          data.startX + (targetX - data.startX) * posEase,
          data.startY + (0 - data.startY) * posEase,
          2 + data.startZ * (1 - posEase)
        );
        light.intensity = (1 - mergeT) * 2.5;
      }

      // Idle wobble gradually fades in after settle (no snap)
      if (progress >= 1) {
        const wobbleFade = Math.min((localT - FLY_DURATION) / 1.5, 1);
        ref.rotation.z = Math.sin(t * 1.2 + i * 0.8) * 0.025 * wobbleFade;
        ref.position.y = Math.sin(t * 0.7 + i * 0.5) * 0.05 * wobbleFade;
      }
    });

    // Pulsing merge light — smooth ramp-in
    if (mergeLightRef.current) {
      const allMergedRaw = Math.max(0, t - (letterData[3].delay + FLY_DURATION + 0.8));
      const allMergedT = Math.min(allMergedRaw / 1.5, 1);
      mergeLightRef.current.intensity = 1.5 + Math.sin(t * 2.0) * 0.4 * allMergedT + allMergedT * 0.8;
    }

    // Show full name after all letters merged — smooth fade + rise
    if (fullNameRef.current) {
      const fullNameDelay = letterData[3].delay + FLY_DURATION + 0.8 + 0.4;
      const fullNameT = Math.max(0, Math.min((t - fullNameDelay) / 1.2, 1));
      const fullNameEase = easeOutQuart(fullNameT);
      fullNameRef.current.scale.setScalar(fullNameEase);
      fullNameRef.current.position.y = -1.7 + (1 - fullNameEase) * 0.3;
      fullNameRef.current.position.z = (1 - fullNameEase) * 0.5;
    }
  });

  const baseScale = Math.min(viewport.width / 8, 1);

  return (
    <group ref={groupRef} scale={baseScale}>
      {/* Per-letter colored lights that follow each letter in */}
      {letterData.map((data, i) => (
        <pointLight
          key={`light-${i}`}
          ref={(el) => { lightRefs.current[i] = el; }}
          position={[data.startX, data.startY, 2]}
          intensity={2.5}
          color={data.flyColor}
          distance={8}
        />
      ))}

      {/* Unified pulsing light at center after merge */}
      <pointLight ref={mergeLightRef} position={[0, 0, 3]} intensity={1.5} color={MERGE_COLOR} distance={12} />

      {/* Flying letters with halos and orbiting rings */}
      {LETTERS.map((letter, i) => {
        const data = letterData[i];
        return (
          <group key={i} ref={(el) => { letterRefs.current[i] = el; }}>
            {/* Main 3D letter */}
            <Center>
              <Text3D
                font={fontJson as unknown as string}
                size={1.4}
                height={0.35}
                curveSegments={16}
                bevelEnabled
                bevelThickness={0.05}
                bevelSize={0.05}
                bevelSegments={8}
              >
                {letter}
                <meshStandardMaterial
                  ref={(el: THREE.MeshStandardMaterial | null) => { matRefs.current[i] = el; }}
                  color={data.flyColor}
                  emissive={data.flyEmissive}
                  emissiveIntensity={0.4}
                  metalness={0.95}
                  roughness={0.05}
                />
              </Text3D>
            </Center>

            {/* Glowing halo behind each letter */}
            <mesh position={[0, 0, -0.3]}>
              <planeGeometry args={[2.5, 2.5]} />
              <meshBasicMaterial
                ref={(el: THREE.MeshBasicMaterial | null) => { haloMatRefs.current[i] = el; }}
                color={data.flyColor}
                transparent
                opacity={0}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Orbiting energy rings — two per letter at different angles */}
            <EnergyRing color={data.flyColor} radius={1.0} speed={0.6} tilt={Math.PI / 2.5} />
            <EnergyRing color={data.flyColor} radius={1.15} speed={-0.4} tilt={Math.PI / 4} />
          </group>
        );
      })}

      {/* Full Name */}
      <group ref={fullNameRef} position={[0, -1.7, 0]} scale={0}>
        <Center>
          <Text3D
            font={fontJson as unknown as string}
            size={0.26}
            height={0.06}
            curveSegments={8}
            bevelEnabled
            bevelThickness={0.01}
            bevelSize={0.01}
            bevelSegments={3}
          >
            Information Technology
            <meshStandardMaterial
              color="#ffffff"
              emissive="#00f0ff"
              emissiveIntensity={0.2}
              metalness={0.6}
              roughness={0.3}
            />
          </Text3D>
        </Center>
        <Center position={[0, -0.45, 0]}>
          <Text3D
            font={fontJson as unknown as string}
            size={0.26}
            height={0.06}
            curveSegments={8}
            bevelEnabled
            bevelThickness={0.01}
            bevelSize={0.01}
            bevelSegments={3}
          >
            Student Association
            <meshStandardMaterial
              color="#ffffff"
              emissive="#00ff9d"
              emissiveIntensity={0.2}
              metalness={0.6}
              roughness={0.3}
            />
          </Text3D>
        </Center>
      </group>
    </group>
  );
}

function HeroScene({ replayKey }: { replayKey: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <spotLight position={[0, 5, 5]} intensity={0.6} angle={0.4} penumbra={1} color="#ffffff" />
      <pointLight position={[-8, 0, 4]} intensity={0.5} color="#00f0ff" distance={15} />
      <pointLight position={[8, 0, 4]} intensity={0.5} color="#3b82f6" distance={15} />

      <Suspense fallback={null}>
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
          <FlyingLettersHero replayKey={replayKey} />
        </Float>
        <Sparkles count={60} scale={9} size={3} speed={0.4} color="#00f0ff" opacity={0.5} />
        <Sparkles count={30} scale={6} size={2} speed={0.6} color="#00ff9d" opacity={0.4} />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}

// ─── Feature Cards ──────────────────────────────────────────────

const features = [
  { icon: Calendar, title: 'Events', desc: 'Hackathons, workshops, and tech talks that push boundaries.', link: '/events' },
  { icon: Users, title: 'Team', desc: 'A passionate community of innovators and creators.', link: '/team' },
  { icon: Trophy, title: 'Achievements', desc: 'Recognized excellence at national and state levels.', link: '/achievements' },
  { icon: SparklesIcon, title: 'Gallery', desc: 'Moments captured from our journey of innovation.', link: '/gallery' },
];

// ─── Stats ──────────────────────────────────────────────────────

const stats = [
  { value: '500+', label: 'Members' },
  { value: '50+', label: 'Events Hosted' },
  { value: '20+', label: 'Awards Won' },
  { value: '5', label: 'Years Active' },
];

// ─── Page Component ─────────────────────────────────────────────

export default function Home({ startAnimation = true }: { startAnimation?: boolean }) {
  const heroRef = useRef<HTMLElement>(null);
  const [replayKey, setReplayKey] = useState(0);
  const [blurAmount, setBlurAmount] = useState(0);

  // Replay the flying-letters animation each time the hero scrolls back into view
  useEffect(() => {
    if (!startAnimation) return;

    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setReplayKey((k) => k + 1);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [startAnimation]);

  // CSS blur overlay: when letters join, blur the canvas for ~1s then sharpen
  useEffect(() => {
    // Last letter joins at: delay(1.35) + FLY_DURATION(1.8) = 3.15s
    const blurStart = (letterData[3].delay + FLY_DURATION) * 1000;
    const blurDuration = 1000;

    setBlurAmount(0);
    const startTimer = setTimeout(() => setBlurAmount(8), blurStart);
    const clearTimer = setTimeout(() => setBlurAmount(0), blurStart + blurDuration);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(clearTimer);
    };
  }, [replayKey]);

  return (
    <div className="relative min-h-screen">
      {/* Particle Background */}
      <div className="fixed inset-0 z-0">
        <ParticleNetwork />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen w-full flex items-center justify-center">
        <div
          className="absolute inset-0 z-10 transition-[filter] duration-1000 ease-out"
          style={{ filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none' }}
        >
          <HeroScene replayKey={replayKey} />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-float">
          <span className="text-white/40 text-xs font-mono uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-neon-cyan animate-bounce" />
          </div>
        </div>
      </section>

      {/* Full Name Section (HTML fallback for SEO + accessibility) */}
      <section className="relative z-10 py-20 px-4 text-center">
        <ScrollReveal>
          <p className="text-white/40 font-mono text-sm uppercase tracking-[0.3em] mb-4">PCCOE presents</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl gradient-text mb-3">
            Information Technology Student Association
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            We are a community of dreamers, builders, and innovators. From competitive programming to
            groundbreaking hackathons, ITSA is where passion meets technology.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/about" className="btn-primary" data-cursor="link">
              Discover ITSA <ArrowRight size={18} />
            </Link>
            <Link to="/events" className="btn-ghost" data-cursor="link">
              Upcoming Events
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 0.1}>
              <div className="glass p-6 text-center hover:border-neon-cyan/40 transition-all duration-300 group">
                <p className="font-display font-bold text-3xl sm:text-4xl gradient-text group-hover:scale-110 transition-transform">
                  {s.value}
                </p>
                <p className="text-white/50 text-sm mt-2 uppercase tracking-wider">{s.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="relative z-10 py-16 px-4 sm:px-6">
        <ScrollReveal>
          <h3 className="font-display font-bold text-3xl sm:text-4xl text-center mb-12">
            What We <span className="gradient-text">Do</span>
          </h3>
        </ScrollReveal>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.1}>
              <Link to={f.link} data-cursor="link" className="block group h-full">
                <div className="glass p-6 h-full hover:border-neon-cyan/40 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20 flex items-center justify-center mb-4 group-hover:from-neon-cyan/30 group-hover:to-neon-blue/30 transition-all">
                    <f.icon size={24} className="text-neon-cyan" />
                  </div>
                  <h4 className="font-display font-semibold text-lg mb-2 group-hover:text-neon-cyan transition-colors">
                    {f.title}
                  </h4>
                  <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-4 sm:px-6">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto glass-strong p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-neon-cyan/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-neon-green/20 blur-3xl" />
            <h3 className="font-display font-bold text-2xl sm:text-3xl mb-4 relative">
              Ready to <span className="gradient-text">Innovate</span> with us?
            </h3>
            <p className="text-white/60 mb-6 relative">
              Join ITSA and be part of a community that turns ideas into reality.
            </p>
            <Link to="/contact" className="btn-primary relative" data-cursor="link">
              Get in Touch <ArrowRight size={18} />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
