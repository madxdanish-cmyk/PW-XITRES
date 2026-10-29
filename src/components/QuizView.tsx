import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Trophy,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, Subject, Flashcard } from '../types';
import { aiService } from '../services/aiService';

interface QuizViewProps {
  subjects: Subject[];
  cards: Flashcard[];
  onRecordStudyTime: (minutes: number) => void;
  onIncrementQuizzesCompleted: () => void;
  onAddCardsToDeck?: (newCards: any[]) => void;
  initialTopic?: string;
  initialNotes?: string;
}

export const QuizView: React.FC<QuizViewProps> = ({
  subjects,
  cards,
  onRecordStudyTime,
  onIncrementQuizzesCompleted,
  onAddCardsToDeck,
  initialTopic = '',
  initialNotes = '',
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [notesContext, setNotesContext] = useState(initialNotes);
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(false);

  // Active quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{
    question: QuizQuestion;
    selectedIdx: number;
    isCorrect: boolean;
  }[]>([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [expandedMistakeIndex, setExpandedMistakeIndex] = useState<number | null>(null);

  // Quick preset topics
  const presetTopics = [
    'Cellular Respiration & ATP Synthase',
    'Data Structures: Binary Trees & Graphs',
    'Cognitive Science & Spaced Repetition',
    'Enzyme Kinetics & Michaelis-Menten',
    'Calculus: Derivatives & Optimization',
    'Psychology: Working Memory & Retrieval',
  ];

  // Start generating quiz
  const handleGenerateQuiz = async (customTopic?: string) => {
    const targetTopic = customTopic || topic;
    if (!targetTopic.trim() && !notesContext.trim()) return;

    setLoading(true);
    try {
      const generated = await aiService.generateQuiz(
        targetTopic,
        notesContext,
        questionCount
      );
      setQuizQuestions(generated);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setScore(0);
      setUserAnswers([]);
      setIsQuizCompleted(false);
      setExpandedMistakeIndex(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;

    const currentQ = quizQuestions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctIndex;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        question: currentQ,
        selectedIdx: selectedOption,
        isCorrect,
      },
    ]);

    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished Quiz
      setIsQuizCompleted(true);
      onIncrementQuizzesCompleted();
      onRecordStudyTime(Math.max(5, Math.round(quizQuestions.length * 2)));

      const percentage = Math.round((score / quizQuestions.length) * 100);
      if (percentage >= 70) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const currentQ = quizQuestions[currentIndex];
  const percentage = quizQuestions.length > 0 ? Math.round((score / quizQuestions.length) * 100) : 0;

  const getGrade = (pct: number) => {
    if (pct >= 90) return { letter: 'A+', text: 'Exceptional Mastery', color: 'text-emerald-400' };
    if (pct >= 80) return { letter: 'A', text: 'Strong Comprehension', color: 'text-emerald-300' };
    if (pct >= 70) return { letter: 'B', text: 'Good Understanding', color: 'text-sky-400' };
    if (pct >= 60) return { letter: 'C', text: 'Needs Some Review', color: 'text-amber-400' };
    return { letter: 'Needs Revision', text: 'Targeted Review Recommended', color: 'text-rose-400' };
  };

  const mistakes = userAnswers.filter((a) => !a.isCorrect);

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-5 sm:space-y-8 animate-in fade-in duration-300 overflow-x-hidden">
      {/* View Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <GraduationCap className="w-6 h-6 text-violet-400" />
          <span>Active Recall Diagnostic Quiz</span>
        </h2>
        <p className="text-xs text-slate-400">
          Simulate real exam pressure with instant diagnostic feedback and comprehensive explanations
        </p>
      </div>

      {quizQuestions.length === 0 ? (
        /* Quiz Generator Setup Screen */
        <div className="p-4 sm:p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Generate Instant Practice Exam
              </h3>
              <p className="text-xs text-slate-400">
                Choose a topic or paste study notes to construct an active recall test
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Study Topic / Exam Subject
              </label>
              <input
                type="text"
                placeholder="e.g. Krebs Cycle, Dynamic Programming, Photosynthesis..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Lecture Notes Excerpt (Optional Context)
              </label>
              <textarea
                rows={3}
                placeholder="Paste key notes or formulas to focus the questions on your specific curriculum..."
                value={notesContext}
                onChange={(e) => setNotesContext(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-xs text-slate-400 block mb-1.5">
                Quick Subject Inspiration:
              </span>
              <div className="flex flex-wrap gap-2">
                {presetTopics.map((pt) => (
                  <button
                    key={pt}
                    onClick={() => {
                      setTopic(pt);
                      handleGenerateQuiz(pt);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700/60"
                  >
                    {pt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Questions:</span>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white"
                >
                  <option value={3}>3 Questions (Quick Sprint)</option>
                  <option value={5}>5 Questions (Standard)</option>
                  <option value={8}>8 Questions (Deep Test)</option>
                </select>
              </div>

              <button
                onClick={() => handleGenerateQuiz()}
                disabled={loading || (!topic.trim() && !notesContext.trim())}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-violet-600/30 transition"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Generate Test with AI</span>
              </button>
            </div>
          </div>
        </div>
      ) : isQuizCompleted ? (
        /* Results Screen */
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-violet-600/30">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <span className={`text-3xl font-black ${getGrade(percentage).color}`}>
              {getGrade(percentage).letter}
            </span>
            <h3 className="text-2xl font-black text-white mt-1">
              Score: {score} / {quizQuestions.length} ({percentage}%)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {getGrade(percentage).text}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setQuizQuestions([]);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Create New Test</span>
            </button>

            <button
              onClick={() => {
                setCurrentIndex(0);
                setSelectedOption(null);
                setIsAnswerSubmitted(false);
                setScore(0);
                setUserAnswers([]);
                setIsQuizCompleted(false);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition shadow-md shadow-violet-600/30"
            >
              <span>Retake This Quiz</span>
            </button>
          </div>

          {/* Detailed Mistakes Review Accordion */}
          {mistakes.length > 0 && (
            <div className="text-left pt-6 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                <span>Review Missed Concepts ({mistakes.length})</span>
              </h4>

              <div className="space-y-3">
                {mistakes.map((m, idx) => {
                  const isExpanded = expandedMistakeIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2"
                    >
                      <div
                        onClick={() =>
                          setExpandedMistakeIndex(isExpanded ? null : idx)
                        }
                        className="flex items-start justify-between gap-3 cursor-pointer"
                      >
                        <span className="font-semibold text-xs text-slate-200">
                          {idx + 1}. {m.question.question}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
                          <span className="text-[10px] font-bold uppercase block text-red-400 mb-0.5">
                            Your Choice:
                          </span>
                          {m.question.options[m.selectedIdx]}
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                          <span className="text-[10px] font-bold uppercase block text-emerald-400 mb-0.5">
                            Correct Answer:
                          </span>
                          {m.question.options[m.question.correctIndex]}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                        <strong className="text-indigo-400 block mb-0.5 font-bold">
                          Explanation:
                        </strong>
                        {m.question.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Active Interactive Quiz Question Screen */
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">
                Question {currentIndex + 1} of {quizQuestions.length}
              </span>
              <div className="w-36 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-violet-500 h-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / quizQuestions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-300">
                Current Score: <strong className="text-emerald-400">{score}</strong>
              </span>
              <button
                onClick={() => setQuizQuestions([])}
                className="text-xs text-slate-500 hover:text-white px-2 py-1 rounded-lg"
              >
                Quit Quiz
              </button>
            </div>
          </div>

          {/* Question Card */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed">
              {currentQ?.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ?.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let optionStyles = 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyles = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                  } else if (isSelected && !isCorrect) {
                    optionStyles = 'bg-rose-500/20 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                  } else {
                    optionStyles = 'bg-slate-950/40 border-slate-800/40 opacity-40 text-slate-500';
                  }
                } else if (isSelected) {
                  optionStyles = 'bg-violet-600/20 border-violet-500 text-white ring-1 ring-violet-500';
                }

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${optionStyles}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1">
                      {option}
                    </span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Explanation box after submit */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 space-y-1 animate-in fade-in duration-300">
                <span className="text-indigo-400 font-bold block uppercase tracking-wider text-[10px]">
                  Professor Rationale & Explanation:
                </span>
                <p className="leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Submit / Next Button */}
            <div className="flex items-center justify-end pt-2">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold text-xs transition shadow-md shadow-violet-600/30"
                >
                  Confirm Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/30"
                >
                  <span>
                    {currentIndex < quizQuestions.length - 1
                      ? 'Next Question'
                      : 'View Final Diagnostic'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
