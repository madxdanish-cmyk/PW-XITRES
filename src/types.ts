export type SubjectColor = 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'teal' | 'orange';

export interface Subject {
  id: string;
  name: string;
  color: SubjectColor;
  iconName: string;
}

export type CardStatus = 'new' | 'learning' | 'review' | 'mastered';

export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  hint?: string;
  tag?: string;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  nextReviewDate: string; // ISO string YYYY-MM-DD
  lastReviewedDate?: string;
  status: CardStatus;
}

export interface Deck {
  id: string;
  title: string;
  subjectId: string;
  description: string;
  createdAt: string;
}

export interface CornellNote {
  id: string;
  title: string;
  subjectId: string;
  cues: string[]; // Cue questions / keywords in left column
  content: string; // Main notes in right column
  summary: string; // Bottom summary
  tags: string[];
  lastUpdated: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subjectId: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  subjectId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  mistakes: {
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    explanation: string;
  }[];
}

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface StudyTask {
  id: string;
  title: string;
  subjectId: string;
  priority: TaskPriority;
  status: TaskStatus;
  estPomodoros: number;
  completedPomodoros: number;
  dueDate?: string;
}

export interface ExamCountdown {
  id: string;
  title: string;
  subjectId: string;
  examDate: string; // YYYY-MM-DD
  targetGrade?: string;
  weightPercentage?: number;
  keyTopics?: string;
}

export interface StudySessionLog {
  id: string;
  date: string; // YYYY-MM-DD
  minutes: number;
  mode: 'pomodoro' | 'flashcards' | 'quiz' | 'notes';
  subjectId?: string;
  taskId?: string;
}

export interface UserStats {
  currentStreak: number;
  bestStreak: number;
  totalMinutes: number;
  totalCardsReviewed: number;
  totalQuizzesCompleted: number;
  studyDays: Record<string, number>; // dateString -> minutes
  dailyGoalMinutes?: number;
}

export interface FeynmanExplanation {
  concept: string;
  simpleSummary: string;
  analogy: string;
  keySteps: string[];
  mnemonic?: string;
  checkQuestion: string;
}
