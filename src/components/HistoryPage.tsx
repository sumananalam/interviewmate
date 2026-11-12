import React, { useEffect, useState } from 'react';
import { User, InterviewSession } from '../types';
import { History, ArrowLeft, Trophy, Calendar, ChevronRight } from 'lucide-react';

interface HistoryPageProps {
  user: User;
  onViewResults: (sessionId: number) => void;
  onDashboard: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ user, onViewResults, onDashboard }) => {
  const [history, setHistory] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/users/${user.id}/history`);
        const data = await res.json();
        if (res.ok) {
          setHistory(data);
        }
      } catch (err) {
        console.error('Failed to fetch interview history:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [user.id]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={onDashboard}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Interview History</h1>
              <p className="text-xs text-slate-400">All your completed mock interview sessions and performance scores</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-slate-500">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <p className="text-slate-400">No mock interview sessions found.</p>
              <button
                onClick={onDashboard}
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-medium"
              >
                Start an Interview
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
                    <th className="py-3 px-4">Questions</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4 font-semibold text-white">{item.role_title}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.interview_type === 'Technical' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'}`}>
                          {item.interview_type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{item.difficulty}</td>
                      <td className="py-4 px-4 text-slate-300">{item.total_questions}</td>
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
                          View Details
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
