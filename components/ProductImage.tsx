import React, { useState, useEffect } from 'react';

interface Props {
  upc: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

export const ProductImage: React.FC<Props> = ({ upc, alt, className, onClick }) => {
  // Logic to determine potential filenames
  const fullUpc = upc; // e.g. 0001234567890
  const strippedUpc = parseInt(upc, 10).toString(); // e.g. 1234567890

  // Priority list of paths to try - prioritizing .webp as requested
  const candidates = [
    `/${strippedUpc}.webp`,
    `/${fullUpc}.webp`,
    `/${strippedUpc}.png`,
    `/${strippedUpc}.jpg`,
    `/${strippedUpc}.jpeg`,
    `/${fullUpc}.png`,
    `/${fullUpc}.jpg`
  ];

  const [currentSrc, setCurrentSrc] = useState(candidates[0]);
  const [attemptIdx, setAttemptIdx] = useState(0);

  useEffect(() => {
    // Reset when UPC changes
    setAttemptIdx(0);
    setCurrentSrc(candidates[0]);
  }, [upc]);

  const handleError = () => {
    const nextIdx = attemptIdx + 1;
    if (nextIdx < candidates.length) {
      setAttemptIdx(nextIdx);
      setCurrentSrc(candidates[nextIdx]);
    } else {
      // Fallback to placeholder if all local files fail
      setCurrentSrc(`https://placehold.co/100x300/222/FFF?text=${strippedUpc}`);
    }
  };

  return (
    <img 
      src={currentSrc} 
      alt={alt} 
      className={className} 
      onClick={onClick}
      onError={handleError}
      loading="lazy"
    />
  );
};
