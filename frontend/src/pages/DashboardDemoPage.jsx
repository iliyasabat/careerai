import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileUp,
  Search,
  Mail,
  ChevronRight,
  Clock,
  BarChart,
  Briefcase
} from 'lucide-react';
import MatchBadge from '../components/MatchBadge';
import PageHeader from '../components/PageHeader';

// Frozen design reference dashboard — all data here is hardcoded for visual
// documentation. The live, wired dashboard lives at /dashboard (DashboardPage).
const DashboardDemoPage = () => {
  const stats = [
    { label: 'ATS Score',    value: '68', sub: 'Last analysed 2 days ago', icon: BarChart,  color: 'text-primary' },
    { label: 'Jobs Matched', value: '6',  sub: 'Based on your resume',     icon: Search,    color: 'text-accent' },
    { label: 'Emails Sent',  value: '3',  sub: 'This week',                 icon: Mail,      color: 'text-emerald-500' },
    { label: 'Applications', value: '8',  sub: '2 in Interview stage',      icon: Briefcase, color: 'text-amber-500' }
  ];

  const activities = [
    { title: 'ATS Score updated — 68/100',                    time: '2 hours ago', icon: BarChart,  color: 'bg-primary' },
    { title: 'Applied to Razorpay — Backend Engineer',        time: '1 day ago',   icon: Briefcase, color: 'bg-emerald-500' },
    { title: 'Cold email sent to Meesho',                     time: '2 days ago',  icon: Mail,      color: 'bg-blue-500' },
    { title: 'Skill gap analysed for Backend Engineer role',  time: '3 days ago',  icon: BarChart,  color: 'bg-amber-500' },
    { title: 'Resume uploaded — resume_v3.pdf',               time: '3 days ago',  icon: FileUp,    color: 'bg-slate-500' }
  ];

  const jobs = [
    { id: 'demo-1', company: 'Razorpay', title: 'Backend Engineer', match_score: 92, skills_required: ['Python', 'FastAPI', 'PostgreSQL'] },
    { id: 'demo-2', company: 'Meesho',   title: 'SDE-1',            match_score: 87, skills_required: ['Python', 'AWS', 'Docker'] },
    { id: 'demo-3', company: 'Swiggy',   title: 'Software Engineer', match_score: 81, skills_required: ['Java', 'Kafka', 'Redis'] }
  ];

  return (
    <div className="space-y-8 pb-12 animate-slide-up">
      <PageHeader
        title="Good morning, Arjun 👋"
        subtitle="Design reference — all numbers and activity items below are hardcoded."
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-mono font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm font-bold text-slate-700">{stat.label}</div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link to="/resume" className="flex-1 min-w-[200px] flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark text-white p-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/10">
          <FileUp className="w-5 h-5" />
          Upload New Resume
        </Link>
        <Link to="/jobs" className="flex-1 min-w-[200px] flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 p-4 rounded-xl font-bold transition-all">
          <Search className="w-5 h-5" />
          Find Jobs
        </Link>
        <Link to="/email" className="flex-1 min-w-[200px] flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 p-4 rounded-xl font-bold transition-all">
          <Mail className="w-5 h-5" />
          Generate Cold Email
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Recent Activity */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-display font-bold text-slate-900 mb-8">Recent Activity</h3>
          <div className="space-y-6">
            {activities.map((act, i) => (
              <div key={i} className="flex gap-4 relative group">
                {i !== activities.length - 1 && (
                  <div className="absolute left-6 top-10 bottom-[-24px] w-0.5 bg-slate-100" />
                )}
                <div className={`w-12 h-12 rounded-2xl ${act.color} text-white flex items-center justify-center shrink-0 z-10 group-hover:scale-110 transition-transform`}>
                  <act.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 pt-1 pb-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-slate-900">{act.title}</h4>
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {act.time}
                    </span>
                  </div>
                  <div className="mt-2 text-primary font-bold text-xs cursor-pointer hover:underline flex items-center gap-1 invisible group-hover:visible">
                    View Details <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Matched Jobs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-end mb-4 px-2">
            <h3 className="text-xl font-display font-bold text-slate-900">Top Job Matches</h3>
            <Link to="/jobs" className="text-xs font-bold text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg font-bold group-hover:text-primary transition-colors">
                      {job.company[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{job.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{job.company}</p>
                    </div>
                  </div>
                  <MatchBadge score={job.match_score} />
                </div>
                <div className="flex flex-wrap gap-1.5 overflow-hidden h-6">
                  {job.skills_required.slice(0, 3).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-400 border border-slate-100 rounded text-[9px] font-bold uppercase truncate max-w-[80px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary-light border border-primary/10 rounded-3xl p-6 mt-8 relative overflow-hidden group cursor-pointer">
            <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            <h4 className="text-primary font-display font-bold text-lg mb-2">Next Step: Interview Prep</h4>
            <p className="text-sm text-primary/70 mb-4 font-medium leading-relaxed">Prepare for your Razorpay Backend Engineer interview with role-specific system design questions.</p>
            <Link to="/interview" className="inline-flex items-center gap-2 text-xs font-bold bg-primary text-white px-4 py-2 rounded-lg hover:translate-x-1 transition-all">
              Practice Now <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDemoPage;
