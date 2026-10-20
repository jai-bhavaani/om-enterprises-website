import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoSrc from '@/assets/images/logo.png';

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  // brandPhase: 'om' -> 'edilite'
  const [brandPhase, setBrandPhase] = useState<'om' | 'edilite'>('om');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Phase 1: Show OM ENTERPRISES for 1.2s, then toggle to EDILITE CONSTRUCTIONS
    const toggleTimer = setTimeout(() => {
      setBrandPhase('edilite');
    }, 1200);

    // Phase 2: After total 2.4s, trigger smooth exit
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      if (onComplete) {
        onComplete();
      }
    }, 2450);

    // Absolute failsafe: guarantee unblock after 2.8s
    const failsafeTimer = setTimeout(() => {
      setIsExiting(true);
      if (onComplete) {
        onComplete();
      }
    }, 2800);

    return () => {
      clearTimeout(toggleTimer);
      clearTimeout(exitTimer);
      clearTimeout(failsafeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-0 z-[9999] bg-[#0B1120] flex flex-col items-center justify-center select-none ${
        isExiting ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
    >
      {/* Subtle blueprint grid texture for depth */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        
        {/* Logo Container with safety orange aura */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6 flex items-center justify-center"
        >
          {/* Radial Orange Accent Aura */}
          <div className="absolute -inset-4 bg-[#FF6B00]/15 rounded-full blur-xl pointer-events-none" />
          
          {/* Elegant Circular Frame */}
          <div className="relative p-2.5 rounded-2xl bg-[#0F172A]/80 border border-[#FF6B00]/30 shadow-[0_0_25px_rgba(255,107,0,0.15)] backdrop-blur-sm">
            <img
              src={logoSrc}
              alt="OM Enterprises"
              className="h-20 sm:h-24 w-auto object-contain drop-shadow-md rounded-xl"
              loading="eager"
            />
          </div>
        </motion.div>

        {/* Minimal Animated Divider Hairline */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 64, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-[2px] bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent mb-5"
        />

        {/* Brand Name & Subtitle Toggle Animation */}
        <div className="h-16 flex flex-col items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {brandPhase === 'om' ? (
              <motion.div
                key="om-brand"
                initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                <h1 className="font-header text-2xl sm:text-3xl tracking-[0.2em] font-bold text-[#F8FAFC] uppercase whitespace-nowrap">
                  OM ENTERPRISES
                </h1>
                <p className="font-body text-[10px] sm:text-[11px] text-[#94A3B8] uppercase tracking-[0.25em] font-medium mt-1">
                  Foundation & Civil Engineering Specialists
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="edilite-brand"
                initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                <h1 className="font-header text-2xl sm:text-3xl tracking-[0.2em] font-bold text-[#F8FAFC] uppercase whitespace-nowrap">
                  EDILITE CONSTRUCTIONS
                </h1>
                <p className="font-body text-[10px] sm:text-[11px] text-[#FF6B00] uppercase tracking-[0.25em] font-medium mt-1">
                  Civil Infrastructure & Construction Pvt. Ltd.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Minimal Sleek Progress Bar Indicator */}
        <div className="w-36 h-[2px] bg-slate-800/80 rounded-full mt-7 overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: 'easeInOut'
            }}
            className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent"
          />
        </div>

      </div>
    </motion.div>
  );
};
