import { useRef, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import ScrollReveal from '@/components/ScrollReveal';
import { galleryImages } from '@/data/content';

/**
 * Gallery Page — 3D Masonry Grid.
 *
 * A masonry layout where hovering over an image extrudes it on the Z-axis,
 * casting a shadow on images behind it.
 */

function GalleryItem({ image, index }: { image: { url: string; title: string; span: string }; index: number }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    const el = itemRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) translateZ(40px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.05)`;
  };

  const onLeave = () => {
    setHovered(false);
    if (itemRef.current) {
      itemRef.current.style.transform = '';
    }
  };

  return (
    <div
      ref={itemRef}
      className={`relative group rounded-2xl overflow-hidden cursor-pointer ${image.span}`}
      style={{
        transition: 'transform 0.4s ease, box-shadow 0.4s ease',
        transformStyle: 'preserve-3d',
        boxShadow: hovered
          ? '0 25px 50px rgba(0,0,0,0.5), 0 0 30px rgba(0,240,255,0.2)'
          : '0 4px 20px rgba(0,0,0,0.3)',
        zIndex: hovered ? 10 : 1,
      }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      data-cursor="link"
    >
      <img
        src={image.url}
        alt={image.title}
        loading="lazy"
        className="w-full h-full object-cover min-h-[180px] transition-transform duration-500 group-hover:scale-110"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-400" />
      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="font-display font-semibold text-white text-sm sm:text-base">{image.title}</h3>
      </div>
      {/* Glow border on hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-neon-cyan/0 group-hover:border-neon-cyan/40 transition-colors duration-300" />
    </div>
  );
}

export default function Gallery() {
  return (
    <PageLayout
      title="Gallery"
      subtitle="Moments captured from our journey — events, workshops, wins, and the people who make ITSA what it is."
    >
      {/* Masonry grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px]">
        {galleryImages.map((img, i) => (
          <ScrollReveal key={i} delay={(i % 4) * 0.08} className={img.span}>
            <GalleryItem image={img} index={i} />
          </ScrollReveal>
        ))}
      </div>

      {/* CTA */}
      <ScrollReveal>
        <div className="text-center mt-16">
          <p className="text-white/50 mb-4">Want to see more? Follow us on social media.</p>
          <div className="flex justify-center gap-3">
            {['Instagram', 'LinkedIn', 'GitHub'].map((s) => (
              <a
                key={s}
                href="#"
                className="btn-ghost text-sm"
                data-cursor="link"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </PageLayout>
  );
}
