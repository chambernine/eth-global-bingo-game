import React, { useState, useEffect } from 'react';

export const AnimatedModal = ({ isOpen, onClose, children }) => {
  const [animationClass, setAnimationClass] = useState('opacity-0 scale-95');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimationClass('opacity-100 scale-100'), 10);
    } else {
      setAnimationClass('opacity-0 scale-95');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className={`relative transform transition-all duration-300 ease-out ${animationClass}`}>
        {children}
      </div>
    </div>
  );
};