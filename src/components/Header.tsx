import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Lightbulb,
  Headphones,
  MessageCircle,
  User,
  ShieldCheck,
  LogIn,
  Globe,
  MoreVertical,
  Sparkles,
  GraduationCap,
  Trophy,
  Download,
  Upload,
  RefreshCw,
} from 'lucide-react';
import { audioSynth } from '../services/audioSynth';
import { AuthUser } from './PhoneLoginModal';
import { ActiveTab } from './Sidebar';

interface HeaderProps {
  title: string;
  subtitle: string;
  onStartFocus: () => void;
  onOpenFeynman: () => void;
  onOpenSoundModal: () => void;
  onOpenWhatsApp: () => void;
  onOpenLogin: () => void;
  currentUser: AuthUser | null;
  isTimerRunning: boolean;
  timerMinutes: number;
  timerSeconds: number;
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  onExportData: () => void;
  onImportData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onStartFocus,
  onOpenFeynman,
  onOpenSoundModal,
  onOpenWhatsApp,
  onOpenLogin,
  currentUser,
  isTimerRunning,
  timerMinutes,
  timerSeconds,
  language,
  onToggleLanguage,
  setActiveTab,
  onExportData,
  onImportData,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentSound = audioSynth.getCurrentTrack();

  const timerHours = Math.floor(timerMinutes / 60);
  const remainingMins = timerMinutes % 60;

  const formattedTime =
    timerHours > 0
      ? `${timerHours}h ${String(remainingMins).padStart(2, '0')}m`
      : `${String(timerMinutes).padStart(2, '0')}:${String(timerSeconds).padStart(2, '0')}`;

  const idleLabel = timerHours > 0 ? `Focus ${timerHours}h` : `Focus ${timerMinutes}m`;

  // Close dropdown on outside click or Esc
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header className="h-16 md:h-18 px-3 sm:px-6 md:px-8 pr-14 md:pr-8 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
        <img
          src="/logo.png"
          alt="XITRES MIND"
          className="w-8 h-8 rounded-lg object-cover ring-1 ring-amber-400/40 md:hidden shrink-0"
        />
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg md:text-xl font-black text-white tracking-tight flex items-center gap-2 truncate">
            <span className="font-cinzel text-sm sm:text-base md:text-lg gold-gradient-text tracking-wide truncate">
              {title}
            </span>
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-400 truncate">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 relative">
        {/* Language Switcher */}
        <button
          onClick={onToggleLanguage}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-xs font-black transition group shadow-sm active:scale-95"
          title={language === 'en' ? 'हिंदी में बदलें (Switch to Hindi)' : 'Switch to English'}
        >
          <Globe className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
          <span className="font-bold text-[11px] sm:text-xs tracking-wide">
            {language === 'en' ? 'हिंदी' : 'English'}
          </span>
        </button>

        {/* Quick Pomodoro Button (Essential) */}
        <button
          onClick={onStartFocus}
          className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition shadow-md ${
            isTimerRunning
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/20'
          }`}
        >
          <Timer className={`w-3.5 h-3.5 ${isTimerRunning ? 'animate-spin' : ''}`} />
          <span>{isTimerRunning ? formattedTime : idleLabel}</span>
        </button>

        {/* Three-Dot Vertical Menu (⋮) */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-300 flex items-center justify-center transition shadow-sm active:scale-95"
            title="More Options & Secondary Tools"
            aria-label="Open Secondary Menu"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Neat Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-200">
              <div className="px-3.5 py-2 border-b border-slate-800 mb-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                  Quick Tools & Features
                </span>
              </div>

              {/* AI Academic Coach */}
              <button
                onClick={() => {
                  setActiveTab('tutor');
                  setIsMenuOpen(false);
                }}
                className="w-full px-3.5 py-2.5 text-left text-xs font-semibold flex items-center gap-2.5 hover:bg-slate-800/80 text-slate-200 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div>AI Academic Coach</div>
                  <div className="text-[10px] text-slate-400">Aura AI Tutor</div>
                </div>
              </button>

              {/* Feynman Explainer */}
              <button
                onClick={() => {
                  onOpenFeynman();
                  setIsMenuOpen(false);
                }}
                className="w-full px-3.5 py-2.5 text-left text-xs font-semibold flex items-center gap-2.5 hover:bg-slate-800/80 text-slate-200 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div>Feynman Explainer</div>
                  <div className="text-[10px] text-slate-400">Simplify concepts</div>
                </div>
              </button>

              {/* Active Recall Quiz */}
              <button
                onClick={() => {
                  setActiveTab('quizzes');
                  setIsMenuOpen(false);
                }}
                className="w-full px-3.5 py-2.5 text-left text-xs font-semibold flex items-center gap-2.5 hover:bg-slate-800/80 text-slate-200 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div>Active Recall Quiz</div>
                  <div className="text-[10px] text-slate-400">Test your mastery</div>
                </div>
              </button>

              {/* Academic Badges & Milestones */}
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setIsMenuOpen(false);
                }}
                className="w-full px-3.5 py-2.5 text-left text-xs font-semibold flex items-center gap-2.5 hover:bg-slate-800/80 text-slate-200 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Trophy className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div>Academic Badges & Milestones</div>
                  <div className="text-[10px] text-slate-400">View streak & trophies</div>
                </div>
              </button>

              {/* Ambient Soundscapes */}
              <button
                onClick={() => {
                  onOpenSoundModal();
                  setIsMenuOpen(false);
                }}
                className="w-full px-3.5 py-2.5 text-left text-xs font-semibold flex items-center gap-2.5 hover:bg-slate-800/80 text-slate-200 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <Headphones className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div>Ambient Soundscapes</div>
                  <div className="text-[10px] text-slate-400">
                    {currentSound ? `Active: ${currentSound}` : 'Focus sounds'}
                  </div>
                </div>
              </button>

              {/* WhatsApp Creator Chat */}
              <button
                onClick={() => {
                  onOpenWhatsApp();
                  setIsMenuOpen(false);
                }}
                className="w-full px-3.5 py-2.5 text-left text-xs font-semibold flex items-center gap-2.5 hover:bg-slate-800/80 text-emerald-300 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div>WhatsApp Creator</div>
                  <div className="text-[10px] text-emerald-400/80">@xitres_maker</div>
                </div>
              </button>

              {/* Data Backup & Restore */}
              <div className="border-t border-slate-800 my-1 pt-1">
                <button
                  onClick={() => {
                    onExportData();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium flex items-center gap-2 hover:bg-slate-800/80 text-slate-300 transition"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Export Study Backup</span>
                </button>
                <button
                  onClick={() => {
                    onImportData();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium flex items-center gap-2 hover:bg-slate-800/80 text-slate-300 transition"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Restore Data</span>
                </button>
              </div>

              {/* Login / Profile */}
              <div className="border-t border-slate-800 my-1 pt-1">
                <button
                  onClick={() => {
                    onOpenLogin();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-semibold flex items-center gap-2.5 hover:bg-slate-800/80 text-amber-300 transition"
                >
                  {currentUser ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div>{currentUser.name}</div>
                        <div className="text-[10px] text-emerald-400">Verified Account</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 text-amber-400" />
                      <div>
                        <div>Sign In with Phone</div>
                        <div className="text-[10px] text-slate-400">Sync across devices</div>
                      </div>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
