import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Environment, Float, Text3D } from '@react-three/drei';
import * as THREE from 'three';
import { Eye, Target, Heart, Code, Lightbulb, Users } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import ScrollReveal from '@/components/ScrollReveal';
import fontJson from '@/assets/helvetiker_bold.typeface.json';

/**
 * About Us Page — Interactive 3D Boxes.
 *
 * Vision, Mission, and Core Values are displayed as floating glass-like 3D cubes.
 * On hover/tap, each cube rotates 360° to reveal text on the front face with a glowing aura.
 */

// ─── 3D Glass Cube ──────────────────────────────────────────────

interface CubeProps {
  label: string;
  color: string;
  position: [number, number, number];
  isFlipped: boolean;
  onToggle: () => void;
}

function GlassCube({ label, color, position, isFlipped, onToggle }: CubeProps) {
  const meshRef = useRef<THREE.Group>(null);
  const targetRotation = isFlipped ? Math.PI * 2 : 0;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += (targetRotation - meshRef.current.rotation.x) * 0.08;
      meshRef.current.rotation.y += (0.005);
    }
  });

  return (
    <group
      position={position}
      ref={meshRef}
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      onPointerOver={(e) => { e.stopPropagation(); onToggle(); }}
    >
      {/* Glass cube body */}
      <mesh>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.15}
          roughness={0.1}
          metalness={0.1}
          transmission={0.9}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Wireframe edges */}
      <mesh>
        <boxGeometry args={[1.61, 1.61, 1.61]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
      </mesh>
      {/* Label text on front face */}
      <Center position={[0, 0, 0.81]}>
        <mesh>
          <Text3D
            font={fontJson as unknown as string}
            size={0.25}
            height={0.03}
            curveSegments={8}
            bevelEnabled
            bevelThickness={0.005}
            bevelSize={0.005}
            bevelSegments={2}
          >
            {label}
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.6}
              metalness={0.8}
              roughness={0.2}
            />
          </Text3D>
        </mesh>
      </Center>
    </group>
  );
}

function CubeScene({ flipped, onToggle }: { flipped: boolean[]; onToggle: (i: number) => void }) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00f0ff" />
      <pointLight position={[-5, -5, 3]} intensity={0.6} color="#00ff9d" />
      <Suspense fallback={null}>
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.6}>
          <GlassCube label="VISION" color="#00f0ff" position={[-2.5, 0, 0]} isFlipped={flipped[0]} onToggle={() => onToggle(0)} />
          <GlassCube label="MISSION" color="#00ff9d" position={[0, 0, 0]} isFlipped={flipped[1]} onToggle={() => onToggle(1)} />
          <GlassCube label="VALUES" color="#3b82f6" position={[2.5, 0, 0]} isFlipped={flipped[2]} onToggle={() => onToggle(2)} />
        </Float>
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}

// ─── Info Cards ─────────────────────────────────────────────────

const infoCards = [
  {
    icon: Eye,
    title: 'Our Vision',
    color: 'cyan',
    text: 'To be the premier student-driven technology community that empowers future innovators to solve real-world problems through technology, collaboration, and creative thinking.',
  },
  {
    icon: Target,
    title: 'Our Mission',
    color: 'green',
    text: 'To create a vibrant platform where students develop technical skills, build meaningful projects, connect with industry, and foster a culture of continuous learning and innovation.',
  },
  {
    icon: Heart,
    title: 'Our Values',
    color: 'blue',
    text: 'Innovation, integrity, inclusivity, and excellence. We believe in the power of community, the importance of giving back, and the relentless pursuit of knowledge.',
  },
];

const colorMap: Record<string, { text: string; border: string; glow: string; bg: string }> = {
  cyan: { text: 'text-neon-cyan', border: 'border-neon-cyan/40', glow: 'shadow-[0_0_30px_rgba(0,240,255,0.15)]', bg: 'from-neon-cyan/20' },
  green: { text: 'text-neon-green', border: 'border-neon-green/40', glow: 'shadow-[0_0_30px_rgba(0,255,157,0.15)]', bg: 'from-neon-green/20' },
  blue: { text: 'text-neon-blue', border: 'border-neon-blue/40', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]', bg: 'from-neon-blue/20' },
};

const coreValues = [
  { icon: Lightbulb, title: 'Innovation', desc: 'Pushing boundaries with fresh ideas and creative solutions.' },
  { icon: Code, title: 'Technical Excellence', desc: 'Mastering the craft through continuous learning and practice.' },
  { icon: Users, title: 'Community', desc: 'Building a supportive network of passionate tech enthusiasts.' },
  { icon: Heart, title: 'Impact', desc: 'Using technology to make a meaningful difference.' },
];

// ─── Page ──────────────────────────────────────────────────────

export default function About() {
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false]);

  const toggle = (i: number) => {
    setFlipped((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  return (
    <PageLayout
      title="About ITSA"
      subtitle="Where technology meets passion, and students become innovators."
    >
      {/* 3D Cube Section */}
      <ScrollReveal>
        <div className="relative h-[400px] sm:h-[450px] mb-16">
          <CubeScene flipped={flipped} onToggle={toggle} />
          <p className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white/40 text-sm font-mono text-center">
            Hover or tap a cube to rotate it
          </p>
        </div>
      </ScrollReveal>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {infoCards.map((card, i) => {
          const c = colorMap[card.color];
          return (
            <ScrollReveal key={card.title} delay={i * 0.15}>
              <div className={`glass p-6 h-full hover:${c.border} ${c.glow} transition-all duration-300 hover:-translate-y-1`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.bg} to-transparent flex items-center justify-center mb-4`}>
                  <card.icon size={24} className={c.text} />
                </div>
                <h3 className={`font-display font-semibold text-xl mb-3 ${c.text}`}>{card.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{card.text}</p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Core Values Grid */}
      <ScrollReveal>
        <h3 className="font-display font-bold text-3xl text-center mb-12">
          Our Core <span className="gradient-text">Values</span>
        </h3>
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {coreValues.map((v, i) => (
          <ScrollReveal key={v.title} delay={i * 0.1}>
            <div className="glass p-6 text-center hover:border-neon-cyan/40 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-blue/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <v.icon size={26} className="text-neon-cyan" />
              </div>
              <h4 className="font-display font-semibold text-lg mb-2">{v.title}</h4>
              <p className="text-white/50 text-sm leading-relaxed">{v.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* About Story */}
      <ScrollReveal>
        <div className="glass-strong p-8 sm:p-12 max-w-4xl mx-auto">
          <h3 className="font-display font-bold text-2xl sm:text-3xl mb-6 gradient-text">Our Story</h3>
          <div className="space-y-4 text-white/60 leading-relaxed">
            <p>
              Founded with a vision to bridge the gap between academic learning and industry expectations,
              the Information Technology Student Association (ITSA) at PCCOE has grown into one of the most
              active technical communities on campus.
            </p>
            <p>
              From organizing large-scale hackathons and coding competitions to hosting workshops on
              cutting-edge technologies, ITSA provides students with opportunities to learn, build, and
              showcase their skills. Our members have gone on to win national-level competitions, contribute
              to open-source projects, and secure positions at leading tech companies.
            </p>
            <p>
              At ITSA, we believe that the best way to learn is by doing. Every event, workshop, and project
              is designed to give students hands-on experience with real-world challenges and technologies.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </PageLayout>
  );
}
