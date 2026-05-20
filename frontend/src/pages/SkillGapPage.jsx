import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Search,
  ChevronDown,
  Sparkles,
  AlertCircle,
  FileUp
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SkillPill from '../components/SkillPill';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { getSkillGap } from '../api';

const SkillGapPage = () => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('Backend Engineer');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [expandedSkill, setExpandedSkill] = useState(null);

  const resumeId = localStorage.getItem('resume_id');

  const handleAnalyze = async () => {
    if (!resumeId) {
      setError('Upload a resume first — skill-gap detection compares your resume to the role.');
      return;
    }
    if (!role.trim()) {
      setError('Enter a target role to analyse.');
      return;
    }
    setLoading(true);
    setError('');
    const res = await getSkillGap(resumeId, role.trim());
    if (res?.error) {
      setError(res.message || 'Could not analyse skill gap. Please try again.');
      setResult(null);
    } else {
      setResult(res);
    }
    setLoading(false);
  };

  if (!resumeId) {
    return (
      <div className="space-y-8 animate-slide-up pb-32">
        <PageHeader
          title="Skill Gap Detector"
          subtitle="We compare your resume against the top requirements for target roles."
          breadcrumb="Skills"
        />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-primary-light border border-primary/10 rounded-3xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shrink-0">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-primary text-lg">Upload your resume first</h4>
              <p className="text-sm text-primary/70 font-medium mt-1">
                Skill-gap analysis needs your parsed skills to compare them against the role.
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

  return (
    <div className="space-y-8 animate-slide-up pb-32">
      <PageHeader
        title="Skill Gap Detector"
        subtitle="We compare your resume against the top requirements for target roles."
        breadcrumb="Skills"
      />

      {/* Role Selector */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Enter your target role (e.g. Backend Engineer)"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-display font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-10 py-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            {loading ? <LoadingSpinner size="sm" /> : <><Zap className="w-5 h-5" /> Analyse Gap</>}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700 font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Mapping your skill landscape..." />
      ) : result ? (
        <div className="space-y-8 animate-slide-up transition-all">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6">
              <div className="text-emerald-600 font-display font-bold text-3xl mb-1">{result.your_skills.length}</div>
              <div className="text-emerald-700 font-bold text-sm">Skills You Have</div>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-3xl p-6">
              <div className="text-red-600 font-display font-bold text-3xl mb-1">{result.missing_skills.length}</div>
              <div className="text-red-700 font-bold text-sm">Skills Missing</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Comparison Column */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                <h3 className="text-xl font-display font-bold text-slate-900 mb-8 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" /> Skill Comparison
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Your Toolkit</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.your_skills.length === 0 && (
                        <span className="text-xs text-slate-400 font-medium italic">No skills detected on your resume.</span>
                      )}
                      {result.your_skills.map((skill, i) => (
                        <SkillPill key={i} skill={skill} variant="have" index={i} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Role Requirements</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.required_skills.map((skill, i) => (
                        <SkillPill
                          key={i}
                          skill={skill}
                          variant={result.your_skills.includes(skill) ? 'have' : 'missing'}
                          index={i}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gap Analysis Column */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-display font-bold text-slate-900">Learning Path</h3>
                <span className="text-xs font-bold text-slate-400">SELECT A SKILL TO SEE RESOURCES</span>
              </div>

              {result.missing_skills.length === 0 ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 text-emerald-700 font-medium text-sm">
                  No gaps detected — your resume covers every listed requirement for this role.
                </div>
              ) : (
                <div className="space-y-4">
                  {result.missing_skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className={`bg-white border transition-all rounded-[32px] overflow-hidden ${
                        expandedSkill === skill ? 'border-primary ring-4 ring-primary/5 shadow-lg' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <button
                        onClick={() => setExpandedSkill(expandedSkill === skill ? null : skill)}
                        className="w-full p-6 flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4 text-left">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            expandedSkill === skill ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400 group-hover:text-primary'
                          }`}>
                            <Zap className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className={`text-md font-bold ${expandedSkill === skill ? 'text-primary' : 'text-slate-900'}`}>{skill}</h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${
                              idx < 2 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {idx < 2 ? 'High Priority' : 'Good to Have'}
                            </span>
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedSkill === skill ? 'rotate-180 text-primary' : ''}`} />
                      </button>

                      {expandedSkill === skill && (
                        <div className="p-6 pt-0 border-t border-slate-50 animate-slide-up">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                            {(result.courses?.[skill] && result.courses[skill].length > 0) ? (
                              result.courses[skill].map((course, j) => (
                                <CourseCard key={j} course={course} />
                              ))
                            ) : (
                              <div className="col-span-full py-8 text-center text-slate-400 font-medium">
                                No specific resources for this skill yet.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="Start Your Analysis"
          subtitle="Enter a target role above and click Analyse to see what skills you're missing."
        />
      )}
    </div>
  );
};

export default SkillGapPage;
