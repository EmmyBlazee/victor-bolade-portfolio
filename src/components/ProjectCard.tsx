'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  category: string;
  image: string;
  index: number;
}

export default function ProjectCard({ title, category, image, index }: ProjectCardProps) {
  const yOffset = index % 2 === 0 ? 0 : 40; // Asymmetric offset for masonry feel

  return (
      <motion.div 
        className="project-card"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: yOffset }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.8 }}
        whileHover={{ y: yOffset - 15 }}
      >
      <div className="image-container">
        <img src={image} alt={title} className="project-image" />
        <div className="overlay">
          <motion.div 
            className="overlay-content"
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="category">{category}</span>
            <h3 className="project-title playfair">{title}</h3>
            <div className="view-project">
              View Project 
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .project-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          background: var(--surface);
          aspect-ratio: 4/5;
          cursor: pointer;
        }

        .image-container {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .project-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.2, 1, 0.3, 1);
        }

        .project-card:hover .project-image {
          transform: scale(1.1);
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%);
          display: flex;
          align-items: flex-end;
          padding: 30px;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .project-card:hover .overlay {
          opacity: 1;
        }

        .category {
          font-size: 0.8rem;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
          display: block;
        }

        .project-title {
          font-size: 1.8rem;
          margin-bottom: 15px;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-weight: 500;
        }

        .view-project {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 500;
        }
      `}</style>
    </motion.div>
  );
}
