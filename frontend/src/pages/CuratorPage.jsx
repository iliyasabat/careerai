import React, { useState, useEffect } from 'react';
import { 
  Wand2, 
  Check, 
  X, 
  Edit3, 
  Download, 
  ChevronDown, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { curateResume } from '../api';

const CuratorPage = () => {
  const [loading, setLoading] = useState(true);
  const [bullets, setBullets] = useState([]);
  const [jdExpanded, setJdExpanded] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await curateResume('res_123');
        setBullets(res.bullets.map(b => ({ ...b, status: 'pending' })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAction = (id, status) => {
    setBullets(bullets.map(b => b.id === id ? { ...b, status } : b));
  };

  const reviewedCount = bullets.filter(b => b.status !== 'pending').length;
  const progress = (reviewedCount / bullets.length) * 100;
  const isComplete = reviewedCount === bullets.length;

  if (loading) return <LoadingSpinner text="AI is rewriting your bullets..." />;

  return (
    <div className="space-y-8 animate-slide-up pb-32">
      <div className="fixed top-0 left-60 right-0 h-1 z-40 bg-slate-100">
        <div 
          className="h-full bg-primary transition-all duration-500" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      <PageHeader 
        title="Resume Curator" 
        subtitle="AI has rewritten your weak bullets. Review each change for maximal impact."
      />

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <button 
          onClick={() => setJdExpanded(!jdExpanded)}
          className="w-full p-6 flex justify-between items-center hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-700">Target Job Description</span>
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${jdExpanded ? 'rotate-180' : ''}`} />
        </button>
        {jdExpanded && (
          <div className="p-6 pt-0 border-t border-slate-50">
            <p className="text-sm text-slate-500 italic leading-relaxed">
              "We are looking for a Backend Engineer (Python/FastAPI) to join our team at Razorpay. Experience with PostgreSQL, Redis, and high-traffic systems is required..."
            </p>
          </div>
        )}
      </div>

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
                <p className="text-slate-900 font-bold leading-relaxed pr-8">
                  {bullet.rewritten.split(' ').map((word, i) => (
                    ['Architected', 'maintained', 'RESTful', 'APIs', 'high-traffic', 'Optimised', 'query', 'indexing', 'consistent'].includes(word.replace(/[.,]/g, ''))
                      ? <mark key={i} className="bg-primary/10 text-primary rounded px-0.5">{word} </mark>
                      : word + ' '
                  ))}
                </p>
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

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-6 z-50">
        <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between border border-slate-700 backdrop-blur-md">
          <div className="px-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Reviewed</div>
            <div className="text-lg font-mono font-bold">
              {bullets.filter(b => b.status === 'accepted').length} Accepted · {bullets.filter(b => b.status === 'rejected').length} Rejected
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
    </div>
  );
};

export default CuratorPage;
