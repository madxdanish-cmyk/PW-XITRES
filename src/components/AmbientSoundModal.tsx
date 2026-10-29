import React, { useState } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  CloudRain,
  Radio,
  Coffee,
  Waves,
  Bell,
  Sparkles,
} from 'lucide-react';
import { audioSynth } from '../services/audioSynth';

interface AmbientSoundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AmbientSoundModal: React.FC<AmbientSoundModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTrack, setActiveTrack] = useState<string | null>(
    audioSynth.getCurrentTrack()
  );
  const [volume, setVolume] = useState<number>(audioSynth.getVolume());

  if (!isOpen) return null;

  const tracks = [
    {
      id: 'alpha' as const,
      name: 'Binaural Alpha (10 Hz)',
      desc: 'Stereo detuned sine waves that synchronize brainwaves into deep flow state.',
      icon: Radio,
      color: 'from-indigo-500/20 to-sky-500/20 text-indigo-400 border-indigo-500/30',
    },
    {
      id: 'rain' as const,
      name: 'Gentle Rain on Window',
      desc: 'Dynamic filtered raindrops with subtle natural rhythm to calm anxiety.',
      icon: CloudRain,
      color: 'from-sky-500/20 to-teal-500/20 text-sky-400 border-sky-500/30',
    },
    {
      id: 'brownnoise' as const,
      name: 'Deep Brown Noise',
      desc: 'Deep low-frequency rumble that effectively masks human speech and distractions.',
      icon: Waves,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    },
    {
      id: 'whitenoise' as const,
      name: 'Balanced White Noise',
      desc: 'Crisp, even sound spectrum for steady concentration and masking ambient sounds.',
      icon: Sparkles,
      color: 'from-slate-500/20 to-zinc-500/20 text-slate-300 border-slate-500/30',
    },
    {
      id: 'cafe' as const,
      name: 'Cozy Study Cafe',
      desc: 'Warm acoustic room frequency evoking a bustling corner coffee shop.',
      icon: Coffee,
      color: 'from-rose-500/20 to-amber-500/20 text-rose-400 border-rose-500/30',
    },
  ];

  const handleSelectTrack = (trackId: 'alpha' | 'rain' | 'brownnoise' | 'whitenoise' | 'cafe') => {
    if (activeTrack === trackId) {
      audioSynth.stopAmbient();
      setActiveTrack(null);
    } else {
      audioSynth.playAmbient(trackId);
      setActiveTrack(trackId);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    audioSynth.setVolume(newVol);
  };

  const handleStop = () => {
    audioSynth.stopAmbient();
    setActiveTrack(null);
  };

  const handleTestChime = () => {
    audioSynth.playSessionChime('work_finish');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Ambient Soundscapes & Audio Synth
              </h3>
              <p className="text-xs text-slate-400">
                100% browser synthesized audio for zero-distraction focus
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tracks List */}
        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {tracks.map((t) => {
            const Icon = t.icon;
            const isPlaying = activeTrack === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTrack(t.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 group ${
                  isPlaying
                    ? 'bg-gradient-to-r ' + t.color + ' ring-1 ring-white/10 shadow-lg'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                    isPlaying ? 'bg-white/10 scale-105' : 'bg-slate-800 text-slate-400 group-hover:scale-105'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">
                      {t.name}
                    </span>
                    {isPlaying && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white animate-pulse">
                        PLAYING
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                    {t.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Controls & Volume Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <span>Volume ({Math.round(volume * 100)}%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 accent-indigo-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              onClick={handleTestChime}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition border border-slate-700"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Test Session Bell</span>
            </button>

            {activeTrack && (
              <button
                onClick={handleStop}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-semibold transition"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop Audio</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition ml-auto"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
