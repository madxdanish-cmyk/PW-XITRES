import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  RotateCw,
  Lightbulb,
  BookOpen,
  Layers,
  Copy,
  Check,
  Brain,
  HelpCircle,
  Bot,
  User,
} from 'lucide-react';
import { Subject, CornellNote } from '../types';
import { aiService } from '../services/aiService';

interface AITutorViewProps {
  subjects: Subject[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  subjects,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm_intro',
      role: 'assistant',
      content: `Hello! I'm **Aura**, your personal academic tutor and cognitive study coach. 🎓

Ask me to:
- Deconstruct difficult scientific or mathematical concepts with analogies.
- Formulate catchy memory **mnemonics** for tough lists or cycles.
- Run an active recall quiz to diagnose your blind spots.
- Build a realistic revision strategy for an upcoming exam.

What are we mastering today?`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

  const promptStarters = [
    'Explain the Krebs cycle using an everyday analogy',
    'Create an active recall drill with 3 hard questions on my subject',
    'Give me a mnemonic to remember Big-O complexity classes',
    'How does the SM-2 algorithm prevent the Ebbinghaus forgetting curve?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `m_user_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'm_intro')
        .map((m) => ({ role: m.role, content: m.content }));

      const reply = await aiService.askTutor(
        text.trim(),
        selectedSubject?.name,
        undefined,
        history
      );

      const botMsg: ChatMessage = {
        id: `m_bot_${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-5rem)] flex flex-col space-y-4 animate-in fade-in duration-300">
      {/* Header & Context Attachment */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Aura • AI Study Partner
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Gemini 3.8
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive tutoring, intuitive breakdowns, and active recall drills
            </p>
          </div>
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                Subject: {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-violet-600/20 border border-violet-500/30 text-violet-400'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-2xl rounded-2xl p-4.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-950 border border-slate-800/90 text-slate-200 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Footer timestamp & action */}
                <div
                  className={`flex items-center justify-between pt-2 mt-2 border-t text-[11px] ${
                    isUser
                      ? 'border-indigo-500/50 text-indigo-200'
                      : 'border-slate-800 text-slate-500'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="hover:text-slate-300 transition flex items-center gap-1"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
              <RotateCw className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
              <span>Aura is synthesizing intuition and active recall tips...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          Prompts:
        </span>
        {promptStarters.map((ps, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(ps)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs shrink-0 transition"
          >
            {ps}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-2 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask Aura anything about your studies, request mnemonics, or test your memory..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 px-4 py-3 bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim() || loading}
          className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition shadow-md shadow-indigo-600/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
