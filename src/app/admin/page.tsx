'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState({ title: '', category: '', image: '', description: '' });
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/login');
      return;
    }

    const stored = localStorage.getItem('portfolio_projects');
    if (stored) {
      try {
        setProjects(JSON.parse(stored));
      } catch (e) {
        setProjects(defaultProjects);
      }
    } else {
      setProjects(defaultProjects);
    }
    setLoading(false);
  }, [router]);

  const saveProjects = (updatedProjects: any[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects));
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.image) return;
    
    const updated = [newProject, ...projects];
    saveProjects(updated);
    setNewProject({ title: '', category: '', image: '', description: '' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProject({ ...newProject, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProject = (index: number) => {
    const updated = projects.filter((_: any, i: number) => i !== index);
    saveProjects(updated);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.push('/');
  };

  if (loading) return <div className="admin-page">Loading...</div>;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1 className="section-title">Admin Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn glass">Logout</button>
        </div>

        <div className="admin-grid">
          {/* Add Project Form */}
          <motion.div 
            className="admin-panel glass"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3>Add New Project</h3>
            <form className="add-form" onSubmit={handleAddProject}>
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Project Title" 
                  className="glass-input" 
                  required 
                  value={newProject.title}
                  onChange={(e: any) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Category (e.g. Branding)" 
                  className="glass-input" 
                  required 
                  value={newProject.category}
                  onChange={(e: any) => setNewProject({ ...newProject, category: e.target.value })}
                />
              </div>
              <div className="form-group">
                <input 
                  type="file" 
                  accept="image/*"
                  className="glass-input" 
                  required 
                  onChange={handleImageUpload}
                />
              </div>
              <div className="form-group">
                <textarea 
                  placeholder="Project Description" 
                  className="glass-input" 
                  rows={4}
                  value={newProject.description}
                  onChange={(e: any) => setNewProject({ ...newProject, description: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="submit-btn glass">Add Project</button>
            </form>
          </motion.div>

          {/* Manage Projects List */}
          <motion.div 
            className="admin-panel glass"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3>Manage Projects</h3>
            <div className="projects-list">
              {projects.length === 0 ? (
                <p>No projects found.</p>
              ) : (
                projects.map((p: any, index: number) => (
                  <div key={index} className="project-list-item glass">
                    <img src={p.image} alt={p.title} className="thumb" />
                    <div className="project-info">
                      <h4>{p.title}</h4>
                      <span>{p.category}</span>
                    </div>
                    <button onClick={() => handleRemoveProject(index)} className="delete-btn">
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          padding-top: 120px;
          padding-bottom: 60px;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .admin-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .admin-panel {
          padding: 40px;
          border-radius: 20px;
        }

        .admin-panel h3 {
          margin-bottom: 25px;
          color: var(--accent);
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1.5rem;
        }

        .add-form {
          display: grid;
          gap: 20px;
        }

        .glass-input {
          width: 100%;
          padding: 15px 20px;
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
          padding: 15px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-smooth);
          margin-top: 10px;
        }

        .submit-btn:hover {
          background: var(--accent);
          color: var(--background);
        }

        .logout-btn {
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 0.9rem;
          color: #ff5c5c;
          cursor: pointer;
        }

        .logout-btn:hover {
          background: rgba(255, 92, 92, 0.1);
        }

        .projects-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
          max-height: 600px;
          overflow-y: auto;
          padding-right: 10px;
        }

        /* Custom Scrollbar for projects list */
        .projects-list::-webkit-scrollbar {
          width: 6px;
        }
        .projects-list::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02); 
        }
        .projects-list::-webkit-scrollbar-thumb {
          background: var(--glass-border); 
          border-radius: 10px;
        }

        .project-list-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          border-radius: 12px;
        }

        .thumb {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
        }

        .project-info {
          flex: 1;
        }

        .project-info h4 {
          font-size: 1.1rem;
          margin-bottom: 4px;
        }

        .project-info span {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .delete-btn {
          background: rgba(255, 92, 92, 0.1);
          color: #ff5c5c;
          border: none;
          padding: 8px 15px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: var(--transition-smooth);
        }

        .delete-btn:hover {
          background: #ff5c5c;
          color: white;
        }

        @media (max-width: 900px) {
          .admin-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
