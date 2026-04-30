import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  ArrowRight, 
  Zap, 
  BarChart3, 
  Mail, 
  Github, 
  Search, 
  Wand2, 
  MessageSquare, 
  Kanban, 
  Target, 
  TrendingUp, 
  FileUp, 
  ScanSearch,
  Play
} from 'lucide-react';
import { useInView } from '../hooks/useInView';

const LandingPage = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [f1Ref, f1InView] = useInView({ triggerOnce: true });
  const [f2Ref, f2InView] = useInView({ triggerOnce: true });
  const [f3Ref, f3InView] = useInView({ triggerOnce: true });
  const [f4Ref, f4InView] = useInView({ triggerOnce: true });
  const [f5Ref, f5InView] = useInView({ triggerOnce: true });
  const [f6Ref, f6InView] = useInView({ triggerOnce: true });
  const [f7Ref, f7InView] = useInView({ triggerOnce: true });
  const [howRef, howInView] = useInView({ triggerOnce: true });

  const features = [
    {
      id: 'f1',
      ref: f1Ref,
      inView: f1InView,
      icon: Search,
      accent: 'cyan',
      label: '01 · Job Search',
      title: 'Find jobs that actually match your profile',
      description: "Search thousands of real job openings from top Indian and global companies. Every listing shows a match score calculated from YOUR resume — so you know before you apply.",
      bullets: [
        "Live job listings from LinkedIn, Indeed & more",
        "Filters: role, location, salary, work mode, experience",
        "AI match score per job based on your resume"
      ],
      link: 'Try Job Search →',
      visual: (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
          <div className="flex gap-2 mb-6">
            <div className="h-2 w-12 bg-slate-700 rounded-full" />
            <div className="h-2 w-20 bg-slate-700 rounded-full" />
            <div className="h-2 w-8 bg-slate-700 rounded-full ml-auto" />
          </div>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary/20" />
                    <div>
                      <div className="h-3 w-24 bg-white/10 rounded mb-1" />
                      <div className="h-2 w-16 bg-white/5 rounded" />
                    </div>
                  </div>
                  <div className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded border border-emerald-500/20">88% Match</div>
                </div>
                <div className="flex gap-2">
                  <div className="h-2 w-10 bg-slate-800 rounded" />
                  <div className="h-2 w-14 bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'f2',
      ref: f2Ref,
      inView: f2InView,
      icon: BarChart3,
      accent: 'indigo',
      label: '02 · ATS Score',
      title: "Know exactly why you're getting rejected",
      description: "Most resumes never reach a human — they're filtered by ATS software. CareerOS scores your resume across 5 dimensions and tells you precisely what to fix.",
      bullets: [
        "5-dimension scoring rubric",
        "Semantic keyword matching (not just word count)",
        "Instant fix recommendations"
      ],
      link: 'Check Your ATS Score →',
      visual: (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-[8px] border-primary border-t-slate-700 flex flex-col items-center justify-center mb-6">
            <span className="text-3xl font-mono font-bold text-white">68</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold">ATS Score</span>
          </div>
          <div className="w-full space-y-3">
            {[
              { l: 'Keyword Match', s: 18, m: 30, c: 'bg-amber-500' },
              { l: 'Bullet Strength', s: 16, m: 25, c: 'bg-emerald-500' },
              { l: 'Completeness', s: 14, m: 20, c: 'bg-emerald-500' }
            ].map((d, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <span>{d.l}</span>
                  <span>{d.s}/{d.m}</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full w-full overflow-hidden">
                  <div className={`h-full ${d.c}`} style={{ width: `${(d.s/d.m)*100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'f3',
      ref: f3Ref,
      inView: f3InView,
      icon: Zap,
      accent: 'white', // Custom for user styling
      label: '03 · Skill Gap',
      title: "See exactly what's standing between you and the job",
      description: "CareerOS compares your resume skills against any job description and shows you what's missing — with hand-picked free courses to close each gap.",
      bullets: [
        "Semantic skill comparison (not just keyword match)",
        "Gap analysis for any target role",
        "Curated courses from YouTube, Coursera & Udemy"
      ],
      link: 'Detect Your Skill Gaps →',
      labelStyle: { color: '#ffffff' },
      linkStyle: { borderColor: '#fbf9f5', color: '#fcf9f5' },
      visual: (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-3">Your Skills</div>
              <div className="flex flex-wrap gap-1.5">
                {['Python', 'Django', 'React', 'Git'].map(s => (
                  <span key={s} className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded">✓ {s}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-3">Missing Skills</div>
              <div className="flex flex-wrap gap-1.5">
                {['Docker', 'Redis'].map(s => (
                  <span key={s} className="px-2 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold rounded">✗ {s}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
             <div className="w-10 h-10 bg-red-500/20 text-red-500 rounded flex items-center justify-center font-bold">YT</div>
             <div>
               <div className="text-xs font-bold text-white">Docker for Beginners</div>
               <div className="text-[10px] text-slate-500">Free Course · 4 hrs</div>
             </div>
          </div>
        </div>
      )
    },
    {
      id: 'f4',
      ref: f4Ref,
      inView: f4InView,
      icon: Wand2,
      accent: 'purple',
      label: '04 · Resume Curator',
      title: "Turn weak bullets into interview-winning achievements",
      description: "CareerOS's AI rewrites your weakest resume bullets to be stronger, metrics-driven, and tailored to your target job — while keeping it 100% truthful to your experience.",
      bullets: [
        "Per-bullet strength scoring",
        "JD-aware rewrites with real keyword injection",
        "No fabrication — keeps it 100% genuine"
      ],
      link: 'Rewrite My Resume →',
      visual: (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg">
            <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Original</div>
            <div className="text-[11px] text-slate-400">Responsible for managing the backend API for e-commerce platform</div>
          </div>
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="text-[9px] font-bold text-primary uppercase mb-1">AI Rewritten</div>
            <div className="text-[11px] text-white">Architected RESTful APIs serving 10K+ daily users, <span className="bg-primary/20 text-primary px-1 rounded">reducing response time by 35%</span></div>
          </div>
          <div className="flex gap-2 justify-end">
            <div className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded">Accept</div>
            <div className="px-3 py-1 border border-slate-700 text-slate-400 text-[10px] font-bold rounded">Edit</div>
          </div>
        </div>
      )
    },
    {
      id: 'f5',
      ref: f5Ref,
      inView: f5InView,
      icon: Mail,
      accent: 'teal',
      label: '05 · Cold Email',
      title: "Reach hiring managers before anyone else",
      description: "Skip the application queue. CareerOS generates personalised cold emails that reference the specific company and role — making hiring managers actually want to reply.",
      bullets: [
        "3 tone variants: formal, conversational, referral",
        "Pulls in company news for a genuine hook",
        "One-click send via Gmail"
      ],
      link: 'Generate a Cold Email →',
      visual: (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
          <div className="space-y-1 mb-4 border-b border-slate-700 pb-3">
            <div className="text-[10px] text-slate-500">Subject: Backend Engineer at Razorpay — Would love to chat</div>
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed space-y-2">
            <p>Hi Priya,</p>
            <p>Razorpay's recent push into <span className="text-white font-medium">event-driven architecture</span> is exactly the kind of infrastructure challenge I want to work on.</p>
            <p>I've spent the last 1.5 years building backends...</p>
          </div>
          <div className="flex gap-1.5 mt-4">
            {['Formal', 'Conversational', 'Referral'].map((t, idx) => (
              <div key={t} className={`px-2 py-1 text-[9px] font-bold rounded ${idx === 1 ? 'bg-primary text-white' : 'bg-slate-900 text-slate-500'}`}>{t}</div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'f6',
      ref: f6Ref,
      inView: f6InView,
      icon: MessageSquare,
      accent: 'rose',
      label: '06 · Interview Coach',
      title: "Walk into every interview fully prepared",
      description: "CareerOS generates role-specific interview questions and evaluates your answers — scoring for STAR format, technical correctness, and clarity.",
      bullets: [
        "Role-specific questions from the actual JD",
        "Voice answer support via speech-to-text",
        "Detailed feedback: STAR format scoring + improvement tips"
      ],
      link: 'Start Mock Interview →',
      visual: (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 mb-4">
            <div className="flex gap-2 mb-2">
              <span className="text-[8px] font-bold px-1.5 py-0.5 bg-amber-500/10 text-amber-500 rounded uppercase">Medium</span>
              <span className="text-[8px] font-bold px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded uppercase">System Design</span>
            </div>
            <div className="text-[10px] font-bold text-white">Design a URL shortener service.</div>
          </div>
          <div className="h-16 w-full bg-slate-900/50 rounded-lg border border-slate-800 mb-4 p-3 overflow-hidden">
             <div className="h-2 w-full bg-slate-700 rounded mb-2" />
             <div className="h-2 w-[80%] bg-slate-700 rounded mb-2" />
             <div className="h-2 w-[90%] bg-slate-700 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-[10px] font-bold text-primary">STAR Score</div>
              <div className="w-16 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '80%' }} />
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-primary">4/5</span>
          </div>
        </div>
      )
    },
    {
      id: 'f7',
      ref: f7Ref,
      inView: f7InView,
      icon: Kanban,
      accent: 'white', // Custom for user styling
      label: '07 · Application Tracker',
      title: "Never lose track of where you stand",
      description: "Track every application across every stage in one Kanban board. CareerOS automatically reminds you to follow up if you haven't heard back in 7 days.",
      bullets: [
        "Kanban board: Applied → Screening → Interview → Offer",
        "7-day auto follow-up reminders",
        "Notes, status history, and timeline per application"
      ],
      link: 'Track My Applications →',
      labelStyle: { color: '#f2f8f6' },
      linkStyle: { color: '#fcfcfc' },
      visual: (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl grid grid-cols-2 gap-4">
          {[
            { t: 'Applied', c: 2 },
            { t: 'Screening', c: 1 },
            { t: 'Interview', c: 1 },
            { t: 'Offer', c: 1 }
          ].map((col, idx) => (
            <div key={idx} className="bg-slate-900/50 border border-slate-800 p-2 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[8px] font-bold text-slate-500 uppercase">{col.t}</span>
                <span className="text-[8px] font-bold text-primary">{col.c}</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-6 bg-slate-800 rounded flex items-center px-1.5 gap-1.5">
                  <div className="w-2 h-2 rounded bg-primary/40" />
                  <div className="h-1.5 w-8 bg-slate-700 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="bg-slate-900 min-h-screen text-white overflow-x-hidden font-body">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-display font-bold text-white tracking-tight">CareerOS</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/auth" className="hidden sm:block text-sm font-bold text-white/80 hover:text-white transition-colors px-4 py-2 border border-slate-700 rounded-lg hover:bg-slate-800">Log In</Link>
            <Link to="/auth" className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-44 pb-32 px-6 overflow-hidden min-h-screen flex flex-col items-center">
        <div className={`max-w-7xl mx-auto text-center relative z-10 transition-all duration-1000 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8">
            ✦ AI-POWERED CAREER PLATFORM
          </div>
          
          <h1 className="text-6xl md:text-[80px] font-display font-bold mb-8 leading-[1.05] tracking-tight">
            Your <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">AI Co-Pilot</span><br />
            for Landing the Job
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
            From resume to offer letter — CareerOS handles job search, skill gaps, resume rewriting, cold emails, interview prep, and application tracking. All in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/auth" className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-lg shadow-2xl shadow-primary/40 group">
              Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#demo" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold border border-slate-700 hover:bg-slate-800 transition-all text-lg flex items-center justify-center gap-2">
              <Play className="w-5 h-5 fill-current" /> Watch Demo
            </a>
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="text-slate-500 text-sm font-medium">
              Bridging the gap between <span className="text-slate-300 mx-1">talent and opportunity</span> with AI
            </p>
          </div>
        </div>

        {/* Hero visual */}
        <div className={`mt-20 max-w-4xl w-full mx-auto relative transition-all duration-1000 delay-500 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="absolute inset-x-0 -top-20 h-96 bg-primary/20 blur-[120px] rounded-full mx-auto" />
          <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)] animate-[float_4s_ease-in-out_infinite]">
             <div className="flex flex-col md:flex-row gap-8">
               <div className="flex-1 bg-slate-900 rounded-2xl p-6 border border-slate-800">
                  <div className="flex justify-between items-center mb-10">
                    <h4 className="font-display font-bold text-lg text-white">ATS Score Dashboard</h4>
                    <div className="px-3 py-1 rounded bg-amber-500/20 text-amber-500 text-[10px] font-bold border border-amber-500/20">C+ GRADE</div>
                  </div>
                  <div className="flex items-center gap-10 mb-8">
                    <div className="w-24 h-24 rounded-full border-[6px] border-primary border-t-slate-800 flex flex-col items-center justify-center font-mono text-3xl font-bold">
                      74
                      <span className="text-[8px] text-slate-500">SCORE</span>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase">Keyword Match</div>
                        <div className="h-2 bg-slate-800 rounded-full w-full overflow-hidden"><div className="h-full bg-primary rounded-full w-[60%]" /></div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase">Bullet Strength</div>
                        <div className="h-2 bg-slate-800 rounded-full w-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full w-[80%]" /></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 italic">
                    "Optimise your Docker and FastAPI keywords to reach 85+"
                  </div>
               </div>
               <div className="hidden md:flex flex-col gap-4 w-64">
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-500/10 text-accent rounded flex items-center justify-center">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Matched Job</div>
                      <div className="text-xs font-bold text-white">Swiggy · 88% Match</div>
                    </div>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/10 text-success rounded flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Goal Tracker</div>
                      <div className="text-xs font-bold text-white">2 Interviews Booked</div>
                    </div>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Skill Analysis</div>
                      <div className="text-xs font-bold text-white">5 Critical Gaps Fixed</div>
                    </div>
                  </div>
               </div>
             </div>
          </div>
        </div>

        {/* Global Grid Pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} 
        />
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Everything you need to get hired</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Integrated AI-powered tools to streamline your entire job search journey.</p>
          </div>

          <div className="space-y-48">
            {features.map((f, idx) => (
              <div 
                key={f.id} 
                ref={f.ref}
                className={`flex flex-col lg:flex-row gap-16 lg:items-center transition-all duration-1000 ${
                  f.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                } ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className="flex-1">
                   <div 
                    className={`text-xs font-bold uppercase tracking-[0.2em] mb-4 ${!f.labelStyle ? `text-${f.accent}-500` : ''}`}
                    style={f.labelStyle}
                   >
                     {f.label}
                   </div>
                   <h3 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white leading-tight">
                     {f.title}
                   </h3>
                   <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                     {f.description}
                   </p>
                   <div className="space-y-4 mb-8">
                     {f.bullets.map((b, i) => (
                       <div key={i} className="flex items-center gap-3">
                         <div className={`w-1.5 h-1.5 rounded-full ${!f.labelStyle ? `bg-${f.accent}-500` : 'bg-white'}`} />
                         <span className="text-slate-300 font-medium">{b}</span>
                       </div>
                     ))}
                   </div>
                   <Link 
                    to="/auth" 
                    className={`inline-flex items-center gap-2 font-bold hover:gap-3 transition-all ${!f.linkStyle ? `text-${f.accent}-500` : 'border-b pb-1'}`}
                    style={f.linkStyle}
                   >
                     {f.link}
                   </Link>
                </div>
                <div className="flex-1 relative group">
                  <div className={`absolute inset-0 ${!f.labelStyle ? `bg-${f.accent}-500/10` : 'bg-white/5'} blur-[80px] rounded-full transition-all group-hover:blur-[100px]`} />
                  <div className="relative">
                    {f.visual}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6 bg-slate-950 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">From zero to offer letter in 4 steps</h2>
          </div>

          <div ref={howRef} className="grid grid-cols-1 md:grid-cols-4 gap-12 relative transition-all duration-1000">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px border-t border-dashed border-slate-800 z-0" />
            
            {[
              { t: 'Upload Your Resume', d: 'Drop your PDF or DOCX resume. CareerOS parses it in seconds — extracting your skills, experience, education, and achievements.', i: FileUp },
              { t: 'Analyse & Fix', d: 'Get your ATS score, see your skill gaps, and let AI rewrite your weak bullets. Know exactly what to fix before applying.', i: ScanSearch },
              { t: 'Find & Target Jobs', d: 'Search real job openings. See your match score per listing. Send personalised cold emails directly to hiring managers.', i: Target },
              { t: 'Prepare & Track', d: 'Practice with AI interview coaching tailored to each role. Track all your applications in one Kanban board.', i: TrendingUp }
            ].map((step, idx) => (
              <div 
                key={idx} 
                className={`relative z-10 flex flex-col items-center text-center transition-all duration-700`}
                style={{ transitionDelay: `${idx * 200}ms`, opacity: howInView ? 1 : 0, transform: howInView ? 'translateY(0)' : 'translateY(20px)' }}
              >
                <div className="w-24 h-24 rounded-[32px] bg-slate-900 border border-slate-800 flex items-center justify-center mb-8 relative group">
                  <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />
                  <step.i className="w-10 h-10 text-primary relative z-10" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-white font-display font-bold flex items-center justify-center text-sm shadow-lg">
                    {idx + 1}
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-4 text-white">{step.t}</h4>
                <p className="text-sm text-slate-500 leading-relaxed px-4">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6 relative overflow-hidden">
         <div className="max-w-6xl mx-auto rounded-[48px] bg-indigo-600 p-12 md:p-24 text-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/20 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">Ready to land your dream job?</h2>
              <p className="text-xl text-indigo-100 mb-12 font-medium opacity-90">Start your journey with CareerOS and crack your dream placements with confidence.</p>
              <Link to="/auth" className="inline-block bg-white text-indigo-600 px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20">
                Get Started Free
              </Link>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Briefcase className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-display font-bold text-white tracking-tight">CareerOS</span>
              </div>
              <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
                Your AI-powered career co-pilot. Built to bridge the gap between education and employment.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                   <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="md:col-span-2">
               <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Product</h4>
               <ul className="space-y-4 text-sm text-slate-500">
                 <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                 <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                 <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
               </ul>
            </div>

            <div className="md:col-span-3">
               <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Tools</h4>
               <ul className="space-y-4 text-sm text-slate-500">
                 <li><Link to="/ats" className="hover:text-white transition-colors">ATS Checker</Link></li>
                 <li><Link to="/skills" className="hover:text-white transition-colors">Skill Gap Analyzer</Link></li>
                 <li><Link to="/curator" className="hover:text-white transition-colors">Resume Curator</Link></li>
                 <li><Link to="/email" className="hover:text-white transition-colors">Cold Email Generator</Link></li>
                 <li><Link to="/interview" className="hover:text-white transition-colors">Interview Coach</Link></li>
               </ul>
            </div>

            <div className="md:col-span-2">
               <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Support</h4>
               <ul className="space-y-4 text-sm text-slate-500">
                 <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
               </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-600">
            <div>© 2025 CareerOS · Built for students, by students</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Hero Float Animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}} />
    </div>
  );
};

export default LandingPage;
