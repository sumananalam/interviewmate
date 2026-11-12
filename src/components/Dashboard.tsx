import React, { useEffect, useState } from 'react';
import { User, InterviewSession, UserStats } from '../types';
import { Sparkles, Trophy, CheckCircle2, Clock, ArrowRight, Play, Award, ChevronRight, BarChart2 } from 'lucide-react';

interface DashboardProps {
  user: User;
  onStartInterview: () => void;
  onViewResults: (sessionId: number) => void;
  onViewHistory: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onStartInterview, onViewResults, onViewHistory }) => {
  const [stats, setStats] = useState<UserStats>({ totalInterviews: 0, avgScore: 0, questionsAttempted: 0 });
  const [recentHistory, setRecentHistory] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const profileRes = await fetch(`/api/users/${user.id}/profile`);
        const profileData = await profileRes.json();
        if (profileRes.ok) {
          setStats(profileData.stats);
        }

        const historyRes = await fetch(`/api/users/${user.id}/history`);
        const historyData = await historyRes.json();
        if (historyRes.ok) {
          setRecentHistory(historyData.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user.id]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900/60 border border-purple-500/20 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target Role: {user.preferred_role}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Welcome back, {user.name}!
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Ready to sharpen your interview skills today? Launch a mock session or review your previous AI evaluation reports.
            </p>
          </div>

          <button
            onClick={onStartInterview}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] transition-all flex items-center gap-3 shrink-0 relative z-10 group"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start New Interview</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Completed Interviews</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{loading ? '...' : stats.totalInterviews}</h3>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Average Score / 10</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">
                {loading ? '...' : Number(stats.avgScore).toFixed(1)}
              </h3>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Questions Attempted</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{loading ? '...' : stats.questionsAttempted}</h3>
            </div>
          </div>
        </div>

        {/* Recent History Section */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Recent Interview Sessions</h2>
              <p className="text-xs text-slate-400 mt-0.5">Review your latest mock interview attempts and AI feedback</p>
            </div>
            <button
              onClick={onViewHistory}
              className="text-sm font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>View All History</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading your history...</div>
          ) : recentHistory.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-800/60 flex items-center justify-center mx-auto text-slate-500">
                <BarChart2 className="w-8 h-8" />
              </div>
              <p className="text-slate-400 text-sm">No mock interviews completed yet.</p>
              <button
                onClick={onStartInterview}
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-medium text-sm hover:bg-purple-500 transition-colors"
              >
                Start Your First Interview
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Difficulty</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {recentHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4 font-semibold text-white">{item.role_title}</td>
                      <td className="py-4 px-4 text-slate-300">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.interview_type === 'Technical' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'}`}>
                          {item.interview_type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{item.difficulty}</td>
                      <td className="py-4 px-4">
                        <span className={`font-bold ${item.score >= 7 ? 'text-emerald-400' : item.score >= 5 ? 'text-amber-400' : 'text-red-400'}`}>
                          {item.score} / 10
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-xs">
                        {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => onViewResults(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 font-medium text-xs transition-colors"
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
