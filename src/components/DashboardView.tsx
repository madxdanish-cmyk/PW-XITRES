import React, { useState, useEffect } from 'react';
import {
  Flame,
  Clock,
  Layers,
  GraduationCap,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Trophy,
  BookOpen,
  Timer,
  Lightbulb,
  Target,
  Sliders,
  Edit2,
  Check,
  TrendingUp,
  MessageCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActiveTab } from './Sidebar';
import { AuthUser } from './PhoneLoginModal';
import {
  Subject,
  Deck,
  Flashcard,
  CornellNote,
  StudyTask,
  ExamCountdown,
  UserStats,
} from '../types';

interface DashboardViewProps {
  stats: UserStats;
  subjects: Subject[];
  decks: Deck[];
  cards: Flashcard[];
  notes: CornellNote[];
  tasks: StudyTask[];
  exams: ExamCountdown[];
  setActiveTab: (tab: ActiveTab) => void;
  onStartFocus: () => void;
  onOpenFeynman: () => void;
  onToggleTask: (taskId: string) => void;
  onUpdateDailyGoal: (minutes: number) => void;
  onOpenWhatsApp?: () => void;
  currentUser?: AuthUser | null;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  subjects,
  decks,
  cards,
  notes,
  tasks,
  exams,
  setActiveTab,
  onStartFocus,
  onOpenFeynman,
  onToggleTask,
  onUpdateDailyGoal,
  onOpenWhatsApp,
  currentUser,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const minutesToday = stats.studyDays[today] || 0;
  const dailyGoalMinutes = stats.dailyGoalMinutes || 90;

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState<number>(dailyGoalMinutes);

  useEffect(() => {
    setGoalInput(stats.dailyGoalMinutes || 90);
  }, [stats.dailyGoalMinutes]);

  const rawPercent = Math.round((minutesToday / dailyGoalMinutes) * 100);
  const progressPercent = Math.min(100, rawPercent);
  const isGoalReached = minutesToday >= dailyGoalMinutes;
  const remainingMinutes = Math.max(0, dailyGoalMinutes - minutesToday);

