import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { MapPin, Mail, Phone, Send, CheckCircle2 } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import ScrollReveal from '@/components/ScrollReveal';

/**
 * Contact Us Page — 3D Globe + Animated Form.
 *
 * Features an interactive 3D globe pinpointing PCCOE, and a contact form
 * with smooth animated input fields.
 */

// ─── 3D Globe ────────────────────────────────────────────────────

function GlobeMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const pinRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
    if (pinRef.current) {
      const t = state.clock.elapsedTime;
      pinRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.3);
    }
  });

  // PCCOE approximate location on globe (lat 18.65, lon 73.77)
  // Convert to sphere coordinates
  const lat = (18.65 * Math.PI) / 180;
  const lon = (73.77 * Math.PI) / 180;
  const r = 2;
  const pinPos: [number, number, number] = [
    r * Math.cos(lat) * Math.cos(lon),
    r * Math.sin(lat),
    r * Math.cos(lat) * Math.sin(lon),
  ];

  return (
    <group>
      {/* Globe wireframe */}
      <Sphere ref={meshRef} args={[2, 32, 32]}>
        <meshPhysicalMaterial
          color="#0a0c1a"
          wireframe
          emissive="#00f0ff"
          emissiveIntensity={0.15}
          transparent
          opacity={0.6}
        />
      </Sphere>
      {/* Inner solid sphere */}
      <Sphere args={[1.98, 32, 32]}>
        <meshPhysicalMaterial
          color="#11142b"
          transparent
          opacity={0.8}
          roughness={0.5}
          metalness={0.3}
        />
      </Sphere>
      {/* Location pin */}
      <mesh ref={pinRef} position={pinPos}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#00ff9d"
          emissive="#00ff9d"
          emissiveIntensity={1}
        />
      </mesh>
      {/* Pin glow ring */}
      <mesh position={pinPos}>
        <ringGeometry args={[0.12, 0.18, 32]} />
        <meshBasicMaterial color="#00ff9d" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function GlobeScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 3, 5]} intensity={1} color="#00f0ff" />
      <pointLight position={[-5, -3, 2]} intensity={0.5} color="#00ff9d" />
      <Suspense fallback={null}>
        <GlobeMesh />
        <Stars radius={50} depth={50} count={1500} factor={4} fade speed={1} />
        <Environment preset="night" />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}

// ─── Animated Input Field ────────────────────────────────────────

function AnimatedInput({
  label,
  type = 'text',
  textarea = false,
}: {
  label: string;
  type?: string;
  textarea?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');

  const active = focused || value.length > 0;

  return (
    <div className="relative">
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white outline-none resize-none transition-all duration-300 focus:border-neon-cyan focus:bg-white/8 focus:shadow-[0_0_20px_rgba(0,240,255,0.1)]"
          data-cursor="link"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white outline-none transition-all duration-300 focus:border-neon-cyan focus:bg-white/8 focus:shadow-[0_0_20px_rgba(0,240,255,0.1)]"
          data-cursor="link"
        />
      )}
      <label
        className={`absolute left-4 transition-all duration-300 pointer-events-none font-mono ${
          active
            ? 'top-2 text-xs text-neon-cyan'
            : 'top-4 text-sm text-white/40'
        }`}
      >
        {label}
      </label>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────

export default function Contact() {
  const [sent, setSent] = useState(false);

  const contactInfo = [
    { icon: MapPin, label: 'Location', value: 'PCCOE, Akurdi, Pune — 411044' },
    { icon: Mail, label: 'Email', value: 'itsa@pccoe.edu.in' },
    { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
  ];

  return (
    <PageLayout
      title="Contact Us"
      subtitle="Have a question, idea, or want to collaborate? We'd love to hear from you."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* 3D Globe */}
        <ScrollReveal>
          <div className="glass-strong rounded-3xl p-6 h-[400px] sm:h-[500px] relative overflow-hidden">
            <div className="absolute inset-0">
              <GlobeScene />
            </div>
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <div className="glass p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neon-green/20 flex items-center justify-center">
                    <MapPin size={20} className="text-neon-green" />
                  </div>
                  <div>
                    <p className="text-white font-display font-semibold text-sm">PCCOE, Akurdi</p>
                    <p className="text-white/50 text-xs">Pune, Maharashtra, India</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="absolute top-6 left-6 z-10 text-white/40 text-xs font-mono">
              Drag to rotate the globe
            </p>
          </div>
        </ScrollReveal>

        {/* Contact Form */}
        <ScrollReveal delay={0.15}>
          <div className="glass-strong rounded-3xl p-6 sm:p-8">
            <h3 className="font-display font-bold text-xl mb-6 gradient-text">Send us a message</h3>
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-neon-green/20 flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} className="text-neon-green" />
                </div>
                <h4 className="font-display font-semibold text-lg mb-2">Message Sent!</h4>
                <p className="text-white/50 text-sm">We'll get back to you soon.</p>
                <button
                  onClick={() => setSent(false)}
                  className="btn-ghost mt-6 text-sm"
                  data-cursor="link"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatedInput label="Name" />
                  <AnimatedInput label="Email" type="email" />
                </div>
                <AnimatedInput label="Subject" />
                <AnimatedInput label="Message" textarea />
                <button
                  type="submit"
                  className="btn-primary w-full"
                  data-cursor="link"
                >
                  Send Message <Send size={18} />
                </button>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {contactInfo.map((c, i) => (
          <ScrollReveal key={c.label} delay={i * 0.1}>
            <div className="glass p-6 flex items-center gap-4 hover:border-neon-cyan/40 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-blue/10 flex items-center justify-center shrink-0">
                <c.icon size={22} className="text-neon-cyan" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider font-mono">{c.label}</p>
                <p className="text-white text-sm font-medium mt-1">{c.value}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </PageLayout>
  );
}
