
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { Button } from './Button';
import { ButtonVariant } from '../types';

const timelineData = [
  { 
    year: '2004', 
    title: 'Breaking Ground', 
    desc: 'OM Enterprises founded. First major excavation project in Mumbai suburbs using manual survey and rental JCBs.',
    // Excavator digging dirt
    img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    year: '2010', 
    title: 'Deep Foundations', 
    desc: 'Partnered with B.E. Billimoria. Specialized in rocky terrain excavation and reinforced concrete piling.',
    // Construction site foundation
    img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    year: '2015', 
    title: 'Heavy Fleet Expansion', 
    desc: 'Acquired fleet of Tata Hitachi EX-380s and DTH Piling Rigs. Capacity increased to 50,000 CuM per month.',
    // Heavy machinery / Piling rig
    img: 'https://images.unsplash.com/photo-1578335345718-f6003929497e?q=80&w=1974&auto=format&fit=crop' 
  },
  { 
    year: '2020', 
    title: 'Mega Infrastructure', 
    desc: 'Executed complex basement excavations for L&T and Prestige Group. Integrated laser-guided leveling systems.',
    // Large construction site overview
    img: 'https://images.unsplash.com/photo-1590644365607-1c5a38fc43e0?q=80&w=2048&auto=format&fit=crop' 
  },
  { 
    year: '2025', 
    title: 'The Future Built', 
    desc: 'Setting industry standards with AI-driven site monitoring and 100% safety compliance across all sites.',
    // Modern safety / tech site
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop' 
  }
];