  const handleSaveGoal = (targetMinutes?: number) => {
    const target = targetMinutes !== undefined ? targetMinutes : goalInput;
    if (target && target >= 5 && target <= 600) {
      onUpdateDailyGoal(target);
      setIsEditingGoal(false);
      if (minutesToday >= target) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  // Count due cards
  const dueCards = cards.filter((c) => c.nextReviewDate <= today);

  // Find nearest exam
  const sortedExams = [...exams].sort(
    (a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
  );
  const nearestExam = sortedExams[0];

  const getDaysUntil = (dateStr: string) => {
    const target = new Date(dateStr).getTime();
    const curr = new Date(today).getTime();
    const diff = Math.ceil((target - curr) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Generate 30-day heatmap grid
  const last30Days: { dateStr: string; minutes: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    last30Days.push({
      dateStr,
      minutes: stats.studyDays[dateStr] || 0,
    });
  }

  const getHeatmapColor = (minutes: number) => {
    if (minutes === 0) return 'bg-slate-800/40 border-slate-800';
    if (minutes < 30) return 'bg-emerald-950 border-emerald-800/40 text-emerald-300';
    if (minutes < 60) return 'bg-emerald-800/70 border-emerald-700/50 text-emerald-200';
    if (minutes < 90) return 'bg-emerald-600 border-emerald-500/60 text-emerald-100';
    return 'bg-emerald-500 border-emerald-400 text-white font-bold';
  };

  // Badges system
  const badges = [
    {
      id: 'streak_master',
      title: 'Streak Titan',
      desc: 'Maintain a 5+ day study streak',
      unlocked: stats.currentStreak >= 5,
      icon: Flame,
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 'focus_hound',
      title: 'Centurion Mind',
      desc: 'Accumulate 20+ hours of focused study',
      unlocked: stats.totalMinutes >= 1200,
      icon: Clock,
      color: 'from-indigo-500 to-sky-500',
    },
    {
      id: 'recall_expert',
      title: 'Active Recall Master',
      desc: 'Review 100+ spaced repetition cards',
      unlocked: stats.totalCardsReviewed >= 100,
      icon: Layers,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      id: 'quiz_crusher',
      title: 'Test Champion',
      desc: 'Complete 10+ active recall quizzes',
      unlocked: stats.totalQuizzesCompleted >= 10,
      icon: GraduationCap,
      color: 'from-violet-500 to-purple-500',
    },
  ];

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-300 overflow-x-hidden">
      {/* XITRES MIND Hero Banner with App Image */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 p-4 sm:p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            <img
              src="/logo.png"
              alt="XITRES MIND Emblem"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl object-cover ring-2 ring-amber-400/50 shadow-2xl shadow-amber-500/25 shrink-0"
            />
            <div className="space-y-1.5 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 sm:py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-cinzel tracking-wider">XITRES ACADEMY SUITE</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-2 sm:gap-3 truncate">
                <span className="font-cinzel gold-gradient-text truncate">XITRES MIND</span>
              </h2>
              <p className="text-amber-200/90 text-xs sm:text-sm font-semibold tracking-wide">
                Learn Smart. Rise Higher.
              </p>
              <p className="text-slate-400 text-xs max-w-xl">
                {currentUser
                  ? `Welcome back, ${currentUser.name}! Your cognitive study environment is active and synced.`
                  : `"Effortful retrieval produces durable learning. What feels difficult now is neural encoding in progress."`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0 pt-2 sm:pt-0">
            {onOpenWhatsApp && (
              <button
                onClick={onOpenWhatsApp}
                className="flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition shadow-lg shadow-emerald-500/10 group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20 group-hover:scale-110 transition-transform" />
                <span>Contact @xitres_maker</span>
              </button>
            )}
            <button
              onClick={onStartFocus}
              className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition transform hover:-translate-y-0.5"
            >
              <Timer className="w-4 h-4 text-slate-950" />
              <span>Start 25m Focus</span>
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className="flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-xs transition"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Review ({dueCards.length})</span>
            </button>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Daily Study Goal Tracker Banner */}
      <div
        className={`p-4 sm:p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden shadow-xl ${
          isGoalReached
            ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/30 border-emerald-500/40'
            : 'bg-gradient-to-r from-indigo-950/30 via-slate-900 to-slate-900/90 border-indigo-500/30'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left goal info */}
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isGoalReached
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-indigo-500/20 text-indigo-400'
                }`}
              >
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Daily Study Goal
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isGoalReached
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  {isGoalReached ? '🎉 GOAL CRUSHED' : `${progressPercent}% COMPLETED`}
                </span>
              </h3>
            </div>

            <p className="text-xs text-slate-300">
              {isGoalReached
                ? `Incredible focus! You hit your ${dailyGoalMinutes} min target and completed ${minutesToday} minutes of deep study today.`
                : `${remainingMinutes} minutes of recorded study needed to hit your ${dailyGoalMinutes} min target for today.`}
            </p>
          </div>

          {/* Right stats & action controls */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="text-2xl font-black text-white tabular-nums">
                  {minutesToday}
                </span>
                <span className="text-xs text-slate-400">/ {dailyGoalMinutes} min</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                {rawPercent}% of daily target
              </div>
            </div>

            <button
              onClick={() => setIsEditingGoal(!isEditingGoal)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              title="Change your daily minute goal"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isEditingGoal ? 'Close' : 'Adjust Goal'}</span>
            </button>

            <button
              onClick={onStartFocus}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Focus (+25m)</span>
            </button>
          </div>
        </div>

        {/* Progress Bar with Milestones */}
        <div className="mt-5 space-y-2">
          <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-full h-4 p-0.5 overflow-hidden shadow-inner relative">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out relative ${
                isGoalReached
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 shadow-lg shadow-emerald-500/40'
                  : 'bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-400'
              }`}
              style={{ width: `${Math.max(2, progressPercent)}%` }}
            >
              {progressPercent > 12 && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-950 leading-none">
                  {progressPercent}%
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
            <span>0m (Start)</span>
            <span>{Math.round(dailyGoalMinutes * 0.25)}m (25%)</span>
            <span>{Math.round(dailyGoalMinutes * 0.5)}m (50%)</span>
            <span>{Math.round(dailyGoalMinutes * 0.75)}m (75%)</span>
            <span className={isGoalReached ? 'text-emerald-400 font-bold' : ''}>
              {dailyGoalMinutes}m (100% Target)
            </span>
          </div>
        </div>

        {/* Interactive Goal Setting Drawer */}
        {isEditingGoal && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                Select or Customize Your Daily Study Target:
              </span>

              <div className="flex items-center gap-1.5 flex-wrap">
                {[30, 45, 60, 90, 120, 150, 180].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setGoalInput(preset);
                      handleSaveGoal(preset);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                      dailyGoalMinutes === preset
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {preset}m
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
                <span className="text-xs text-slate-400">Custom minutes:</span>
                <input
                  type="number"
                  min={10}
                  max={480}
                  step={5}
                  value={goalInput}
                  onChange={(e) => setGoalInput(Math.max(5, Number(e.target.value)))}
                  className="w-20 bg-transparent text-sm font-bold text-white focus:outline-none text-center"
                />
                <span className="text-xs text-slate-400">min/day</span>
              </div>

              <button
                onClick={() => handleSaveGoal(goalInput)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm"
              >
                Save New Goal
              </button>

              <button
                onClick={() => setIsEditingGoal(false)}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Study Time */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Study Time Today
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsEditingGoal(!isEditingGoal)}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 hover:bg-indigo-600 hover:text-white transition"
                title="Adjust daily minute goal"
              >
                Adjust
              </button>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{minutesToday}</span>
            <span className="text-xs text-slate-400">/ {dailyGoalMinutes} min goal</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isGoalReached ? 'bg-emerald-400' : 'bg-indigo-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{progressPercent}% completed</span>
            {isGoalReached ? (
              <span className="text-emerald-400 font-semibold">Goal Reached ✓</span>
            ) : (
              <span>{remainingMinutes}m left</span>
            )}
          </div>
        </div>

        {/* Due Flashcards */}
        <div
          onClick={() => setActiveTab('flashcards')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Cards Due for SRS
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{dueCards.length}</span>
            <span className="text-xs text-amber-400 font-medium">cards to review</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
            <span>{cards.length} total cards in {decks.length} decks</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Study Streak */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-orange-500/30 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Streak
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-orange-400 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{stats.currentStreak}</span>
            <span className="text-xs text-orange-400 font-medium">days in a row</span>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Personal Best: <strong className="text-slate-200">{stats.bestStreak} days</strong>
          </div>
        </div>

        {/* Next Exam Countdown */}
        <div
          onClick={() => setActiveTab('planner')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-rose-500/30 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Upcoming Exam
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            {nearestExam ? (
              <>
                <span className="text-2xl font-black text-white">
                  {getDaysUntil(nearestExam.examDate)}
                </span>
                <span className="text-xs text-rose-400 font-medium">days left</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-slate-400">No exams set</span>
            )}
          </div>
          <div className="mt-3 text-xs text-slate-400 truncate flex items-center justify-between">
            <span className="truncate">{nearestExam?.title || 'Add exam in planner'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Grid: Heatmap & Quick Action Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 30-Day Activity Heatmap & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Heatmap Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>30-Day Study Consistency Matrix</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Daily retrieval and focus sessions over the last month
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-800/60" />
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-950" />
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-700" />
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span>More</span>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
              {last30Days.map((day) => {
                const dayLabel = new Date(day.dateStr).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                return (
                  <div
                    key={day.dateStr}
                    title={`${dayLabel}: ${day.minutes} mins studied`}
                    className={`h-11 rounded-lg border p-1 flex flex-col justify-between transition-all hover:scale-105 cursor-pointer ${getHeatmapColor(
                      day.minutes
                    )}`}
                  >
                    <span className="text-[9px] opacity-70 leading-none">
                      {day.dateStr.split('-')[2]}
                    </span>
                    <span className="text-[10px] font-bold text-right leading-none">
                      {day.minutes > 0 ? `${day.minutes}m` : '-'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
              <span>Total Lifetime Study Time: <strong className="text-slate-200">{(stats.totalMinutes / 60).toFixed(1)} hours</strong></span>
              <span>Cards Mastered: <strong className="text-emerald-400">{cards.filter(c => c.status === 'mastered').length}</strong></span>
            </div>
          </div>

          {/* Quick Hub Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('quizzes')}
              className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-left transition group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                Active Recall Quiz
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Generate or take tests to evaluate genuine comprehension.
              </p>
            </button>

            <button
              onClick={() => setActiveTab('tutor')}
              className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-left transition group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                Aura • AI Academic Coach
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Concept breakdowns, mnemonics, and custom study guidance.
              </p>
            </button>

            <button
              onClick={onOpenFeynman}
              className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-violet-950/40 border border-slate-800 hover:border-violet-500/40 text-left transition group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-violet-300 transition-colors">
                Feynman Explainer
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Turn confusing formulas and terms into vivid analogies.
              </p>
            </button>
          </div>
        </div>

        {/* Right Col: Priority Study Tasks & Badges */}
        <div className="space-y-6">
          {/* Priority Tasks */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Today's Action Items</h3>
                <p className="text-xs text-slate-400">Pomodoros linked to tasks</p>
              </div>
              <button
                onClick={() => setActiveTab('planner')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 4).map((task) => {
                const isDone = task.status === 'done';
                return (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className={`p-3 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                      isDone
                        ? 'bg-slate-950/30 border-slate-800/60 opacity-60'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <button className="mt-0.5 text-slate-400 hover:text-emerald-400">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 hover:border-emerald-400" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-xs font-semibold ${
                          isDone ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span>🍅 {task.completedPomodoros}/{task.estPomodoros}</span>
                        {task.priority === 'urgent' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                            Urgent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Academic Badges</span>
              </h3>
              <span className="text-xs text-slate-400">
                {badges.filter((b) => b.unlocked).length}/{badges.length}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {badges.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center transition ${
                      b.unlocked
                        ? 'bg-slate-950 border-slate-700/80 shadow-md'
                        : 'bg-slate-950/40 border-slate-800/40 opacity-40 grayscale'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${
                        b.unlocked
                          ? `bg-gradient-to-tr ${b.color} text-white shadow-md`
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-white">{b.title}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                      {b.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
