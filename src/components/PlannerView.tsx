import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Timer,
  Trash2,
  Sparkles,
  ArrowRight,
  Flame,
  X,
  Tag,
} from 'lucide-react';
import { StudyTask, ExamCountdown, Subject } from '../types';

interface PlannerViewProps {
  tasks: StudyTask[];
  exams: ExamCountdown[];
  subjects: Subject[];
  onSaveTasks: (tasks: StudyTask[]) => void;
  onSaveExams: (exams: ExamCountdown[]) => void;
  onStartPomodoroForTask: (task: StudyTask) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  tasks,
  exams,
  subjects,
  onSaveTasks,
  onSaveExams,
  onStartPomodoroForTask,
}) => {
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewExamModalOpen, setIsNewExamModalOpen] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubjectId, setNewTaskSubjectId] = useState(subjects[0]?.id || '');
  const [newTaskPriority, setNewTaskPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('high');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(2);
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // New exam form state
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamSubjectId, setNewExamSubjectId] = useState(subjects[0]?.id || '');
  const [newExamDate, setNewExamDate] = useState('');
  const [newExamGrade, setNewExamGrade] = useState('A');
  const [newExamWeight, setNewExamWeight] = useState(25);
  const [newExamTopics, setNewExamTopics] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const getDaysUntil = (dateStr: string) => {
    const target = new Date(dateStr).getTime();
    const curr = new Date(todayStr).getTime();
    return Math.ceil((target - curr) / (1000 * 60 * 60 * 24));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: StudyTask = {
      id: `task_${Date.now()}`,
      title: newTaskTitle.trim(),
      subjectId: newTaskSubjectId,
      priority: newTaskPriority,
      status: 'todo',
      estPomodoros: newTaskPomodoros,
      completedPomodoros: 0,
      dueDate: newTaskDueDate || undefined,
    };

    onSaveTasks([newTask, ...tasks]);
    setIsNewTaskModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDueDate('');
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle.trim() || !newExamDate) return;

    const newExam: ExamCountdown = {
      id: `exam_${Date.now()}`,
      title: newExamTitle.trim(),
      subjectId: newExamSubjectId,
      examDate: newExamDate,
      targetGrade: newExamGrade,
      weightPercentage: newExamWeight,
      keyTopics: newExamTopics.trim(),
    };

    onSaveExams([...exams, newExam]);
    setIsNewExamModalOpen(false);
    setNewExamTitle('');
    setNewExamDate('');
    setNewExamTopics('');
  };

  const handleMoveTaskStatus = (
    taskId: string,
    newStatus: 'todo' | 'in_progress' | 'done'
  ) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
    onSaveTasks(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    onSaveTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleDeleteExam = (examId: string) => {
    onSaveExams(exams.filter((e) => e.id !== examId));
  };

  const priorityColors = {
    urgent: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    high: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    medium: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  // Weekly study schedule template
  const weeklySchedule = [
    { day: 'Mon', focus: 'Biology Cellular Respiration & CS Trees', hours: '2.5 hrs' },
    { day: 'Tue', focus: 'Active Recall Quizzes & Biochemistry', hours: '2.0 hrs' },
    { day: 'Wed', focus: 'Calculus Problem Sets & Optimization', hours: '3.0 hrs' },
    { day: 'Thu', focus: 'Cognitive Science Notes & Spaced SRS', hours: '2.0 hrs' },
    { day: 'Fri', focus: 'Algorithm Mock Coding & Exam Review', hours: '2.5 hrs' },
    { day: 'Sat', focus: 'Deep Flashcard Revision (All Decks)', hours: '3.0 hrs' },
    { day: 'Sun', focus: 'Weekly Reset, Planning & Light Reading', hours: '1.5 hrs' },
  ];

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-8 animate-in fade-in duration-300 overflow-x-hidden">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-sky-400" />
            <span>Study Planner &amp; Exam Countdowns</span>
          </h2>
          <p className="text-xs text-slate-400">
            Keep upcoming finals in sight, budget focus pomodoros, and execute daily tasks
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => setIsNewExamModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Plus className="w-4 h-4 text-rose-400" />
            <span>Add Exam</span>
          </button>
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Study Task</span>
          </button>
        </div>
      </div>

      {/* Exam Countdowns Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-400" />
            <span>Exam &amp; Finals Countdowns ({exams.length})</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {exams.map((exam) => {
            const daysLeft = getDaysUntil(exam.examDate);
            const subject = subjects.find((s) => s.id === exam.subjectId);
            const isUrgent = daysLeft <= 7;

            return (
              <div
                key={exam.id}
                className={`p-5 rounded-2xl border transition relative group overflow-hidden ${
                  isUrgent
                    ? 'bg-gradient-to-br from-slate-900 to-rose-950/30 border-rose-500/30 shadow-lg'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {subject?.name || 'Academic'}
                  </span>
                  <button
                    onClick={() => handleDeleteExam(exam.id)}
                    className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="font-bold text-white text-base mt-1 line-clamp-1">
                  {exam.title}
                </h4>

                {/* Days Left Huge Pill */}
                <div className="my-4 flex items-baseline gap-2">
                  <span
                    className={`text-4xl font-black ${
                      isUrgent ? 'text-rose-400' : 'text-sky-400'
                    }`}
                  >
                    {daysLeft > 0 ? daysLeft : 0}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {daysLeft === 1 ? 'day remaining' : 'days remaining'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span>Target Grade:</span>
                    <strong className="text-emerald-400 font-bold">
                      {exam.targetGrade || 'A'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Course Weight:</span>
                    <strong className="text-slate-200">
                      {exam.weightPercentage ? `${exam.weightPercentage}%` : 'N/A'}
                    </strong>
                  </div>
                  {exam.keyTopics && (
                    <div className="text-[11px] text-slate-400 pt-1 line-clamp-2">
                      <strong className="text-slate-300">Topics:</strong> {exam.keyTopics}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Kanban Columns (To Do, In Progress, Mastered) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Study Task Board
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['todo', 'in_progress', 'done'] as const).map((columnKey) => {
            const columnTasks = tasks.filter((t) => t.status === columnKey);
            const columnTitles = {
              todo: 'To Review / To Do',
              in_progress: 'In Active Focus',
              done: 'Completed & Mastered',
            };
            const colColors = {
              todo: 'border-slate-800 text-slate-300',
              in_progress: 'border-indigo-500/40 text-indigo-300',
              done: 'border-emerald-500/40 text-emerald-300',
            };

            return (
              <div
                key={columnKey}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
                    {columnTitles[columnKey]}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 min-h-[300px]">
                  {columnTasks.map((task) => {
                    const subject = subjects.find((s) => s.id === task.subjectId);
                    return (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition space-y-2 group shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-slate-400">
                            {subject?.name || 'General'}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                              priorityColors[task.priority]
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        <h5 className="font-semibold text-xs text-white leading-snug">
                          {task.title}
                        </h5>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            🍅 {task.completedPomodoros}/{task.estPomodoros}
                          </span>
                          {task.dueDate && (
                            <span className="text-[10px] text-slate-500">
                              Due: {task.dueDate}
                            </span>
                          )}
                        </div>

                        {/* Card Action Controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                          {columnKey !== 'done' && (
                            <button
                              onClick={() => onStartPomodoroForTask(task)}
                              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                            >
                              <Timer className="w-3.5 h-3.5" />
                              <span>Focus (25m)</span>
                            </button>
                          )}

                          <div className="flex items-center gap-1.5 ml-auto">
                            {columnKey !== 'todo' && (
                              <button
                                onClick={() => handleMoveTaskStatus(task.id, 'todo')}
                                title="Move to To Do"
                                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white"
                              >
                                ←
                              </button>
                            )}
                            {columnKey !== 'in_progress' && (
                              <button
                                onClick={() => handleMoveTaskStatus(task.id, 'in_progress')}
                                title="Move to In Progress"
                                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-indigo-400 hover:text-indigo-300"
                              >
                                {columnKey === 'todo' ? '→' : '←'}
                              </button>
                            )}
                            {columnKey !== 'done' && (
                              <button
                                onClick={() => handleMoveTaskStatus(task.id, 'done')}
                                title="Mark Done"
                                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-emerald-400 hover:text-emerald-300"
                              >
                                ✓
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {columnTasks.length === 0 && (
                    <div className="h-28 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-600 text-xs">
                      No tasks in this lane
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Revision Timetable */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Weekly Revision Cadence
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weeklySchedule.map((ws, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-indigo-400">{ws.day}</span>
                <span className="text-[10px] font-semibold text-slate-500">{ws.hours}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                {ws.focus}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">New Study Task</h3>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Task Title
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Master Glycolysis 10 steps"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Subject
                  </label>
                  <select
                    value={newTaskSubjectId}
                    onChange={(e) => setNewTaskSubjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
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
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Est. Pomodoros (25m)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={newTaskPomodoros}
                    onChange={(e) => setNewTaskPomodoros(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Exam Modal */}
      {isNewExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Add Upcoming Exam</h3>
              <button
                onClick={() => setIsNewExamModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Exam Title
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Organic Chemistry II Final"
                  value={newExamTitle}
                  onChange={(e) => setNewExamTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Subject
                  </label>
                  <select
                    value={newExamSubjectId}
                    onChange={(e) => setNewExamSubjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
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
                    Exam Date
                  </label>
                  <input
                    required
                    type="date"
                    value={newExamDate}
                    onChange={(e) => setNewExamDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Target Grade
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. A (95%)"
                    value={newExamGrade}
                    onChange={(e) => setNewExamGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Weight (% of grade)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newExamWeight}
                    onChange={(e) => setNewExamWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Key Syllabus Topics
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Chapters 4-9, Aldehydes, Ketones, NMR Spectroscopy"
                  value={newExamTopics}
                  onChange={(e) => setNewExamTopics(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewExamModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
