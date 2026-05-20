import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileUp,
  Search,
  Mail,
  ChevronRight,
  Briefcase,
  Target,
  Trophy,
  Clock,
  AlertCircle
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { getApplications } from '../api';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getApplications();
      if (res?.error) {
        setError(res.message || 'Failed to load applications');
        setApps([]);
      } else {
        setApps(Array.isArray(res) ? res : []);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner text="Getting your dashboard ready..." />;

  const hasResume = !!localStorage.getItem('resume_id');
  const firstName = user?.name?.split(' ')[0] || 'there';

  const countBy = (status) => apps.filter((a) => a.status === status).length;
  const stats = [
    { label: 'Applications', value: apps.length,            sub: 'Tracked total',      icon: Briefcase, color: 'text-amber-500' },
    { label: 'In Interview', value: countBy('Interview'),   sub: 'Active stage',       icon: Clock,     color: 'text-primary' },
    { label: 'Offers',       value: countBy('Offer'),       sub: 'Live offers',        icon: Trophy,    color: 'text-emerald-500' },
    { label: 'Rejected',     value: countBy('Rejected'),    sub: 'Closed loops',       icon: Target,    color: 'text-slate-400' }
  ];

  const recent = [...apps]
    .sort((a, b) => (a.date_applied < b.date_applied ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="space-y-8 pb-12 animate-slide-up">
      <PageHeader
        title={`Good to see you, ${firstName} 👋`}
        subtitle="Your job-search workspace. Upload a resume to unlock job matching and ATS scoring."
      />

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700 font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!hasResume && (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-primary-light border border-primary/10 rounded-3xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shrink-0">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-primary text-lg">Start by uploading your resume</h4>
              <p className="text-sm text-primary/70 font-medium mt-1">
                ATS scoring, resume curation, skill-gap analysis and job matching all need it.
              </p>
            </div>
          </div>
          <Link
            to="/resume"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold whitespace-nowrap"
          >
            Upload Resume <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

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
          {hasResume ? 'Re-upload Resume' : 'Upload Resume'}
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

      {/* Recent Applications */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-display font-bold text-slate-900">Recent Applications</h3>
          <Link to="/tracker" className="text-xs font-bold text-primary hover:underline">View All</Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No applications yet"
            subtitle="Add your first application in the Tracker to see it show up here."
            action={{ label: 'Open Tracker', onClick: () => { window.location.href = '/tracker'; } }}
          />
        ) : (
          <div className="space-y-3">
            {recent.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg font-bold">
                    {a.company?.[0] || '?'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{a.role} — {a.company}</h4>
                    <p className="text-xs text-slate-500 font-medium">{a.date_applied} · {a.days_since} days ago</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-100">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
