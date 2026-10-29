import { Subject, Deck, Flashcard, CornellNote, StudyTask, ExamCountdown, UserStats } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'subj_bio', name: 'Biology & Life Sciences', color: 'emerald', iconName: 'Dna' },
  { id: 'subj_cs', name: 'Computer Science', color: 'sky', iconName: 'Cpu' },
  { id: 'subj_chem', name: 'Chemistry & Biochem', color: 'violet', iconName: 'FlaskConical' },
  { id: 'subj_math', name: 'Calculus & Linear Algebra', color: 'indigo', iconName: 'Binary' },
  { id: 'subj_psych', name: 'Psychology & Learning', color: 'amber', iconName: 'Brain' },
  { id: 'subj_hist', name: 'World History', color: 'rose', iconName: 'Landmark' },
];

export const INITIAL_DECKS: Deck[] = [
  {
    id: 'deck_bio_cell',
    title: 'Cellular Respiration & Organelles',
    subjectId: 'subj_bio',
    description: 'High-yield cellular biology concepts, mitochondrial membranes, and ATP production pathways.',
    createdAt: '2026-10-20',
  },
  {
    id: 'deck_cs_algo',
    title: 'Data Structures & Algorithms Mastery',
    subjectId: 'subj_cs',
    description: 'Big-O complexities, binary trees, dynamic programming patterns, and graph traversals.',
    createdAt: '2026-10-22',
  },
  {
    id: 'deck_psych_memory',
    title: 'Cognitive Science & Memory Encoding',
    subjectId: 'subj_psych',
    description: 'Spaced repetition mechanics, dual-coding theory, working memory limitations, and active recall.',
    createdAt: '2026-10-25',
  },
];

const today = new Date().toISOString().split('T')[0];

export const INITIAL_CARDS: Flashcard[] = [
  // Biology Deck
  {
    id: 'card_bio_1',
    deckId: 'deck_bio_cell',
    front: 'Where specifically does the Krebs (Citric Acid) Cycle take place within the eukaryotic cell?',
    back: 'The **mitochondrial matrix** (the fluid inside the inner mitochondrial membrane). Glycolysis occurs in the cytosol, and oxidative phosphorylation occurs across the inner mitochondrial membrane cristae.',
    hint: 'Inner fluid compartment of the power plant.',
    tag: 'Mitochondria',
    intervalDays: 1,
    easeFactor: 2.5,
    repetitions: 1,
    nextReviewDate: today,
    status: 'learning',
  },
  {
    id: 'card_bio_2',
    deckId: 'deck_bio_cell',
    front: 'What enzyme acts as a miniature rotary motor driven by proton motive force to synthesize ATP?',
    back: '**ATP Synthase** (Complex V). As H+ ions flow down their electrochemical gradient from the intermembrane space into the matrix, the F0 subunit rotates, catalyzing ADP + Pi -> ATP in the F1 subunit.',
    hint: 'Think of a hydroelectric turbine generating cellular power.',
    tag: 'Bioenergetics',
    intervalDays: 3,
    easeFactor: 2.5,
    repetitions: 2,
    nextReviewDate: today,
    status: 'review',
  },
  {
    id: 'card_bio_3',
    deckId: 'deck_bio_cell',
    front: 'What is the primary structural and functional difference between Rough ER and Smooth ER?',
    back: '- **Rough Endoplasmic Reticulum**: Studded with ribosomes; synthesizes and processes proteins destined for secretion or membranes.\n- **Smooth Endoplasmic Reticulum**: Lacks ribosomes; synthesizes lipids/phospholipids, metabolizes carbohydrates, and detoxifies drugs/poisons (prominent in liver cells).',
    hint: 'One has protein factories (ribosomes), the other synthesizes lipids and detoxifies.',
    tag: 'Organelles',
    intervalDays: 4,
    easeFactor: 2.6,
    repetitions: 3,
    nextReviewDate: today,
    status: 'mastered',
  },
  // CS Deck
  {
    id: 'card_cs_1',
    deckId: 'deck_cs_algo',
    front: 'What is the average and worst-case time complexity of QuickSort?',
    back: '- Average Case: **O(n log n)**\n- Worst Case: **O(n²)** (occurs when pivot selection repeatedly produces highly unbalanced partitions, e.g., already sorted array with first element as pivot).',
    hint: 'Log-linear on average; quadratic with disastrous pivot picks.',
    tag: 'Sorting',
    intervalDays: 1,
    easeFactor: 2.4,
    repetitions: 1,
    nextReviewDate: today,
    status: 'learning',
  },
  {
    id: 'card_cs_2',
    deckId: 'deck_cs_algo',
    front: 'How do you detect a cycle in a singly linked list in O(1) auxiliary space?',
    back: '**Floyd\'s Tortoise and Hare (Slow/Fast Pointer) Algorithm**:\nAdvance `slow` pointer by 1 step and `fast` pointer by 2 steps. If a cycle exists, `fast` will inevitably lap and meet `slow`. If `fast` reaches null, no cycle exists.',
    hint: 'One pointer moves twice as fast as the other.',
    tag: 'Pointers',
    intervalDays: 5,
    easeFactor: 2.5,
    repetitions: 3,
    nextReviewDate: today,
    status: 'mastered',
  },
  {
    id: 'card_cs_3',
    deckId: 'deck_cs_algo',
    front: 'What is the core difference between BFS (Breadth-First) and DFS (Depth-First) graph traversals?',
    back: '- **BFS**: Uses a **Queue (FIFO)**; explores layer-by-layer; finds the shortest path in unweighted graphs.\n- **DFS**: Uses a **Stack (LIFO)** or recursion; plunges as deep as possible before backtracking; ideal for topological sort, cycle detection, and maze solving.',
    hint: 'Queue for level order; Stack for diving deep.',
    tag: 'Graphs',
    intervalDays: 2,
    easeFactor: 2.5,
    repetitions: 1,
    nextReviewDate: today,
    status: 'learning',
  },
  // Psychology Deck
  {
    id: 'card_psych_1',
    deckId: 'deck_psych_memory',
    front: 'What is the "Testing Effect" (Retrieval Practice) in cognitive psychology?',
    back: 'The empirical finding that actively retrieving information from memory (e.g. flashcards, practice questions) produces significantly stronger, longer-lasting neural traces than passive study or re-reading of equal duration.',
    hint: 'Pulling memories out of the brain strengthens them more than putting them in.',
    tag: 'Active Recall',
    intervalDays: 3,
    easeFactor: 2.5,
    repetitions: 2,
    nextReviewDate: today,
    status: 'review',
  },
  {
    id: 'card_psych_2',
    deckId: 'deck_psych_memory',
    front: 'What does the Ebbinghaus Forgetting Curve show about memory decay without revision?',
    back: 'Without systematic review, approximately **70% of newly learned information is forgotten within 24 to 48 hours**. However, spaced reviews flatten the decay curve exponentially, locking facts into permanent long-term memory.',
    hint: 'Rapid initial drop-off that flattens with spaced repetition.',
    tag: 'Spaced Repetition',
    intervalDays: 7,
    easeFactor: 2.7,
    repetitions: 4,
    nextReviewDate: today,
    status: 'mastered',
  },
];

