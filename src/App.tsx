import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { MessageCircle, MoreVertical } from 'lucide-react';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { FocusTimerView } from './components/FocusTimerView';
import { FlashcardsView } from './components/FlashcardsView';
import { CornellNotesView } from './components/CornellNotesView';
import { QuizView } from './components/QuizView';
import { PlannerView } from './components/PlannerView';
import { AITutorView } from './components/AITutorView';
import { MobileNavDrawer } from './components/MobileNavDrawer';
import { AmbientSoundModal } from './components/AmbientSoundModal';
import { FeynmanModal } from './components/FeynmanModal';
import { StarryBackground } from './components/StarryBackground';
import { WhatsAppContactModal } from './components/WhatsAppContactModal';
import { PhoneLoginModal, AuthUser } from './components/PhoneLoginModal';
import { storage } from './utils/storage';
import { audioSynth } from './services/audioSynth';
import { translations, Language } from './utils/translations';
import {
  Subject,
  Deck,
  Flashcard,
  CornellNote,
  StudyTask,
  ExamCountdown,
  UserStats,
  FeynmanExplanation,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Application Language State (English / Hindi for 11th & 12th)
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return (localStorage.getItem('xitres_language') as Language) || 'en';
    } catch {
      return 'en';
    }
  });

  const handleToggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'en' ? 'hi' : 'en';
      try {
        localStorage.setItem('xitres_language', next);
      } catch {}
      return next;
    });
  };

  // Application Persistent Data
  const [subjects, setSubjects] = useState<Subject[]>(() => storage.getSubjects());
  const [decks, setDecks] = useState<Deck[]>(() => storage.getDecks());
  const [cards, setCards] = useState<Flashcard[]>(() => storage.getCards());
  const [notes, setNotes] = useState<CornellNote[]>(() => storage.getNotes());
  const [tasks, setTasks] = useState<StudyTask[]>(() => storage.getTasks());
  const [exams, setExams] = useState<ExamCountdown[]>(() => storage.getExams());
  const [stats, setStats] = useState<UserStats>(() => storage.getStats());

  // Current Logged-in Phone User
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem('xitres_auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Global Pomodoro Timer State
  const [timerMode, setTimerMode] = useState<'work' | 'short_break' | 'long_break'>('work');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [sessionDuration, setSessionDuration] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  // Modals state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  const [isFeynmanModalOpen, setIsFeynmanModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [feynmanPreloadConcept, setFeynmanPreloadConcept] = useState('');

  // Cross-module Quiz generator preloads
  const [quizInitialTopic, setQuizInitialTopic] = useState('');
  const [quizInitialNotes, setQuizInitialNotes] = useState('');

  const handlePracticeQuizFromNotes = (topic: string, noteContent: string) => {
    setQuizInitialTopic(topic);
    setQuizInitialNotes(noteContent);
    setActiveTab('quizzes');
  };

  // Hidden file input for import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global Pomodoro Countdown Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer expired
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerMode, selectedTaskId, sessionDuration]);

  const handleTimerComplete = () => {
    setIsTimerRunning(false);

    if (timerMode === 'work') {
      audioSynth.playSessionChime('work_finish');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Record actual duration of focused study
      const studyMinutes = Math.max(1, Math.round(sessionDuration / 60));
      const updatedStats = storage.recordStudyTime(studyMinutes);
      setStats({ ...updatedStats });

      // If tied to a task, increment completedPomodoros
      if (selectedTaskId) {
        setTasks((prev) => {
          const updated = prev.map((t) =>
            t.id === selectedTaskId
              ? {
                  ...t,
                  completedPomodoros:
                    t.completedPomodoros + Math.max(1, Math.round(studyMinutes / 25)),
                  status:
                    t.completedPomodoros + 1 >= t.estPomodoros ? 'done' : t.status,
                }
              : t
          );
          storage.saveTasks(updated);
          return updated;
        });
      }

      // Transition to break
      setTimerMode('short_break');
      setTimeLeft(5 * 60);
    } else {
      audioSynth.playSessionChime('break_finish');
      setTimerMode('work');
      setTimeLeft(sessionDuration);
    }
  };

  // State update helpers with storage sync
  const handleSaveCards = (newCards: Flashcard[]) => {
    setCards(newCards);
    storage.saveCards(newCards);
  };

  const handleSaveDecks = (newDecks: Deck[]) => {
    setDecks(newDecks);
    storage.saveDecks(newDecks);
  };

  const handleSaveNotes = (newNotes: CornellNote[]) => {
    setNotes(newNotes);
    storage.saveNotes(newNotes);
  };

  const handleSaveTasks = (newTasks: StudyTask[]) => {
    setTasks(newTasks);
    storage.saveTasks(newTasks);
  };

  const handleSaveExams = (newExams: ExamCountdown[]) => {
    setExams(newExams);
    storage.saveExams(newExams);
  };

  const handleRecordStudyTime = (minutes: number) => {
    const updatedStats = storage.recordStudyTime(minutes);
    setStats({ ...updatedStats });
  };

  const handleIncrementCardsReviewed = (count: number = 1) => {
    const updatedStats = storage.incrementCardsReviewed(count);
    setStats({ ...updatedStats });
  };

  const handleIncrementQuizzesCompleted = () => {
    const updatedStats = storage.incrementQuizzesCompleted();
    setStats({ ...updatedStats });
  };

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) =>
      t.id === taskId
        ? { ...t, status: (t.status === 'done' ? 'todo' : 'done') as any }
        : t
    );
    handleSaveTasks(updated);
  };

  const handleUpdateDailyGoal = (minutes: number) => {
    const updatedStats = storage.saveDailyGoal(minutes);
    setStats({ ...updatedStats });
  };

  const handleStartFocus = () => {
    setActiveTab('timer');
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }
  };

  const handleStartPomodoroForTask = (task: StudyTask) => {
    setSelectedTaskId(task.id);
    setActiveTab('timer');
    setTimerMode('work');
    setTimeLeft(25 * 60);
    setIsTimerRunning(true);
  };

  // Auth Handlers
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem('xitres_auth_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('xitres_auth_user');
  };

  // Cross-module actions
  const handleOpenFeynmanWithConcept = (concept: string) => {
    setFeynmanPreloadConcept(concept);
    setIsFeynmanModalOpen(true);
  };

  const handleSaveFeynmanAsCard = (exp: FeynmanExplanation) => {
    const today = new Date().toISOString().split('T')[0];
    const targetDeck = decks[0];
    if (!targetDeck) return;

    const newCard: Flashcard = {
      id: `card_feyn_${Date.now()}`,
      deckId: targetDeck.id,
      front: `Explain the core intuition and mechanism of "${exp.concept}".`,
      back: `**Summary:** ${exp.simpleSummary}\n\n**Analogy:** ${exp.analogy}\n\n**Key Steps:**\n${exp.keySteps.join('\n')}`,
      hint: exp.mnemonic || exp.analogy.slice(0, 40),
      tag: 'Feynman',
      intervalDays: 1,
      easeFactor: 2.5,
      repetitions: 0,
      nextReviewDate: today,
      status: 'new',
    };

    handleSaveCards([newCard, ...cards]);
    setActiveTab('flashcards');
  };

  // Export / Import
  const handleExportData = () => {
    const jsonStr = storage.exportFullData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `XITRES_MIND_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && storage.importFullData(content)) {
        setSubjects(storage.getSubjects());
        setDecks(storage.getDecks());
        setCards(storage.getCards());
        setNotes(storage.getNotes());
        setTasks(storage.getTasks());
        setExams(storage.getExams());
        setStats(storage.getStats());
        alert('XITRES MIND workspace restored successfully!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Due cards count
  const todayStr = new Date().toISOString().split('T')[0];
  const dueCardsCount = cards.filter((c) => c.nextReviewDate <= todayStr).length;

  const timerMinutes = Math.floor(timeLeft / 60);
  const timerSeconds = timeLeft % 60;

  const t = translations[language];

  const tabTitles: Record<ActiveTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: language === 'hi' ? 'XITRES MIND • होम' : 'XITRES MIND • Dashboard',
      subtitle: t.tabSubtitles.dashboard,
    },
    timer: {
      title: t.tabs.timer,
      subtitle: t.tabSubtitles.timer,
    },
    flashcards: {
      title: t.tabs.flashcards,
      subtitle: t.tabSubtitles.flashcards,
    },
    notes: {
      title: t.tabs.notes,
      subtitle: t.tabSubtitles.notes,
    },
    quizzes: {
      title: t.tabs.quizzes,
      subtitle: t.tabSubtitles.quizzes,
    },
    planner: {
      title: t.tabs.planner,
      subtitle: t.tabSubtitles.planner,
    },
    tutor: {
      title: t.tabs.tutor,
      subtitle: t.tabSubtitles.tutor,
    },
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col md:flex-row antialiased font-outfit relative selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden">
      {/* Soft Black Background with Flying Cosmic Stars & Meteors */}
      <StarryBackground />

      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Persistent Left Sidebar for Desktop (md+) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isTimerRunning={isTimerRunning}
        timerMinutes={timerMinutes}
        timerSeconds={timerSeconds}
        dueCardsCount={dueCardsCount}
        currentStreak={stats.currentStreak}
        onOpenSoundModal={() => setIsSoundModalOpen(true)}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        currentUser={currentUser}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden relative z-10 w-full">
        {/* Top Header */}
        <Header
          title={tabTitles[activeTab].title}
          subtitle={tabTitles[activeTab].subtitle}
          onStartFocus={handleStartFocus}
          onOpenFeynman={() => setIsFeynmanModalOpen(true)}
          onOpenSoundModal={() => setIsSoundModalOpen(true)}
          onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          currentUser={currentUser}
          isTimerRunning={isTimerRunning}
          timerMinutes={timerMinutes}
          timerSeconds={timerSeconds}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          setActiveTab={setActiveTab}
          onExportData={handleExportData}
          onImportData={handleImportData}
        />

        {/* Dynamic Tab Body */}
        <main className="flex-1 pb-24 md:pb-20 overflow-x-hidden w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              subjects={subjects}
              decks={decks}
              cards={cards}
              notes={notes}
              tasks={tasks}
              exams={exams}
              setActiveTab={setActiveTab}
              onStartFocus={handleStartFocus}
              onOpenFeynman={() => setIsFeynmanModalOpen(true)}
              onToggleTask={handleToggleTask}
              onUpdateDailyGoal={handleUpdateDailyGoal}
              onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'timer' && (
            <FocusTimerView
              tasks={tasks}
              onTaskCompletedPomodoro={(taskId) => {
                setTasks((prev) =>
                  prev.map((t) =>
                    t.id === taskId
                      ? { ...t, completedPomodoros: t.completedPomodoros + 1 }
                      : t
                  )
                );
              }}
              onRecordStudyTime={handleRecordStudyTime}
              mode={timerMode}
              setMode={setTimerMode}
              timeLeft={timeLeft}
              setTimeLeft={setTimeLeft}
              isRunning={isTimerRunning}
              setIsRunning={setIsTimerRunning}
              selectedTaskId={selectedTaskId}
              setSelectedTaskId={setSelectedTaskId}
              sessionDuration={sessionDuration}
              setSessionDuration={setSessionDuration}
              language={language}
            />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardsView
              decks={decks}
              cards={cards}
              subjects={subjects}
              onSaveCards={handleSaveCards}
              onSaveDecks={handleSaveDecks}
              onRecordStudyTime={handleRecordStudyTime}
              onIncrementCardsReviewed={handleIncrementCardsReviewed}
            />
          )}

          {activeTab === 'notes' && (
            <CornellNotesView
              notes={notes}
              subjects={subjects}
              onSaveNotes={handleSaveNotes}
              onRecordStudyTime={handleRecordStudyTime}
              onPracticeQuiz={handlePracticeQuizFromNotes}
              onOpenFeynman={handleOpenFeynmanWithConcept}
            />
          )}

          {activeTab === 'quizzes' && (
            <QuizView
              subjects={subjects}
              cards={cards}
              onRecordStudyTime={handleRecordStudyTime}
              onIncrementQuizzesCompleted={handleIncrementQuizzesCompleted}
              initialTopic={quizInitialTopic}
              initialNotes={quizInitialNotes}
            />
          )}

          {activeTab === 'planner' && (
            <PlannerView
              tasks={tasks}
              exams={exams}
              subjects={subjects}
              onSaveTasks={handleSaveTasks}
              onSaveExams={handleSaveExams}
              onStartPomodoroForTask={handleStartPomodoroForTask}
            />
          )}

          {activeTab === 'tutor' && (
            <AITutorView
              subjects={subjects}
            />
          )}
        </main>
      </div>

      {/* Fixed Top-Right ⋮ Menu Button on Mobile (320–480px, up to md) */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-2.5 right-2.5 z-40 md:hidden w-11 h-11 rounded-2xl bg-slate-900/95 border border-amber-500/40 text-amber-300 shadow-2xl shadow-black/80 backdrop-blur-md flex items-center justify-center hover:bg-slate-800 active:scale-95 transition"
        aria-label="Open Navigation Menu"
        title="Open Navigation Menu"
      >
        <MoreVertical className="w-5 h-5 text-amber-300" />
        {isTimerRunning && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        )}
      </button>

      {/* Scrollable Mobile Navigation Drawer with Backdrop & Escape/Outside Tap handling */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isTimerRunning={isTimerRunning}
        timerMinutes={timerMinutes}
        timerSeconds={timerSeconds}
        dueCardsCount={dueCardsCount}
        currentStreak={stats.currentStreak}
        onOpenSoundModal={() => setIsSoundModalOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenFeynman={() => setIsFeynmanModalOpen(true)}
        onExportData={handleExportData}
        onImportData={handleImportData}
        currentUser={currentUser}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <button
        onClick={() => setIsWhatsAppModalOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-2xl shadow-emerald-500/40 border border-emerald-300/40 transition transform hover:scale-105 active:scale-95 group"
        title="Chat with @xitres_maker on WhatsApp"
      >
        <div className="relative">
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-200 rounded-full animate-ping" />
        </div>
        <span className="font-extrabold tracking-wide hidden xs:inline">Chat @xitres_maker</span>
      </button>

      {/* WhatsApp Contact Modal */}
      <WhatsAppContactModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />

      {/* Phone Number & OTP Login Modal */}
      <PhoneLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      {/* Global Ambient Audio Synthesizer Modal */}
      <AmbientSoundModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
      />

      {/* Global Feynman Explainer Modal */}
      <FeynmanModal
        isOpen={isFeynmanModalOpen}
        onClose={() => setIsFeynmanModalOpen(false)}
        onSaveAsCard={handleSaveFeynmanAsCard}
      />
    </div>
  );
}
