'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// ---- Defaults ----
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

const defaultPageContent = {
  heroTag: 'Graphic Designer',
  heroTitle: 'Victor Bolade',
  heroTagline: 'Crafting Visual Legacies.',
  heroDescription: 'Synthesizing high-concept visual identities with architectural precision. Operating at the intersection of branding, digital experiences, and artistic storytelling for global industry leaders.',
  aboutPhilosophy: "My approach to design is rooted in the belief that every brand has a soul waiting to be visualized. With over a decade of experience, I blend artistic intuition with strategic precision to create identities that aren't just seen—they're felt.",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [toast, setToast] = useState('');

  // Projects state
  const [projects, setProjects] = useState<any[]>([]);
  const [newProject, setNewProject] = useState({ title: '', category: '', description: '' });
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [footerData, setFooterData] = useState(defaultFooter);
  const [pageContent, setPageContent] = useState<any>(defaultPageContent);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // ---- Auth check & initial load ----
  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (!auth) { router.push('/login'); return; }

    Promise.all([
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/settings?key=footer').then(r => r.json()),
      fetch('/api/settings?key=page_content').then(r => r.json()),
    ]).then(([proj, footer, page]) => {
      if (Array.isArray(proj)) setProjects(proj);
      if (footer) setFooterData({ ...defaultFooter, ...footer });
      if (page) {
        setPageContent({ ...defaultPageContent, ...page });
        if (page.logoUrl) setLogoPreview(page.logoUrl);
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, [router]);

  // ---- Image upload ----
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return editingProject?.image_url || null;
    const form = new FormData();
    form.append('file', imageFile);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    const data = await res.json();
    if (data.error) { showToast('Upload failed: ' + data.error); return null; }
    return data.url;
  };

  // ---- Add project ----
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;
    setSaving('add');
    const url = await uploadImage();
    if (!url) { setSaving(''); return; }
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newProject, image_url: url, sort_order: projects.length })
    });
    const created = await res.json();
    if (!created.error) {
      setProjects([...projects, created]);
      setNewProject({ title: '', category: '', description: '' });
      setImageFile(null);
      setImagePreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      showToast('Project added!');
    } else {
      showToast('Error: ' + created.error);
    }
    setSaving('');
  };

  // ---- Edit project ----
  const startEdit = (p: any) => {
    setEditingProject(p);
    setImagePreview(p.image_url);
    setImageFile(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving('edit');
    const url = await uploadImage();
    const res = await fetch('/api/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editingProject, image_url: url })
    });
    const updated = await res.json();
    if (!updated.error) {
      setProjects(projects.map(p => p.id === updated.id ? updated : p));
      setEditingProject(null);
      setImagePreview('');
      setImageFile(null);
      showToast('Project saved!');
    } else {
      showToast('Error: ' + updated.error);
    }
    setSaving('');
  };

  // ---- Delete project ----
  const handleDelete = async (id: string) => {
    if (!confirm('Remove this project?')) return;
    const res = await fetch('/api/projects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (data.success) {
      setProjects(projects.filter(p => p.id !== id));
      showToast('Project removed.');
    }
  };

  // ---- Save settings ----
  const handleSaveFooter = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving('footer');
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'footer', value: footerData })
    });
    const d = await res.json();
    showToast(d.success ? 'Footer saved!' : 'Error: ' + d.error);
    setSaving('');
  };

  const handleSavePageContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving('page');
    
    let finalContent = { ...pageContent };
    
    if (logoFile) {
      const form = new FormData();
      form.append('file', logoFile);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!data.error) {
        finalContent.logoUrl = data.url;
      } else {
        showToast('Logo upload failed: ' + data.error);
        setSaving('');
        return;
      }
    }

    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'page_content', value: finalContent })
    });
    const d = await res.json();
    if (d.success) {
      setPageContent(finalContent);
      setLogoFile(null);
      showToast('Homepage content saved!');
    } else {
      showToast('Error: ' + d.error);
    }
    setSaving('');
  };

  const handleSocialChange = (index: number, field: 'label' | 'url', value: string) => {
    const s = [...footerData.socials];
    s[index] = { ...s[index], [field]: value };
    setFooterData({ ...footerData, socials: s });
  };

  const handleLogout = () => { localStorage.removeItem('admin_auth'); router.push('/'); };

  if (loading) return (
    <div className="admin-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p>Loading dashboard…</p>
    </div>
  );

  return (
    <div className="admin-page">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div className="toast" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container">
        <div className="admin-header">
          <h1 className="section-title">Admin Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn glass">Logout</button>
        </div>

        {/* ========== PROJECTS ========== */}
        <div className="admin-grid">
          {/* Add project */}
          <motion.div className="admin-panel glass" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h3>Add New Project</h3>
            <form className="add-form" onSubmit={handleAddProject}>
              <input type="text" placeholder="Project Title" className="glass-input" required
                value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} />
              <input type="text" placeholder="Category (e.g. Branding)" className="glass-input"
                value={newProject.category} onChange={e => setNewProject({ ...newProject, category: e.target.value })} />
              <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                {imagePreview && !editingProject
                  ? <img src={imagePreview} alt="preview" className="upload-preview" />
                  : <span>Click to choose image</span>}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
              <textarea placeholder="Project Description" className="glass-input" rows={4}
                value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} />
              <button type="submit" className="submit-btn glass" disabled={saving === 'add'}>
                {saving === 'add' ? 'Saving…' : 'Add Project'}
              </button>
            </form>
          </motion.div>

          {/* Manage projects */}
          <motion.div className="admin-panel glass" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3>Manage Projects</h3>
            <div className="projects-list">
              {projects.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No projects yet. Add one!</p>}
              {projects.map((p: any) => (
                <div key={p.id} className="project-list-item glass">
                  <img src={p.image_url} alt={p.title} className="thumb" />
                  <div className="project-info">
                    <h4>{p.title}</h4>
                    <span>{p.category}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => startEdit(p)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="delete-btn">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ========== EDIT MODAL ========== */}
        <AnimatePresence>
          {editingProject && (
            <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditingProject(null)}>
              <motion.div className="modal-box glass" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}>
                <h3>Edit Project</h3>
                <form className="add-form" onSubmit={handleSaveEdit}>
                  <input type="text" placeholder="Project Title" className="glass-input" required
                    value={editingProject.title}
                    onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} />
                  <input type="text" placeholder="Category" className="glass-input"
                    value={editingProject.category}
                    onChange={e => setEditingProject({ ...editingProject, category: e.target.value })} />
                  <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                    {imagePreview
                      ? <img src={imagePreview} alt="preview" className="upload-preview" />
                      : <span>Click to change image</span>}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                  <textarea placeholder="Description" className="glass-input" rows={5}
                    value={editingProject.description}
                    onChange={e => setEditingProject({ ...editingProject, description: e.target.value })} />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="submit-btn glass" disabled={saving === 'edit'}>
                      {saving === 'edit' ? 'Saving…' : 'Save Changes'}
                    </button>
                    <button type="button" className="logout-btn glass" onClick={() => setEditingProject(null)}>Cancel</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========== HOMEPAGE CONTENT ========== */}
        <motion.div className="admin-panel glass" style={{ marginTop: '40px' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3>Edit Homepage Content</h3>
          <form className="add-form" onSubmit={handleSavePageContent}>
            <div>
              <label className="field-label">Navbar Logo / Profile Picture</label>
              <div className="upload-zone" onClick={() => logoInputRef.current?.click()} style={{ minHeight: '80px', padding: '15px' }}>
                {logoPreview
                  ? <img src={logoPreview} alt="logo preview" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                  : <span>Click to upload Logo</span>}
              </div>
              <input ref={logoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setLogoFile(file);
                  setLogoPreview(URL.createObjectURL(file));
                }
              }} />
            </div>
            <div className="two-col">
              <div>
                <label className="field-label">Hero Tag</label>
                <input type="text" className="glass-input" value={pageContent.heroTag}
                  onChange={e => setPageContent({ ...pageContent, heroTag: e.target.value })} />
              </div>
              <div>
                <label className="field-label">Hero Title (Your Name)</label>
                <input type="text" className="glass-input" value={pageContent.heroTitle}
                  onChange={e => setPageContent({ ...pageContent, heroTitle: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="field-label">Tagline</label>
              <input type="text" className="glass-input" value={pageContent.heroTagline}
                onChange={e => setPageContent({ ...pageContent, heroTagline: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Hero Description</label>
              <textarea className="glass-input" rows={3} value={pageContent.heroDescription}
                onChange={e => setPageContent({ ...pageContent, heroDescription: e.target.value })} />
            </div>
            <div>
              <label className="field-label">About / Philosophy</label>
              <textarea className="glass-input" rows={3} value={pageContent.aboutPhilosophy}
                onChange={e => setPageContent({ ...pageContent, aboutPhilosophy: e.target.value })} />
            </div>
            <button type="submit" className="submit-btn glass" disabled={saving === 'page'}>
              {saving === 'page' ? 'Saving…' : 'Save Homepage Content'}
            </button>
          </form>
        </motion.div>

        {/* ========== FOOTER ========== */}
        <motion.div className="admin-panel glass" style={{ marginTop: '40px' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3>Edit Footer & Contact</h3>
          <form className="add-form" onSubmit={handleSaveFooter}>
            <div>
              <label className="field-label">Bio</label>
              <textarea className="glass-input" rows={3} value={footerData.bio}
                onChange={e => setFooterData({ ...footerData, bio: e.target.value })} />
            </div>
            <div className="two-col">
              <div>
                <label className="field-label">Email</label>
                <input type="text" className="glass-input" value={footerData.email}
                  onChange={e => setFooterData({ ...footerData, email: e.target.value })} />
              </div>
              <div>
                <label className="field-label">Phone</label>
                <input type="text" className="glass-input" value={footerData.phone}
                  onChange={e => setFooterData({ ...footerData, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="field-label">Social Links</label>
              {footerData.socials.map((link, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <input type="text" placeholder="Label" className="glass-input" style={{ flex: 1 }}
                    value={link.label} onChange={e => handleSocialChange(i, 'label', e.target.value)} />
                  <input type="text" placeholder="URL" className="glass-input" style={{ flex: 2 }}
                    value={link.url} onChange={e => handleSocialChange(i, 'url', e.target.value)} />
                </div>
              ))}
            </div>
            <button type="submit" className="submit-btn glass" disabled={saving === 'footer'}>
              {saving === 'footer' ? 'Saving…' : 'Save Footer'}
            </button>
          </form>
        </motion.div>
      </div>

      <style jsx>{`
        .admin-page { min-height: 100vh; padding-top: 120px; padding-bottom: 80px; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .admin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .admin-panel { padding: 40px; border-radius: 20px; }
        .admin-panel h3 { margin-bottom: 25px; color: var(--accent); font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.5rem; }
        .add-form { display: grid; gap: 16px; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .field-label { display: block; margin-bottom: 6px; font-size: 0.85rem; color: var(--accent); }
        .glass-input { width: 100%; padding: 14px 18px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 12px; color: white; outline: none; transition: var(--transition-smooth); box-sizing: border-box; }
        .glass-input:focus { border-color: var(--accent); background: rgba(255,255,255,0.08); }
        .upload-zone { border: 2px dashed var(--glass-border); border-radius: 12px; padding: 30px; text-align: center; cursor: pointer; transition: var(--transition-smooth); color: var(--text-secondary); min-height: 100px; display: flex; align-items: center; justify-content: center; }
        .upload-zone:hover { border-color: var(--accent); color: var(--accent); }
        .upload-preview { width: 100%; max-height: 180px; object-fit: cover; border-radius: 8px; }
        .submit-btn { padding: 15px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: var(--transition-smooth); }
        .submit-btn:hover { background: var(--accent); color: var(--background); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .logout-btn { padding: 10px 20px; border-radius: 10px; font-size: 0.9rem; color: #ff5c5c; cursor: pointer; }
        .logout-btn:hover { background: rgba(255,92,92,0.1); }
        .projects-list { display: flex; flex-direction: column; gap: 14px; max-height: 560px; overflow-y: auto; padding-right: 8px; }
        .projects-list::-webkit-scrollbar { width: 5px; }
        .projects-list::-webkit-scrollbar-thumb { background: var(--glass-border); border-radius: 10px; }
        .project-list-item { display: flex; align-items: center; gap: 14px; padding: 14px; border-radius: 12px; }
        .thumb { width: 60px; height: 60px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
        .project-info { flex: 1; }
        .project-info h4 { font-size: 1rem; margin-bottom: 3px; }
        .project-info span { font-size: 0.8rem; color: var(--text-secondary); }
        .edit-btn { background: rgba(100,200,255,0.1); color: #5ce1ff; border: none; padding: 7px 14px; border-radius: 8px; cursor: pointer; font-size: 0.8rem; transition: var(--transition-smooth); }
        .edit-btn:hover { background: #5ce1ff; color: var(--background); }
        .delete-btn { background: rgba(255,92,92,0.1); color: #ff5c5c; border: none; padding: 7px 14px; border-radius: 8px; cursor: pointer; font-size: 0.8rem; transition: var(--transition-smooth); }
        .delete-btn:hover { background: #ff5c5c; color: white; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-box { width: 90%; max-width: 600px; padding: 40px; border-radius: 20px; max-height: 90vh; overflow-y: auto; }
        .modal-box h3 { margin-bottom: 25px; color: var(--accent); font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.5rem; }
        .toast { position: fixed; top: 30px; right: 30px; background: var(--accent); color: var(--background); padding: 14px 24px; border-radius: 12px; font-weight: 600; z-index: 9999; }
        @media (max-width: 900px) {
          .admin-grid { grid-template-columns: 1fr; }
          .two-col { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
