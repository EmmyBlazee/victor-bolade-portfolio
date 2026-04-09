'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Magnetic from './Magnetic';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className={`navbar ${scrolled || menuOpen ? 'scrolled glass' : ''}`}>
      <div className="navbar-container">
        <Link href="/" className="logo" onClick={() => setMenuOpen(false)}>
          VB<span className="dot">.</span>
        </Link>
        
        <div className="nav-links desktop-only">
          <Magnetic><Link href="#portfolio" className="nav-link">Explore Work</Link></Magnetic>
          <Magnetic><Link href="#about" className="nav-link">Philosophy</Link></Magnetic>
          <Magnetic><Link href="#contact" className="contact-btn glass">Get In Touch</Link></Magnetic>
        </div>

        <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="mobile-menu glass"
            initial={{ clipPath: 'circle(0% at 90% 5%)' }}
            animate={{ clipPath: 'circle(150% at 90% 5%)' }}
            exit={{ clipPath: 'circle(0% at 90% 5%)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobile-links">
              {['Explore Work', 'Philosophy', 'Get In Touch'].map((text, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                >
                  <Link 
                    href={text === 'Get In Touch' ? '#contact' : text === 'Philosophy' ? '#about' : '#portfolio'} 
                    className={`mobile-link ${text === 'Get In Touch' ? 'contact-accent' : ''}`}
                    onClick={toggleMenu}
                  >
                    {text}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 30px 5vw;
          z-index: 1000;
          transition: var(--transition-smooth);
        }

        .navbar.scrolled {
          padding: 15px 5vw;
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
          z-index: 1001;
        }

        .dot {
          color: var(--accent);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .nav-link {
          font-weight: 400;
          color: var(--text-secondary);
          transition: var(--transition-smooth);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .nav-link:hover {
          color: var(--accent);
        }

        .contact-btn {
          padding: 12px 25px;
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 600;
          transition: var(--transition-smooth);
        }

        .contact-btn:hover {
          background: var(--accent);
          color: var(--background);
          border-color: var(--accent);
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          z-index: 1001;
          padding: 0;
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(10, 10, 12, 0.95);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .mobile-links {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
        }

        .mobile-link {
          font-size: 2.5rem;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-weight: 500;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .contact-accent {
          color: var(--accent);
        }

        @media (max-width: 768px) {
          .desktop-only {
            display: none;
          }
          .mobile-toggle {
            display: block;
          }
          .navbar {
            padding: 20px 5vw;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
