import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  Timer,
  Layers,
  BookOpen,
  GraduationCap,
  Calendar,
  Sparkles,
  MessageCircle,
  Volume2,
  VolumeX,
  LogIn,
  ShieldCheck,
  Flame,
  X,
  Download,
  Upload,
  Globe,
  Lightbulb,
} from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { AuthUser } from './PhoneLoginModal';
import { audioSynth } from '../services/audioSynth';
import { translations, Language } from '../utils/translations';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isTimerRunning: boolean;
  timerMinutes: number;
  timerSeconds: number;
  dueCardsCount: number;
  currentStreak: number;
  onOpenSoundModal: () => void;
  onOpenWhatsApp: () => void;
  onOpenLogin: () => void;
  onOpenFeynman: () => void;
  onExportData: () => void;
  onImportData: () => void;
  currentUser: AuthUser | null;
  language: Language;
  onToggleLanguage: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  isTimerRunning,
  timerMinutes,
  timerSeconds,
  dueCardsCount,
  currentStreak,
  onOpenSoundModal,
  onOpenWhatsApp,
  onOpenLogin,
  onOpenFeynman,
  onExportData,
  onImportData,
  currentUser,
  language,
  onToggleLanguage,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const t = translations[language];
  const currentSound = audioSynth.getCurrentTrack();

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: t.tabs.dashboard,
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'timer' as ActiveTab,
      label: t.tabs.timer,
      icon: Timer,
      badge: isTimerRunning
        ? `${String(timerMinutes).padStart(2, '0')}:${String(timerSeconds).padStart(2, '0')}`
        : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    },
    {
      id: 'flashcards' as ActiveTab,
      label: t.tabs.flashcards,
      icon: Layers,
      badge: dueCardsCount > 0 ? `${dueCardsCount}` : null,
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    },
    {
      id: 'notes' as ActiveTab,
      label: t.tabs.notes,
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'quizzes' as ActiveTab,
      label: t.tabs.quizzes,
      icon: GraduationCap,
      badge: null,
    },
    {
      id: 'planner' as ActiveTab,
      label: t.tabs.planner,
      icon: Calendar,
      badge: null,
    },
    {
      id: 'tutor' as ActiveTab,
      label: t.tabs.tutor,
      icon: Sparkles,
      badge: 'Aura',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex justify-end">
      {/* Backdrop: Closes on outside tap */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Drawer Container: Slide in from right */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className="relative z-50 w-[85vw] max-w-xs h-full bg-slate-950 border-l border-slate-800/80 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
      >
        {/* Top Section */}
        <div>
          {/* Header with App Branding and Close Button */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/90 sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="/logo.png"
                alt="XITRES MIND Logo"
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-amber-400/50 shadow-md shadow-amber-500/20 shrink-0"
              />
              <div className="min-w-0">
                <h2 className="font-cinzel font-black text-sm text-white tracking-wider truncate">
                  <span className="gold-gradient-text">XITRES MIND</span>
                </h2>
                <p className="text-[10px] text-amber-300/80 font-medium tracking-tight truncate">
                  {t.tagline}
                </p>
              </div>
            </div>

            {/* Explicit Close Button (min 44x44px target) */}
            <button
              onClick={onClose}
              className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center transition active:scale-95 shrink-0"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Account / Phone Login / Settings Trigger */}
          <div className="p-3">
            {currentUser ? (
              <div
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="p-3 rounded-2xl bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 transition cursor-pointer flex items-center justify-between gap-2 shadow-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                      <span>{currentUser.name}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {currentUser.phone}
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 shrink-0">
                  Settings
                </span>
              </div>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="w-full min-h-[44px] p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-500/30 hover:border-amber-400/60 transition flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <LogIn className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-300">
                      Login / Profile / Settings
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Sync profile &amp; backup
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 shrink-0">
                  Sign In
                </span>
              </button>
            )}
          </div>

          {/* Active Streak & Timer Live Bar */}
          <div className="px-3 pb-2">
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-500/20 rounded-2xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Flame className="w-4 h-4 fill-amber-400 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-amber-300">
                    {currentStreak} Day Streak!
                  </div>
                  <div className="text-[10px] text-slate-400">Consistency is power</div>
                </div>
              </div>

              {isTimerRunning && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>
                    {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Core Navigation Items (Closes on page selection) */}
          <nav className="p-3 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
              Academic Modules
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80 active:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-slate-950' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-slate-950/30 text-slate-950'
                          : item.badgeColor || 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Working Modals & Actions */}
        <div className="p-3 border-t border-slate-800/80 space-y-2 bg-slate-950/90">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">
            Tools &amp; Assistance
          </div>

          {/* 1. WhatsApp Creator Contact */}
          <button
            onClick={() => {
              onClose();
              onOpenWhatsApp();
            }}
            className="w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold transition group shadow-sm active:scale-98"
          >
            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              <div className="text-left">
                <div className="leading-tight font-bold text-xs">WhatsApp Creator</div>
                <div className="text-[10px] text-emerald-400/90 font-mono">@xitres_maker</div>
              </div>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase tracking-wider">
              Chat
            </span>
          </button>

          {/* 2. Soundscapes (Ambient Audio) */}
          <button
            onClick={() => {
              onClose();
              onOpenSoundModal();
            }}
            className={`w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition active:scale-98 ${
              currentSound
                ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {currentSound ? (
                <Volume2 className="w-4 h-4 text-sky-400 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <span>{currentSound ? `Audio: ${currentSound}` : 'Soundscapes'}</span>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
              {currentSound ? 'Active' : 'Muted'}
            </span>
          </button>

          {/* 3. Feynman Explainer Modal */}
          <button
            onClick={() => {
              onClose();
              onOpenFeynman();
            }}
            className="w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 text-xs font-semibold transition active:scale-98"
          >
            <div className="flex items-center gap-2.5">
              <Lightbulb className="w-4 h-4 text-violet-400" />
              <span>Feynman Explainer</span>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-400">
              Simplify
            </span>
          </button>

          {/* Language Switcher in Drawer */}
          <button
            onClick={() => {
              onToggleLanguage();
            }}
            className="w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-xl border border-amber-500/40 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold transition active:scale-98 shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>{language === 'en' ? 'Language' : 'भाषा (Language)'}</span>
            </div>
            <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {language === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
            </span>
          </button>

          {/* Backup data buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                onClose();
                onExportData();
              }}
              className="flex-1 min-h-[38px] flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs font-medium hover:text-white transition"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onImportData();
              }}
              className="flex-1 min-h-[38px] flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs font-medium hover:text-white transition"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Import</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
