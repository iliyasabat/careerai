import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  AlertCircle,
  Wand2,
  ArrowRight,
  FileUp
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ScoreGauge from '../components/ScoreGauge';
import DimensionBar from '../components/DimensionBar';
import LoadingSpinner from '../components/LoadingSpinner';
import SkillPill from '../components/SkillPill';
import { getATSScore } from '../api';

const ATSScorePage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [jd, setJd] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const resumeId = localStorage.getItem('resume_id');

  const handleScore = async () => {
    if (!resumeId) {
      setError('Upload a resume first.');
      return;
    }
    if (!jd.trim()) {
      setError('Paste a job description to score against.');
      return;
    }
    setLoading(true);
    setError('');
    const res = await getATSScore(resumeId, jd.trim());
    if (res?.error) {
      setError(res.message || 'Could not score the resume. Please try again.');
      setResult(null);
    } else {
      setResult(res);
    }
    setLoading(false);
  };

  if (!resumeId) {
    return (
      <div className="space-y-8 animate-slide-up pb-20">
        <PageHeader title="ATS Score Analysis" subtitle="Score your resume against a job description." breadcrumb="ATS Score" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-primary-light border border-primary/10 rounded-3xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shrink-0">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-primary text-lg">Upload your resume first</h4>
              <p className="text-sm text-primary/70 font-medium mt-1">
                ATS scoring needs a parsed resume to compare against the job description.
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

  const getGradeStyle = (grade) => {
    if (!grade) return 'bg-slate-50 text-slate-700 border-slate-200';
    if (grade.startsWith('A')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (grade.startsWith('B')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (grade.startsWith('C')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  return (
    <div className="space-y-8 animate-slide-up pb-20">
      <PageHeader
        title="ATS Score Analysis"
        subtitle="Paste a job description and we'll score your resume against it on 5 dimensions."
        breadcrumb="ATS Score"
      />

      {/* JD Input */}
      <div className="bg-slate-900 rounded-[32px] p-8 shadow-sm text-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="text-white w-5 h-5" />
          </div>
          <h3 className="text-lg font-display font-bold">Job Description</h3>
        </div>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the full job description here..."
          className="w-full h-40 bg-slate-800 border border-slate-700 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all mb-6 resize-none"
        />
        <button
          onClick={handleScore}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          {loading ? 'Scoring…' : (<>Score Against This JD <ArrowRight className="w-4 h-4" /></>)}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700 font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && <LoadingSpinner text="Calculating your ATS score..." />}

      {result && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Scores */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-8">
            <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm flex flex-col items-center text-center">
              <div className="relative mb-6">
                <ScoreGauge score={result.overall_score} size="lg" />
                <div className={`absolute -top-2 -right-4 px-6 py-2 rounded-2xl text-2xl font-display font-bold border-2 shadow-sm ${getGradeStyle(result.grade)}`}>
                  {result.grade}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">Overall Score: {result.overall_score}/100</h3>

              <div className="w-full space-y-6 text-left">
                <DimensionBar label="Keyword Match"        score={result.dimensions.keyword_match.score}        max={result.dimensions.keyword_match.max} />
                <DimensionBar label="Section Completeness" score={result.dimensions.section_completeness.score} max={result.dimensions.section_completeness.max} />
                <DimensionBar label="Bullet Point Strength" score={result.dimensions.bullet_strength.score}    max={result.dimensions.bullet_strength.max} />
                <DimensionBar label="Experience Fit"        score={result.dimensions.experience_fit.score}      max={result.dimensions.experience_fit.max} />
                <DimensionBar label="Format Quality"        score={result.dimensions.format_quality.score}      max={result.dimensions.format_quality.max} />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-amber-200">
                <AlertCircle className="w-12 h-12" />
              </div>
              <h4 className="flex items-center gap-2 text-amber-800 font-bold mb-4">Recommendations</h4>
              <p className="text-sm text-amber-700 leading-relaxed font-medium">{result.recommendation}</p>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-8">
            {/* Missing Keywords */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-display font-bold text-slate-900">Missing Keywords</h3>
                {result.dimensions.keyword_match.missing?.length > 0 && (
                  <div className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100">
                    Action Required
                  </div>
                )}
              </div>
              {result.dimensions.keyword_match.missing?.length > 0 ? (
                <>
                  <p className="text-sm text-slate-500 mb-6 font-medium">These keywords appear in the JD but are missing from your resume:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.dimensions.keyword_match.missing.map((skill, i) => (
                      <SkillPill key={i} skill={skill} variant="missing" index={i} />
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-500 font-medium">No missing keywords detected.</p>
              )}
            </div>

            {/* Weak Bullets */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-display font-bold text-slate-900">Weak Bullet Points</h3>
                {result.dimensions.bullet_strength.weak_bullets?.length > 0 && (
                  <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold border border-amber-100">
                    Low Impact
                  </div>
                )}
              </div>
              {result.dimensions.bullet_strength.weak_bullets?.length > 0 ? (
                <div className="space-y-4">
                  {result.dimensions.bullet_strength.weak_bullets.map((bullet, i) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all group">
                      <p className="text-sm text-slate-600 italic font-medium leading-relaxed">"{bullet}"</p>
                      <button
                        onClick={() => navigate('/curator')}
                        className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-white text-primary border border-slate-200 rounded-xl text-xs font-bold hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                      >
                        <Wand2 className="w-3.5 h-3.5" /> AI Rewrite
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 font-medium">No weak bullets detected.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSScorePage;
