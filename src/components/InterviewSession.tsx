import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Sparkles, Send } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  type: string;
}

interface InterviewSessionProps {
  sessionId: number;
  questions: Question[];
  onComplete: (evaluationData: any) => void;
  onCancel: () => void;
}

export const InterviewSession: React.FC<InterviewSessionProps> = ({ sessionId, questions, onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes per question
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto advance or stay at 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(180);
  }, [currentIndex]);

  const currentQ = questions[currentIndex];

  const handleAnswerChange = (text: string) => {
    setAnswers({
      ...answers,
      [currentQ.id]: text
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitInterview = async () => {
    if (!window.confirm('Are you sure you want to submit your interview for AI evaluation?')) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formattedAnswers = questions.map((q) => ({
        questionId: q.id,
        questionText: q.text,
        answerText: answers[q.id] || ''
      }));

      const res = await fetch(`/api/interviews/${sessionId}/submit-and-evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: formattedAnswers })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Evaluation failed');
      }

      onComplete(data);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (submitting) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 animate-pulse">
          <Sparkles className="w-10 h-10 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Gemini AI is Evaluating Your Answers...</h2>
        <p className="text-slate-400 max-w-md text-sm">
          Analyzing technical accuracy, clarity, conceptual completeness, and formulating constructive feedback. Please wait a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-6 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Top Progress & Timer Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-purple-400 mb-1">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>·</span>
              <span>{currentQ.type}</span>
            </div>
            <div className="w-48 sm:w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-mono font-bold ${timeLeft < 30 ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' : 'bg-slate-950/60 border-slate-800 text-slate-300'}`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium transition-colors"
            >
              Exit Interview
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Question Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-6 shadow-2xl">
          <div>
            <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold">Question Prompt</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-2 leading-relaxed">
              {currentQ.text}
            </h2>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-300">Your Answer / Explanation</label>
              <span className="text-xs text-slate-500">Be clear and structured</span>
            </div>
            <textarea
              rows={8}
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Type your detailed response here..."
              className="w-full p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-purple-500 transition-colors leading-relaxed"
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-3">
              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center gap-2"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitInterview}
                  className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Interview</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-600 py-4">
        InterviewMate Secure Proctoring System
      </div>
    </div>
  );
};
