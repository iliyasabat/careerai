import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileUp,
  Trash2,
  CheckCircle2,
  Loader2,
  FileText,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { uploadResume } from '../api';

const ResumeUploadPage = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError('');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError('');
    const res = await uploadResume(file);
    setAnalyzing(false);
    if (res?.error) {
      setError(res.message || 'Resume upload failed. Please try a different file.');
      return;
    }
    navigate('/ats');
  };

  return (
    <div className="space-y-8 animate-slide-up pb-20">
      <PageHeader
        title="My Resume"
        subtitle="Upload your resume to unlock ATS scoring, curation, and job matching."
        breadcrumb="Resume"
      />

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700 font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

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
                Supports PDF and DOCX
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
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 p-12 text-center bg-white border border-slate-200 rounded-[40px] shadow-sm max-w-2xl mx-auto animate-slide-up">
          <div className="relative mb-12">
            <div className="w-24 h-24 rounded-[32px] bg-primary relative z-10 flex items-center justify-center">
              <Loader2 className="text-white w-10 h-10 animate-spin" />
            </div>
          </div>

          <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">Analysing your resume…</h2>
          <p className="text-sm text-slate-500 max-w-sm">
            Parsing the file, extracting skills, and generating embeddings. The first analysis can take ~20 seconds while the ML model warms up.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeUploadPage;
