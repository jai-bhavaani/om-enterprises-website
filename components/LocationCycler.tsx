import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOCATIONS = ["Goa","Thane","Navi Mumbai",     "Jharkhand", "Jammu", "Mumbai"];

export const LocationCycler: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOCATIONS.length);
    }, 3500); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-concrete-light mt-5">
       <svg 
         xmlns="http://www.w3.org/2000/svg" 
         viewBox="0 0 24 24" 
         fill="currentColor" 
         className="w-15 h-10 text-safety"
       >
         <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
       </svg>
       
       <div className="relative h-6 w-34 overflow-hidden">
         <AnimatePresence mode='wait'>
           <motion.span
             key={LOCATIONS[index]}
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             exit={{ y: -20, opacity: 0 }}
             transition={{ duration: 0.5, ease: "easeOut" }}
             className="absolute left-0 top-0 font-body text-sm font-medium uppercase tracking-wide block"
           >
             {LOCATIONS[index]}
           </motion.span>
         </AnimatePresence>
       </div>
    </div>
  );
};
