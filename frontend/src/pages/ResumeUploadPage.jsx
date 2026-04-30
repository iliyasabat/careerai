import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileUp, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  FileText, 
  ChevronRight, 
  Plus,
  ArrowUpRight
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { uploadResume } from '../api';

const ResumeUploadPage = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const steps = [
    "Parsing resume content...",
    "Extracting skills and experience...",
    "Generating ATS embeddings...",
    "Syncing with database..."
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    
    // Simulate steps
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(r => setTimeout(r, 600));
    }
    
    await uploadResume(file);
    navigate('/ats');
  };

  return (
    <div className="space-y-8 animate-slide-up pb-20">
      <PageHeader 
        title="My Resume" 
        subtitle="Upload your resume to get started with analysis and job matching."
        breadcrumb="Resume"
      />

      {!analyzing ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div 
              className={`relative border-2 border-dashed rounded-[32px] p-12 transition-all flex flex-col items-center text-center ${
                dragActive ? 'border-primary bg-primary-light' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept=".pdf,.docx" 
                onChange={handleFileChange}
              />
              
              <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                <FileUp className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
                Drag and drop your resume here
              </h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                Upload your most recent resume to get an AI-powered score analysis.
              </p>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all"
              >
                Or browse from computer
              </button>
              
              <p className="mt-6 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                Supports PDF and DOCX · Max 5MB
              </p>
            </div>

            {file && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-slide-up">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-light text-primary rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 truncate max-w-[200px] md:max-w-md">{file.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{(file.size / (1024 * 1024)).toFixed(2)} MB · {file.name.split('.').pop().toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => setFile(null)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-danger bg-red-50 hover:bg-red-100 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                  <button 
                    onClick={handleAnalyze}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                  >
                    Analyse Resume <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
              <h4 className="text-xl font-display font-bold mb-4">ATS Compatibility</h4>
              <p className="text-sm text-slate-400 font-medium mb-6 leading-relaxed">Most companies use Applicant Tracking Systems. We help you beat them by matching your resume structure to their algorithms.</p>
              <ul className="space-y-3">
                {['Single column layout', 'Standard headings', 'Keyword density', 'Metrics & Results'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-bold">
                    <div className="w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h4 className="text-lg font-bold text-slate-900 mb-6">Resume History</h4>
              <div className="space-y-4">
                {[
                  { name: 'resume_final_v2.pdf', date: 'Apr 26, 2025', score: 68 },
                  { name: 'resume_old.pdf', date: 'Mar 12, 2025', score: 54 }
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center group-hover:bg-primary-light group-hover:text-primary transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 line-clamp-1">{r.name}</div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">{r.date}</div>
                      </div>
                    </div>
                    <div className="text-sm font-mono font-bold text-primary group-hover:translate-x-1 transition-transform">
                      {r.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 p-12 text-center bg-white border border-slate-200 rounded-[40px] shadow-sm max-w-2xl mx-auto animate-slide-up">
          <div className="relative mb-12">
            <div className="w-24 h-24 rounded-[32px] bg-primary relative z-10 flex items-center justify-center animate-bounce">
              <FileUp className="text-white w-10 h-10" />
            </div>
            <div className="absolute inset-x-[-20px] bottom-[-10px] h-4 bg-slate-100 rounded-full blur-md animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-8">AI is dissecting your resume...</h2>
          
          <div className="w-full max-w-md space-y-6">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                  i < currentStep 
                    ? 'bg-success border-success text-white' 
                    : i === currentStep 
                      ? 'border-primary text-primary animate-pulse' 
                      : 'border-slate-200 text-slate-300'
                }`}>
                  {i < currentStep ? <CheckCircle2 className="w-5 h-5" /> : (i + 1)}
                </div>
                <div className={`text-sm font-bold text-left ${
                  i === currentStep ? 'text-primary' : i < currentStep ? 'text-slate-900' : 'text-slate-300'
                }`}>
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUploadPage;
