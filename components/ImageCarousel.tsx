import React, { useState, useEffect, useCallback } from 'react';
import { ImageWithFallback } from './ImageWithFallback';
import { motion, AnimatePresence } from 'framer-motion';

export interface CarouselItem {
  src: string;
  title?: string;
}

interface ImageCarouselProps {
  items: CarouselItem[];
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(timer);
  }, [nextImage]);

  return (
    <div className="relative w-full h-full group">
      {items.map((item, index) => (
        <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
            <ImageWithFallback
            src={item.src}
            fallbackSrc="https://placehold.co/800x600/png?text=Image+Not+Found"
            alt={item.title || `Carousel image ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
            />
             {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-lg"></div>
        </div>
      ))}
      
      {/* Project Title Animation */}
      <div className="absolute bottom-16 left-0 right-0 z-20 px-6 text-center">
        <AnimatePresence mode='wait'>
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="text-white font-header text-2xl md:text-3xl uppercase tracking-wider">
                    {items[currentIndex]?.title}
                </h3>
            </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={prevImage}
          className="bg-black/50 hover:bg-black/75 text-white rounded-full p-2 backdrop-blur-sm transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextImage}
          className="bg-black/50 hover:bg-black/75 text-white rounded-full p-2 backdrop-blur-sm transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
