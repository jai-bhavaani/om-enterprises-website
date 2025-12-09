import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  // `fallbackSrc` is no longer directly used for display, but could be for debugging or specific logic if needed
  fallbackSrc?: string; 
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, fallbackSrc, alt, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    // If an error occurs, prevent rendering the image.
    // Optionally, `fallbackSrc` could be used here for more complex fallback logic.
    setHasError(true);
  };

  if (hasError) {
    return null; // Do not render anything if there's an error
  }

  return <img src={currentSrc} alt={alt} onError={handleError} {...props} />;
};