export const Timeline: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Handle Toggle Animation
  useLayoutEffect(() => {
    if (!window.gsap) return;
    
    if (isOpen) {
      // Animate Height Auto
      window.gsap.fromTo(containerRef.current, 
        { height: 0, opacity: 0 },
        { 
          height: 'auto', 
          opacity: 1, 
          duration: 1, 
          ease: 'power3.inOut',
          onComplete: () => {
            // Refresh ScrollTrigger once the DOM has expanded so positions are recalculated
            if (window.gsap.ScrollTrigger) {
              window.gsap.ScrollTrigger.refresh();
            }
          }
        }
      );
    } else {
      window.gsap.to(containerRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.in'
      });
    }
  }, [isOpen]);

  // Handle Scroll Animations (Only when open)
  useEffect(() => {
    if (!isOpen || !window.gsap || !window.gsap.ScrollTrigger) return;
    
    const ctx = window.gsap.context(() => {
      const gsap = window.gsap;
      const ScrollTrigger = window.gsap.ScrollTrigger;
      
      // 1. Line Drawing Animation
      if (lineRef.current && contentRef.current) {
        const length = lineRef.current.getTotalLength();
        
        gsap.set(lineRef.current, { 
          strokeDasharray: length, 
          strokeDashoffset: length 
        });

        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 1,
          }
        });
      }

      // 2. Items Animation (Thud Effect & Background Change)
      timelineData.forEach((_, index) => {
        const item = document.getElementById(`timeline-item-${index}`);
        if (!item) return;

        const direction = index % 2 === 0 ? -100 : 100;

        gsap.fromTo(item, 
          { 
            opacity: 0, 
            x: direction,
            scale: 0.9
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1.2,
            ease: "back.out(2.5)", // Heavy thud effect
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none reverse",
              onEnter: () => {
                // Fade in corresponding background
                bgRefs.current.forEach((bg, i) => {
                  if(bg) {
                    gsap.to(bg, { opacity: i === index ? 0.6 : 0, duration: 1 });
                  }
                });
              },
              onEnterBack: () => {
                // Handle scrolling back up
                bgRefs.current.forEach((bg, i) => {
                  if(bg) {
                    gsap.to(bg, { opacity: i === index ? 0.6 : 0, duration: 1 });
                  }
                });
              }
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isOpen]);

  return (
    <section id="timeline" ref={sectionRef} className="relative bg-background border-t border-border-subtle">
      
      {/* Sticky Background Layer - Only visible when open */}
      <div className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          {timelineData.map((data, i) => (
            <div 
              key={`bg-${i}`}
              ref={(el) => { bgRefs.current[i] = el; }}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
              style={{ 
                backgroundImage: `url(${data.img})`,
                opacity: 0 
              }}
            >
              <div className="absolute inset-0 bg-background/90 backdrop-blur-xs" />
            </div>
          ))}
          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-blueprint-pattern opacity-10" style={{ backgroundSize: '40px 40px' }}></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 py-20">
        {/* Header Section (Always Visible) */}
        <div className="text-center mb-10 relative z-20">
           <span className="font-mono text-safety text-xs uppercase tracking-widest border border-safety px-2 py-1 font-semibold">Est. 2004</span>
           <h2 className="font-header text-5xl md:text-6xl text-text-primary uppercase mt-6 mb-8">Our <span className="text-stroke-safety">Legacy</span></h2>
           
           {!isOpen && (
             <div className="animate-bounce-custom">
               <Button 
                 label="Explore Our History" 
                 variant={ButtonVariant.PRIMARY} 
                 onClick={() => setIsOpen(true)}
                 icon={<span className="text-xl">↓</span>}
               />
               <p className="font-body text-text-secondary text-sm mt-4 opacity-75">Click to unfold 20 years of excellence</p>
             </div>
           )}
        </div>

        {/* Expandable Timeline Container */}
        <div ref={containerRef} className="overflow-hidden h-0 opacity-0">
          <div ref={contentRef} className="relative pb-24">
            {/* Central Line SVG */}
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px h-full hidden md:block">
               <svg className="w-4 h-full overflow-visible" preserveAspectRatio="none">
                 <path 
                   ref={lineRef}
                   d="M 2 0 V 3000" // Long path to be drawn
                   className="stroke-safety stroke-2 fill-none"
                   vectorEffect="non-scaling-stroke"
                 />
               </svg>
            </div>

            <div className="flex flex-col gap-24 md:gap-48 relative mt-12">
              {timelineData.map((item, index) => (
                <div 
                  key={index} 
                  id={`timeline-item-${index}`}
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-0 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                >
                  {/* Content Side */}
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'} text-center`}>
                    <div className="bg-surface/90 backdrop-blur-md border border-border-subtle p-6 relative group hover:border-safety/50 transition-colors duration-300 shadow-xl rounded">
                       {/* Decorative Corners */}
                       <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-safety opacity-50"></div>
                       <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-safety opacity-50"></div>
                       
                       {/* Giant Year Number */}
                       <span className="font-header text-7xl md:text-9xl font-bold text-text-primary/5 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-0 select-none pointer-events-none">
                         {item.year}
                       </span>
                       
                       <div className="relative z-10">
                          <h3 className="font-header text-3xl text-text-primary uppercase mb-4 text-shadow-sm">{item.title}</h3>
                          <p className="font-body text-text-secondary leading-relaxed font-light">{item.desc}</p>
                       </div>
                    </div>
                  </div>

                  {/* Marker Center */}
                  <div className="relative z-20 flex-shrink-0">
                     {/* Survey Marker SVG */}
                     <div className="w-16 h-16 relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-surface rounded-full border-4 border-border-subtle shadow-md"></div>
                        <svg viewBox="0 0 40 40" className="w-10 h-10 animate-spin-slow" style={{ animationDuration: '10s' }}>
                          <circle cx="20" cy="20" r="18" className="stroke-safety stroke-2 fill-transparent opacity-50" strokeDasharray="4,4" />
                          <line x1="20" y1="0" x2="20" y2="40" className="stroke-safety stroke-1" />
                          <line x1="0" y1="20" x2="40" y2="20" className="stroke-safety stroke-1" />
                          <circle cx="20" cy="20" r="4" className="fill-safety" />
                        </svg>
                     </div>
                  </div>

                  {/* Empty Side for Layout Balance */}
                  <div className="w-full md:w-1/2 hidden md:block"></div>
                </div>
              ))}
            </div>
            
            {/* Close Button at Bottom */}
             <div className="text-center mt-24">
                <Button 
                   label="Close Timeline" 
                   variant={ButtonVariant.GHOST} 
                   onClick={() => {
                     // Scroll back to top of timeline before closing for better UX
                     sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                     setTimeout(() => setIsOpen(false), 500);
                   }} 
                />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