export const INITIAL_CORNELL_NOTES: CornellNote[] = [
  {
    id: 'note_1',
    title: 'The Science of High-Retention Learning & Active Recall',
    subjectId: 'subj_psych',
    cues: [
      'Why is passive reading deceptive?',
      'How does Spaced Repetition exploit the Ebbinghaus Curve?',
      'What is Interleaving vs Blocking?',
      'How does the Feynman Technique expose illusion of competence?',
    ],
    content: `# Cognitive Foundations of Effective Study

## 1. The Illusion of Fluency
When re-reading textbooks or highlighting sentences, students experience "fluency" — recognizing words feels effortless, tricking the brain into mistaking recognition for comprehension. Under exam conditions without cues, passive memory collapses.

## 2. Desirable Difficulty
Robert Bjork's principle states that learning is most durable when retrieval requires mental effort. If it feels easy, you are likely not encoding new synaptic pathways.

## 3. Spaced Repetition (The SM-2 Interval System)
- Initial interval: Review after 1 day.
- Second interval: Review after 3 days.
- Third interval: Review after 7 days.
- Fourth interval: Review after 21 days.
Each successful retrieval resets the decay slope, making the trace exponentially more resistant to decay.

## 4. Interleaving Practice
Instead of practicing one topic in huge blocks (AAAA BBBB CCCC), interleave mixed problems (ABACBC). This forces the brain to identify *which* strategy to apply, rather than blindly executing the same formula.`,
    summary: 'Active recall and spaced retrieval practice beat passive re-reading by order of magnitude. Desirable difficulty stimulates memory reconsolidation. True mastery is the ability to explain the core concept simply without reference materials.',
    tags: ['Learning Theory', 'Memory', 'Exam Strategy'],
    lastUpdated: '2026-10-26',
  },
  {
    id: 'note_2',
    title: 'Mitochondrial Bioenergetics & ATP Yield',
    subjectId: 'subj_bio',
    cues: [
      'Net ATP yield per glucose molecule?',
      'Role of NADH vs FADH2?',
      'Chemiosmotic hypothesis by Mitchell?',
      'Cyanide & Carbon Monoxide poisoning mechanism?',
    ],
    content: `# Aerobic Respiration: Energy Harvest

## 1. Overview of ATP Generation
- **Glycolysis**: Cytosol, Net 2 ATP + 2 NADH
- **Pyruvate Oxidation**: Mitochondrial Matrix, 2 NADH + 2 Acetyl-CoA
- **Citric Acid Cycle (TCA)**: Matrix, 2 ATP (GTP) + 6 NADH + 2 FADH2
- **Oxidative Phosphorylation**: Cristae, ~26 to 28 ATP via Electron Transport Chain (ETC)

## 2. The Electrochemical Proton Gradient
Complexes I, III, and IV pump protons from the matrix into the intermembrane space, creating both a pH gradient (chemical) and a voltage gradient (electrical). ATP Synthase uses this proton motive force to phosphorylate ADP.

## 3. Inhibitors of the ETC
- **Cyanide (CN-) & Carbon Monoxide (CO)**: Bind with high affinity to Complex IV (Cytochrome c oxidase), halting electron transfer and arresting ATP synthesis.`,
    summary: 'Aerobic metabolism yields approximately 30-32 net ATP per glucose. The proton motive force across the inner mitochondrial membrane drives rotary ATP Synthase. Inhibiting Complex IV arrests the entire energy cascade.',
    tags: ['Biochemistry', 'Metabolism', 'Cell Bio'],
    lastUpdated: '2026-10-24',
  },
];

