import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Sparkles, 
  ChevronRight, 
  Copy, 
  Check, 
  RefreshCw,
  Globe,
  Loader2,
  AlertCircle
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import EmailPreview from '../components/EmailPreview';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateEmail } from '../api';

const ColdEmailPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: 'Razorpay',
    role: 'Backend Engineer',
    manager: 'Priya',
    tone: 'formal',
    includeNews: true
  });
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('formal');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateEmail(formData);
      setResult(res);
      setActiveTab(formData.tone);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-8 animate-slide-up pb-32">
      <PageHeader 
        title="Cold Email Generator" 
        subtitle="Generate hyper-personalised networking emails and cover letters in seconds."
        breadcrumb="Networking"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel - Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <h3 className="text-xl font-display font-bold text-slate-900 mb-8 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Personalisation Details
            </h3>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Company Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Razorpay"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary transition-all"
                  value={formData.company}
                  onChange={(e) => updateForm('company', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Target Role</label>
                <input 
                  type="text" 
                  placeholder="e.g. Backend Engineer"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary transition-all"
                  value={formData.role}
                  onChange={(e) => updateForm('role', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider ml-1">Hiring Manager (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Priya"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary transition-all font-mono"
                  value={formData.manager}
                  onChange={(e) => updateForm('manager', e.target.value)}
                />
              </div>

              <div className="pt-4 space-y-3">
                <label className="text-sm font-bold text-slate-700 ml-1">Tone & Communication Style</label>
                <div className="flex p-1 bg-slate-100 rounded-xl">
                  {['formal', 'conversational', 'referral'].map(tone => (
                    <button 
                      key={tone}
                      onClick={() => updateForm('tone', tone)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                        formData.tone === tone ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Include News Hook</h4>
                      <p className="text-[10px] text-slate-500">AI fetches recent company news</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.includeNews}
                      onChange={(e) => updateForm('includeNews', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 mt-4 group"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Generate Cold Email</>}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Result */}
        <div className="lg:col-span-7">
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-[32px] p-20 flex flex-col items-center justify-center text-center shadow-sm h-full max-h-[700px]">
              <div className="relative mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary animate-bounce" />
                </div>
                <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full animate-ping" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-2">Crafting your email...</h3>
              <p className="text-slate-500 max-w-xs mx-auto animate-pulse">Our AI is researching {formData.company} and aligning your 1.5 years of experience.</p>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-slide-up h-full">
              <div className="flex p-1 bg-slate-200/50 rounded-2xl w-fit">
                {Object.keys(result.variants).map(v => (
                  <button 
                    key={v}
                    onClick={() => setActiveTab(v)}
                    className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      activeTab === v ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <EmailPreview 
                subject={result.variants[activeTab].subject}
                body={result.variants[activeTab].body}
              />

              <div className="bg-slate-900 text-white p-6 rounded-3xl flex items-center justify-between border border-slate-700 shadow-xl">
                 <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Networking Pro-Tip</h4>
                    <p className="text-[11px] text-slate-400">Following up after 3 days increases response rates by 28%.</p>
                  </div>
                 </div>
                 <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all border border-slate-700 whitespace-nowrap">
                   Set Reminder
                 </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-[40px] flex items-center justify-center p-12 text-center bg-slate-50/50">
              <div className="max-w-xs">
                <div className="w-16 h-16 bg-white border border-slate-100 text-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-display font-bold text-slate-400">Your email will appear here</h3>
                <p className="text-xs text-slate-400 mt-2">Personalise the company name and target role to generate a unique networking email.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColdEmailPage;
