'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        onLogin();
      } else {
        setError('Invalid username or password.');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF8F4] px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-[#C9956A]/20"
      >
        <div className="text-center mb-8">
          <p className="font-sans text-xs tracking-widest text-[#C9956A] uppercase mb-2">Admin Access</p>
          <h1 className="font-serif text-3xl text-[#2C2018]">Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-sans text-xs font-semibold text-[#2C2018]/60 uppercase mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#C9956A]/20 focus:border-[#C9956A] outline-none font-serif"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block font-sans text-xs font-semibold text-[#2C2018]/60 uppercase mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#C9956A]/20 focus:border-[#C9956A] outline-none font-serif"
              placeholder="Enter password"
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center italic">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#C9956A] text-white rounded-full font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#B5845A] shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Enter Dashboard'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
