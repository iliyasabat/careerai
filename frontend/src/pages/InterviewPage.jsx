import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  ChevronRight, 
  Sparkles, 
  Trophy, 
  Target, 
  AlertCircle,
  HelpCircle,
  Loader2,
  ChevronDown
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { getInterviewQuestions, evaluateAnswer } from '../api';

const InterviewPage = () => {
  const [role, setRole] = useState('Backend Engineer');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [evaluatingId, setEvaluatingId] = useState(null);
  const [showModelAnswer, setShowModelAnswer] = useState({});

  const handleGenerate = async () => {
    if (!role) return;
    setLoading(true);
    try {
      const res = await getInterviewQuestions(role);
      setQuestions(res);
      setActiveId(res[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (qId) => {
    const answer = answers[qId];
    if (!answer) return;
    
    setEvaluatingId(qId);
    try {
      const res = await evaluateAnswer(qId, answer);
      setEvaluations(prev => ({ ...prev, [qId]: res }));
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluatingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-slide-up pb-32">
      <PageHeader 
        title="Interview Coach" 
        subtitle="Practice role-specific questions and get instant AI feedback on your answers."
        breadcrumb="Coach"
      />

      {/* Role Selector */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="e.g. Backend Engineer, System Design" 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-display font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="px-10 py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Generate Questions</>}
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Generating tailored interview questions..." />
      ) : questions ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Question List Panel */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-4">Question Queue</h3>
            {questions.map((q, idx) => (
              <button 
                key={q.id}
                onClick={() => setActiveId(q.id)}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${
                  activeId === q.id 
                    ? 'bg-primary-light border-primary/20 shadow-sm ring-1 ring-primary/10' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    q.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' :
                    q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {q.difficulty}
                  </span>
                  {evaluations[q.id] && <div className="w-2 h-2 rounded-full bg-success" />}
                </div>
                <p className={`text-sm font-bold line-clamp-2 ${activeId === q.id ? 'text-primary' : 'text-slate-900'}`}>{q.question}</p>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  {q.category}
                </div>
              </button>
            ))}
          </div>

          {/* Active Question Playground */}
          <div className="lg:col-span-8 space-y-6">
            {questions.find(q => q.id === activeId) && (
              <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm animate-slide-up">
                {/* Question Info */}
                <div className="flex flex-col gap-6 mb-10">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <HelpCircle className="w-4 h-4" /> Question Perspective
                  </div>
                  <h2 className="text-3xl font-display font-bold text-slate-900 leading-tight">
                    {questions.find(q => q.id === activeId).question}
                  </h2>
                </div>

                {/* Model Answer Toggle */}
                <div className="mb-10">
                  <button 
                    onClick={() => setShowModelAnswer(prev => ({ ...prev, [activeId]: !prev[activeId] }))}
                    className="flex items-center gap-2 text-xs font-bold text-primary hover:underline transition-all"
                  >
                    {showModelAnswer[activeId] ? 'Hide' : 'Show'} AI-Generated Model Answer <ChevronDown className={`w-3 h-3 transition-transform ${showModelAnswer[activeId] ? 'rotate-180' : ''}`} />
                  </button>
                  {showModelAnswer[activeId] && (
                    <div className="mt-4 p-6 bg-slate-50 border border-slate-100 rounded-2xl animate-slide-up">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-lg mb-4 uppercase tracking-widest">
                        <Sparkles className="w-3.5 h-3.5" /> AI Model Answer
                      </div>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                        {questions.find(q => q.id === activeId).model_answer}
                      </p>
                    </div>
                  )}
                </div>

                {/* Answer Field */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 ml-1">Your Proposed Answer</label>
                  <textarea 
                    placeholder="Type your answer here using the STAR method if behavioral, or structured system design components if technical..."
                    className="w-full h-48 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none shadow-inner"
                    value={answers[activeId] || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [activeId]: e.target.value }))}
                  />
                  
                  <div className="flex items-center justify-between gap-4 pt-4">
                    <span className="text-xs text-slate-400 font-medium italic">
                      Tip: Aim for 200–500 words for technical answers.
                    </span>
                    <button 
                      onClick={() => handleEvaluate(activeId)}
                      disabled={!answers[activeId] || evaluatingId === activeId}
                      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 transition-all shadow-xl"
                    >
                      {evaluatingId === activeId ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Target className="w-5 h-5" /> Evaluate My Answer</>}
                    </button>
                  </div>
                </div>

                {/* Evaluation Result */}
                {evaluations[activeId] && (
                  <div className="mt-12 p-8 bg-primary-light border border-primary/20 rounded-[32px] animate-slide-up">
                    <div className="flex justify-between items-center mb-8">
                       <h4 className="flex items-center gap-2 text-primary font-display font-bold text-xl">
                        <Trophy className="w-6 h-6" /> AI Feedback Result
                       </h4>
                       <div className="flex items-center gap-3">
                         <div className="text-sm font-bold text-primary">STAR Score</div>
                         <div className="w-32 h-3 bg-white rounded-full overflow-hidden border border-primary/10">
                           <div className="h-full bg-primary" style={{ width: `${(evaluations[activeId].score / 5) * 100}%` }} />
                         </div>
                         <div className="text-lg font-mono font-bold text-primary">{evaluations[activeId].score}/5</div>
                       </div>
                    </div>
                    
                    <p className="text-slate-800 font-medium leading-relaxed mb-8">
                      {evaluations[activeId].feedback}
                    </p>

                    <div className="flex flex-wrap gap-2">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block w-full mb-2">Improvement Badges</span>
                       {evaluations[activeId].missing.map((tag, i) => (
                         <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white text-danger border border-danger/10 rounded-xl text-xs font-bold">
                           <AlertCircle className="w-4 h-4" /> {tag}
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <EmptyState 
          icon={MessageSquare}
          title="Interview Coaching"
          subtitle="Generate a set of interview questions for your dream role and get real-time feedback."
        />
      )}

      {/* Persistence Bar */}
      {questions && (
        <div className="fixed bottom-8 left-60 right-0 px-8 z-40 pointer-events-none">
          <div className="max-w-4xl mx-auto bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-3xl border border-slate-700 shadow-2xl flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-4 ml-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</span>
              <div className="w-40 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-success transition-all duration-1000" style={{ width: `${(Object.keys(evaluations).length / questions.length) * 100}%` }} />
              </div>
              <span className="text-sm font-mono font-bold">{Object.keys(evaluations).length} / {questions.length} Attempted</span>
            </div>
            <button className="flex items-center gap-2 bg-primary px-6 py-2 rounded-xl text-sm font-bold hover:translate-x-1 transition-transform">
              Next Question <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
