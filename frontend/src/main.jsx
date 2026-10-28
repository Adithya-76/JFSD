import React, { useEffect, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const rawApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8081').trim();
const baseURL = (rawApiUrl.startsWith('http://') || rawApiUrl.startsWith('https://') || rawApiUrl.startsWith('/'))
  ? rawApiUrl
  : `https://${rawApiUrl}`;

const api = axios.create({
  baseURL
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Inline SVG Icons
const Icons = {
  Shield: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  Upload: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  FileText: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Download: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Trash: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Info: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  LogOut: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Sun: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
    </svg>
  ),
  Moon: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  )
};

function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('lexiscan_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lexiscan_theme', theme);
  }, [isDark]);

  const toggle = () => setIsDark(prev => !prev);
  return [isDark, toggle];
}

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      className="btn btn-secondary btn-sm"
      style={{ padding: '7px 12px', borderRadius: '20px' }}
      onClick={onToggle}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? <Icons.Sun /> : <Icons.Moon />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}

function Auth() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDark, toggleTheme] = useTheme();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegister ? { name, email, password } : { email, password };
      const res = await api.post(endpoint, payload);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </div>

      <div className="auth-card">
        <div className="auth-logo-center">
          <div className="auth-logo-icon">
            <Icons.Shield />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>LexiScan</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            AI-Powered Legal Document Intelligence
          </p>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {isRegister && (
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input
                className="text-input"
                placeholder="e.g. John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="text-input"
              placeholder="you@domain.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="text-input"
              placeholder="At least 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          {error && (
            <div className="error-banner">
              <Icons.AlertTriangle />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ padding: '12px' }} disabled={loading}>
            {loading ? <div className="spinner" /> : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--primary)', fontWeight: 600 }}
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [docs, setDocs] = useState([]);
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [adminStats, setAdminStats] = useState(null);
  const [isDark, toggleTheme] = useTheme();

  function fetchUser() {
    api.get('/api/auth/me')
      .then(res => {
        setCurrentUser(res.data);
        if (res.data.role === 'ADMIN') {
          api.get('/api/admin/stats').then(s => setAdminStats(s.data)).catch(() => {});
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        location.reload();
      });
  }

  function fetchDocs() {
    api.get('/api/documents')
      .then(res => setDocs(res.data.content || []))
      .catch(() => {});
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchUser();
      fetchDocs();
    }
  }, []);

  if (!localStorage.getItem('token')) return <Auth />;

  async function viewAnalysis(doc) {
    setError('');
    setSelectedDoc(doc);
    setLoading(true);
    setLoadingMsg(`Loading analysis for "${doc.fileName}"...`);
    try {
      const res = await api.get(`/api/documents/${doc.id}/analysis`);
      setAnalysis(res.data);
    } catch (err) {
      await triggerAndPoll(doc.id, doc.fileName);
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  }

  async function triggerAndPoll(docId, fileName) {
    setLoading(true);
    setLoadingMsg(`AI analyzing "${fileName}" (segmenting clauses & evaluating risks)...`);
    try {
      await api.post(`/api/documents/${docId}/analyze`);
      let attempts = 0;
      await new Promise((resolve, reject) => {
        const poll = setInterval(async () => {
          attempts++;
          try {
            const check = (await api.get(`/api/documents/${docId}`)).data;
            if (check.status === 'ANALYZED') {
              clearInterval(poll);
              const result = (await api.get(`/api/documents/${docId}/analysis`)).data;
              setAnalysis(result);
              setSelectedDoc(check);
              fetchDocs();
              resolve();
            } else if (check.status === 'FAILED') {
              clearInterval(poll);
              reject(new Error('Document analysis failed. Please try a different document.'));
            } else if (attempts > 30) {
              clearInterval(poll);
              reject(new Error('Analysis timed out. Please try again.'));
            }
          } catch (e) {
            clearInterval(poll);
            reject(e);
          }
        }, 1200);
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Analysis failed');
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  }

  async function handleUpload() {
    if (!file) return;
    setError('');
    setLoading(true);
    setLoadingMsg('Uploading document...');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/api/documents', formData);
      const newDoc = res.data;
      setDocs(prev => [newDoc, ...prev]);
      setFile(null);
      await triggerAndPoll(newDoc.id, newDoc.fileName);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      setLoading(false);
      setLoadingMsg('');
    }
  }

  async function handleDelete(docId, fileName, e) {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return;
    try {
      await api.delete(`/api/documents/${docId}`);
      setDocs(docs.filter(d => d.id !== docId));
      if (selectedDoc?.id === docId) {
        setSelectedDoc(null);
        setAnalysis(null);
      }
    } catch (err) {
      alert('Failed to delete document');
    }
  }

  async function downloadReport(docId, fileName, e) {
    if (e) e.stopPropagation();
    try {
      const res = await api.get(`/api/documents/${docId}/report`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName.replace(/\.[^/.]+$/, '')}-lexiscan-report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Unable to generate PDF report.');
    }
  }

  // Filter clauses by search & risk category
  const filteredClauses = useMemo(() => {
    if (!analysis?.clauses) return [];
    return analysis.clauses.filter(c => {
      const matchesSearch = c.clauseText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (c.riskReason && c.riskReason.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRisk = riskFilter === 'ALL' || c.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [analysis, searchTerm, riskFilter]);

  const highRiskCount = analysis?.clauses?.filter(c => c.riskLevel === 'HIGH').length || 0;
  const medRiskCount = analysis?.clauses?.filter(c => c.riskLevel === 'MEDIUM').length || 0;
  const lowRiskCount = analysis?.clauses?.filter(c => c.riskLevel === 'LOW').length || 0;

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">
            <Icons.Shield />
          </div>
          <div className="brand-text">
            <h1>LexiScan</h1>
          </div>
          <span className="brand-tag">AI Legal Intelligence</span>
        </div>

        <div className="nav-actions">
          {/* Theme Toggle Button */}
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

          {currentUser && (
            <div className="user-profile">
              <div className="user-avatar">
                {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
              </div>
              <span>{currentUser.name}</span>
              <span className={`role-badge ${currentUser.role === 'ADMIN' ? 'admin' : ''}`}>
                {currentUser.role}
              </span>
            </div>
          )}

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { localStorage.clear(); location.reload(); }}
          >
            <Icons.LogOut />
            <span>Sign out</span>
          </button>
        </div>
      </header>

      <div className="main-wrapper">
        {/* Compliance Notice Banner */}
        <div className="disclaimer-banner">
          <Icons.Info />
          <div>
            <strong>Legal Notice:</strong> LexiScan uses automated NLP heuristics to highlight legal risks and key details. It assists review and does not constitute formal legal advice.
          </div>
        </div>

        {/* Admin Stats Overview if ADMIN */}
        {adminStats && (
          <div className="card" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Administrator Dashboard</h3>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '4px' }}>System Overview</h2>
              </div>
              <span className="brand-tag" style={{ background: '#334155', color: '#38bdf8', borderColor: '#475569' }}>Admin Privileges Active</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '1.25rem' }}>
              <div style={{ background: '#0f172a', padding: '14px', borderRadius: '8px', border: '1px solid #334155' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Registered Users</span>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>{adminStats.totalUsers}</p>
              </div>
              <div style={{ background: '#0f172a', padding: '14px', borderRadius: '8px', border: '1px solid #334155' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Uploaded Documents</span>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a78bfa' }}>{adminStats.totalDocuments}</p>
              </div>
              <div style={{ background: '#0f172a', padding: '14px', borderRadius: '8px', border: '1px solid #334155' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Completed Analyses</span>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4ade80' }}>{adminStats.analyses}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Views: Analysis Detail vs Dashboard */}
        {analysis && selectedDoc ? (
          <div>
            {/* Analysis Header Bar */}
            <div className="analysis-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => { setAnalysis(null); setSelectedDoc(null); }}
                >
                  <Icons.ArrowLeft />
                  <span>Back to Documents</span>
                </button>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {selectedDoc.fileName}
                  </h2>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Extracted & analyzed via Java Rule-Based Engine
                  </span>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => downloadReport(selectedDoc.id, selectedDoc.fileName)}
              >
                <Icons.Download />
                <span>Export Official PDF Report</span>
              </button>
            </div>

            {/* Analysis Grid (Left: Score & Summary & Entities | Right: Interactive Clauses) */}
            <div className="analysis-grid">
              {/* Left Column */}
              <div>
                {/* Score Hero Card */}
                <div className="score-hero-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Overall Risk Evaluation
                    </span>
                    <span className={`risk-pill ${analysis.overallRiskLevel}`}>
                      {analysis.overallRiskLevel} RISK
                    </span>
                  </div>

                  <div className="score-display">
                    <div className={`score-circle ${analysis.overallRiskLevel}`}>
                      <span className="score-circle-number">{analysis.overallRiskScore}</span>
                      <span className="score-circle-label">/ 100</span>
                    </div>
                    <div className="score-details">
                      <h3>{analysis.overallRiskLevel === 'HIGH' ? 'Critical Attention Required' : analysis.overallRiskLevel === 'MEDIUM' ? 'Moderate Risk Detected' : 'Standard Terms'}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Calculated from {analysis.clauses?.length || 0} extracted clauses based on active legal heuristics.
                      </p>
                    </div>
                  </div>

                  <div className="score-breakdown-bar">
                    <div className={`score-breakdown-fill ${analysis.overallRiskLevel}`} style={{ width: `${analysis.overallRiskScore}%` }} />
                  </div>

                  {/* Clause counters */}
                  <div className="clause-counts">
                    <div className="count-box high">
                      <span className="count-num">{highRiskCount}</span>
                      <span className="count-label">High Risk</span>
                    </div>
                    <div className="count-box med">
                      <span className="count-num">{medRiskCount}</span>
                      <span className="count-label">Medium Risk</span>
                    </div>
                    <div className="count-box low">
                      <span className="count-num">{lowRiskCount}</span>
                      <span className="count-label">Low Risk</span>
                    </div>
                  </div>
                </div>

                {/* Plain-Language Summary */}
                <div className="card">
                  <div className="card-header" style={{ marginBottom: '10px' }}>
                    <h3 className="card-title">
                      <Icons.FileText />
                      <span>Plain-Language Summary</span>
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.65' }}>
                    {analysis.summary}
                  </p>
                </div>

                {/* Key Entities Detected */}
                <div className="card">
                  <div className="card-header" style={{ marginBottom: '10px' }}>
                    <h3 className="card-title">
                      <Icons.CheckCircle />
                      <span>Extracted Contract Entities</span>
                    </h3>
                  </div>
                  <div className="entities-container">
                    {analysis.entities && Object.entries(analysis.entities).map(([key, val]) => (
                      <div key={key} className="entity-group">
                        <div className="entity-label">
                          <span>{key}</span>
                        </div>
                        <div className="entity-tags">
                          {Array.isArray(val) && val.length > 0 ? (
                            val.map((item, idx) => (
                              <span key={idx} className="entity-tag">{item}</span>
                            ))
                          ) : (
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
                              None specified
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Clauses Explorer */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div className="clauses-header">
                  <div>
                    <h3 className="card-title">Contract Clauses Breakdown</h3>
                    <p className="card-subtitle">Showing {filteredClauses.length} of {analysis.clauses?.length || 0} clauses</p>
                  </div>

                  {/* Search box */}
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search clauses or category..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="filter-pills" style={{ marginBottom: '1.25rem' }}>
                  <button
                    className={`filter-pill ${riskFilter === 'ALL' ? 'active' : ''}`}
                    onClick={() => setRiskFilter('ALL')}
                  >
                    All ({analysis.clauses?.length || 0})
                  </button>
                  <button
                    className={`filter-pill ${riskFilter === 'HIGH' ? 'active' : ''}`}
                    onClick={() => setRiskFilter('HIGH')}
                    style={riskFilter === 'HIGH' ? { background: 'var(--risk-high-accent)', borderColor: 'var(--risk-high-accent)', color: 'white' } : {}}
                  >
                    High Risk ({highRiskCount})
                  </button>
                  <button
                    className={`filter-pill ${riskFilter === 'MEDIUM' ? 'active' : ''}`}
                    onClick={() => setRiskFilter('MEDIUM')}
                    style={riskFilter === 'MEDIUM' ? { background: 'var(--risk-med-accent)', borderColor: 'var(--risk-med-accent)', color: 'white' } : {}}
                  >
                    Medium Risk ({medRiskCount})
                  </button>
                  <button
                    className={`filter-pill ${riskFilter === 'LOW' ? 'active' : ''}`}
                    onClick={() => setRiskFilter('LOW')}
                    style={riskFilter === 'LOW' ? { background: 'var(--risk-low-accent)', borderColor: 'var(--risk-low-accent)', color: 'white' } : {}}
                  >
                    Low Risk ({lowRiskCount})
                  </button>
                </div>

                {/* Clauses List */}
                <div style={{ maxHeight: '780px', overflowY: 'auto', paddingRight: '4px' }}>
                  {filteredClauses.length === 0 ? (
                    <div className="empty-state">
                      <Icons.Search />
                      <p>No clauses match your filter or search query.</p>
                    </div>
                  ) : (
                    filteredClauses.map((c, i) => (
                      <div key={c.id || i} className={`clause-card ${c.riskLevel}`}>
                        <div className="clause-top">
                          <span className="clause-category">
                            Clause {c.clauseIndex} · {c.category}
                          </span>
                          <span className={`risk-pill ${c.riskLevel}`}>
                            {c.riskLevel} · Score {c.riskScore}
                          </span>
                        </div>
                        <p className="clause-text">{c.clauseText}</p>
                        {c.riskLevel !== 'LOW' && (
                          <div className={`clause-warning ${c.riskLevel}`}>
                            <Icons.AlertTriangle />
                            <span><strong>Risk Flag:</strong> {c.riskReason}</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Main Dashboard: Upload Card + Recent Documents List */
          <div>
            {/* Upload Section */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">
                    <Icons.Upload />
                    <span>Upload & Analyze Document</span>
                  </h2>
                  <p className="card-subtitle">
                    Supported formats: PDF (`.pdf`) and Microsoft Word (`.docx`) up to 10 MB.
                  </p>
                </div>
              </div>

              {/* Drag & Drop Zone */}
              <div
                className={`upload-dropzone ${isDragActive ? 'drag-active' : ''}`}
                onDragOver={e => { e.preventDefault(); setIsDragActive(true); }}
                onDragLeave={() => setIsDragActive(false)}
                onDrop={e => {
                  e.preventDefault();
                  setIsDragActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    setFile(e.dataTransfer.files[0]);
                  }
                }}
              >
                <input
                  type="file"
                  className="file-hidden-input"
                  accept=".pdf,.docx"
                  onChange={e => e.target.files && setFile(e.target.files[0])}
                />
                <div className="upload-icon-wrapper">
                  <Icons.Upload />
                </div>
                <h3 className="upload-title">
                  {file ? file.name : 'Choose a contract or drag & drop here'}
                </h3>
                <p className="upload-desc">
                  {file
                    ? `${(file.size / 1024).toFixed(1)} KB — Ready to analyze`
                    : 'PDF or DOCX documents with legal clauses'}
                </p>

                {file && (
                  <div className="file-preview">
                    <Icons.FileText />
                    <span>{file.name}</span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--risk-high-accent)', padding: '2px 6px' }}
                      onClick={e => { e.stopPropagation(); setFile(null); }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Upload Action Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {loadingMsg ? (
                    <span style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="spinner spinner-primary" />
                      {loadingMsg}
                    </span>
                  ) : (
                    <span>Sample contracts available in <code>sample-documents/</code></span>
                  )}
                </div>

                <button
                  className="btn btn-primary"
                  disabled={!file || loading}
                  onClick={handleUpload}
                >
                  {loading ? (
                    <>
                      <div className="spinner" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Icons.Shield />
                      <span>Upload & Run AI Scan</span>
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="error-banner" style={{ marginTop: '1rem' }}>
                  <Icons.AlertTriangle />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Recent Documents Table Card */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">
                    <Icons.FileText />
                    <span>Contract Repository</span>
                  </h2>
                  <p className="card-subtitle">
                    {docs.length} document{docs.length === 1 ? '' : 's'} managed in your repository
                  </p>
                </div>
              </div>

              {docs.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Icons.FileText />
                  </div>
                  <h3>No contracts analyzed yet</h3>
                  <p style={{ marginTop: '4px', fontSize: '0.9rem' }}>
                    Drag & drop a contract above to scan for risky clauses, obligations, and penalties.
                  </p>
                </div>
              ) : (
                <div className="docs-table-wrapper">
                  <table className="docs-table">
                    <thead>
                      <tr>
                        <th>Document Name</th>
                        <th>Analysis Status</th>
                        <th>Risk Level</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {docs.map(doc => (
                        <tr key={doc.id} style={{ cursor: 'pointer' }} onClick={() => viewAnalysis(doc)}>
                          <td>
                            <div className="doc-name-cell">
                              <div className="doc-icon">
                                <Icons.FileText />
                              </div>
                              <div>
                                <div style={{ color: 'var(--text-main)' }}>{doc.fileName}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 400 }}>
                                  ID: {doc.id.substring(0, 8)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`status-pill status-${doc.status?.toLowerCase()}`}>
                              {doc.status}
                            </span>
                          </td>
                          <td>
                            {doc.riskLevel ? (
                              <span className={`risk-pill ${doc.riskLevel}`}>
                                {doc.riskLevel}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>Pending</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={e => { e.stopPropagation(); viewAnalysis(doc); }}
                              >
                                {doc.status === 'ANALYZED' ? 'View Analysis' : 'Analyze Now'}
                              </button>
                              {doc.status === 'ANALYZED' && (
                                <button
                                  className="btn btn-secondary btn-sm"
                                  title="Download PDF Report"
                                  onClick={e => downloadReport(doc.id, doc.fileName, e)}
                                >
                                  <Icons.Download />
                                </button>
                              )}
                              <button
                                className="btn btn-danger btn-sm"
                                title="Delete document"
                                onClick={e => handleDelete(doc.id, doc.fileName, e)}
                              >
                                <Icons.Trash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
