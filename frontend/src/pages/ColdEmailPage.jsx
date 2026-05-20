import React, { useState } from 'react';
import {
  Mail,
  Sparkles,
  Globe,
  Loader2,
  AlertCircle
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import EmailPreview from '../components/EmailPreview';
import { generateEmail } from '../api';

const initialForm = {
  company_name: '',
  role_title: '',
  job_description: '',
  manager_name: '',
  tone: 'formal',
  include_news_hook: false,
  portfolio_url: ''
};

const ColdEmailPage = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('formal');

  const updateForm = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleGenerate = async () => {
    if (!form.company_name.trim() || !form.role_title.trim() || !form.job_description.trim()) {
      setError('Company, role, and job description are all required.');
      return;
    }
    setLoading(true);
    setError('');
    const res = await generateEmail(form);
    if (res?.error) {
      setError(res.message || 'Could not generate the email. Please try again.');
      setResult(null);
    } else {
      setResult(res);
      setActiveTab(form.tone);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-slide-up pb-32">
      <PageHeader
        title="Cold Email Generator"
        subtitle="Generate hyper-personalised networking emails in seconds."
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
                <label className="text-sm font-bold text-slate-700 ml-1">Company Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Razorpay"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary transition-all"
                  value={form.company_name}
                  onChange={(e) => updateForm('company_name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Target Role *</label>
                <input
                  type="text"
                  placeholder="e.g. Backend Engineer"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary transition-all"
                  value={form.role_title}
                  onChange={(e) => updateForm('role_title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Job Description *</label>
                <textarea
                  placeholder="Paste the JD here — the AI uses it to reference specifics."
                  className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary transition-all resize-none"
                  value={form.job_description}
                  onChange={(e) => updateForm('job_description', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider ml-1">Hiring Manager (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Priya"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary transition-all"
                  value={form.manager_name}
                  onChange={(e) => updateForm('manager_name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider ml-1">Portfolio URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://…"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary transition-all"
                  value={form.portfolio_url}
                  onChange={(e) => updateForm('portfolio_url', e.target.value)}
                />
              </div>

              <div className="pt-4 space-y-3">
                <label className="text-sm font-bold text-slate-700 ml-1">Tone</label>
                <div className="flex p-1 bg-slate-100 rounded-xl">
                  {['formal', 'conversational', 'referral'].map((tone) => (
                    <button
                      key={tone}
                      onClick={() => updateForm('tone', tone)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                        form.tone === tone ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
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
                      <h4 className="text-sm font-bold text-slate-900">Include news hook</h4>
                      <p className="text-[10px] text-slate-500">Fetches a recent company headline (requires Tavily key)</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={form.include_news_hook}
                      onChange={(e) => updateForm('include_news_hook', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700 font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 mt-4 group"
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
              <p className="text-slate-500 max-w-xs mx-auto animate-pulse">Generating three tone variants for {form.company_name || 'your target company'}.</p>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-slide-up h-full">
              <div className="flex p-1 bg-slate-200/50 rounded-2xl w-fit">
                {Object.keys(result.variants).map((v) => (
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

              <div className="bg-slate-900 text-white p-6 rounded-3xl flex items-center gap-4 border border-slate-700 shadow-xl">
                <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Saved for follow-up</h4>
                  <p className="text-[11px] text-slate-400">
                    A follow-up draft will be generated automatically around {result.follow_up_date?.slice(0, 10)}.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-[40px] flex items-center justify-center p-12 text-center bg-slate-50/50">
              <div className="max-w-xs">
                <div className="w-16 h-16 bg-white border border-slate-100 text-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-display font-bold text-slate-400">Your email will appear here</h3>
                <p className="text-xs text-slate-400 mt-2">Fill in company, role, and JD on the left to generate.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColdEmailPage;
