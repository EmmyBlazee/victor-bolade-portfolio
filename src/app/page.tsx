'use client';

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProjectCard from '@/components/ProjectCard';
import Magnetic from '@/components/Magnetic';

const projects = [
  {
    title: "EcoBrand Identity",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1634942537034-2530b667362c?q=80&w=1974&auto=format&fit=crop"
  },
  {
    title: "Architectural Type",
    category: "Typography",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop"
  },
  {
    title: "Nexus UX/UI",
    category: "Digital Design",
    image: "https://images.unsplash.com/photo-1541462608141-ad603a1ee596?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Vivid Motion Caps",
    category: "Motion Graphics",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Urban Flux Posters",
    category: "Print Media",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop"
  },
  {
    title: "Serenity Branding",
    category: "Minimalism",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563cc4c?q=80&w=2070&auto=format&fit=crop"
  }
];

export default function Home() {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 1500);
  };

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" as any }
  };

  const titleWords = "Victor Bolade".split(" ");
  const taglineWords = "Crafting Visual Legacies.".split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: "easeOut" as any }
    }
  };

  return (
    <div className="home-page" ref={containerRef}>
      {/* Hero Section */}
      <section className="hero">
        {/* Animated Background Orbs */}
        <motion.div 
          className="bg-glow" 
          style={{ top: '10%', right: '10%', y: y1 }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="bg-glow" 
          style={{ bottom: '20%', left: '5%', y: y2, background: 'radial-gradient(circle, #5ce1ff 0%, rgba(0,0,0,0) 70%)' }}
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="container">
          <motion.div 
            className="hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ opacity, scale }}
          >
            <motion.span 
              className="hero-tag"
              variants={wordVariants}
            >
              Multidisciplinary Designer & Visual Strategist
            </motion.span>
            <h1 className="hero-title">
              <div className="title-row">
                {titleWords.map((word, i) => (
                  <motion.span key={i} variants={wordVariants} className="word">
                    {word}
                  </motion.span>
                ))}
              </div>
              <div className="tagline-row">
                {taglineWords.map((word, i) => (
                  <motion.span 
                    key={i} 
                    variants={wordVariants} 
                    className={`word ${i >= 1 ? 'playfair accent-text' : ''}`}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </h1>
            <motion.p 
              className="hero-description"
              variants={wordVariants}
            >
              Synthesizing high-concept visual identities with architectural precision. Operating at the intersection of branding, digital experiences, and artistic storytelling for global industry leaders.
            </motion.p>
          </motion.div>
        </div>
        <div className="hero-bg-accent"></div>
      </section>

      {/* Portfolio Grid */}
      <motion.section 
        id="portfolio" 
        className="portfolio"
        {...fadeIn}
      >
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Selected Works</h2>
            <div className="filter-hint">2022 — 2026</div>
          </div>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} index={index} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* About/Services Section */}
      <motion.section 
        id="about" 
        className="about-services"
        {...fadeIn}
      >
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <h2 className="section-title">The Philosophy</h2>
              <p>
                My approach to design is rooted in the belief that every brand has a soul waiting to be visualized. 
                With over a decade of experience, I blend artistic intuition with strategic precision to create 
                identities that aren't just seen—they're felt.
              </p>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">10+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">150+</span>
                  <span className="stat-label">Projects Completed</span>
                </div>
              </div>
            </div>
            
            <div className="services-list">
              {[
                { title: "Branding", desc: "Strategic identity systems, logo design, and brand guidelines." },
                { title: "Digital Design", desc: "Bespoke web experiences, mobile interfaces, and digital assets." },
                { title: "Visual Art", desc: "Custom illustrations, typography, and motion graphics." }
              ].map((service, i) => (
                <motion.div 
                  key={i}
                  className="service-item glass"
                  whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        id="contact" 
        className="contact"
        {...fadeIn}
      >
        <div className="container">
          <div className="contact-box glass">
            <h2 className="section-title">Ready to Start?</h2>
            <p>Let's turn your vision into a visual masterpiece. Drop a message below.</p>
            
            {formStatus === 'success' ? (
              <motion.div 
                className="success-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h3>Message Sent Successfully!</h3>
                <p>I'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="glass-input" 
                    required 
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, [e.target.name || 'message']: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="glass-input" 
                    required 
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <textarea 
                    placeholder="Tell me about your project..." 
                    className="glass-input" 
                    rows={5} 
                    required
                    value={formData.message}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="submit-btn glass"
                  disabled={formStatus === 'sending'}
                >
                  {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.section>

      <style jsx>{`
        .home-page {
          background: var(--background);
        }

        /* Hero */
        .hero {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
        }

        .hero-tag {
          color: var(--accent);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          display: block;
          margin-bottom: 20px;
        }

        .hero-title {
          font-size: clamp(1.8rem, 8vw, 6rem);
          line-height: 1;
          margin-bottom: 2rem;
          font-weight: 800;
          word-wrap: break-word;
        }

        .title-row {
          display: block;
        }

        .tagline-row {
          display: block;
          margin-top: 1rem;
        }

        .word {
          display: inline-block;
        }

        .playfair {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-weight: 400;
        }

        .accent-text {
          color: var(--accent);
          text-shadow: var(--accent-glow);
          -webkit-text-stroke: 0;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2rem;
        }

        .hero-description {
          max-width: 600px;
          font-size: 1.2rem;
          margin: 0;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 1.5rem;
          margin-top: 3rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .primary-btn {
          padding: 18px 40px;
          border-radius: 100px;
          font-weight: 600;
          background: var(--accent);
          color: var(--background) !important;
          transition: var(--transition-smooth);
        }

        .primary-btn:hover {
          background: var(--accent-light);
          transform: translateY(-5px);
        }

        .secondary-btn {
          padding: 18px 40px;
          font-weight: 600;
          color: var(--text-primary);
          transition: var(--transition-smooth);
        }

        .hero-bg-accent {
          position: absolute;
          top: -10%;
          right: -10%;
          width: 50vw;
          height: 50vw;
          background: radial-gradient(circle, rgba(0,209,255,0.05) 0%, rgba(0,0,0,0) 70%);
          z-index: -1;
        }

        /* Section Header */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 60px;
        }

        .section-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
        }

        .filter-hint {
          color: var(--accent);
          font-family: monospace;
        }

        /* Portfolio */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 80px 40px; /* Larger row gap for asymmetry */
          padding-bottom: 60px;
        }

        /* About Grid */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 100px;
          align-items: center;
        }

        .stats-grid {
          display: flex;
          gap: 50px;
          margin-top: 40px;
        }

        .stat-number {
          display: block;
          font-size: 3rem;
          font-weight: 800;
          color: var(--accent);
        }

        .stat-label {
          color: var(--text-secondary);
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
        }

        /* Services */
        .services-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .service-item {
          padding: 30px;
          border-radius: 20px;
        }

        .service-item h3 {
          margin-bottom: 10px;
          color: var(--accent);
        }

        /* Contact Box */
        .contact-box {
          padding: 60px;
          border-radius: 40px;
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .contact-form {
          margin-top: 40px;
          display: grid;
          gap: 20px;
        }

        .glass-input {
          width: 100%;
          padding: 15px 25px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: white;
          outline: none;
          transition: var(--transition-smooth);
        }

        .glass-input:focus {
          border-color: var(--accent);
          background: rgba(255,255,255,0.08);
        }

        .submit-btn {
          padding: 18px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .submit-btn:hover:not(:disabled) {
          background: var(--accent);
          color: var(--background);
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .success-message {
          padding: 40px;
        }

        .success-message h3 {
          color: var(--accent);
          margin-bottom: 10px;
        }

        @media (max-width: 992px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 60px;
          }
        }

        @media (max-width: 600px) {
          .hero-actions {
            flex-direction: column;
          }
          .contact-box {
            padding: 30px;
          }
           .projects-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
