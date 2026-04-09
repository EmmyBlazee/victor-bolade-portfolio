'use client';

import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [followerPosition, setFollowerPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Delay follower slightly
      setTimeout(() => {
        setFollowerPosition({ x: e.clientX, y: e.clientY });
      }, 50);
    };

    const handlePointerType = () => {
      const target = document.querySelectorAll('a, button, .project-card');
      target.forEach(el => {
        el.addEventListener('mouseenter', () => setIsPointer(true));
        el.addEventListener('mouseleave', () => setIsPointer(false));
      });
    };

    window.addEventListener('mousemove', moveCursor);
    handlePointerType();

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <>
      <div 
        className="custom-cursor" 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) ${isPointer ? 'scale(1.5)' : 'scale(1)'}`
        }} 
      />
      <div 
        className="custom-cursor-follower" 
        style={{ 
          left: `${followerPosition.x}px`, 
          top: `${followerPosition.y}px`,
          transform: `translate(-50%, -50%) ${isPointer ? 'scale(2)' : 'scale(1)'}`
        }} 
      />
    </>
  );
}
