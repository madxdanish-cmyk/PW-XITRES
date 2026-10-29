// AI Study Service bridging client to backend Gemini endpoints

import { Flashcard, QuizQuestion, FeynmanExplanation } from '../types';

export const aiService = {
  // Generate flashcards from topic or notes
  async generateFlashcards(
    topic: string,
    notes?: string,
    count: number = 6,
    difficulty: string = 'intermediate'
  ): Promise<Omit<Flashcard, 'id' | 'deckId' | 'intervalDays' | 'easeFactor' | 'repetitions' | 'nextReviewDate' | 'status'>[]> {
    try {
      const res = await fetch('/api/study/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, notes, count, difficulty }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      return (data.cards || []).map((c: any) => ({
        front: c.front,
        back: c.back,
        hint: c.hint || '',
        tag: c.tag || topic || 'General',
      }));
    } catch (err) {
      console.warn('AI card generation fallback activated:', err);
      return [
        {
          front: `What is the core definition and importance of ${topic}?`,
          back: `The fundamental concept that underpins ${topic}. It defines the primary conditions and mechanism used to solve standard problems in this domain.`,
          hint: 'Think about the foundational axiom.',
          tag: topic || 'Key Concept',
        },
        {
          front: `What are the primary components or stages of ${topic}?`,
          back: `The key constituent parts: Stage 1 initiates the process, Stage 2 drives the transformation, and Stage 3 stabilizes the outcome.`,
          hint: 'Break it into chronological steps.',
          tag: 'Stages',
        },
        {
          front: `What is a common misconception or pitfall in ${topic}?`,
          back: `Students often confuse the primary mechanism with secondary effects. Pay close attention to boundary conditions.`,
          hint: 'Watch out for exceptions.',
          tag: 'Exam Tip',
        },
      ];
    }
  },

  // Generate Practice Quiz Questions
  async generateQuiz(
    topic: string,
    notes?: string,
    count: number = 5
  ): Promise<QuizQuestion[]> {
    try {
      const res = await fetch('/api/study/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, notes, count }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      return (data.quiz || []).map((q: any, i: number) => ({
        id: `q_gen_${Date.now()}_${i}`,
        question: q.question,
        options: q.options,
        correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
        explanation: q.explanation || 'Review fundamental definitions.',
      }));
    } catch (err) {
      console.warn('AI quiz generation fallback activated:', err);
      return [
        {
          id: `q_fb_1_${Date.now()}`,
          question: `In the study of ${topic}, what is the primary benefit of active recall over passive reading?`,
          options: [
            'It takes less total time with zero cognitive exertion',
            'It forces the brain to retrieve information, strengthening synaptic connections',
            'It guarantees instant 100% test scores without review',
            'It replaces the need to understand prerequisite concepts',
          ],
          correctIndex: 1,
          explanation: 'Testing oneself activates neural reconsolidation, yielding superior long-term memory durability compared to passive recognition.',
        },
        {
          id: `q_fb_2_${Date.now()}`,
          question: `When applying ${topic} to complex problem-solving, which approach is most effective?`,
          options: [
            'Immediately jumping to conclusions without analyzing given parameters',
            'Deconstructing the problem into first principles and fundamental laws',
            'Ignoring edge cases and relying purely on intuition',
            'Memorizing specific numbers rather than relationships',
          ],
          correctIndex: 1,
          explanation: 'First-principles thinking allows you to re-derive solutions even when exam problems present novel twists.',
        },
      ];
    }
  },

  // Feynman Technique Explainer
  async explainFeynman(concept: string, userLevel?: string): Promise<FeynmanExplanation> {
    try {
      const res = await fetch('/api/study/feynman-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept, userLevel }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('AI Feynman fallback activated:', err);
      return {
        concept,
        simpleSummary: `${concept} is a principle where balanced inputs determine an efficient, predictable output.`,
        analogy: `Imagine water flowing through connected pipes: if one pipe narrows, water backs up until the flow adapts. ${concept} works on this exact conservation flow balance.`,
        keySteps: [
          'Recognize the governing conditions and boundaries.',
          'Trace the cause-and-effect relationship between variables.',
          'Identify what happens if one element changes or is removed.',
        ],
        mnemonic: `Remember "F-L-O-W": Fundamental rules, Linking elements, Operating principles, Working outcome.`,
        checkQuestion: `Could you predict how ${concept} would react if the primary input doubled?`,
      };
    }
  },

  // AI Study Tutor Chat
  async askTutor(
    message: string,
    subject?: string,
    contextNotes?: string,
    history?: { role: 'user' | 'assistant'; content: string }[]
  ): Promise<string> {
    try {
      const res = await fetch('/api/study/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, subject, contextNotes, history }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.reply;
    } catch (err) {
      console.warn('AI Tutor fallback:', err);
      return `Here's a key study principle to help with **${subject || 'this topic'}**: Break the concept into its two most fundamental rules. Then, try explaining it out loud without looking at any notes (Active Recall). Where you hesitate or stumble is exactly where your knowledge gap is!`;
    }
  },

  // Cornell Notes Summary Generator
  async generateSummary(content: string): Promise<string> {
    try {
      const res = await fetch('/api/study/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.summary || 'Summary generated from notes.';
    } catch (err) {
      console.warn('AI summary fallback:', err);
      const sentences = content.split(/(?<=[.?!])\s+/).filter(Boolean);
      return sentences.slice(0, 3).join(' ') || 'Summary of key lecture principles and definitions.';
    }
  },

  // Cornell Notes Cue Retrieval Generator
  async generateCues(content: string): Promise<string[]> {
    try {
      const res = await fetch('/api/study/generate-cues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.cues || [];
    } catch (err) {
      console.warn('AI cues fallback:', err);
      return [
        'What is the core definition and importance of this topic?',
        'What are the key steps or mechanisms in this process?',
        'What is a common pitfall or exam question type to watch out for?',
      ];
    }
  },
};
