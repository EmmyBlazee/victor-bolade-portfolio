'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

const defaultProjects = [
  {
    title: "EcoBrand Identity",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1634942537034-2530b667362c?q=80&w=1974&auto=format&fit=crop",
    description: ""
  },
  {
    title: "Architectural Type",
    category: "Typography",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
    description: ""
  },
  {
    title: "Nexus UX/UI",
    category: "Digital Design",
    image: "https://images.unsplash.com/photo-1541462608141-ad603a1ee596?q=80&w=2070&auto=format&fit=crop",
    description: ""
  },
  {
    title: "Vivid Motion Caps",
    category: "Motion Graphics",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    description: ""
  },
  {
    title: "Urban Flux Posters",
    category: "Print Media",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop",
    description: ""
  },
  {
    title: "Serenity Branding",
    category: "Minimalism",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563cc4c?q=80&w=2070&auto=format&fit=crop",
    description: ""
  }
];

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        let allProjects = Array.isArray(data) && data.length > 0 ? data : defaultProjects;

        if (params && params.slug) {
          const foundProject = allProjects.find((p: any) => {
            const slug = encodeURIComponent(p.title.toLowerCase().replace(/\s+/g, '-'));
            return slug === params.slug;
          });

          if (foundProject) {
            setProject(foundProject);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params]);

  if (loading) {
    return <div className="project-detail-page"><div className="container" style={{paddingTop: '150px'}}>Loading...</div></div>;
  }

  if (!project) {
    return (
      <div className="project-detail-page">
        <div className="container" style={{paddingTop: '150px'}}>
          <h1>Project non found</h1>
          <Link href="/" className="submit-btn glass" style={{marginTop: '20px', display: 'inline-block'}}>Back to Portfolio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      <div className="container">
        
        <Link href="/" className="back-btn glass">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to work
        </Link>

        <div className="project-header">
          <motion.h1 
            className="project-title playfair"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {project.title}
          </motion.h1>
          <motion.span 
            className="project-category"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {project.category}
          </motion.span>
        </div>

        <motion.div 
          className="image-wrapper glass"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img src={project.image} alt={project.title} className="hero-img"/>
        </motion.div>

        <div className="content-grid">
          <motion.div 
            className="info-column"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3>About This Project</h3>
          </motion.div>
          <motion.div 
            className="text-column"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {project.description ? (
              project.description.split('\n').map((paragraph: string, i: number) => (
                <p key={i}>{paragraph}</p>
              ))
            ) : (
              <p>No extra details were provided for this case study. View the visuals above to explore the identity and artistic direction.</p>
            )}
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .project-detail-page {
          min-height: 100vh;
          padding-top: 150px;
          padding-bottom: 100px;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          border-radius: 30px;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 60px;
          transition: var(--transition-smooth);
        }

        .back-btn:hover {
          color: var(--accent);
          background: rgba(255,255,255,0.08);
        }

        .project-header {
          margin-bottom: 50px;
        }

        .project-title {
          font-size: 5rem;
          line-height: 1.1;
          margin-bottom: 15px;
          color: var(--accent);
        }

        .project-category {
          font-size: 1.2rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--text-secondary);
        }

        .image-wrapper {
          width: 100%;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 80px;
        }

        .hero-img {
          width: 100%;
          max-height: 70vh;
          object-fit: cover;
          display: block;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 60px;
        }

        .info-column h3 {
          font-size: 1.5rem;
          color: var(--text-primary);
          border-top: 2px solid var(--accent);
          padding-top: 20px;
        }

        .text-column {
          font-size: 1.2rem;
          line-height: 1.8;
          color: var(--text-secondary);
        }

        .text-column p {
          margin-bottom: 20px;
        }

        @media (max-width: 900px) {
          .project-title {
            font-size: 3rem;
          }
          .content-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .hero-img {
            max-height: 50vh;
          }
        }
      `}</style>
    </div>
  );
}
