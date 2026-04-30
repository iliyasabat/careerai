import React from 'react';
import { Copy, Send, Check } from 'lucide-react';

const EmailPreview = ({ subject, body }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = body.trim().split(/\s+/).length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-slate-50 border-b border-slate-200 p-4 space-y-2">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-400 font-medium w-16">To:</span>
          <span className="text-slate-600 truncate italic">recruiter@company.com</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-400 font-medium w-16">Subject:</span>
          <span className="text-slate-900 font-bold truncate">{subject}</span>
        </div>
      </div>
      
      <div className="p-8 min-h-[400px] font-body text-slate-700 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
        {body}
      </div>

      <div className="border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded ${wordCount > 160 ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'}`}>
            {wordCount} words
          </span>
          {wordCount > 160 && (
            <span className="text-[10px] text-red-500 font-medium">Too long? Consider trimming.</span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Text'}
          </button>
          <button 
            disabled
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary opacity-50 cursor-not-allowed rounded-lg shadow-sm"
            title="Coming soon"
          >
            <Send className="w-4 h-4" />
            Send via Gmail
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;
