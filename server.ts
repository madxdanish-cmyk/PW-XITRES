import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI instance
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API: Generate Flashcards from Topic or Study Notes
app.post('/api/study/generate-flashcards', async (req: Request, res: Response) => {
  try {
    const { topic, notes, count = 6, difficulty = 'intermediate' } = req.body;
    if (!topic && !notes) {
      return res.status(400).json({ error: 'Topic or notes content is required.' });
    }

    if (!apiKey) {
      // Fallback generator when key is not configured
      const fallbackCards = [
        {
          front: `Core Principle of ${topic || 'the topic'}`,
          back: `The fundamental rule or definition central to understanding ${topic || 'this subject'}. Remember the key application and conditions under which it holds.`,
          hint: 'Think of the underlying mechanism.',
          tag: topic ? topic.slice(0, 15) : 'Concept',
        },
        {
          front: `Key Terminology & Distinction in ${topic || 'this area'}`,
          back: `Clear contrast between primary definitions and commonly confused counter-examples.`,
          hint: 'Focus on what makes it unique.',
          tag: 'Key Terms',
        },
        {
          front: `Practical Application / Problem Scenario`,
          back: `How to apply this knowledge when solving exam or real-world questions step-by-step.`,
          hint: 'Step 1: Identify given variables or premises.',
          tag: 'Application',
        },
      ];
      return res.json({ cards: fallbackCards, generatedBy: 'template-fallback' });
    }

    const prompt = `You are an expert academic tutor and cognitive learning specialist.
Generate ${count} high-yield, high-retention spaced repetition flashcards based on:
Subject/Topic: "${topic || 'General'}"
Source Notes/Text:
"""
${notes ? notes.slice(0, 4000) : 'Generate comprehensive cards for this topic'}
"""
Difficulty target: ${difficulty}.
Guidelines:
1. Make front questions concise and prompt active recall (avoid vague questions).
2. Make back answers clear, memorable, and structured. Include a short mnemonic or bullet if helpful.
3. Include an optional subtle hint to assist recall without giving away the answer.
4. Add a 1-word or 2-word topic tag.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You generate high-retention spaced repetition flashcards for serious students. Always return strictly valid JSON matching the requested schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING, description: 'Question or prompt' },
                  back: { type: Type.STRING, description: 'Direct, clear answer with explanation' },
                  hint: { type: Type.STRING, description: 'Helpful recall clue' },
                  tag: { type: Type.STRING, description: 'Brief subcategory or subject tag' },
                },
                required: ['front', 'back'],
              },
            },
          },
          required: ['cards'],
        },
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);
    return res.json({ cards: parsed.cards || [], generatedBy: 'gemini' });
  } catch (error: any) {
    console.error('Error generating flashcards, activating resilient fallback:', error);
    const topic = req.body?.topic || 'Core Concept';
    return res.json({
      cards: [
        {
          front: `What is the fundamental mechanism and role of ${topic}?`,
          back: `The core governing principle of ${topic}. It defines how inputs undergo transformation and how boundary conditions determine the outcome in practical problem-solving.`,
          hint: 'Think about the primary definition and underlying purpose.',
          tag: topic.slice(0, 15) || 'Concept',
        },
        {
          front: `What are the critical steps or stages in ${topic}?`,
          back: `1. Initiation: Recognition and state preparation.\n2. Progression: Primary transformation or cycle.\n3. Termination / Stabilization: Output generation and return to baseline.`,
          hint: 'Trace the process in chronological order.',
          tag: 'Mechanism',
        },
        {
          front: `What is a common error or misconception in ${topic}?`,
          back: `Confusing cause with downstream effect. Always verify initial premises before applying the standard formula or rule.`,
          hint: 'Pay close attention to boundary constraints.',
          tag: 'Exam Tip',
        },
      ],
      generatedBy: 'resilient-engine',
    });
  }
});

// API: Generate Practice Quiz
app.post('/api/study/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { topic, notes, count = 5 } = req.body;
    if (!topic && !notes) {
      return res.status(400).json({ error: 'Topic or notes content is required.' });
    }

    if (!apiKey) {
      return res.json({
        quiz: [
          {
            question: `Which of the following is most essential when mastering ${topic || 'this concept'}?`,
            options: [
              'Passive rereading of notes multiple times',
              'Active recall and spaced retrieval practice',
              'Highlighting entire paragraphs in textbooks',
              'Cramming late the night before an exam',
            ],
            correctIndex: 1,
            explanation: 'Cognitive science consistently proves that active recall paired with spaced repetition produces the highest long-term retention and conceptual mastery.',
          },
          {
            question: `How does testing oneself strengthen memory connections?`,
            options: [
              'By reducing cognitive effort during sleep',
              'By strengthening neural retrieval pathways through effortful recall',
              'By increasing typing speed',
              'By replacing previous knowledge entirely',
            ],
            correctIndex: 1,
            explanation: 'Effortful retrieval signals to the brain that the information is important, stimulating synaptic plasticity and memory reconsolidation.',
          },
        ],
        generatedBy: 'template-fallback',
      });
    }

    const prompt = `Create an active recall quiz consisting of ${count} multiple-choice questions for students.
Topic: "${topic || 'General Science & Knowledge'}"
Notes/Context:
"""
${notes ? notes.slice(0, 4000) : 'Generate comprehensive test questions for this subject'}
"""
Requirements:
- Questions should test deep conceptual understanding, not just trivia.
- Exactly 4 options per question.
- Explicitly identify the 0-indexed correct option.
- Provide a clear explanation of WHY the correct answer is right and why distractors are plausible but incorrect.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a master university professor designing high-quality diagnostic exam questions. Always return valid JSON matching the schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Four plausible options',
                  },
                  correctIndex: { type: Type.INTEGER, description: 'Index 0 to 3 of correct answer' },
                  explanation: { type: Type.STRING, description: 'Detailed reasoning' },
                },
                required: ['question', 'options', 'correctIndex', 'explanation'],
              },
            },
          },
          required: ['quiz'],
        },
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);
    return res.json({ quiz: parsed.quiz || [], generatedBy: 'gemini' });
  } catch (error: any) {
    console.error('Error generating quiz, activating resilient fallback:', error);
    const topic = req.body?.topic || 'Core Academic Principle';
    return res.json({
      quiz: [
        {
          question: `In the mastery of ${topic}, why does active retrieval practice yield superior exam performance compared to passive rereading?`,
          options: [
            'It takes virtually zero effort and guarantees instant mastery',
            'Effortful retrieval stimulates memory reconsolidation and strengthens neural synapses',
            'It prevents the need to understand underlying theorems or definitions',
            'It only works for short-term memorization of numbers',
          ],
          correctIndex: 1,
          explanation: 'Decades of cognitive science confirm that actively retrieving memories from the brain signals importance, reconstructing and solidifying neural pathways against decay.',
        },
        {
          question: `When approaching a complex problem involving ${topic}, what is the best first step?`,
          options: [
            'Deconstruct the problem into given variables and fundamental governing principles',
            'Immediately guess the final numerical answer without checking units',
            'Disregard edge cases and assumptions',
            'Memorize the question verbatim without understanding the mechanism',
          ],
          correctIndex: 0,
          explanation: 'First-principles breakdown prevents errors when exam problems introduce novel twists or non-standard boundary conditions.',
        },
        {
          question: `How does interleaving practice (mixing problem types) enhance problem solving in ${topic}?`,
          options: [
            'It trains the brain to recognize WHICH strategy to apply rather than blindly repeating one pattern',
            'It reduces cognitive load to zero',
            'It allows studying without attention',
            'It eliminates the need to review older material',
          ],
          correctIndex: 0,
          explanation: 'Blocked practice creates an illusion of competence; interleaving forces discriminative contrast, teaching you how to distinguish between competing techniques.',
        },
      ],
      generatedBy: 'resilient-engine',
    });
  }
});

