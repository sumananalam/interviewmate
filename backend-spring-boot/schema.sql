-- MySQL Database Schema for InterviewMate

CREATE DATABASE IF NOT EXISTS interviewmate_db;
USE interviewmate_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    preferred_role VARCHAR(100) DEFAULT 'Java Developer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS interview_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT,
    type VARCHAR(50) NOT NULL, -- Technical or HR
    difficulty VARCHAR(50) NOT NULL, -- Beginner, Intermediate, Advanced
    question_text TEXT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES job_roles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS interview_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    role_id INT,
    interview_type VARCHAR(50) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    total_questions INT NOT NULL,
    score DECIMAL(4,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES job_roles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS interview_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT,
    question_id INT,
    question_text TEXT,
    answer_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS interview_feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT,
    question_id INT,
    score DECIMAL(4,2),
    strengths TEXT,
    missing_concepts TEXT,
    suggestions TEXT,
    sample_answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
);
