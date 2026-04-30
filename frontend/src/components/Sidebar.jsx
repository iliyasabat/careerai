import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Wand2, 
  Search, 
  Zap, 
  Mail, 
  MessageSquare, 
  Kanban,
  Briefcase,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Resume', icon: FileText, path: '/resume' },
    { name: 'ATS Score', icon: BarChart3, path: '/ats' },
    { name: 'Resume Curator', icon: Wand2, path: '/curator' },
    { name: 'Job Search', icon: Search, path: '/jobs' },
    { name: 'Skill Gap', icon: Zap, path: '/skills' },
    { name: 'Cold Email', icon: Mail, path: '/email' },
    { name: 'Interview Coach', icon: MessageSquare, path: '/interview' },
    { name: 'Applications', icon: Kanban, path: '/tracker' },
  ];

  return (
    <aside className="w-60 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 flex flex-col z-50">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Briefcase className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-display font-bold text-slate-900 tracking-tight">CareerOS</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-primary-light text-primary' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 mb-2">
          <div className="w-10 h-10 bg-primary-light text-primary rounded-full flex items-center justify-center font-bold font-display">
            {user?.avatar || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:text-danger hover:bg-red-50 rounded-lg transition-all"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
