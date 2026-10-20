import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link

export const ButtonVariant = {
  PRIMARY: 'PRIMARY',
  SECONDARY: 'SECONDARY',
  OUTLINE: 'OUTLINE',
  GHOST: 'GHOST'
} as const;

export type ButtonVariant = typeof ButtonVariant[keyof typeof ButtonVariant];

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  label: string;
  icon?: React.ReactNode;
  to?: string; // Change href to 'to' to be consistent with react-router-dom Link
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = ButtonVariant.PRIMARY, 
  label, 
  icon, 
  className = '', 
  to, // Destructure 'to' prop
  ...props 
}) => {
  const btnRef = useRef<HTMLElement>(null); // Change type to HTMLElement as it can be Link or button

  // Magnetic Effect
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn || !window.gsap) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Move the button slightly towards the mouse (magnetic pull)
      window.gsap.to(btn, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      window.gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.4)'
      });
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const baseStyles = "relative px-6 py-3 font-header uppercase tracking-industrial text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 group overflow-hidden select-none";
  
  const variants = {
    [ButtonVariant.PRIMARY]: "bg-safety text-[var(--color-safety-text)] hover:opacity-95 border border-safety font-bold clip-path-slant shadow-md transition-all",
    [ButtonVariant.SECONDARY]: "bg-surface text-text-primary border border-border-strong hover:border-safety hover:text-safety transition-all",
    [ButtonVariant.OUTLINE]: "relative px-8 py-3.5 font-header uppercase tracking-industrial text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 group overflow-hidden select-none bg-transparent text-safety border border-safety hover:bg-safety hover:text-[var(--color-safety-text)] hover:-translate-y-0.5 hover:shadow-md",
    [ButtonVariant.GHOST]: "bg-transparent text-text-secondary hover:text-text-primary transition-colors"
  };

  const content = (
    <span className="relative z-10 flex items-center gap-2 pointer-events-none">
      {label}
      {icon && <span className="text-lg">{icon}</span>}
    </span>
  );

  const sharedClasses = `${baseStyles} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link ref={btnRef as React.RefObject<HTMLAnchorElement>} to={to} className={sharedClasses} {...props}>
        {content}
        {(variant === ButtonVariant.SECONDARY || variant === ButtonVariant.OUTLINE) && (
          <>
            <span className="absolute top-0 left-0 w-2 h-[1px] bg-current opacity-50 transition-opacity group-hover:opacity-100"></span>
            <span className="absolute top-0 left-0 w-[1px] h-2 bg-current opacity-50 transition-opacity group-hover:opacity-100"></span>
            <span className="absolute bottom-0 right-0 w-2 h-[1px] bg-current opacity-50 transition-opacity group-hover:opacity-100"></span>
            <span className="absolute bottom-0 right-0 w-[1px] h-2 bg-current opacity-50 transition-opacity group-hover:opacity-100"></span>
          </>
        )}
      </Link>
    );
  }

  return (
    <button 
      ref={btnRef as React.RefObject<HTMLButtonElement>}
      className={sharedClasses}
      {...props}
    >
      {content}
      {(variant === ButtonVariant.SECONDARY || variant === ButtonVariant.OUTLINE) && (
        <>
          <span className="absolute top-0 left-0 w-2 h-[1px] bg-current opacity-50 transition-opacity group-hover:opacity-100"></span>
          <span className="absolute top-0 left-0 w-[1px] h-2 bg-current opacity-50 transition-opacity group-hover:opacity-100"></span>
          <span className="absolute bottom-0 right-0 w-2 h-[1px] bg-current opacity-50 transition-opacity group-hover:opacity-100"></span>
          <span className="absolute bottom-0 right-0 w-[1px] h-2 bg-current opacity-50 transition-opacity group-hover:opacity-100"></span>
        </>
      )}
    </button>
  );
};