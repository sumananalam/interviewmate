import React from 'react';
import { Brain, Sparkles, User, LogOut, History, LayoutDashboard, FileText } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  user: UserType | null;
  currentView: string;
  setCurrentView: (view: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, currentView, setCurrentView, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Brand Zone */}
        <div 
          onClick={() => setCurrentView(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              InterviewMate
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-normal">AI</span>
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          {!user ? (
            <>
              <button onClick={() => setCurrentView('landing')} className={`hover:text-white transition-colors ${currentView === 'landing' ? 'text-purple-400 font-semibold' : ''}`}>Home</button>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            </>
          ) : (
            <>
              <button 
                onClick={() => setCurrentView('dashboard')} 
                className={`flex items-center gap-2 hover:text-white transition-colors ${currentView === 'dashboard' ? 'text-purple-400 font-semibold' : ''}`}
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </button>
              <button 
                onClick={() => setCurrentView('setup')} 
                className={`flex items-center gap-2 hover:text-white transition-colors ${currentView === 'setup' ? 'text-purple-400 font-semibold' : ''}`}
              >
                <Sparkles className="w-4 h-4" /> New Interview
              </button>
              <button 
                onClick={() => setCurrentView('history')} 
                className={`flex items-center gap-2 hover:text-white transition-colors ${currentView === 'history' ? 'text-purple-400 font-semibold' : ''}`}
              >
                <History className="w-4 h-4" /> History
              </button>
              <button 
                onClick={() => setCurrentView('profile')} 
                className={`flex items-center gap-2 hover:text-white transition-colors ${currentView === 'profile' ? 'text-purple-400 font-semibold' : ''}`}
              >
                <User className="w-4 h-4" /> Profile
              </button>
            </>
          )}
        </nav>

        {/* Primary Action Zone */}
        <div className="flex items-center gap-4 shrink-0">
          {!user ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentView('login')}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => setCurrentView('register')}
                className="px-4.5 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
              >
                Get Started
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-medium text-white">{user.name}</span>
                <span className="text-xs text-slate-400">{user.preferred_role}</span>
              </div>
              <button 
                onClick={onLogout}
                title="Logout"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
