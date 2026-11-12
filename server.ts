import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Database from 'better-sqlite3';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = path.join(process.cwd(), 'interviewmate.db');
const db = new Database(dbPath);

// Initialize Database Tables (MySQL schema equivalent)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    preferred_role TEXT DEFAULT 'Java Developer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS job_roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS interview_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_id INTEGER,
    type TEXT NOT NULL, -- Technical or HR
    difficulty TEXT NOT NULL, -- Beginner, Intermediate, Advanced
    question_text TEXT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES job_roles(id)
  );

  CREATE TABLE IF NOT EXISTS interview_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    role_id INTEGER,
    interview_type TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    total_questions INTEGER NOT NULL,
    score REAL DEFAULT 0,
    status TEXT DEFAULT 'IN_PROGRESS', -- IN_PROGRESS, COMPLETED
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES job_roles(id)
  );

  CREATE TABLE IF NOT EXISTS interview_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER,
    question_id INTEGER,
    question_text TEXT,
    answer_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id)
  );

  CREATE TABLE IF NOT EXISTS interview_feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER,
    question_id INTEGER,
    score REAL,
    strengths TEXT,
    missing_concepts TEXT,
    suggestions TEXT,
    sample_answer TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id)
  );
`);

// Seed default job roles if empty
const roleCount = db.prepare('SELECT COUNT(*) as count FROM job_roles').get() as { count: number };
if (roleCount.count === 0) {
  const insertRole = db.prepare('INSERT INTO job_roles (title, category, description) VALUES (?, ?, ?)');
  const roles = [
    ['Java Developer', 'Backend', 'Object-oriented programming, Spring Boot, microservices, concurrency, and JVM internals.'],
    ['Frontend Developer', 'Frontend', 'React.js, TypeScript, state management, CSS architecture, performance optimization.'],
    ['Python Developer', 'Backend & Data', 'Python syntax, Django/FastAPI, asynchronous programming, database integration, and scripting.'],
    ['Full Stack Developer', 'Full Stack', 'End-to-end web development, REST APIs, database design, frontend frameworks, and cloud deployment.'],
    ['Data Analyst', 'Data Science', 'SQL querying, data visualization, statistical analysis, Python (Pandas/NumPy), and business intelligence.']
  ];
  for (const r of roles) {
    insertRole.run(r[0], r[1], r[2]);
  }

  // Seed initial sample questions
  const insertQ = db.prepare('INSERT INTO interview_questions (role_id, type, difficulty, question_text) VALUES (?, ?, ?, ?)');
  const sampleQuestions = [
    // Java Developer
    [1, 'Technical', 'Intermediate', 'Explain the difference between HashMap and ConcurrentHashMap in Java. How does ConcurrentHashMap achieve thread safety?'],
    [1, 'Technical', 'Advanced', 'What are Java Memory Model (JMM) happens-before relationships and how do volatile variables work?'],
    [1, 'HR', 'Beginner', 'Tell me about a time when you had to debug a difficult production issue under tight deadlines.'],
    [1, 'Technical', 'Beginner', 'What is dependency injection in Spring Boot and what are its main advantages?'],
    [1, 'Technical', 'Intermediate', 'Explain the lifecycle of a Spring Bean and the role of BeanPostProcessor.'],
    
    // Frontend Developer
    [2, 'Technical', 'Intermediate', 'Explain how React fiber reconciler works and virtual DOM diffing mechanism.'],
    [2, 'Technical', 'Advanced', 'How do you optimize React application performance for a large data dashboard with frequent re-renders?'],
    [2, 'HR', 'Beginner', 'How do you handle disagreements with UX designers regarding implementation feasibility?'],
    [2, 'Technical', 'Beginner', 'What are React hooks rules and why do they exist?'],
    [2, 'Technical', 'Intermediate', 'Explain CSS Grid vs Flexbox and when to use each for responsive layouts.'],

    // Python Developer
    [3, 'Technical', 'Intermediate', 'How do Python generators work and what is the advantage of using yield over return?'],
    [3, 'Technical', 'Advanced', 'Explain the Global Interpreter Lock (GIL) in CPython and how multi-threading vs multi-processing bypasses it.'],
    [3, 'HR', 'Beginner', 'Describe a challenging python project you architected from scratch.'],
    [3, 'Technical', 'Beginner', 'What are Python decorators and how do you write a custom decorator with arguments?'],
    [3, 'Technical', 'Intermediate', 'Explain memory management and garbage collection mechanisms in Python (reference counting and cyclic GC).'],

    // Full Stack Developer
    [4, 'Technical', 'Intermediate', 'Design a scalable notification system architecture supporting WebSockets and push notifications.'],
    [4, 'Technical', 'Advanced', 'What are database indexing strategies and how do B-Tree and Hash indexes operate in relational databases?'],
    [4, 'HR', 'Beginner', 'How do you balance writing clean maintainable code with shipping fast to meet business goals?'],
    [4, 'Technical', 'Beginner', 'Explain RESTful API design best practices including idempotency and versioning.'],
    [4, 'Technical', 'Intermediate', 'How do you secure web applications against OWASP Top 10 vulnerabilities (e.g., SQL injection, XSS, CSRF)?'],

    // Data Analyst
    [5, 'Technical', 'Intermediate', 'Explain the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN with practical scenarios.'],
    [5, 'Technical', 'Advanced', 'How do you handle missing or corrupted data in a large dataset before performing statistical analysis?'],
    [5, 'HR', 'Beginner', 'Describe how you present complex technical data insights to non-technical stakeholders.'],
    [5, 'Technical', 'Beginner', 'What is customer lifetime value (LTV) and how do you calculate it using historical transactional data?'],
    [5, 'Technical', 'Intermediate', 'Explain A/B testing statistical significance, p-values, and Type I vs Type II errors.']
  ];

  for (const q of sampleQuestions) {
    insertQ.run(q[0], q[1], q[2], q[3]);
  }
}

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes

  // Auth: Register
  app.post('/api/auth/register', (req, res) => {
    try {
      const { name, email, password, preferredRole } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
      }

      const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      if (existing) {
        return res.status(400).json({ error: 'Email is already registered.' });
      }

      const role = preferredRole || 'Java Developer';
      const stmt = db.prepare('INSERT INTO users (name, email, password_hash, preferred_role) VALUES (?, ?, ?, ?)');
      const info = stmt.run(name, email, password, role);
      const user = db.prepare('SELECT id, name, email, preferred_role, created_at FROM users WHERE id = ?').get(info.lastInsertRowid);

      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const user = db.prepare('SELECT id, name, email, password_hash, preferred_role, created_at FROM users WHERE email = ?').get(email) as any;
      if (!user || user.password_hash !== password) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const { password_hash, ...userInfo } = user;
      res.json({ success: true, user: userInfo });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get user profile and stats
  app.get('/api/users/:userId/profile', (req, res) => {
    try {
      const userId = req.params.userId;
      const user = db.prepare('SELECT id, name, email, preferred_role, created_at FROM users WHERE id = ?').get(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const stats = (db.prepare(`
        SELECT 
          COUNT(*) as totalInterviews,
          COALESCE(AVG(score), 0) as avgScore
        FROM interview_sessions 
        WHERE user_id = ? AND status = 'COMPLETED'
      `).get(userId) || { totalInterviews: 0, avgScore: 0 }) as any;

      const questionsAttempted = db.prepare(`
        SELECT COUNT(DISTINCT a.id) as count
        FROM interview_answers a
        JOIN interview_sessions s ON a.session_id = s.id
        WHERE s.user_id = ?
      `).get(userId) as { count: number };

      res.json({
        user,
        stats: {
          totalInterviews: stats.totalInterviews || 0,
          avgScore: stats.avgScore || 0,
          questionsAttempted: questionsAttempted.count || 0
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update Profile
  app.put('/api/users/:userId/profile', (req, res) => {
    try {
      const userId = req.params.userId;
      const { name, preferredRole } = req.body;
      db.prepare('UPDATE users SET name = ?, preferred_role = ? WHERE id = ?').run(name, preferredRole, userId);
      const user = db.prepare('SELECT id, name, email, preferred_role, created_at FROM users WHERE id = ?').get(userId);
      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get Job Roles
  app.get('/api/job-roles', (req, res) => {
    try {
      const roles = db.prepare('SELECT * FROM job_roles').all();
      res.json(roles);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Start Interview Session
  app.post('/api/interviews/start', async (req, res) => {
    try {
      const { userId, roleId, interviewType, difficulty, questionCount } = req.body;
      const qCount = parseInt(questionCount) || 5;

      // Fetch questions from DB for this role & difficulty/type
      let questions = db.prepare(`
        SELECT * FROM interview_questions 
        WHERE role_id = ? AND (type = ? OR ? = 'Mixed') AND difficulty = ?
        ORDER BY RANDOM() LIMIT ?
      `).all(roleId, interviewType, interviewType, difficulty, qCount) as any[];

      // If not enough questions in DB, generate additional questions via Gemini API
      if (questions.length < qCount) {
        const roleInfo = db.prepare('SELECT title FROM job_roles WHERE id = ?').get(roleId) as { title: string };
        const roleTitle = roleInfo ? roleInfo.title : 'Software Engineer';
        const needed = qCount - questions.length;

        try {
          const prompt = `Generate ${needed} unique ${interviewType} mock interview questions for a ${roleTitle} role at ${difficulty} difficulty level. Return as a JSON array of strings.`;
          const aiRes = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            }
          });

          const generatedTexts = JSON.parse(aiRes.text || '[]');
          const insertGenQ = db.prepare('INSERT INTO interview_questions (role_id, type, difficulty, question_text) VALUES (?, ?, ?, ?)');
          
          for (const text of generatedTexts) {
            const info = insertGenQ.run(roleId, interviewType, difficulty, text);
            questions.push({
              id: info.lastInsertRowid,
              role_id: roleId,
              type: interviewType,
              difficulty,
              question_text: text
            });
          }
        } catch (aiErr) {
          console.error('Gemini question generation fallback error:', aiErr);
          // Fallback generic questions if AI call fails
          for (let i = 0; i < needed; i++) {
            const fallbackText = `Discuss a core architectural principle or challenge regarding ${roleTitle} in ${difficulty} scenarios (#${i + 1}).`;
            const info = db.prepare('INSERT INTO interview_questions (role_id, type, difficulty, question_text) VALUES (?, ?, ?, ?)').run(roleId, interviewType, difficulty, fallbackText);
            questions.push({
              id: info.lastInsertRowid,
              role_id: roleId,
              type: interviewType,
              difficulty,
              question_text: fallbackText
            });
          }
        }
      }

      // Create session
      const sessionStmt = db.prepare(`
        INSERT INTO interview_sessions (user_id, role_id, interview_type, difficulty, total_questions, status)
        VALUES (?, ?, ?, ?, ?, 'IN_PROGRESS')
      `);
      const sessionInfo = sessionStmt.run(userId, roleId, interviewType, difficulty, questions.length);
      const sessionId = sessionInfo.lastInsertRowid;

      res.json({
        sessionId,
        questions: questions.map(q => ({ id: q.id, text: q.question_text, type: q.type }))
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Submit Answer & Evaluate via Gemini AI
  app.post('/api/interviews/:sessionId/submit-and-evaluate', async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const { answers } = req.body; // Array of { questionId, questionText, answerText }

      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Answers array is required.' });
      }

      // Get session info for context
      const session = db.prepare(`
        SELECT s.*, jr.title as role_title 
        FROM interview_sessions s 
        JOIN job_roles jr ON s.role_id = jr.id 
        WHERE s.id = ?
      `).get(sessionId) as any;

      const clearAnswers = db.prepare('DELETE FROM interview_answers WHERE session_id = ?');
      const clearFeedback = db.prepare('DELETE FROM interview_feedback WHERE session_id = ?');
      clearAnswers.run(sessionId);
      clearFeedback.run(sessionId);

      const insertAnswer = db.prepare('INSERT INTO interview_answers (session_id, question_id, question_text, answer_text) VALUES (?, ?, ?, ?)');
      const insertFeedback = db.prepare('INSERT INTO interview_feedback (session_id, question_id, score, strengths, missing_concepts, suggestions, sample_answer) VALUES (?, ?, ?, ?, ?, ?, ?)');

      let totalScore = 0;
      const questionFeedbacks = [];

      for (const ans of answers) {
        insertAnswer.run(sessionId, ans.questionId, ans.questionText, ans.answerText || '');

        // Prompt Gemini to evaluate the answer
        const prompt = `
          You are an expert technical and HR interviewer for the role of ${session ? session.role_title : 'Software Engineer'}.
          Evaluate the candidate's answer to the following interview question.
          
          Question: "${ans.questionText}"
          Candidate's Answer: "${ans.answerText || '(No answer provided)'}"
          
          Provide a rigorous, constructive, and educational evaluation in JSON format containing:
          - score: number between 0 and 10 (decimal allowed)
          - strengths: string summarizing what the candidate did well
          - missingConcepts: string highlighting any technical or conceptual gaps
          - suggestions: string with constructive advice for improvement
          - sampleAnswer: string giving an ideal sample answer
        `;

        let evalResult = {
          score: 5.0,
          strengths: 'Provided a basic attempt at addressing the core question.',
          missingConcepts: 'Could elaborate more on architectural trade-offs and edge cases.',
          suggestions: 'Practice structuring answers using the STAR method or technical depth.',
          sampleAnswer: 'A comprehensive answer would detail specific mechanisms, best practices, and real-world application.'
        };

        try {
          const aiRes = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.NUMBER },
                  strengths: { type: Type.STRING },
                  missingConcepts: { type: Type.STRING },
                  suggestions: { type: Type.STRING },
                  sampleAnswer: { type: Type.STRING }
                },
                required: ['score', 'strengths', 'missingConcepts', 'suggestions', 'sampleAnswer']
              }
            }
          });

          if (aiRes.text) {
            const parsed = JSON.parse(aiRes.text);
            evalResult = {
              score: typeof parsed.score === 'number' ? Math.min(10, Math.max(0, parsed.score)) : 5.0,
              strengths: parsed.strengths || evalResult.strengths,
              missingConcepts: parsed.missingConcepts || evalResult.missingConcepts,
              suggestions: parsed.suggestions || evalResult.suggestions,
              sampleAnswer: parsed.sampleAnswer || evalResult.sampleAnswer
            };
          }
        } catch (evalErr) {
          console.error('Gemini evaluation API error:', evalErr);
        }

        totalScore += evalResult.score;
        insertFeedback.run(
          sessionId,
          ans.questionId,
          evalResult.score,
          evalResult.strengths,
          evalResult.missingConcepts,
          evalResult.suggestions,
          evalResult.sampleAnswer
        );

        questionFeedbacks.push({
          questionId: ans.questionId,
          questionText: ans.questionText,
          answerText: ans.answerText,
          ...evalResult
        });
      }

      const avgScore = answers.length > 0 ? Number((totalScore / answers.length).toFixed(1)) : 0;

      // Update session status to COMPLETED and set score
      db.prepare("UPDATE interview_sessions SET status = 'COMPLETED', score = ? WHERE id = ?").run(avgScore, sessionId);

      res.json({
        success: true,
        sessionId,
        overallScore: avgScore,
        feedbacks: questionFeedbacks
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get Interview History for a user
  app.get('/api/users/:userId/history', (req, res) => {
    try {
      const userId = req.params.userId;
      const history = db.prepare(`
        SELECT 
          s.id, s.interview_type, s.difficulty, s.total_questions, s.score, s.status, s.created_at,
          jr.title as role_title, jr.category as role_category
        FROM interview_sessions s
        JOIN job_roles jr ON s.role_id = jr.id
        WHERE s.user_id = ?
        ORDER BY s.created_at DESC
      `).all(userId);

      res.json(history);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get Session Detailed Results
  app.get('/api/interviews/:sessionId/results', (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const session = db.prepare(`
        SELECT 
          s.id, s.user_id, s.interview_type, s.difficulty, s.total_questions, s.score, s.status, s.created_at,
          jr.title as role_title, jr.category as role_category
        FROM interview_sessions s
        JOIN job_roles jr ON s.role_id = jr.id
        WHERE s.id = ?
      `).get(sessionId);

      if (!session) {
        return res.status(404).json({ error: 'Interview session not found.' });
      }

      const answers = db.prepare('SELECT * FROM interview_answers WHERE session_id = ?').all(sessionId);
      const feedbacks = db.prepare('SELECT * FROM interview_feedback WHERE session_id = ?').all(sessionId);

      // Combine answers and feedback
      const items = answers.map((ans: any) => {
        const fb: any = feedbacks.find((f: any) => f.question_id === ans.question_id) || {};
        return {
          questionId: ans.question_id,
          questionText: ans.question_text,
          answerText: ans.answer_text,
          score: fb.score || 0,
          strengths: fb.strengths || '',
          missingConcepts: fb.missing_concepts || '',
          suggestions: fb.suggestions || '',
          sampleAnswer: fb.sample_answer || ''
        };
      });

      res.json({
        session,
        items
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(3000, '0.0.0.0', () => {
    console.log('InterviewMate Server running on http://localhost:3000');
  });
}

startServer();