export const INITIAL_TASKS: StudyTask[] = [
  {
    id: 'task_1',
    title: 'Review 15 Bioenergetics Flashcards',
    subjectId: 'subj_bio',
    priority: 'urgent',
    status: 'in_progress',
    estPomodoros: 2,
    completedPomodoros: 1,
    dueDate: today,
  },
  {
    id: 'task_2',
    title: 'Complete Graph Algorithm Practice Quiz',
    subjectId: 'subj_cs',
    priority: 'high',
    status: 'todo',
    estPomodoros: 3,
    completedPomodoros: 0,
    dueDate: '2026-10-29',
  },
  {
    id: 'task_3',
    title: 'Write Cornell Notes on Cognitive Biases',
    subjectId: 'subj_psych',
    priority: 'medium',
    status: 'done',
    estPomodoros: 2,
    completedPomodoros: 2,
    dueDate: '2026-10-26',
  },
  {
    id: 'task_4',
    title: 'Solve 5 Calculus Optimization Problems',
    subjectId: 'subj_math',
    priority: 'high',
    status: 'todo',
    estPomodoros: 4,
    completedPomodoros: 0,
    dueDate: '2026-10-31',
  },
];

export const INITIAL_EXAMS: ExamCountdown[] = [
  {
    id: 'exam_1',
    title: 'Cellular Biology Midterm',
    subjectId: 'subj_bio',
    examDate: '2026-11-04',
    targetGrade: 'A (95%+)',
    weightPercentage: 25,
    keyTopics: 'Membranes, Glycolysis, Krebs Cycle, ATP Synthase, Signal Transduction',
  },
  {
    id: 'exam_2',
    title: 'Algorithms & Complexity Exam',
    subjectId: 'subj_cs',
    examDate: '2026-11-12',
    targetGrade: 'A+',
    weightPercentage: 35,
    keyTopics: 'Graph Traversals, Dynamic Programming, Master Theorem, Greedy Heuristics',
  },
  {
    id: 'exam_3',
    title: 'Cognitive Science Finals',
    subjectId: 'subj_psych',
    examDate: '2026-11-20',
    targetGrade: 'A',
    weightPercentage: 30,
    keyTopics: 'Memory Systems, Retrieval Models, Attention Mechanisms',
  },
];

// Generate last 14 days of realistic activity for the heatmap & stats
const getPastDateString = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const INITIAL_STATS: UserStats = {
  currentStreak: 5,
  bestStreak: 12,
  totalMinutes: 1420,
  totalCardsReviewed: 168,
  totalQuizzesCompleted: 14,
  dailyGoalMinutes: 90,
  studyDays: {
    [getPastDateString(0)]: 65,
    [getPastDateString(1)]: 90,
    [getPastDateString(2)]: 120,
    [getPastDateString(3)]: 85,
    [getPastDateString(4)]: 110,
    [getPastDateString(6)]: 75,
    [getPastDateString(7)]: 95,
    [getPastDateString(8)]: 50,
    [getPastDateString(9)]: 130,
    [getPastDateString(11)]: 80,
    [getPastDateString(12)]: 105,
    [getPastDateString(14)]: 60,
  },
};
