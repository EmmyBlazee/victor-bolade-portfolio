'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const defaultFooter = {
  bio: "Designing digital experiences that leave a lasting impression. Let's build something exceptional together.",
  socials: [
    { label: 'Behance', url: '#' },
    { label: 'Dribbble', url: '#' },
    { label: 'LinkedIn', url: '#' },
    { label: 'Instagram', url: '#' }
  ],
  email: 'victor@bolade.design',
  phone: '+234 800 123 4567'
};

export default function Footer() {
  const [footerData, setFooterData] = useState(defaultFooter);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/settings?key=footer', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setFooterData({ ...defaultFooter, ...data });
        }
      })
      .catch(console.error);
  }, []);
  return (
    <footer className="footer section">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-info">
            <h2 className="footer-logo">VB<Link href="/login" className="dot-link"><span className="dot">.</span></Link></h2>
            <p>{footerData.bio}</p>
          </div>
          
          <div className="footer-links">
            <h3>Social</h3>
            {footerData.socials.map((link, index) => (
              <a key={index} href={link.url} className="footer-link" target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ))}
          </div>

          <div className="footer-contact">
            <h3>Get in Touch</h3>
            <p>{footerData.email}</p>
            <p>{footerData.phone}</p>
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
