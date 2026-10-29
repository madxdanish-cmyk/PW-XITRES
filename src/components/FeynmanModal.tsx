import React, { useState } from 'react';
import {
  X,
  Lightbulb,
  Sparkles,
  ArrowRight,
  BookOpen,
  Layers,
  HelpCircle,
  Copy,
  Check,
  RotateCw,
} from 'lucide-react';
import { aiService } from '../services/aiService';
import { FeynmanExplanation } from '../types';

interface FeynmanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAsNote?: (explanation: FeynmanExplanation) => void;
  onSaveAsCard?: (explanation: FeynmanExplanation) => void;
}

export const FeynmanModal: React.FC<FeynmanModalProps> = ({
  isOpen,
  onClose,
  onSaveAsNote,
  onSaveAsCard,
}) => {
  const [conceptInput, setConceptInput] = useState('');
  const [level, setLevel] = useState<'beginner' | 'undergrad' | 'advanced'>('undergrad');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FeynmanExplanation | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleExplain = async () => {
    if (!conceptInput.trim()) return;
    setLoading(true);
    try {
      const data = await aiService.explainFeynman(conceptInput, level);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `FEYNMAN EXPLANATION: ${result.concept}\n\nSummary:\n${result.simpleSummary}\n\nAnalogy:\n${result.analogy}\n\nKey Steps:\n${result.keySteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nMnemonic: ${result.mnemonic || 'N/A'}\n\nCheck Question: ${result.checkQuestion}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleConcepts = [
    'Mitochondrial ATP Synthase',
    'Dijkstra\'s Shortest Path Algorithm',
    'Ebbinghaus Forgetting Curve',
    'Chemiosmosis Gradient',
    'Quicksort Partitioning',
    'Cognitive Dissonance',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Feynman Technique Explainer
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Intuition First
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Deconstruct any complex theory into intuitive, unforgettable mental models
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Input Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              What concept or theory is confusing you?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Proton Motive Force, Binary Search Tree, Epigenetics..."
                value={conceptInput}
                onChange={(e) => setConceptInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
              />
              <button
                onClick={handleExplain}
                disabled={loading || !conceptInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 transition shrink-0"
              >
                {loading ? (
                  <RotateCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Explain Simply</span>
              </button>
            </div>

            {/* Quick Inspiration Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400">Try:</span>
              {sampleConcepts.map((sc) => (
                <button
                  key={sc}
                  onClick={() => {
                    setConceptInput(sc);
                  }}
                  className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
                >
                  {sc}
                </button>
              ))}
            </div>
          </div>

          {/* Explanation Output */}
          {result && (
            <div className="space-y-4 pt-3 border-t border-slate-800/80 animate-in fade-in duration-300">
              {/* Concept Banner */}
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <div className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-1">
                  Plain-English Intuition
                </div>
                <div className="text-base font-semibold text-white">
                  {result.concept}
                </div>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  {result.simpleSummary}
                </p>
              </div>

              {/* Analogy Box */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  Real-World Everyday Analogy
                </div>
                <p className="text-sm text-slate-200 italic leading-relaxed">
                  "{result.analogy}"
                </p>
              </div>

              {/* Key Steps */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Fundamental Mechanics (Step-by-Step)
                </div>
                <ol className="space-y-2">
                  {result.keySteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-violet-600/30 text-violet-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Mnemonic and Check question */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.mnemonic && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                      🧠 Memory Hook / Mnemonic
                    </div>
                    <div className="text-xs text-emerald-200 font-medium">
                      {result.mnemonic}
                    </div>
                  </div>
                )}
                <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-sky-400 mb-1 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Self-Check Question
                  </div>
                  <div className="text-xs text-sky-200 font-medium">
                    {result.checkQuestion}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Explanation'}</span>
                </button>

                <div className="flex items-center gap-2">
                  {onSaveAsCard && (
                    <button
                      onClick={() => {
                        onSaveAsCard(result);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Create Flashcard</span>
                    </button>
                  )}
                  {onSaveAsNote && (
                    <button
                      onClick={() => {
                        onSaveAsNote(result);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Save as Note</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
