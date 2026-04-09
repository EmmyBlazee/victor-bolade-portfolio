'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'project'>('default');

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.project-card')) {
        setCursorType('project');
      } else if (target.closest('a, button')) {
        setCursorType('pointer');
      } else {
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div 
        className="custom-cursor" 
        style={{ 
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          scale: cursorType === 'pointer' ? 1.5 : cursorType === 'project' ? 0 : 1,
        }} 
      />
      <motion.div 
        className="custom-cursor-follower" 
        style={{ 
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          scale: cursorType === 'pointer' ? 2 : cursorType === 'project' ? 4 : 1,
          backgroundColor: cursorType === 'project' ? 'var(--accent)' : 'transparent',
        }} 
      >
        {cursorType === 'project' && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="view-label"
          >
            VIEW
          </motion.span>
        )}
      </motion.div>

      <style jsx global>{`
        .custom-cursor {
          width: 20px;
          height: 20px;
          background: var(--accent);
          border-radius: 50%;
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
          margin: -10px 0 0 -10px;
        }

        .custom-cursor-follower {
          width: 40px;
          height: 40px;
          border: 1px solid var(--accent);
          border-radius: 50%;
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 9998;
          margin: -20px 0 0 -20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s ease;
        }

        .view-label {
          color: var(--background);
          font-size: 0.5rem;
          font-weight: 800;
          letter-spacing: 0.1em;
        }
      `}</style>
    </>
  );
}
