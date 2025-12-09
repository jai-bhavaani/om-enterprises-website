import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TextReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const textRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!textRef.current) return;
    gsap.fromTo(textRef.current,
      { y: '120%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        delay: delay,
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 90%',
        }
      }
    );
  }, [delay]);
  return (
    <div className={`reveal-mask ${className}`}>
      <div ref={textRef} className="reveal-text">
        {children}
      </div>
    </div>
  );
};

export default TextReveal;
