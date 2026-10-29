import React from 'react';
import {
  LayoutDashboard,
  Timer,
  Layers,
  BookOpen,
  GraduationCap,
  Calendar,
  Sparkles,
  Volume2,
  VolumeX,
  Flame,
  Download,
  Upload,
  MessageCircle,
  LogIn,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { audioSynth } from '../services/audioSynth';
import { AuthUser } from './PhoneLoginModal';
import { translations, Language } from '../utils/translations';

export type ActiveTab =
  | 'dashboard'
  | 'timer'
  | 'flashcards'
  | 'notes'
  | 'quizzes'
  | 'planner'
  | 'tutor';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isTimerRunning: boolean;
  timerMinutes: number;
  timerSeconds: number;
  dueCardsCount: number;
  currentStreak: number;
  onOpenSoundModal: () => void;
  onExportData: () => void;
  onImportData: () => void;
  onOpenWhatsApp: () => void;
  onOpenLogin: () => void;
  currentUser: AuthUser | null;
  language: Language;
  onToggleLanguage: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isTimerRunning,
  timerMinutes,
  timerSeconds,
  dueCardsCount,
  currentStreak,
  onOpenSoundModal,
  onExportData,
  onImportData,
  onOpenWhatsApp,
  onOpenLogin,
  currentUser,
  language,
  onToggleLanguage,
}) => {
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
    <aside className="hidden md:flex w-64 bg-slate-950/80 border-r border-slate-800/80 flex-col justify-between shrink-0 h-screen sticky top-0 backdrop-blur-md z-30 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/logo.png"
              alt="XITRES MIND Emblem"
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20 shrink-0"
            />
            <div className="min-w-0">
              <h1 className="font-cinzel font-black text-sm text-white tracking-wider flex items-center gap-1.5 truncate">
                <span className="gold-gradient-text">XITRES MIND</span>
              </h1>
              <p className="text-[10px] text-amber-300/80 font-medium tracking-tight truncate">
                {t.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* User Account / Phone Login Bar */}
        <div className="px-3 pt-3">
          {currentUser ? (
            <div
              onClick={onOpenLogin}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-400 transition cursor-pointer flex items-center justify-between gap-2 shadow-sm"
              title="View Account Profile"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                    <span>{currentUser.name}</span>
                    <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {currentUser.phone}
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 shrink-0">
                PRO
              </span>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-500/30 hover:border-amber-400/60 transition flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <LogIn className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-300">
                    Phone & OTP Login
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Sync profile & streaks
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                Sign In
              </span>
            </button>
          )}
        </div>

        {/* Streak & Status Pill */}
        <div className="px-3 pt-2 pb-1">
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-500/20 rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
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
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-amber-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
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

      {/* Footer Utilities */}
      <div className="p-4 border-t border-slate-800/60 space-y-2.5">
        {/* Contact Creator via WhatsApp */}
        <button
          onClick={onOpenWhatsApp}
          className="w-full flex items-center justify-between p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold transition group shadow-sm"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="leading-tight font-bold text-[11px]">WhatsApp Creator</div>
              <div className="text-[10px] text-emerald-400/80 font-mono">@xitres_maker</div>
            </div>
          </div>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase tracking-wider">
            Chat
          </span>
        </button>

        {/* Ambient Sound Controller */}
        <button
          onClick={onOpenSoundModal}
          className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
            currentSound
              ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {currentSound ? (
              <Volume2 className="w-4 h-4 text-sky-400 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
            <span className="font-medium">
              {currentSound ? `Ambient: ${currentSound}` : 'Soundscapes'}
            </span>
          </div>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
            {currentSound ? 'Active' : 'Muted'}
          </span>
        </button>

        {/* Language Switcher */}
        <button
          onClick={onToggleLanguage}
          className="w-full flex items-center justify-between p-2 rounded-xl border border-amber-500/30 bg-slate-900/90 hover:bg-slate-800 text-amber-300 text-xs font-bold transition shadow-sm"
          title={language === 'en' ? 'हिंदी में बदलें (Switch to Hindi)' : 'Switch to English'}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>{language === 'en' ? 'Language' : 'भाषा (Language)'}</span>
          </div>
          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
            {language === 'en' ? 'हिंदी' : 'English'}
          </span>
        </button>

        {/* Data Backup actions */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={onExportData}
            title="Export full study backup"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 text-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
          <button
            onClick={onImportData}
            title="Import backup"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 text-xs transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
