import React, { useEffect, useState } from 'react';
import { JobRole } from '../types';
import { Sparkles, ArrowRight, BookOpen, Layers, Sliders, CheckCircle2 } from 'lucide-react';

interface InterviewSetupProps {
  userId: number;
  onStartSession: (sessionId: number, questions: any[]) => void;
  onCancel: () => void;
}

export const InterviewSetup: React.FC<InterviewSetupProps> = ({ userId, onStartSession, onCancel }) => {
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<number>(1);
  const [interviewType, setInterviewType] = useState<string>('Technical');
  const [difficulty, setDifficulty] = useState<string>('Intermediate');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await fetch('/api/job-roles');
        const data = await res.json();
        if (res.ok && data.length > 0) {
          setRoles(data);
          setSelectedRole(data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch job roles:', err);
      }
    }
    fetchRoles();
  }, []);

  const handleBegin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/interviews/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          roleId: selectedRole,
          interviewType,
          difficulty,
          questionCount
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to start interview session');
      }

      onStartSession(data.sessionId, data.questions);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-2xl w-full bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 sm:p-10 backdrop-blur-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Configure Your Mock Interview
          </h1>
          <p className="text-sm text-slate-400">
            Select your parameters to generate role-specific questions and AI evaluation criteria.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleBegin} className="space-y-6">
          {/* Job Role Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Target Job Role</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${selectedRole === role.id ? 'bg-purple-600/10 border-purple-500 text-white shadow-lg shadow-purple-600/10' : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{role.title}</span>
                      {selectedRole === role.id && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                    </div>
                    <span className="text-xs text-purple-300 font-medium">{role.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interview Type */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Interview Type</label>
            <div className="grid grid-cols-2 gap-4">
              {['Technical', 'HR'].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setInterviewType(type)}
                  className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${interviewType === type ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/20' : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/40'}`}
                >
                  {type} Interview
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Difficulty Level</label>
            <div className="grid grid-cols-3 gap-3">
              {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                <button
                  type="button"
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${difficulty === diff ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20' : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/40'}`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Number of Questions</label>
            <div className="grid grid-cols-3 gap-3">
              {[5, 10, 15].map((count) => (
                <button
                  type="button"
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${questionCount === count ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20' : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/40'}`}
                >
                  {count} Questions
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="w-1/3 py-3.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-xl shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Preparing Questions...' : 'Start Interview'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
