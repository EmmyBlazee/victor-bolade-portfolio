'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="footer section">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-info">
            <h2 className="footer-logo">VB<span className="dot">.</span></h2>
            <p>Designing digital experiences that leave a lasting impression. Let's build something exceptional together.</p>
          </div>
          
          <div className="footer-links">
            <h3>Social</h3>
            <a href="#" className="footer-link">Behance</a>
            <a href="#" className="footer-link">Dribbble</a>
            <a href="#" className="footer-link">LinkedIn</a>
            <a href="#" className="footer-link">Instagram</a>
          </div>

          <div className="footer-contact">
            <h3>Get in Touch</h3>
            <p>victor@bolade.design</p>
            <p>+234 800 123 4567</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Victor Bolade. Built with passion & precision.</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--surface);
          border-top: 1px solid var(--glass-border);
          padding-top: 80px;
          padding-bottom: 40px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 80px;
        }

        .footer-logo {
          font-size: 2.5rem;
          margin-bottom: 20px;
        }

        .dot {
          color: var(--accent);
        }

        .footer-info p {
          max-width: 350px;
        }

        h3 {
          font-size: 1.2rem;
          margin-bottom: 25px;
          color: var(--text-primary);
        }

        .footer-link {
          display: block;
          color: var(--text-secondary);
          margin-bottom: 15px;
          transition: var(--transition-smooth);
        }

        .footer-link:hover {
          color: var(--accent);
          transform: translateX(5px);
        }

        .footer-contact p {
          margin-bottom: 10px;
          color: var(--text-primary);
          font-weight: 500;
        }

        .footer-bottom {
          padding-top: 40px;
          border-top: 1px solid var(--glass-border);
          text-align: center;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>
    </footer>
  );
}
