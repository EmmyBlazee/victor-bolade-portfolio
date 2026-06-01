'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.email === 'mdacreatives01' && credentials.password === '7030796210') {
      localStorage.setItem('admin_auth', 'true');
      router.push('/admin');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <motion.div
          className="login-box glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Admin Access</h2>
          <p>Please log in to manage your portfolio.</p>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Email Address"
                className="glass-input"
                required
                value={credentials.email}
                onChange={(e: any) => setCredentials({ ...credentials, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                className="glass-input"
                required
                value={credentials.password}
                onChange={(e: any) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="submit-btn glass">Login</button>
          </form>
        </motion.div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 100px;
        }

        .login-box {
          padding: 60px;
          border-radius: 40px;
          max-width: 500px;
          margin: 0 auto;
          text-align: center;
        }

        .login-form {
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
          margin-top: 10px;
        }

        .submit-btn:hover {
          background: var(--accent);
          color: var(--background);
        }

        .error-message {
          color: #ff5c5c;
          font-size: 0.9rem;
          margin-top: 10px;
        }

        @media (max-width: 600px) {
          .login-box {
            padding: 30px;
          }
        }
      `}</style>
    </div>
  );
}
