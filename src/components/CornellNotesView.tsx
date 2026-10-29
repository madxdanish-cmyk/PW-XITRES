import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Sparkles,
  HelpCircle,
  Trash2,
  Edit3,
  Check,
  Search,
  Download,
  GraduationCap,
  Eye,
  EyeOff,
  Lightbulb,
  FileText,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { CornellNote, Subject } from '../types';
import { aiService } from '../services/aiService';

interface CornellNotesViewProps {
  notes: CornellNote[];
  subjects: Subject[];
  onSaveNotes: (notes: CornellNote[]) => void;
  onRecordStudyTime: (minutes: number) => void;
  onPracticeQuiz?: (topic: string, notes: string) => void;
  onOpenFeynman?: (concept: string) => void;
}

export const CornellNotesView: React.FC<CornellNotesViewProps> = ({
  notes,
  subjects,
  onSaveNotes,
  onRecordStudyTime,
  onPracticeQuiz,
  onOpenFeynman,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [isTestingRecall, setIsTestingRecall] = useState(false);
  const [mobileTab, setMobileTab] = useState<'all' | 'cues' | 'notes' | 'summary'>('all');

  // AI loading states
  const [aiGeneratingSummary, setAiGeneratingSummary] = useState(false);
  const [aiGeneratingCues, setAiGeneratingCues] = useState(false);

  // New Note Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || '');
  const [newTags, setNewTags] = useState('');

  // New cue input inside active note
  const [newCueInput, setNewCueInput] = useState('');

  const currentNote = notes.find((n) => n.id === selectedNoteId) || notes[0];
  const currentSubject = subjects.find((s) => s.id === currentNote?.subjectId);

  // Filtered notes
  const filteredNotes = notes.filter((n) => {
    const matchesSubject =
      selectedSubjectFilter === 'all' || n.subjectId === selectedSubjectFilter;
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  const handleUpdateCurrentNote = (partial: Partial<CornellNote>) => {
    if (!currentNote) return;
    const updated = notes.map((n) =>
      n.id === currentNote.id
        ? {
            ...n,
            ...partial,
            lastUpdated: new Date().toISOString().split('T')[0],
          }
        : n
    );
    onSaveNotes(updated);
  };

  const handleAddCue = () => {
    if (!newCueInput.trim() || !currentNote) return;
    handleUpdateCurrentNote({
      cues: [...currentNote.cues, newCueInput.trim()],
    });
    setNewCueInput('');
  };

  const handleRemoveCue = (index: number) => {
    if (!currentNote) return;
    handleUpdateCurrentNote({
      cues: currentNote.cues.filter((_, i) => i !== index),
    });
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newNote: CornellNote = {
      id: `note_${Date.now()}`,
      title: newTitle.trim(),
      subjectId: newSubjectId,
      cues: [
        'What is the core definition?',
        'Why does this matter?',
        'Give a key example or diagram?',
      ],
      content: `# ${newTitle.trim()}\n\n## Main Concepts\n- Key principle 1:\n- Key principle 2:\n\n## Evidence & Mechanisms\n- `,
      summary: 'Summary in 1-2 concise sentences synthesizing the key takeaways.',
      tags: newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    onSaveNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
    setIsNewModalOpen(false);
    setNewTitle('');
    setNewTags('');
    setIsEditing(true);
  };

  const handleDeleteNote = (id: string) => {
    if (notes.length <= 1) {
      alert('You must keep at least one Cornell Note.');
      return;
    }
    const remaining = notes.filter((n) => n.id !== id);
    onSaveNotes(remaining);
    setSelectedNoteId(remaining[0].id);
  };

  const handleGenerateSummary = async () => {
    if (!currentNote || aiGeneratingSummary) return;
    setAiGeneratingSummary(true);
    try {
      const summary = await aiService.generateSummary(currentNote.content);
      handleUpdateCurrentNote({ summary });
    } catch (err) {
      console.error(err);
    } finally {
      setAiGeneratingSummary(false);
    }
  };

  const handleGenerateCues = async () => {
    if (!currentNote || aiGeneratingCues) return;
    setAiGeneratingCues(true);
    try {
      const cues = await aiService.generateCues(currentNote.content);
      if (cues && cues.length > 0) {
        handleUpdateCurrentNote({ cues });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiGeneratingCues(false);
    }
  };

  const handleExportMarkdown = () => {
    if (!currentNote) return;
    const text = `# Cornell Note: ${currentNote.title}
Subject: ${currentSubject?.name || 'General'}
Date: ${currentNote.lastUpdated}
Tags: ${currentNote.tags.join(', ')}

========================================
CUES & RETRIEVAL QUESTIONS:
========================================
${currentNote.cues.map((c, i) => `${i + 1}. ${c}`).join('\n')}

========================================
MAIN NOTES:
========================================
${currentNote.content}

========================================
SUMMARY:
========================================
${currentNote.summary}
`;

    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentNote.title.toLowerCase().replace(/\s+/g, '_')}_cornell.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <span className="font-cinzel gold-gradient-text">Cornell Note System</span>
          </h2>
          <p className="text-xs text-slate-400">
            Split-page active recall method: Cues column for retrieval, notes for substance, summary for synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsTestingRecall(!isTestingRecall)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
              isTestingRecall
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isTestingRecall ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isTestingRecall ? 'Reveal Notes' : 'Test Recall (Hide Notes)'}</span>
          </button>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Notes Selector & Right Cornell Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Note Navigator */}
        <div className="lg:col-span-4 space-y-3">
          {/* Search & Subject Filter */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search notes or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedSubjectFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
                  selectedSubjectFilter === 'all'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Subjects
              </button>
              {subjects.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSubjectFilter(s.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
                    selectedSubjectFilter === s.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const isSelected = note.id === currentNote?.id;
              const sub = subjects.find((s) => s.id === note.subjectId);
              return (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    setIsEditing(false);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition text-left group ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/50 shadow-md shadow-amber-500/10'
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {sub?.name || 'General'}
                    </span>
                    <span className="text-[10px] text-slate-500">{note.lastUpdated}</span>
                  </div>
                  <h4
                    className={`text-xs font-bold line-clamp-2 transition ${
                      isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {note.title}
                  </h4>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                    <span>{note.cues.length} Cues</span>
                    <span className="text-amber-400/80">{note.tags[0] ? `#${note.tags[0]}` : ''}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Cornell Active Document */}
        {currentNote ? (
          <div className="lg:col-span-8 space-y-4">
            {/* Note Action Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {currentSubject?.name || 'Study Topic'}
                  </span>
                  <span className="text-xs text-slate-400">Updated {currentNote.lastUpdated}</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentNote.title}
                    onChange={(e) => handleUpdateCurrentNote({ title: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-sm font-bold text-white focus:outline-none focus:border-amber-400"
                  />
                ) : (
                  <h3 className="text-base sm:text-lg font-black text-white mt-1 truncate">
                    {currentNote.title}
                  </h3>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                    isEditing
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Edit3 className="w-3.5 h-3.5" />}
                  <span>{isEditing ? 'Done' : 'Edit'}</span>
                </button>

                <button
                  onClick={handleExportMarkdown}
                  title="Export as Markdown"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                {onPracticeQuiz && (
                  <button
                    onClick={() => onPracticeQuiz(currentNote.title, currentNote.content)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold transition"
                    title="Generate Recall Quiz from this Note"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
                    <span className="hidden sm:inline">Quiz</span>
                  </button>
                )}

                <button
                  onClick={() => handleDeleteNote(currentNote.id)}
                  title="Delete Note"
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Mobile View Tab Selector (< md) */}
            <div className="flex sm:hidden items-center justify-between p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
              <button
                onClick={() => setMobileTab('all')}
                className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition ${
                  mobileTab === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                Full Layout
              </button>
              <button
                onClick={() => setMobileTab('cues')}
                className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition ${
                  mobileTab === 'cues' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                Cues ({currentNote.cues.length})
              </button>
              <button
                onClick={() => setMobileTab('notes')}
                className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition ${
                  mobileTab === 'notes' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                Notes
              </button>
              <button
                onClick={() => setMobileTab('summary')}
                className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition ${
                  mobileTab === 'summary' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                Summary
              </button>
            </div>

            {/* Cornell Split-Page Body */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              {/* Top Row: Cue Column + Main Notes Column */}
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px] border-b border-slate-800 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                {/* 1. CUE / RECALL COLUMN (Left / ~35%) */}
                {(mobileTab === 'all' || mobileTab === 'cues') && (
                  <div className="md:col-span-4 p-4 sm:p-5 flex flex-col justify-between bg-slate-950/40">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                            Cues &amp; Questions
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                            RECALL
                          </span>
                        </div>
                        <button
                          onClick={handleGenerateCues}
                          disabled={aiGeneratingCues}
                          title="Generate Cues using AI"
                          className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition disabled:opacity-50"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-400" />
                          <span>{aiGeneratingCues ? 'Thinking...' : 'AI Cues'}</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-tight">
                        Active retrieval prompts: Look only at these questions, try to recall the answer before reading the right column!
                      </p>

                      {/* Cues List */}
                      <div className="space-y-2 mt-3">
                        {currentNote.cues.map((cue, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/20 hover:border-amber-500/40 transition group flex items-start justify-between gap-2 shadow-sm"
                          >
                            <div className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-300 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="text-xs text-slate-200 font-medium leading-snug">
                                {cue}
                              </span>
                            </div>
                            {isEditing && (
                              <button
                                onClick={() => handleRemoveCue(idx)}
                                className="text-slate-500 hover:text-rose-400 p-0.5 shrink-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add Cue Input */}
                    <div className="pt-3 mt-4 border-t border-slate-800">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add recall question..."
                          value={newCueInput}
                          onChange={(e) => setNewCueInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddCue()}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={handleAddCue}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition shrink-0"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. MAIN NOTES COLUMN (Right / ~65%) */}
                {(mobileTab === 'all' || mobileTab === 'notes') && (
                  <div className="md:col-span-8 p-4 sm:p-6 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                          Main Lecture &amp; Reading Notes
                        </span>
                        {isTestingRecall && (
                          <span className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 animate-pulse">
                            Active Recall Mode Active
                          </span>
                        )}
                      </div>

                      {/* If Active Recall mode is on: Blur/Hide notes to force student recall */}
                      {isTestingRecall ? (
                        <div className="p-8 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-4 my-8">
                          <HelpCircle className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
                          <h4 className="text-base font-bold text-white">
                            Active Retrieval In Progress
                          </h4>
                          <p className="text-xs text-slate-400 max-w-md mx-auto">
                            Read the cues on the left. Test yourself by speaking or writing the answers down first before revealing the note text!
                          </p>
                          <button
                            onClick={() => setIsTestingRecall(false)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs shadow-md transition"
                          >
                            Reveal Answers &amp; Notes
                          </button>
                        </div>
                      ) : isEditing ? (
                        <textarea
                          rows={14}
                          value={currentNote.content}
                          onChange={(e) => handleUpdateCurrentNote({ content: e.target.value })}
                          className="w-full h-full min-h-[300px] p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white leading-relaxed font-mono focus:outline-none focus:border-amber-400 resize-y"
                          placeholder="Write key concepts, explanations, bullet points..."
                        />
                      ) : (
                        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3 whitespace-pre-line py-2">
                          {currentNote.content}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. SUMMARY ROW (Bottom / ~100%) */}
              {(mobileTab === 'all' || mobileTab === 'summary') && (
                <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                        Bottom Summary &amp; Core Synthesis
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        BIG PICTURE
                      </span>
                    </div>

                    <button
                      onClick={handleGenerateSummary}
                      disabled={aiGeneratingSummary}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{aiGeneratingSummary ? 'Summarizing...' : 'AI Summary'}</span>
                    </button>
                  </div>

                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={currentNote.summary}
                      onChange={(e) => handleUpdateCurrentNote({ summary: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white leading-relaxed focus:outline-none focus:border-emerald-400 resize-none"
                      placeholder="Synthesize the whole note in 1 or 2 high-impact takeaway sentences..."
                    />
                  ) : (
                    <p className="text-xs sm:text-sm text-emerald-200/90 italic leading-relaxed font-serif">
                      "{currentNote.summary}"
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* New Note Creation Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Create New Cornell Note</span>
            </h3>

            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Action Potentials & Synaptic Transmission"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Subject
                </label>
                <select
                  value={newSubjectId}
                  onChange={(e) => setNewSubjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Biology, Neurons, Midterm"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition"
                >
                  Create Cornell Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
