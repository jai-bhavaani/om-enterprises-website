import React, { useRef } from 'react';

interface ServiceCardProps {
  id: string;
  title: string;
  desc: string;
  type: 'CIVIL' | 'EXCAV' | 'FNDTN' | 'ROAD' | 'ANCHOR';
}

const WireframeIcon = ({ type }: { type: ServiceCardProps['type'] }) => {
  const commonClasses = "w-full h-full fill-none stroke-[var(--color-text-primary)] stroke-[1.5] vector-effect-non-scaling-stroke";
  
  // NOTE: strokeDasharray and strokeDashoffset are used for the draw animation.
  // We set a large enough value to cover the path length.
  
  const illustrations: Record<ServiceCardProps['type'], React.ReactNode> = {
    CIVIL: (
      <svg viewBox="0 0 100 100" className={commonClasses}>
        {/* Building Outline */}
        <path d="M20 90 L20 20 L80 20 L80 90" className="animate-path" pathLength="1" />
        <path d="M20 40 L80 40" className="animate-path" pathLength="1" />
        <path d="M20 65 L80 65" className="animate-path" pathLength="1" />
        <path d="M50 20 L50 90" className="animate-path" pathLength="1" />
        {/* Crane / Detail */}
        <path d="M80 20 L95 5 L95 15" className="stroke-safety" strokeDasharray="2,2" />
        {/* Dimensions */}
        <path d="M10 20 L10 90" className="stroke-safety opacity-50" strokeDasharray="4,4" />
        <text x="5" y="55" className="fill-safety text-[8px] font-mono opacity-80" style={{ writingMode: 'vertical-rl' }}>HEIGHT</text>
      </svg>
    ),
    EXCAV: (
      <svg viewBox="0 0 100 100" className={commonClasses}>
        {/* Terrain Surface */}
        <path d="M10 40 L30 40 L40 75 L60 75 L70 40 L90 40" className="animate-path" pathLength="1" />
        {/* Cut lines */}
        <path d="M30 40 L40 75" className="stroke-safety" strokeDasharray="2,2" />
        <path d="M70 40 L60 75" className="stroke-safety" strokeDasharray="2,2" />
        {/* Depth Markers */}
        <line x1="50" y1="40" x2="50" y2="75" className="stroke-safety opacity-50" strokeDasharray="4,4" />
        <circle cx="50" cy="40" r="2" className="fill-surface stroke-[var(--color-text-primary)]" />
        <circle cx="50" cy="75" r="2" className="fill-surface stroke-[var(--color-text-primary)]" />
      </svg>
    ),
    FNDTN: (
      <svg viewBox="0 0 100 100" className={commonClasses}>
        {/* Ground */}
        <line x1="10" y1="30" x2="90" y2="30" className="stroke-[var(--color-text-secondary)] opacity-30" />
        {/* Piles */}
        <path d="M30 30 L30 85" className="animate-path" pathLength="1" />
        <path d="M40 30 L40 85" className="animate-path" pathLength="1" />
        <path d="M30 85 L40 85" className="animate-path" pathLength="1" />
        {/* Rebar details */}
        <line x1="30" y1="40" x2="40" y2="50" className="stroke-safety opacity-60" />
        <line x1="30" y1="50" x2="40" y2="60" className="stroke-safety opacity-60" />
        <line x1="30" y1="60" x2="40" y2="70" className="stroke-safety opacity-60" />
        {/* Second Pile */}
        <rect x="60" y="30" width="10" height="55" className="animate-path" pathLength="1" />
      </svg>
    ),
    ANCHOR: (
      <svg viewBox="0 0 100 100" className={commonClasses}>
        {/* Retaining Wall / Shoring Face */}
        <path d="M25 18 L25 88" className="animate-path stroke-[2]" pathLength="1" />
        <path d="M10 18 L25 18" className="animate-path stroke-[1.5]" pathLength="1" />
        <path d="M25 88 L90 88" className="stroke-[var(--color-text-secondary)] opacity-30" />
        
        {/* Upper Rock Anchor (Inclined Tieback) */}
        <line x1="25" y1="36" x2="80" y2="58" className="animate-path stroke-[1.5]" pathLength="1" />
        {/* Bearing Plate */}
        <rect x="22" y="32" width="6" height="8" className="fill-surface stroke-safety stroke-[1.5]" />
        {/* Bonded Bulb Grout Zone (Dashed) */}
        <line x1="55" y1="48" x2="80" y2="58" className="stroke-safety stroke-[3] opacity-70" strokeDasharray="3,2" />
        
        {/* Lower Rock Anchor */}
        <line x1="25" y1="62" x2="80" y2="84" className="animate-path stroke-[1.5]" pathLength="1" />
        {/* Bearing Plate */}
        <rect x="22" y="58" width="6" height="8" className="fill-surface stroke-safety stroke-[1.5]" />
        {/* Bonded Bulb Grout Zone */}
        <line x1="55" y1="74" x2="80" y2="84" className="stroke-safety stroke-[3] opacity-70" strokeDasharray="3,2" />
        
        {/* Strata / Rock Hatching */}
        <line x1="40" y1="25" x2="50" y2="20" className="stroke-[var(--color-text-secondary)] opacity-30" />
        <line x1="60" y1="35" x2="70" y2="30" className="stroke-[var(--color-text-secondary)] opacity-30" />
        <line x1="75" y1="45" x2="85" y2="40" className="stroke-[var(--color-text-secondary)] opacity-30" />
        
        {/* Tension Force Arrow & Load Text */}
        <text x="86" y="56" className="fill-safety text-[7px] font-mono opacity-90" style={{ writingMode: 'vertical-rl' }}>65T-LOAD</text>
      </svg>
    ),
    ROAD: (
      <svg viewBox="0 0 100 100" className={commonClasses}>
        {/* Horizon */}
        <line x1="10" y1="30" x2="90" y2="30" className="stroke-[var(--color-text-secondary)] opacity-30" />
        {/* Road Perspective */}
        <path d="M40 30 L10 90" className="animate-path" pathLength="1" />
        <path d="M60 30 L90 90" className="animate-path" pathLength="1" />
        {/* Center Line */}
        <line x1="50" y1="30" x2="50" y2="90" className="stroke-safety" strokeDasharray="5,5" />
        {/* Lanes */}
        <line x1="45" y1="30" x2="25" y2="90" className="stroke-[var(--color-text-secondary)] opacity-20" />
        <line x1="55" y1="30" x2="75" y2="90" className="stroke-[var(--color-text-secondary)] opacity-20" />
      </svg>
    )
  };

  return illustrations[type] || illustrations.CIVIL;
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ id, title, desc, type }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !contentRef.current || !window.gsap) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on cursor position relative to center
    // Range: -10 to 10 degrees
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12; 
    const rotateY = ((x - centerX) / centerX) * 12;

    window.gsap.to(contentRef.current, {
      rotationX: rotateX,
      rotationY: rotateY,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 1000,
      transformOrigin: "center center"
    });
  };

  const handleMouseLeave = () => {
    if (!contentRef.current || !window.gsap) return;
    
    window.gsap.to(contentRef.current, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    });
  };

  const handleMouseEnter = () => {
    // Trigger SVG drawing animation
    if (!contentRef.current || !window.gsap) return;
    
    const paths = contentRef.current.querySelectorAll('.animate-path');
    window.gsap.fromTo(paths, 
      { strokeDasharray: 100, strokeDashoffset: 100 },
      { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', stagger: 0.1 }
    );
  };

  return (
    <div 
      ref={cardRef}
      className="relative w-full h-[520px] sm:h-[540px] group perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Moving Content Container */}
      <div 
        ref={contentRef}
        className="w-full h-full relative bg-surface border border-border-subtle shadow-xl overflow-hidden preserve-3d transition-all duration-300 group-hover:shadow-2xl group-hover:border-safety/40 rounded flex flex-col justify-between"
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none bg-blueprint-pattern" 
          style={{ backgroundSize: '20px 20px' }} 
        />

        <div className="p-6 sm:p-7 flex flex-col h-full relative z-10 justify-between">
          <div>
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-xs text-safety border border-safety px-2.5 py-0.5 bg-safety/10 font-bold tracking-wider">
                {id}
              </span>
              <div className="w-2 h-2 rounded-full bg-safety animate-pulse"></div>
            </div>

            {/* Wireframe Illustration Area */}
            <div className="h-36 w-full flex items-center justify-center p-3 mb-4 border border-dashed border-border-subtle bg-surface-subtle/50 rounded flex-shrink-0">
              <div className="w-28 h-28">
                <WireframeIcon type={type} />
              </div>
            </div>
          </div>

          {/* Text Content - Unconstrained & fully readable without scrollbars */}
          <div className="flex-1 flex flex-col justify-start bg-surface/90 backdrop-blur-sm pt-4 border-t border-border-subtle">
            <h3 className="font-header text-xl sm:text-2xl text-text-primary uppercase tracking-wide mb-2.5 group-hover:text-safety transition-colors leading-tight">
              {title}
            </h3>
            <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed">
              {desc}
            </p>
          </div>
        </div>

        {/* Spec Table Overlay (Decorative) */}
        <div className="absolute top-1/2 -right-12 transform rotate-90 origin-center text-[8px] font-mono text-text-muted/30 whitespace-nowrap pointer-events-none">
          SPEC-2024-V2 // SCALE 1:100 // APPROVED
        </div>
      </div>
    </div>
  );
};