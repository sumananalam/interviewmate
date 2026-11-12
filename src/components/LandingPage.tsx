import React from 'react';
import { Sparkles, Brain, CheckCircle2, Award, Clock, ArrowRight, ShieldCheck, Cpu, BarChart3 } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/20 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation AI Mock Interviews</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
            Practice Smarter. <br />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
              Interview Better.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Master technical and HR interviews with AI-powered role-specific questions, instant multidimensional evaluation, and actionable feedback.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-base shadow-xl shadow-purple-600/25 hover:shadow-purple-600/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
            >
              <span>Start Practicing Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300 font-semibold text-base hover:bg-slate-800 hover:text-white transition-all"
            >
              Sign In to Account
            </button>
          </div>

          {/* Hero Visual Preview Card */}
          <div className="mt-16 max-w-5xl mx-auto rounded-3xl bg-slate-900/40 border border-slate-800/80 p-4 sm:p-8 backdrop-blur-2xl shadow-2xl relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/60">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-white font-semibold mb-2">Role-Tailored Questions</h3>
                <p className="text-sm text-slate-400">Java Developer, Frontend, Python, Full Stack, and Data Analyst questions tuned to your level.</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/60">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="text-white font-semibold mb-2">Gemini AI Evaluation</h3>
                <p className="text-sm text-slate-400">Detailed scoring across technical accuracy, clarity, and completeness with constructive suggestions.</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/60">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-white font-semibold mb-2">Performance Tracking</h3>
                <p className="text-sm text-slate-400">Monitor your interview history, average score improvements, and mastery areas over time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Everything you need to ace your next interview
            </h2>
            <p className="text-slate-400">
              Designed for students and professionals looking to build real interview confidence with zero fluff.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Instant AI Grading</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Get scores out of 10 instantly along with precise strengths, missing concepts, and ideal sample answers.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Timed Pressure Simulation</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Practice under realistic countdown timer constraints to build calmness and concise articulation under pressure.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Secure & Persistent</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                All interview sessions, answers, and evaluations are securely stored and retrievable anytime from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              How InterviewMate Works
            </h2>
            <p className="text-slate-400">
              Three simple steps to elevate your interview readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-600/20">
                1
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Select Target Role</h3>
              <p className="text-sm text-slate-400">Choose your desired job role, interview type (Technical or HR), and difficulty level.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-600/20">
                2
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Answer Questions</h3>
              <p className="text-sm text-slate-400">Respond to one question at a time within the countdown timer in an immersive distraction-free UI.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-600 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/20">
                3
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Review AI Feedback</h3>
              <p className="text-sm text-slate-400">Receive comprehensive scoring, breakdown of missing concepts, and sample improved answers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 text-center text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="font-semibold text-slate-300">InterviewMate</span>
          </div>
          <p>© {new Date().getFullYear()} InterviewMate AI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};
