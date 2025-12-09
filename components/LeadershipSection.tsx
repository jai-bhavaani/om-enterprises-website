import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LEADERS, Leader } from '../src/data/team'; // Adjust path as necessary
import { Button } from './Button'; // Assuming Button component is available
import { ButtonVariant } from '../types';

// Reusable LeaderCard component (optional, but good for separation of concerns)
const LeaderCard: React.FC<{ leader: Leader }> = ({ leader }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="bg-background border border-slate-800 p-8 text-center hover:border-safety/50 transition-colors group rounded-lg shadow-lg"
  >
    <div className="w-40 h-40 bg-slate-800 rounded-full mx-auto mb-6 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-300">
      {/* Avatar Placeholder - use leader.image eventually */}
      <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
    </div>
    <h3 className="font-header text-xl text-white uppercase mb-1">{leader.name}</h3>
    <p className="font-body text-safety text-sm uppercase tracking-widest mb-4">{leader.role}</p>
    <p className="font-body text-concrete/80 text-sm mb-4 line-clamp-3">{leader.bio}</p>
    {/* LinkedIn link removed as per request */}
    {/* Removed the extra div with ID/status text as per request */}
  </motion.div>
);

export const LeadershipSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 3; // Display first 3 leaders by default
  const displayedLeaders = showAll ? LEADERS : LEADERS.slice(0, initialDisplayCount);

  return (
    <section id="team" className="py-20 px-4 bg-surface/10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="font-header text-4xl uppercase font-bold text-white mb-4">Meet Our Leadership</h2>
        <p className="font-body text-concrete max-w-2xl mx-auto">Decades of combined experience in high-stakes infrastructure development.</p>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence initial={false}>
            {displayedLeaders.map((leader, index) => (
              <LeaderCard key={leader.name} leader={leader} /> // Use leader.name as key for simplicity
            ))}
          </AnimatePresence>
        </div>

        {LEADERS.length > initialDisplayCount && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant={ButtonVariant.OUTLINE}
              label={showAll ? "Show Less" : "View More"}
              icon={
                <motion.span
                  animate={{ rotate: showAll ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </motion.span>
              }
            />
          </div>
        )}
      </div>
    </section>
  );
};