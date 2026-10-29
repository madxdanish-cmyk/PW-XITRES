import {
  Subject,
  Deck,
  Flashcard,
  CornellNote,
  StudyTask,
  ExamCountdown,
  UserStats,
  QuizAttempt,
} from '../types';
import {
  INITIAL_SUBJECTS,
  INITIAL_DECKS,
  INITIAL_CARDS,
  INITIAL_CORNELL_NOTES,
  INITIAL_TASKS,
  INITIAL_EXAMS,
  INITIAL_STATS,
} from '../data/initialData';

const STORAGE_KEYS = {
  SUBJECTS: 'studyflow_subjects',
  DECKS: 'studyflow_decks',
  CARDS: 'studyflow_cards',
  NOTES: 'studyflow_notes',
  TASKS: 'studyflow_tasks',
  EXAMS: 'studyflow_exams',
  STATS: 'studyflow_stats',
  ATTEMPTS: 'studyflow_quiz_attempts',
};

export const storage = {
  getSubjects(): Subject[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return raw ? JSON.parse(raw) : INITIAL_SUBJECTS;
  },
  saveSubjects(subjects: Subject[]) {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  getDecks(): Deck[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DECKS);
    return raw ? JSON.parse(raw) : INITIAL_DECKS;
  },
  saveDecks(decks: Deck[]) {
    localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
  },

  getCards(): Flashcard[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CARDS);
    return raw ? JSON.parse(raw) : INITIAL_CARDS;
  },
  saveCards(cards: Flashcard[]) {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
  },

  getNotes(): CornellNote[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    return raw ? JSON.parse(raw) : INITIAL_CORNELL_NOTES;
  },
  saveNotes(notes: CornellNote[]) {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  getTasks(): StudyTask[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    return raw ? JSON.parse(raw) : INITIAL_TASKS;
  },
  saveTasks(tasks: StudyTask[]) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  getExams(): ExamCountdown[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EXAMS);
    return raw ? JSON.parse(raw) : INITIAL_EXAMS;
  },
  saveExams(exams: ExamCountdown[]) {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  },

  getStats(): UserStats {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    const stats: UserStats = raw ? JSON.parse(raw) : INITIAL_STATS;
    if (!stats.dailyGoalMinutes) {
      stats.dailyGoalMinutes = 90;
    }
    return stats;
  },
  saveStats(stats: UserStats) {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  },
  saveDailyGoal(minutes: number): UserStats {
    const stats = this.getStats();
    stats.dailyGoalMinutes = Math.max(5, minutes);
    this.saveStats(stats);
    return stats;
  },

  getQuizAttempts(): QuizAttempt[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    return raw ? JSON.parse(raw) : [];
  },
  saveQuizAttempts(attempts: QuizAttempt[]) {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
  },

  // Record a study session and update streak/heatmap
  recordStudyTime(minutes: number): UserStats {
    const stats = this.getStats();
    const today = new Date().toISOString().split('T')[0];

    // Update minutes today
    stats.studyDays[today] = (stats.studyDays[today] || 0) + minutes;
    stats.totalMinutes += minutes;

    // Check streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const studiedYesterday = Boolean(stats.studyDays[yesterdayStr]);
    const alreadyStudiedToday = (stats.studyDays[today] - minutes) > 0;

    if (!alreadyStudiedToday) {
      if (studiedYesterday) {
        stats.currentStreak += 1;
      } else {
        stats.currentStreak = 1;
      }
      if (stats.currentStreak > stats.bestStreak) {
        stats.bestStreak = stats.currentStreak;
      }
    }

    this.saveStats(stats);
    return stats;
  },

  // Increment cards reviewed
  incrementCardsReviewed(count: number = 1): UserStats {
    const stats = this.getStats();
    stats.totalCardsReviewed += count;
    this.saveStats(stats);
    return stats;
  },

  // Increment quizzes completed
  incrementQuizzesCompleted(): UserStats {
    const stats = this.getStats();
    stats.totalQuizzesCompleted += 1;
    this.saveStats(stats);
    return stats;
  },

  // Export full backup
  exportFullData(): string {
    const backup = {
      subjects: this.getSubjects(),
      decks: this.getDecks(),
      cards: this.getCards(),
      notes: this.getNotes(),
      tasks: this.getTasks(),
      exams: this.getExams(),
      stats: this.getStats(),
      attempts: this.getQuizAttempts(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  },

  // Import full backup
  importFullData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.subjects) this.saveSubjects(data.subjects);
      if (data.decks) this.saveDecks(data.decks);
      if (data.cards) this.saveCards(data.cards);
      if (data.notes) this.saveNotes(data.notes);
      if (data.tasks) this.saveTasks(data.tasks);
      if (data.exams) this.saveExams(data.exams);
      if (data.stats) this.saveStats(data.stats);
      if (data.attempts) this.saveQuizAttempts(data.attempts);
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  },
};
