import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Radio,
  CloudRain,
  Waves,
  Coffee,
  CheckCircle2,
  Flame,
  Sparkles,
  Clock,
  Sliders,
  Timer as TimerIcon,
} from 'lucide-react';
import { audioSynth } from '../services/audioSynth';
import { StudyTask } from '../types';
import { translations, Language } from '../utils/translations';

interface FocusTimerViewProps {
  tasks: StudyTask[];
  onTaskCompletedPomodoro: (taskId: string) => void;
  onRecordStudyTime: (minutes: number) => void;
  // Shared timer state
  mode: 'work' | 'short_break' | 'long_break';
  setMode: (m: 'work' | 'short_break' | 'long_break') => void;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  selectedTaskId: string;
  setSelectedTaskId: (id: string) => void;
  sessionDuration: number;
  setSessionDuration: (duration: number) => void;
  language: Language;
}

export const FocusTimerView: React.FC<FocusTimerViewProps> = ({
  tasks,
  onTaskCompletedPomodoro,
  onRecordStudyTime,
  mode,
  setMode,
  timeLeft,
  setTimeLeft,
  isRunning,
  setIsRunning,
  selectedTaskId,
  setSelectedTaskId,
  sessionDuration,
  setSessionDuration,
  language,
}) => {
  const t = translations[language].timer;
  const [isZenMode, setIsZenMode] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [customHours, setCustomHours] = useState(4);
  const [customMinutes, setCustomMinutes] = useState(0);
  const [isCustomExpanded, setIsCustomExpanded] = useState(false);

  // Marathon Presets Requested by User (up to 24hr)
  const PRESET_DURATIONS = [
    { label: '25m', seconds: 25 * 60, tag: 'Standard' },
    { label: '45m', seconds: 45 * 60, tag: 'Lecture' },
    { label: '1hr', seconds: 60 * 60, tag: 'Deep' },
    { label: '2hr', seconds: 2 * 3600, tag: 'Power' },
    { label: '4hr', seconds: 4 * 3600, tag: 'Marathon' },
    { label: '6hr', seconds: 6 * 3600, tag: 'Intense' },
    { label: '8hr', seconds: 8 * 3600, tag: 'Full Day' },
    { label: '10hr', seconds: 10 * 3600, tag: 'Sprint' },
    { label: '12hr', seconds: 12 * 3600, tag: 'Ultra' },
    { label: '16hr', seconds: 16 * 3600, tag: 'Extreme' },
    { label: '24hr', seconds: 24 * 3600, tag: 'Max Day' },
  ];

  const BREAK_DURATIONS = {
    short_break: 5 * 60,
    long_break: 15 * 60,
  };

  const quotes = t.quotes;

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 25000);
    return () => clearInterval(quoteInterval);
  }, []);

  // Compute total duration for progress ring
  const totalDuration = mode === 'work' ? sessionDuration : BREAK_DURATIONS[mode];
  const progressPercent = Math.min(
    100,
    Math.max(0, ((totalDuration - timeLeft) / (totalDuration || 1)) * 100)
  );

  // Time formatting (HH:MM:SS or MM:SS)
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const displayTimeString =
    hours > 0
      ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleApplyDuration = (secs: number) => {
    setMode('work');
    setIsRunning(false);
    setSessionDuration(secs);
    setTimeLeft(secs);
  };

  const handleApplyCustomTime = () => {
    const totalSecs = Math.max(60, customHours * 3600 + customMinutes * 60);
    handleApplyDuration(totalSecs);
    setIsCustomExpanded(false);
  };

  const handleModeSwitch = (newMode: 'work' | 'short_break' | 'long_break') => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === 'work') {
      setTimeLeft(sessionDuration);
    } else {
      setTimeLeft(BREAK_DURATIONS[newMode]);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setTimeLeft(sessionDuration);
    } else {
      setTimeLeft(BREAK_DURATIONS[mode]);
    }
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (mode === 'work') {
      handleModeSwitch('short_break');
    } else {
      handleModeSwitch('work');
    }
  };

  const currentSound = audioSynth.getCurrentTrack();

  const handleSoundToggle = (track: 'alpha' | 'rain' | 'brownnoise' | 'cafe') => {
    if (currentSound === track) {
      audioSynth.stopAmbient();
    } else {
      audioSynth.playAmbient(track);
    }
  };

  // SVGs for circular progress
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div
      className={`transition-all duration-300 ${
        isZenMode
          ? 'fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-between p-4 sm:p-8'
          : 'p-3 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 overflow-x-hidden'
      }`}
    >
      {/* Top Header */}
      <div className="w-full flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${
                mode === 'work'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {mode === 'work'
                ? `${t.deepWork} (${Math.round(sessionDuration / 3600 > 0 ? sessionDuration / 3600 : sessionDuration / 60)}${sessionDuration >= 3600 ? 'hr' : 'm'})`
                : t.breakTime}
            </span>
            {isRunning && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {t.inSession}
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white mt-1 truncate">
            {t.title}
          </h2>
        </div>

        <button
          onClick={() => setIsZenMode(!isZenMode)}
          className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition border border-slate-700 shrink-0"
        >
          {isZenMode ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span>{t.zenExit}</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t.zenEnter}</span>
            </>
          )}
        </button>
      </div>

      {/* Main Focus / Break Switcher */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-md mx-auto w-full">
        <button
          onClick={() => handleModeSwitch('work')}
          className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition text-center ${
            mode === 'work'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.studyFocus}
        </button>
        <button
          onClick={() => handleModeSwitch('short_break')}
          className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition text-center ${
            mode === 'short_break'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.shortBreak}
        </button>
        <button
          onClick={() => handleModeSwitch('long_break')}
          className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition text-center ${
            mode === 'long_break'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.longBreak}
        </button>
      </div>

      {/* Marathon Focus Durations Panel (4hr, 6hr, 8hr, up to 24hr) */}
      <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
              {t.selectDuration}
            </span>
          </div>
          <button
            onClick={() => setIsCustomExpanded(!isCustomExpanded)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isCustomExpanded ? t.hideCustom : t.customTime}</span>
          </button>
        </div>

        {/* Preset Buttons Grid */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {PRESET_DURATIONS.map((preset) => {
            const isSelected = mode === 'work' && sessionDuration === preset.seconds;
            return (
              <button
                key={preset.label}
                onClick={() => handleApplyDuration(preset.seconds)}
                className={`flex-1 min-w-[65px] sm:min-w-[75px] py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center border shadow-sm ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/30 scale-105'
                    : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-amber-500/50 hover:text-amber-300'
                }`}
              >
                <span className="text-xs sm:text-sm font-black">{preset.label}</span>
                <span className={`text-[9px] font-semibold ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                  {preset.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Hours & Minutes Expander */}
        {isCustomExpanded && (
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 mt-3 space-y-3 animate-in fade-in">
            <div className="text-xs font-bold text-amber-300">
              {t.setExactTime}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400 font-semibold">{t.hours}:</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={customHours}
                  onChange={(e) => setCustomHours(Math.min(24, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-16 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-bold text-center text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400 font-semibold">{t.minutes}:</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-16 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-bold text-center text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <button
                onClick={handleApplyCustomTime}
                className="py-1.5 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs transition shadow-md shadow-amber-500/20 active:scale-95"
              >
                {t.applyTime}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Circular Progress & Clock Face */}
      <div className="flex flex-col items-center justify-center my-2 sm:my-4">
        <div className="relative w-64 h-64 sm:w-76 sm:h-76 md:w-84 md:h-84 flex items-center justify-center max-w-full">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 300 300">
            {/* Background Track */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="#1e293b"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke={mode === 'work' ? '#eab308' : '#10b981'}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Central Digits & Status */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter tabular-nums font-mono drop-shadow-md">
              {displayTimeString}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-amber-300 uppercase tracking-widest mt-1 sm:mt-2">
              {mode === 'work' ? (hours >= 1 ? `Marathon ${hours}h Session` : 'Deep Focus Block') : 'Recovery Rest'}
            </span>

            {/* Selected Task Pill */}
            {selectedTaskId && (
              <div className="mt-2 sm:mt-3 max-w-[180px] sm:max-w-[200px] truncate text-[11px] sm:text-xs px-2.5 py-0.5 sm:py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60">
                {tasks.find((t) => t.id === selectedTaskId)?.title || 'Target Task'}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button
            onClick={handleReset}
            title="Reset timer"
            className="w-12 h-12 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition border border-slate-700/60 active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`w-18 h-18 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl transition transform hover:scale-105 active:scale-95 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                : 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 hover:from-amber-400 hover:to-yellow-300 shadow-amber-500/40 font-black'
            }`}
          >
            {isRunning ? (
              <Pause className="w-8 h-8 fill-white" />
            ) : (
              <Play className="w-8 h-8 fill-slate-950 ml-1" />
            )}
          </button>

          <button
            onClick={handleSkip}
            title="Skip to next session"
            className="w-12 h-12 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition border border-slate-700/60 active:scale-95"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Task Link & Ambient Sound Quick Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
        {/* Task Link Selector */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            {t.linkTask}
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
          >
            <option value="">{t.noTask}</option>
            {tasks
              .filter((t) => t.status !== 'done')
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.completedPomodoros}/{t.estPomodoros} 🍅)
                </option>
              ))}
          </select>
        </div>

        {/* Ambient Study Sound Quick Switch */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t.ambientSound}
            </span>
            {currentSound && (
              <span className="text-[10px] text-amber-400 font-bold uppercase animate-pulse">
                {currentSound}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'alpha' as const, label: 'Alpha 10Hz', icon: Radio },
              { id: 'rain' as const, label: 'Rain', icon: CloudRain },
              { id: 'brownnoise' as const, label: 'Brown Noise', icon: Waves },
              { id: 'cafe' as const, label: 'Cafe', icon: Coffee },
            ].map((snd) => {
              const Icon = snd.icon;
              const isActive = currentSound === snd.id;
              return (
                <button
                  key={snd.id}
                  onClick={() => handleSoundToggle(snd.id)}
                  className={`flex-1 flex flex-col items-center justify-center p-2 rounded-xl border text-[10px] font-semibold transition ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 mb-1" />
                  <span>{snd.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rotating Motivational Quote */}
      <div className="text-center max-w-xl mx-auto py-2">
        <p className="text-xs text-slate-400 italic transition-all duration-700">
          {quotes[quoteIndex]}
        </p>
      </div>
    </div>
  );
};
