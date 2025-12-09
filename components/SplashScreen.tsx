// components/SplashScreen.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

interface SplashScreenProps {
  isLoading: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ isLoading }) => {
  console.log('SplashScreen: rendering with isLoading:', isLoading); // Added log
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-[9999] bg-background flex items-center justify-center"
      style={{ pointerEvents: isLoading ? 'auto' : 'none' }} // Disable pointer events after fade out
    >
      <Logo size="splash" layoutId="brand-logo" />
    </motion.div>
  );
};
