import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wand2,
  Check,
  X,
  Edit3,
  Download,
  AlertCircle,
  FileUp
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { curateResume } from '../api';

const CuratorPage = () => {
  const [loading, setLoading] = useState(false);
  const [bullets, setBullets] = useState([]);
  const [jd, setJd] = useState('');
  const [error, setError] = useState('');
  const [hasRun, setHasRun] = useState(false);

  const resumeId = localStorage.getItem('resume_id');

  const handleCurate = async () => {
    if (!resumeId) {
      setError('Upload a resume first.');
      return;
    }
    if (!jd.trim()) {
      setError('Paste a job description so the curator can target the rewrite.');
      return;
    }
    setLoading(true);
    setError('');
    const res = await curateResume(resumeId, jd.trim());
    if (res?.error) {
      setError(res.message || 'Could not curate your resume. Please try again.');
      setBullets([]);
    } else {
      setBullets((res.bullets || []).map((b) => ({ ...b, status: 'pending' })));
    }
    setHasRun(true);
    setLoading(false);
  };

  const handleAction = (id, status) => {
    setBullets(bullets.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  if (!resumeId) {
    return (
      <div className="space-y-8 animate-slide-up pb-32">
        <PageHeader title="Resume Curator" subtitle="AI-powered rewrite of weak bullet points." />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-primary-light border border-primary/10 rounded-3xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shrink-0">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-primary text-lg">Upload your resume first</h4>
              <p className="text-sm text-primary/70 font-medium mt-1">
                The curator rewrites weak bullets from your parsed resume — we need that first.
              </p>
            </div>
          </div>
          <Link to="/resume" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold whitespace-nowrap">
            Upload Resume
          </Link>
        </div>
      </div>
    );
  }

  const reviewedCount = bullets.filter((b) => b.status !== 'pending').length;
  const progress = bullets.length ? (reviewedCount / bullets.length) * 100 : 0;
  const isComplete = bullets.length > 0 && reviewedCount === bullets.length;

  return (
    <div className="space-y-8 animate-slide-up pb-32">
      {bullets.length > 0 && (
        <div className="fixed top-0 left-60 right-0 h-1 z-40 bg-slate-100">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      )}

      <PageHeader
        title="Resume Curator"
        subtitle="Paste a target JD — the AI rewrites your weakest bullets to align with it."
      />

      {/* JD Input */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <label className="text-sm font-bold text-slate-700 ml-1 block mb-3">Target Job Description</label>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the JD you're targeting. The curator uses its keywords to rewrite your bullets."
          className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none mb-4"
        />
        <button
          onClick={handleCurate}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          {loading ? 'Rewriting bullets…' : (<><Wand2 className="w-5 h-5" /> Curate My Resume</>)}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700 font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && <LoadingSpinner text="AI is rewriting your bullets..." />}

      {hasRun && !loading && !error && bullets.length === 0 && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 text-emerald-700 font-medium text-sm">
          No weak bullets to rewrite — your resume already reads strongly against this JD.
        </div>
      )}

      <div className="space-y-6">
        {bullets.map((bullet) => (
          <div
            key={bullet.id}
            className={`bg-white border rounded-[32px] overflow-hidden transition-all shadow-sm ${
              bullet.status === 'accepted' ? 'border-emerald-200 scale-[0.99] opacity-75' :
              bullet.status === 'rejected' ? 'border-red-100 scale-[0.99] opacity-75' :
              'border-slate-200'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-4">Original Bullet</div>
                <p className={`text-slate-500 font-medium leading-relaxed italic ${bullet.status === 'rejected' ? 'line-through' : ''}`}>
                  "{bullet.original}"
                </p>
              </div>
              <div className="p-10 relative">
                <div className="text-[10px] uppercase font-bold text-primary tracking-widest mb-4">AI Rewritten</div>
                <p className="text-slate-900 font-bold leading-relaxed pr-8">{bullet.rewritten}</p>
                {bullet.status === 'accepted' && (
                  <div className="absolute top-4 right-4 text-emerald-500 animate-slide-up">
                    <Check className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-4">
              <button
                onClick={() => handleAction(bullet.id, 'rejected')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  bullet.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-white text-danger border border-slate-200 hover:bg-red-50'
                }`}
              >
                <X className="w-4 h-4" /> Reject
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-white text-amber-500 border border-slate-200 rounded-xl text-sm font-bold hover:bg-amber-50 transition-all">
                <Edit3 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => handleAction(bullet.id, 'accepted')}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  bullet.status === 'accepted' ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-500 border border-slate-200 hover:bg-emerald-50'
                }`}
              >
                <Check className="w-4 h-4" /> Accept
              </button>
            </div>
          </div>
        ))}
      </div>

      {bullets.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-6 z-50">
          <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between border border-slate-700 backdrop-blur-md">
            <div className="px-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Reviewed</div>
              <div className="text-lg font-mono font-bold">
                {bullets.filter((b) => b.status === 'accepted').length} Accepted · {bullets.filter((b) => b.status === 'rejected').length} Rejected
              </div>
            </div>
            <button
              disabled={!isComplete}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                isComplete ? 'bg-primary hover:bg-primary-dark shadow-lg shadow-primary/30' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Download className="w-5 h-5" /> Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CuratorPage;
