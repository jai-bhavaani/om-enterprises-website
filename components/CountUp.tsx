import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CountUp = ({ end, suffix = '' }: { end: number, suffix?: string }) => {
  const [val, setVal] = useState(end);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    
    const obj = { value: 0 };
    
    gsap.fromTo(obj,
      { value: 0 },
      {
        value: end,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
        },
        onUpdate: () => {
          setVal(Math.floor(obj.value));
        }
      }
    );
  }, [end]);

  return <span ref={ref}>{val}{suffix}</span>;
};

export default CountUp;
