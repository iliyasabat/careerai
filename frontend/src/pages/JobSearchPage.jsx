import React, { useState } from 'react';
import { Search, MapPin, ChevronDown, SlidersHorizontal, AlertCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import JobCard from '../components/JobCard';
import EmptyState from '../components/EmptyState';
import { searchJobs } from '../api';

const initialFilters = {
  title: '',
  location: '',
  mode: 'Any Mode',
  experience: 'Any Exp',
  minSalary: ''
};

const JobSearchPage = () => {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!filters.title.trim() || !filters.location.trim()) {
      setError('Please enter both a job title and a location to search.');
      return;
    }
    setLoading(true);
    setError('');
    const res = await searchJobs(filters);
    if (res?.error) {
      setError(res.message || 'Job search failed. Please try again.');
      setJobs([]);
    } else {
      setJobs(Array.isArray(res) ? res : []);
    }
    setHasSearched(true);
    setLoading(false);
  };

  const updateFilter = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-8 animate-slide-up pb-20">
      <PageHeader
        title="Job Search"
        subtitle={
          hasSearched
            ? `Showing ${jobs.length} ${jobs.length === 1 ? 'opportunity' : 'opportunities'}.`
            : 'Enter a job title and location to start searching.'
        }
        breadcrumb="Jobs"
      />

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Job title or keywords"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={filters.title}
              onChange={(e) => updateFilter('title', e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[200px] relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Location"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 lg:flex gap-4 w-full lg:w-auto">
            <div className="relative">
              <select
                className="appearance-none w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary transition-all"
                value={filters.mode}
                onChange={(e) => updateFilter('mode', e.target.value)}
              >
                <option>Any Mode</option>
                <option>Remote</option>
                <option>Hybrid</option>
                <option>Onsite</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative font-bold">
              <select
                className="appearance-none w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary transition-all"
                value={filters.experience}
                onChange={(e) => updateFilter('experience', e.target.value)}
              >
                <option>Any Exp</option>
                <option>0-1 yr</option>
                <option>1-3 yrs</option>
                <option>3-5 yrs</option>
                <option>5+ yrs</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full lg:w-auto px-8 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
          >
            {loading ? 'Searching…' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700 font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {hasSearched && !error && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm font-bold text-slate-700">
            Showing {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} · Sorted by <span className="text-primary italic">Match Score</span>
          </p>
          <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 h-64 animate-pulse">
              <div className="flex gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-100 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : hasSearched && !error ? (
        <EmptyState
          icon={Search}
          title="No jobs found"
          subtitle="Try a different title, broaden the location, or remove the experience filter."
          action={{ label: 'Reset Filters', onClick: () => { setFilters(initialFilters); setHasSearched(false); } }}
        />
      ) : null}
    </div>
  );
};

export default JobSearchPage;
