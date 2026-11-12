import React, { useEffect, useState } from 'react';
import { Trophy, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw, Sparkles, Award, Lightbulb, BookOpen } from 'lucide-react';

interface ResultsPageProps {
  sessionId: number;
  onRetake: () => void;
  onDashboard: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ sessionId, onRetake, onDashboard }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`/api/interviews/${sessionId}/results`);
        const json = await res.json();
        if (res.ok) {
          setData(json);
        }
      } catch (err) {
        console.error('Failed to fetch results:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading interview results report...
      </div>
    );
  }

  if (!data || !data.session) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-slate-400 mb-4">Results not found.</p>
        <button onClick={onDashboard} className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-medium">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { session, items } = data;
  const scoreColor = session.score >= 7 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : session.score >= 5 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={onDashboard}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <button
            onClick={onRetake}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-300 hover:bg-purple-600/20 text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retake Interview</span>
          </button>
        </div>

        {/* Overview Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{session.role_title} · {session.interview_type} Interview</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Interview Evaluation Report</h1>
            <p className="text-sm text-slate-400">
              Completed on {new Date(session.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className={`flex flex-col items-center justify-center p-6 rounded-3xl border ${scoreColor} min-w-[160px] shadow-xl`}>
            <span className="text-xs uppercase tracking-wider font-semibold opacity-80 mb-1">Overall Score</span>
            <span className="text-4xl font-extxl font-black">{session.score}</span>
            <span className="text-xs opacity-70 mt-0.5">out of 10.0</span>
          </div>
        </div>

        {/* Question-wise Feedback Breakdown */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Question-wise AI Feedback Breakdown</h2>

          {items.map((item: any, idx: number) => (
            <div key={item.questionId} className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Question {idx + 1}</span>
                  <h3 className="text-lg font-bold text-white mt-1 leading-snug">{item.questionText}</h3>
                </div>
                <div className={`px-3 py-1.5 rounded-xl border text-sm font-bold shrink-0 ${item.score >= 7 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : item.score >= 5 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                  {item.score} / 10
                </div>
              </div>

              {/* Candidate Answer */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60">
                <span className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Your Submitted Answer</span>
                <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{item.answerText || '(No answer provided)'}</p>
              </div>

              {/* Feedback Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Strengths</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.strengths}</p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Missing Concepts</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.missingConcepts}</p>
                </div>
              </div>

              {/* Suggestions */}
              <div className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                  <Lightbulb className="w-4 h-4" />
                  <span>Suggestions for Improvement</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.suggestions}</p>
              </div>

              {/* Sample Improved Answer */}
              <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>Sample Ideal Answer</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.sampleAnswer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
