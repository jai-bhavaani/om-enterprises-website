// components/Logo.tsx
import React from 'react';
import { motion } from 'framer-motion';
import logoSrc from '@/assets/images/logo.png'; // Assuming this is the correct path to your logo

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'splash';
  layoutId?: string; // To be used by Framer Motion
}

export const Logo: React.FC<LogoProps> = ({ className, size = 'medium', layoutId }) => {
  let sizeClasses = '';
  switch (size) {
    case 'small':
      sizeClasses = 'h-8 w-auto';
      break;
    case 'medium':
      sizeClasses = 'h-10 w-auto'; // Default for Navbar
      break;
    case 'large':
      sizeClasses = 'h-16 w-auto'; // For Hero section, for example
      break;
    case 'splash':
      sizeClasses = 'h-48 md:h-64 lg:h-80 w-auto'; // Large size for splash screen
      break;
    default:
      sizeClasses = 'h-10 w-auto';
  }

  return (
    <motion.img
      src={logoSrc}
      alt="OM Enterprises Logo"
      className={`${sizeClasses} ${className} rounded-lg`}
      layoutId={layoutId} // Essential for shared layout animation
    />
  );
};