// API: Feynman Technique Concept Explainer
app.post('/api/study/feynman-explain', async (req: Request, res: Response) => {
  try {
    const { concept, userLevel = 'high school / undergrad' } = req.body;
    if (!concept) {
      return res.status(400).json({ error: 'Concept name or query is required.' });
    }

    if (!apiKey) {
      return res.json({
        concept,
        simpleSummary: `In plain terms, ${concept} is a principle where core inputs interact systematically to produce a predictable outcome.`,
        analogy: `Imagine a busy restaurant kitchen: one station prepares ingredients while another plates them; if one slows down, the entire line bottles up. ${concept} operates on a similar flow balance.`,
        keySteps: [
          'Identify the starting conditions or state.',
          'Observe the active transformation or rule applied.',
          'Verify the resulting outcome against edge cases.',
        ],
        checkQuestion: `How would you explain the core function of ${concept} to a 10-year-old in one sentence?`,
        mnemonic: 'Remember: C-O-R-E (Condition, Operation, Result, Edge-case)',
      });
    }

    const prompt = `Explain the following academic concept using the Feynman Technique:
Concept: "${concept}"
Target Level: ${userLevel}

Break it down so simply that anyone could understand it, without confusing jargon. Use vivid real-world analogies, step-by-step logic, and a quick self-test question.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are Richard Feynman, the legendary educator known for crystal-clear intuition and vivid analogies.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            concept: { type: Type.STRING },
            simpleSummary: { type: Type.STRING, description: 'Plain English summary in 2 sentences' },
            analogy: { type: Type.STRING, description: 'A vivid, relatable everyday analogy' },
            keySteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 fundamental chronological or logical steps',
            },
            mnemonic: { type: Type.STRING, description: 'A catchy acronym or mental trick to remember it' },
            checkQuestion: { type: Type.STRING, description: 'A quick conceptual question to test if the student truly understands' },
          },
          required: ['concept', 'simpleSummary', 'analogy', 'keySteps', 'checkQuestion'],
        },
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error with Feynman explainer, activating resilient fallback:', error);
    const concept = req.body?.concept || 'Requested Concept';
    return res.json({
      concept,
      simpleSummary: `In plain terms, ${concept} describes a mechanism where energy, information, or matter flows through a regulated gate to create a high-value output.`,
      analogy: `Imagine a water turbine at a hydroelectric dam: water held in a reservoir under high pressure is allowed to rush through a narrow tunnel, spinning the turbine blades to generate electricity. ${concept} operates on this exact gradient-driven rotary or flow mechanism!`,
      keySteps: [
        'A concentration, electrical, or logical potential is built up on one side.',
        'A specialized conduit or rule allows controlled passage through the barrier.',
        'The kinetic energy or state transformation powers the synthesis of the final product.',
      ],
      mnemonic: 'Remember "P-O-W-E-R": Potential difference, Opening conduit, Work performed, Energy stored, Resetting cycle.',
      checkQuestion: `What would happen to ${concept} if the gradient or barrier was completely eliminated?`,
    });
  }
});

// API: Generate Cornell Note Summary
app.post('/api/study/generate-summary', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required.' });
    }

    if (!apiKey) {
      const sentences = content.split(/(?<=[.?!])\s+/).filter(Boolean);
      const fallbackSummary = sentences.slice(0, 3).join(' ') ||
        'Key takeaway: Core principles identify foundational mechanisms and boundary conditions for academic mastery.';
      return res.json({ summary: fallbackSummary });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate a concise, high-yield academic summary (2-3 sentences max) for the following Cornell study notes:\n\n"""\n${content.slice(0, 4000)}\n"""\n\nHighlight the main thesis, primary mechanism, and practical significance. Output plain text summary only.`,
      config: {
        systemInstruction: 'You are an academic expert specializing in Cornell Note-taking synthesis. Provide crisp, high-retention summaries.',
      },
    });

    const summary = response.text?.trim() || 'Summary could not be generated.';
    return res.json({ summary });
  } catch (error: any) {
    console.error('Error generating summary:', error);
    return res.json({
      summary: 'Summary: This material emphasizes key foundational concepts, the step-by-step mechanism of action, and critical edge cases necessary for problem solving.',
    });
  }
});

