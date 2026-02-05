'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp, getUserProfile } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password);

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Redirect to /home after successful login
        const { data: profile } = await getUserProfile(data.user.id);
        if (profile?.user_role === 'admin') {
          router.push('/admin-panel');
        } else {
          router.push('/home');
        }
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '40px' }}>
        <h1 style={{ fontSize: '36px', fontStyle: 'italic', fontWeight: '900', letterSpacing: '-2px' }}>
          FILM<span style={{ color: '#FFD700' }}>DEKHO</span>
        </h1>
        <p style={{ color: '#777', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Premium Mini-Drama
        </p>
      </div>

      <div className="login-card">
        <div className="auth-tabs">
          <button
            type="button"
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            LOGIN
          </button>
          <button
            type="button"
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            SIGNUP
          </button>
        </div>

        <form onSubmit={handleAuth}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="error-text">{error}</div>}

          <button type="submit" className="gold-button" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'LOG IN' : 'CREATE ACCOUNT'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', color: '#444', fontSize: '10px', marginTop: 'auto', padding: '20px' }}>
        2026 FILMDEKHO PREMIUM
      </p>
    </div>
  );
}
