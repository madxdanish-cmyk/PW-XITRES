import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Sparkles,
  RotateCw,
  Eye,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Trash2,
  Edit2,
  X,
  Search,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Deck, Flashcard, Subject } from '../types';
import { aiService } from '../services/aiService';

interface FlashcardsViewProps {
  decks: Deck[];
  cards: Flashcard[];
  subjects: Subject[];
  onSaveCards: (cards: Flashcard[]) => void;
  onSaveDecks: (decks: Deck[]) => void;
  onRecordStudyTime: (minutes: number) => void;
  onIncrementCardsReviewed: (count: number) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  decks,
  cards,
  subjects,
  onSaveCards,
  onSaveDecks,
  onRecordStudyTime,
  onIncrementCardsReviewed,
}) => {
  const [selectedDeckId, setSelectedDeckId] = useState<string>(decks[0]?.id || '');
  const [studyMode, setStudyMode] = useState<boolean>(false);
  const [studyIndex, setStudyIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [sessionReviewedCount, setSessionReviewedCount] = useState<number>(0);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);

  // Modals & Forms
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isNewDeckModalOpen, setIsNewDeckModalOpen] = useState(false);

  // AI Generator state
  const [aiTopic, setAiTopic] = useState('');
  const [aiNotes, setAiNotes] = useState('');
  const [aiCount, setAiCount] = useState(6);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGeneratedCards, setAiGeneratedCards] = useState<any[]>([]);

  // New Card state
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [newCardHint, setNewCardHint] = useState('');
  const [newCardTag, setNewCardTag] = useState('');

  // New Deck state
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckSubjectId, setNewDeckSubjectId] = useState(subjects[0]?.id || '');
  const [newDeckDesc, setNewDeckDesc] = useState('');

  // Search in card manager
  const [searchTerm, setSearchTerm] = useState('');

  const currentDeck = decks.find((d) => d.id === selectedDeckId) || decks[0];
  const deckCards = cards.filter((c) => c.deckId === currentDeck?.id);

  // Cards due for review (nextReviewDate <= today)
  const today = new Date().toISOString().split('T')[0];
  const dueCardsInDeck = deckCards.filter((c) => c.nextReviewDate <= today);

  // Active study cards queue (prefer due cards, or all deck cards if none are due)
  const studyQueue = dueCardsInDeck.length > 0 ? dueCardsInDeck : deckCards;
  const currentCard = studyQueue[studyIndex];

  // Keyboard navigation during study
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!studyMode || sessionCompleted) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped) {
        if (e.key === '1') handleRateCard('again');
        if (e.key === '2') handleRateCard('hard');
        if (e.key === '3') handleRateCard('good');
        if (e.key === '4') handleRateCard('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [studyMode, isFlipped, sessionCompleted, studyIndex, studyQueue]);

  // SM-2 Spaced Repetition calculation
  const handleRateCard = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;

    let newInterval = currentCard.intervalDays;
    let newEase = currentCard.easeFactor;
    let newReps = currentCard.repetitions;
    let newStatus = currentCard.status;

    if (rating === 'again') {
      newInterval = 1;
      newReps = 0;
      newEase = Math.max(1.3, newEase - 0.2);
      newStatus = 'learning';
    } else if (rating === 'hard') {
      newInterval = Math.max(1, Math.round(newInterval * 1.2));
      newEase = Math.max(1.3, newEase - 0.15);
      newStatus = 'learning';
    } else if (rating === 'good') {
      newReps += 1;
      newInterval = Math.round(newInterval * newEase);
      newStatus = newReps >= 3 ? 'mastered' : 'review';
    } else if (rating === 'easy') {
      newReps += 1;
      newEase += 0.15;
      newInterval = Math.round(newInterval * newEase * 1.3);
      newStatus = 'mastered';
    }

    // Calculate next review date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + newInterval);
    const nextReviewDateStr = nextDate.toISOString().split('T')[0];

    const updatedCards = cards.map((c) =>
      c.id === currentCard.id
        ? {
            ...c,
            intervalDays: newInterval,
            easeFactor: newEase,
            repetitions: newReps,
            status: newStatus,
            nextReviewDate: nextReviewDateStr,
            lastReviewedDate: today,
          }
        : c
    );

    onSaveCards(updatedCards);
    onIncrementCardsReviewed(1);
    setSessionReviewedCount((prev) => prev + 1);

    // Advance queue
    if (studyIndex < studyQueue.length - 1) {
      setStudyIndex((prev) => prev + 1);
      setIsFlipped(false);
      setShowHint(false);
    } else {
      setSessionCompleted(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      // Record 5 minutes study time for session
      onRecordStudyTime(Math.max(3, Math.round(studyQueue.length * 1.5)));
    }
  };

  const handleStartStudy = () => {
    if (deckCards.length === 0) return;
    setStudyMode(true);
    setStudyIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setSessionReviewedCount(0);
    setSessionCompleted(false);
  };

  // AI Card Generation handler
  const handleGenerateAiCards = async () => {
    if (!aiTopic.trim() && !aiNotes.trim()) return;
    setAiLoading(true);
    try {
      const generated = await aiService.generateFlashcards(aiTopic, aiNotes, aiCount);
      setAiGeneratedCards(generated);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleImportAiCards = () => {
    if (aiGeneratedCards.length === 0 || !currentDeck) return;

    const newCards: Flashcard[] = aiGeneratedCards.map((g, i) => ({
      id: `card_ai_${Date.now()}_${i}`,
      deckId: currentDeck.id,
      front: g.front,
      back: g.back,
      hint: g.hint || '',
      tag: g.tag || currentDeck.title.slice(0, 15),
      intervalDays: 1,
      easeFactor: 2.5,
      repetitions: 0,
      nextReviewDate: today,
      status: 'new',
    }));

    onSaveCards([...cards, ...newCards]);
    setIsAiModalOpen(false);
    setAiGeneratedCards([]);
    setAiTopic('');
    setAiNotes('');
  };

  // Add single manual card
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardFront.trim() || !newCardBack.trim() || !currentDeck) return;

    const newCard: Flashcard = {
      id: `card_${Date.now()}`,
      deckId: currentDeck.id,
      front: newCardFront.trim(),
      back: newCardBack.trim(),
      hint: newCardHint.trim(),
      tag: newCardTag.trim() || 'General',
      intervalDays: 1,
      easeFactor: 2.5,
      repetitions: 0,
      nextReviewDate: today,
      status: 'new',
    };

    onSaveCards([...cards, newCard]);
    setIsAddCardModalOpen(false);
    setNewCardFront('');
    setNewCardBack('');
    setNewCardHint('');
    setNewCardTag('');
  };

  // Create new deck
  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckTitle.trim()) return;

    const newDeck: Deck = {
      id: `deck_${Date.now()}`,
      title: newDeckTitle.trim(),
      subjectId: newDeckSubjectId,
      description: newDeckDesc.trim() || 'Custom study collection',
      createdAt: today,
    };

    onSaveDecks([...decks, newDeck]);
    setSelectedDeckId(newDeck.id);
    setIsNewDeckModalOpen(false);
    setNewDeckTitle('');
    setNewDeckDesc('');
  };

  const handleDeleteCard = (cardId: string) => {
    onSaveCards(cards.filter((c) => c.id !== cardId));
  };

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-300 overflow-x-hidden">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-amber-400" />
            <span>Spaced Repetition Flashcards</span>
          </h2>
          <p className="text-xs text-slate-400">
            SM-2 algorithm calculates exact review intervals to lock facts into permanent memory
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsNewDeckModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Deck</span>
          </button>
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-violet-600/30 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Card Generator</span>
          </button>
        </div>
      </div>

      {/* If Study Mode is Active: Show Interactive Flip Card */}
      {studyMode ? (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Study Header & Progress */}
          <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">
                Card {studyIndex + 1} of {studyQueue.length}
              </span>
              <div className="w-40 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-300"
                  style={{
                    width: `${((studyIndex + 1) / studyQueue.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <button
              onClick={() => setStudyMode(false)}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
            >
              Exit Review
            </button>
          </div>

          {sessionCompleted ? (
            /* Session Completed Screen */
            <div className="p-10 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-5 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                Review Session Completed!
              </h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                You successfully reviewed {sessionReviewedCount} cards. Your retrieval strength and memory intervals have been updated!
              </p>
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={handleStartStudy}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  Review Again
                </button>
                <button
                  onClick={() => setStudyMode(false)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                >
                  Back to Decks
                </button>
              </div>
            </div>
          ) : (
            /* 3D Flip Card Container */
            <div className="perspective-1000">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative w-full min-h-[280px] sm:min-h-[380px] rounded-2xl sm:rounded-3xl p-5 sm:p-8 cursor-pointer select-none transition-all duration-500 transform-style-3d border shadow-2xl flex flex-col justify-between ${
                  isFlipped
                    ? 'bg-slate-900 border-indigo-500/40'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Front Side */}
                {!isFlipped ? (
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {currentCard?.tag || 'Question'}
                      </span>
                      <span className="text-xs text-slate-500">
                        Space or Click to Flip
                      </span>
                    </div>

                    <div className="py-8 my-auto text-center">
                      <h3 className="text-xl md:text-2xl font-semibold text-white leading-relaxed">
                        {currentCard?.front}
                      </h3>

                      {currentCard?.hint && (
                        <div className="mt-4">
                          {showHint ? (
                            <p className="text-xs text-amber-300/90 italic bg-amber-500/10 border border-amber-500/20 py-2 px-4 rounded-xl inline-block">
                              💡 Hint: {currentCard.hint}
                            </p>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowHint(true);
                              }}
                              className="text-xs text-slate-500 hover:text-amber-400 transition inline-flex items-center gap-1.5"
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                              <span>Reveal Hint</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Click card or press Spacebar to see answer</span>
                    </div>
                  </div>
                ) : (
                  /* Back Side (Answer & SRS rating buttons) */
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        Answer & Explanation
                      </span>
                      <span className="text-xs text-slate-500">
                        Rate retrieval difficulty below
                      </span>
                    </div>

                    <div className="py-6 my-auto text-left max-w-xl mx-auto">
                      <div className="text-base md:text-lg text-slate-100 leading-relaxed whitespace-pre-line font-medium">
                        {currentCard?.back}
                      </div>
                    </div>

                    {/* Spaced Repetition Rating Buttons */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-800"
                    >
                      <button
                        onClick={() => handleRateCard('again')}
                        className="py-2.5 px-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold flex flex-col items-center transition"
                      >
                        <span className="font-bold">Again</span>
                        <span className="text-[10px] text-red-400">&lt; 10m (1)</span>
                      </button>
                      <button
                        onClick={() => handleRateCard('hard')}
                        className="py-2.5 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex flex-col items-center transition"
                      >
                        <span className="font-bold">Hard</span>
                        <span className="text-[10px] text-amber-400">+1 day (2)</span>
                      </button>
                      <button
                        onClick={() => handleRateCard('good')}
                        className="py-2.5 px-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold flex flex-col items-center transition"
                      >
                        <span className="font-bold">Good</span>
                        <span className="text-[10px] text-sky-400">+3 days (3)</span>
                      </button>
                      <button
                        onClick={() => handleRateCard('easy')}
                        className="py-2.5 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex flex-col items-center transition"
                      >
                        <span className="font-bold">Easy</span>
                        <span className="text-[10px] text-emerald-400">+7 days (4)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Regular Deck Overview & Card Manager */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Col: Decks List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                Decks ({decks.length})
              </h3>
            </div>

            <div className="space-y-2.5">
              {decks.map((deck) => {
                const count = cards.filter((c) => c.deckId === deck.id).length;
                const dueCount = cards.filter(
                  (c) => c.deckId === deck.id && c.nextReviewDate <= today
                ).length;
                const isSelected = deck.id === selectedDeckId;
                const subject = subjects.find((s) => s.id === deck.subjectId);

                return (
                  <div
                    key={deck.id}
                    onClick={() => setSelectedDeckId(deck.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">
                        {subject?.name || 'General'}
                      </span>
                      {dueCount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {dueCount} due
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-sm mt-1">{deck.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {deck.description}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/60 text-xs text-slate-400">
                      <span>{count} flashcards</span>
                      <span className="text-indigo-400 font-semibold flex items-center gap-1">
                        Select Deck <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 2 Cols: Selected Deck Details & Cards Manager */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected Deck Hero Card */}
            {currentDeck && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-indigo-500/20 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Active Study Deck
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">
                    {currentDeck.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-md">
                    {currentDeck.description}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                    <span>Total Cards: <strong className="text-white">{deckCards.length}</strong></span>
                    <span>•</span>
                    <span>Due Today: <strong className="text-amber-400">{dueCardsInDeck.length}</strong></span>
                    <span>•</span>
                    <span>Mastered: <strong className="text-emerald-400">{deckCards.filter(c => c.status === 'mastered').length}</strong></span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <button
                    onClick={handleStartStudy}
                    disabled={deckCards.length === 0}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Review Due Cards ({dueCardsInDeck.length || deckCards.length})</span>
                  </button>

                  <button
                    onClick={() => setIsAddCardModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Card</span>
                  </button>
                </div>
              </div>
            )}

            {/* Deck Cards List & Search */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search cards in this deck..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <span className="text-xs text-slate-400 shrink-0">
                  Showing {deckCards.length} cards
                </span>
              </div>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {deckCards
                  .filter(
                    (c) =>
                      c.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      c.back.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (c.tag && c.tag.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((card) => (
                    <div
                      key={card.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition flex items-start justify-between gap-4 group"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            {card.tag || 'Card'}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              card.status === 'mastered'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : card.status === 'review'
                                ? 'bg-sky-500/10 text-sky-400'
                                : 'bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {card.status.toUpperCase()}
                          </span>
                        </div>
                        <h5 className="font-semibold text-white text-xs leading-snug">
                          {card.front}
                        </h5>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {card.back}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-900 transition opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                {deckCards.length === 0 && (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No cards in this deck yet. Click "AI Card Generator" or "Add Card" to begin!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Flashcard Generator Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    AI Flashcard Generator
                  </h3>
                  <p className="text-xs text-slate-400">
                    Generate high-retention active recall cards from any topic or notes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Subject / Topic Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Glycolysis enzymes, Big-O Notation, Neurotransmitters..."
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Or Paste Lecture Notes / Text (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste lecture excerpts or textbook paragraphs to convert into flashcards..."
                  value={aiNotes}
                  onChange={(e) => setAiNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Card Count:</span>
                  <select
                    value={aiCount}
                    onChange={(e) => setAiCount(Number(e.target.value))}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white"
                  >
                    <option value={4}>4 Cards</option>
                    <option value={6}>6 Cards</option>
                    <option value={8}>8 Cards</option>
                    <option value={10}>10 Cards</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateAiCards}
                  disabled={aiLoading || (!aiTopic.trim() && !aiNotes.trim())}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 transition"
                >
                  {aiLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>Generate Cards</span>
                </button>
              </div>

              {/* Preview Generated Cards */}
              {aiGeneratedCards.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">
                      Generated {aiGeneratedCards.length} Flashcards
                    </span>
                    <button
                      onClick={handleImportAiCards}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/30"
                    >
                      Add All to {currentDeck.title}
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {aiGeneratedCards.map((c, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1"
                      >
                        <div className="font-semibold text-white">Q: {c.front}</div>
                        <div className="text-slate-400">A: {c.back}</div>
                        {c.hint && (
                          <div className="text-amber-400/80 text-[11px]">
                            💡 Hint: {c.hint}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Card Modal */}
      {isAddCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Add New Flashcard</h3>
              <button
                onClick={() => setIsAddCardModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Question (Prompt for Active Recall)
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. What is the rate-limiting enzyme of glycolysis?"
                  value={newCardFront}
                  onChange={(e) => setNewCardFront(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Answer (Detailed & Memorable)
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Phosphofructokinase-1 (PFK-1)..."
                  value={newCardBack}
                  onChange={(e) => setNewCardBack(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Hint (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Three-letter acronym"
                    value={newCardHint}
                    onChange={(e) => setNewCardHint(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Topic Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Enzymes"
                    value={newCardTag}
                    onChange={(e) => setNewCardTag(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCardModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Deck Modal */}
      {isNewDeckModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Create New Deck</h3>
              <button
                onClick={() => setIsNewDeckModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeck} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Deck Title
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Organic Chemistry Reactions"
                  value={newDeckTitle}
                  onChange={(e) => setNewDeckTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Subject Category
                </label>
                <select
                  value={newDeckSubjectId}
                  onChange={(e) => setNewDeckSubjectId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
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
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short summary of what this deck covers..."
                  value={newDeckDesc}
                  onChange={(e) => setNewDeckDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewDeckModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Create Deck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
