import React, { useState, useEffect } from 'react';
import { User } from './types';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthView } from './components/AuthView';
import { Dashboard } from './components/Dashboard';
import { InterviewSetup } from './components/InterviewSetup';
import { InterviewSession } from './components/InterviewSession';
import { ResultsPage } from './components/ResultsPage';
import { HistoryPage } from './components/HistoryPage';
import { ProfilePage } from './components/ProfilePage';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('interviewmate_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentView, setCurrentView] = useState<string>(() => {
    return user ? 'dashboard' : 'landing';
  });

  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('interviewmate_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('interviewmate_user');
    }
  }, [user]);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  const handleStartSession = (sessionId: number, questions: any[]) => {
    setActiveSessionId(sessionId);
    setActiveQuestions(questions);
    setCurrentView('session');
  };

  const handleSessionComplete = (evaluationData: any) => {
    setActiveSessionId(evaluationData.sessionId);
    setCurrentView('results');
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-purple-500 selection:text-white">
      {currentView !== 'login' && currentView !== 'register' && currentView !== 'session' && (
        <Navbar
          user={user}
          currentView={currentView}
          setCurrentView={(v) => {
            if (!user && v !== 'landing' && v !== 'login' && v !== 'register') {
              setCurrentView('login');
            } else {
              setCurrentView(v);
            }
          }}
          onLogout={handleLogout}
        />
      )}

      <main>
        {currentView === 'landing' && (
          <LandingPage
            onStart={() => {
              if (user) {
                setCurrentView('setup');
              } else {
                setCurrentView('register');
              }
            }}
            onLogin={() => setCurrentView('login')}
          />
        )}

        {(currentView === 'login' || currentView === 'register') && (
          <AuthView
            initialMode={currentView}
            onSuccess={handleLoginSuccess}
            onSwitchMode={(mode) => setCurrentView(mode)}
            onBackToHome={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'dashboard' && user && (
          <Dashboard
            user={user}
            onStartInterview={() => setCurrentView('setup')}
            onViewResults={(sid) => {
              setActiveSessionId(sid);
              setCurrentView('results');
            }}
            onViewHistory={() => setCurrentView('history')}
          />
        )}

        {currentView === 'setup' && user && (
          <InterviewSetup
            userId={user.id}
            onStartSession={handleStartSession}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'session' && user && activeSessionId && (
          <InterviewSession
            sessionId={activeSessionId}
            questions={activeQuestions}
            onComplete={handleSessionComplete}
            onCancel={() => {
              if (window.confirm('Are you sure you want to exit? Progress will be lost.')) {
                setCurrentView('dashboard');
              }
            }}
          />
        )}

        {currentView === 'results' && user && activeSessionId && (
          <ResultsPage
            sessionId={activeSessionId}
            onRetake={() => setCurrentView('setup')}
            onDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'history' && user && (
          <HistoryPage
            user={user}
            onViewResults={(sid) => {
              setActiveSessionId(sid);
              setCurrentView('results');
            }}
            onDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'profile' && user && (
          <ProfilePage
            user={user}
            onUpdateUser={(updated) => setUser(updated)}
            onDashboard={() => setCurrentView('dashboard')}
          />
        )}
      </main>
    </div>
  );
}
