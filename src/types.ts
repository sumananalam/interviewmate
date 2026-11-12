export interface User {
  id: number;
  name: string;
  email: string;
  preferred_role: string;
  created_at: string;
}

export interface JobRole {
  id: number;
  title: string;
  category: string;
  description: string;
}

export interface InterviewSession {
  id: number;
  user_id: number;
  role_id: number;
  interview_type: string;
  difficulty: string;
  total_questions: number;
  score: number;
  status: string;
  created_at: string;
  role_title?: string;
  role_category?: string;
}

export interface QuestionFeedback {
  questionId: number;
  questionText: string;
  answerText: string;
  score: number;
  strengths: string;
  missingConcepts: string;
  suggestions: string;
  sampleAnswer: string;
}

export interface UserStats {
  totalInterviews: number;
  avgScore: number;
  questionsAttempted: number;
}