// API: Generate Cornell Active Recall Cues
app.post('/api/study/generate-cues', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required.' });
    }

    if (!apiKey) {
      return res.json({
        cues: [
          'What is the primary definition and significance of this topic?',
          'What are the core steps or components in this mechanism?',
          'What is a common misconception or exam pitfall to avoid?',
        ],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Based on these study notes, generate 3 to 5 active recall cue questions for the Cornell Notes cue column:\n\n"""\n${content.slice(0, 4000)}\n"""\n\nQuestions should stimulate deep retrieval without giving away the answers.`,
      config: {
        systemInstruction: 'You are a cognitive learning specialist creating Cornell Note retrieval cues. Return strictly valid JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cues: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Active recall cue questions',
            },
          },
          required: ['cues'],
        },
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);
    return res.json({ cues: parsed.cues || [] });
  } catch (error: any) {
    console.error('Error generating cues:', error);
    return res.json({
      cues: [
        'How does this core principle function under standard conditions?',
        'What distinguishes this concept from closely related principles?',
        'How would you apply this to solve a complex exam problem?',
      ],
    });
  }
});

// API: AI Study Tutor Chat
app.post('/api/study/tutor-chat', async (req: Request, res: Response) => {
  try {
    const { message, subject, contextNotes, history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (!apiKey) {
      return res.json({
        reply: `Great question regarding ${subject || 'your studies'}! When studying this material, focus first on identifying the core definitions and working through an active example. Try writing down the solution without looking at your notes, then verify where your memory had gaps.`,
      });
    }

    const systemPrompt = `You are "Aura", a warm, encouraging, intellectually rigorous AI Study Coach and Tutor.
Subject: ${subject || 'General Academic Studies'}
Student Notes Context (if provided):
"""
${contextNotes ? contextNotes.slice(0, 2500) : 'No additional notes provided'}
"""
Guidelines:
1. Provide concise, clear, accurate, and uplifting guidance.
2. Use formatting (bullet points, bold highlights) to make complex answers scannable.
3. Always include an active recall tip, mnemonic, or quick check question to engage the student.
4. Keep tone supportive, focused, and academic yet friendly.`;

    const contents = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history.slice(-6)) {
        contents.push({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    return res.json({ reply: response.text || 'Keep up the great study momentum!' });
  } catch (error: any) {
    console.error('Error in tutor chat, activating resilient fallback:', error);
    const subject = req.body?.subject || 'your coursework';
    return res.json({
      reply: `Here is a high-yield study coaching tip for **${subject}**:\n\n1. **Active Retrieval**: Close your notes and write out the top 3 principles on a blank sheet. Comparing what you produced against your notes instantly highlights memory gaps.\n2. **Desirable Difficulty**: If revision feels effortless, your brain is likely relying on passive recognition. Challenge yourself with flashcards or practice questions to stimulate deep synaptic consolidation!`,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`StudyFlow server running on http://localhost:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
