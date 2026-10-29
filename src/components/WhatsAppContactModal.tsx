import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface WhatsAppContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppContactModal: React.FC<WhatsAppContactModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [customMsg, setCustomMsg] = useState(
    'Hi @xitres_maker, I am using XITRES MIND and want to connect with you!'
  );

  if (!isOpen) return null;

  const handleCopyUsername = () => {
    navigator.clipboard.writeText('@xitres_maker');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(customMsg);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const presetMessages = [
    'Hi @xitres_maker, I loved using XITRES MIND for my studies! 🚀',
    'Hello @xitres_maker, I have a feature suggestion for the app 💡',
    'Hey @xitres_maker, want to connect regarding study collaborations 📚',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col relative">
        {/* Glow ambient */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between relative z-10 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
              <MessageCircle className="w-6 h-6 fill-emerald-400/20" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                Connect on WhatsApp
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-xs text-slate-400">
                Official contact channel for XITRES MIND
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 relative z-10">
          {/* Creator Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/25 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Xitres Logo"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400/40 shadow-md"
              />
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Developer & Creator
                </div>
                <div className="text-base font-black text-white font-mono flex items-center gap-1.5">
                  @xitres_maker
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">
                  Active on WhatsApp
                </span>
              </div>
            </div>

            <button
              onClick={handleCopyUsername}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700 shrink-0"
              title="Copy username"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Quick preset message selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Quick Message Template:
            </label>
            <div className="space-y-1.5">
              {presetMessages.map((pm, idx) => (
                <button
                  key={idx}
                  onClick={() => setCustomMsg(pm)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition ${
                    customMsg === pm
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {/* Editable message */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Your Message:
            </label>
            <textarea
              rows={3}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Launch Button */}
          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 transition transform hover:-translate-y-0.5"
          >
            <MessageCircle className="w-5 h-5 fill-slate-950" />
            <span>Chat with @xitres_maker on WhatsApp</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
