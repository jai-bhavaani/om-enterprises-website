
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const KineticDivider: React.FC = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!marqueeRef.current) return;

    const marquee = marqueeRef.current;
    const words = marquee.querySelectorAll('.marquee-word');
    const marqueeWidth = marquee.offsetWidth;
    const contentWidth: number = Array.from(words).reduce<number>((acc, word) => acc + (word as HTMLElement).clientWidth, 0);

    // Initial animation
    animationRef.current = gsap.to(words, {
      x: `-=${contentWidth + (words.length * 4 * 16)}`, // Move by content width + gaps
      ease: 'none',
      duration: 80,
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % (contentWidth + (words.length * 4 * 16)))
      }
    });

    gsap.to(animationRef.current, { timeScale: -1 });

    // Scroll-based speed and direction control
    gsap.to(animationRef.current, {
      timeScale: 1,
      scrollTrigger: {
        trigger: marquee,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: self => {
          // -1 for scrolling up, 1 for scrolling down
          const direction = self.direction;
          gsap.to(animationRef.current, { timeScale: direction, duration: 0.2 });
        }
      }
    });

    return () => {
      animationRef.current?.kill();
    };
  }, []);

  const text = "EXCAVATION • PILING • CIVIL • INFRASTRUCTURE";

  return (
    <>
      <style>{`
        .kinetic-divider {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 4rem 0;
          background-color: var(--color-background);
        }
        .marquee {
          display: flex;
          white-space: nowrap;
        }
        .marquee-word {
          font-family: 'Oswald', sans-serif;
          font-size: 10rem;
          font-weight: 700;
          color: transparent;
          -webkit-text-stroke: 1px var(--color-border-strong);
          text-stroke: 1px var(--color-border-strong);
          opacity: 0.25;
          padding: 0 2rem;
        }
      `}</style>
      <div className="kinetic-divider">
        <div ref={marqueeRef} className="marquee">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="marquee-word">{text}</span>
          ))}
        </div>
      </div>
    </>
  );
};
