// Fix: Add React import to resolve 'Cannot find namespace React' error.
import type React from 'react';

export type Screen = 'HOME' | 'BOOKS' | 'CHAPTERS' | 'QUIZ' | 'REPORT' | 'CELEBRATION';
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Classic';
export type GenieAction = 'idle' | 'talk' | 'correct' | 'incorrect' | 'skip' | 'celebrate' | 'thinking';

export interface GenieState {
    message: string;
    action: GenieAction;
}

export interface Subject {
  name: string;
  icon: React.FC<{ className?: string }>;
  color: string;
}

export interface Book {
  publication: string;
  title: string;
}

export interface Chapter {
    name: string;
}

export interface Question {
  question: string;
  options: { [key: string]: string };
  correctAnswer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizResult {
  question: Question;
  userAnswer: string | null; // null if skipped
  isCorrect: boolean;
}

export interface QuizScreenProps {
  subject: Subject;
  book: Book;
  chapter: Chapter;
  difficulty: Difficulty;
  onQuizComplete: (results: QuizResult[]) => void;
  setGenieState: (state: GenieState) => void;
}

export interface ReportData {
  summary: string;
  score: number;
  strengths: string[];
  improvementAreas: {
    question: string;
    userAnswer: string | null;
    correctAnswer: string;
    explanation: string;
  }[];
  reviewTopics: string[];
  topicAnalysis: {
      topic: string;
      performance: string;
      recommendation: string;
  }[];
}