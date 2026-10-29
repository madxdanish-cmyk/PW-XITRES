export type Language = 'en' | 'hi';

export interface Translations {
  appName: string;
  tagline: string;
  langName: string;
  toggleLang: string;
  tabs: {
    dashboard: string;
    timer: string;
    flashcards: string;
    notes: string;
    quizzes: string;
    planner: string;
    tutor: string;
  };
  tabSubtitles: {
    dashboard: string;
    timer: string;
    flashcards: string;
    notes: string;
    quizzes: string;
    planner: string;
    tutor: string;
  };
  header: {
    feynman: string;
    sound: string;
    focus: string;
    login: string;
    whatsApp: string;
  };
  timer: {
    title: string;
    deepWork: string;
    breakTime: string;
    inSession: string;
    start: string;
    pause: string;
    reset: string;
    skip: string;
    zenEnter: string;
    zenExit: string;
    studyFocus: string;
    shortBreak: string;
    longBreak: string;
    selectDuration: string;
    customTime: string;
    hideCustom: string;
    setExactTime: string;
    hours: string;
    minutes: string;
    applyTime: string;
    linkTask: string;
    noTask: string;
    ambientSound: string;
    quotes: string[];
  };
  dashboard: {
    welcome: string;
    subWelcome: string;
    dailyGoal: string;
    streak: string;
    cardsDue: string;
    testsTaken: string;
    hoursStudied: string;
    quickActions: string;
    startTimer: string;
    practiceFlashcards: string;
    writeNotes: string;
    takeQuiz: string;
    upcomingExams: string;
    noExams: string;
    recentTasks: string;
  };
  flashcards: {
    title: string;
    subtitle: string;
    createDeck: string;
    addCard: string;
    startReview: string;
    frontQuestion: string;
    backAnswer: string;
    difficulty: string;
    easy: string;
    medium: string;
    hard: string;
  };
  notes: {
    title: string;
    subtitle: string;
    newNote: string;
    cuesCol: string;
    notesCol: string;
    summaryRow: string;
    aiSummaryBtn: string;
    aiCuesBtn: string;
    quizFromNotes: string;
  };
  quizzes: {
    title: string;
    subtitle: string;
    generateQuiz: string;
    startQuiz: string;
    score: string;
    questionsCount: string;
    checkAnswer: string;
    nextQuestion: string;
    retry: string;
  };
  planner: {
    title: string;
    subtitle: string;
    addTask: string;
    addExam: string;
    daysLeft: string;
    completed: string;
    pending: string;
  };
  tutor: {
    title: string;
    subtitle: string;
    askPlaceholder: string;
    sendBtn: string;
    suggestedTopics: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'XITRES MIND',
    tagline: 'Smart Study for Class 11th & 12th',
    langName: 'English',
    toggleLang: 'हिंदी में देखें',
    tabs: {
      dashboard: 'Dashboard',
      timer: 'Focus Timer',
      flashcards: 'Flashcards',
      notes: 'Class Notes',
      quizzes: 'Practice Tests',
      planner: 'Study Planner',
      tutor: 'AI Study Buddy',
    },
    tabSubtitles: {
      dashboard: 'Track your daily study progress, streak, and revision goals',
      timer: 'Set your study timer (25m to 24hr) and focus without distraction',
      flashcards: 'Revise formulas, definitions and key questions with easy cards',
      notes: 'Write clean lecture notes with questions on the side and summary at bottom',
      quizzes: 'Practice questions to score higher in 11th, 12th boards and entrance exams',
      planner: 'Stay on track with homework tasks and upcoming exam countdowns',
      tutor: 'Ask any question or clear your doubts in simple, easy-to-understand words',
    },
    header: {
      feynman: 'Feynman Helper',
      sound: 'Study Sounds',
      focus: 'Focus',
      login: 'Phone Login',
      whatsApp: 'WhatsApp Creator',
    },
    timer: {
      title: 'Study Focus Studio',
      deepWork: 'Study Session',
      breakTime: 'Break & Rest',
      inSession: 'Studying Now',
      start: 'Start',
      pause: 'Pause',
      reset: 'Reset',
      skip: 'Skip to Break',
      zenEnter: 'Zen Fullscreen',
      zenExit: 'Exit Zen',
      studyFocus: 'Study Focus',
      shortBreak: 'Short Break (5m)',
      longBreak: 'Long Break (15m)',
      selectDuration: 'Choose Study Time (25m up to 24 Hours Marathon):',
      customTime: 'Custom Time',
      hideCustom: 'Hide Custom',
      setExactTime: 'Set exact hours and minutes to study:',
      hours: 'Hours (0-24)',
      minutes: 'Minutes (0-59)',
      applyTime: 'Set Focus Time',
      linkTask: 'Study for a Specific Task / Chapter:',
      noTask: 'General Study (All Subjects)',
      ambientSound: 'Background Study Music / Sounds',
      quotes: [
        '“Success in 11th & 12th comes from daily consistency, not last-minute cramming.”',
        '“Every 1 hour of focused study today brings you closer to your dream college.”',
        '“Small daily revision makes big exam syllabus feel easy.”',
        '“Focus on understanding the concept, marks will follow naturally.”',
        '“Put your phone on silent, take a deep breath, and let’s master this chapter!”',
      ],
    },
    dashboard: {
      welcome: 'Welcome Back, Champion!',
      subWelcome: 'Ready to study for Class 11th & 12th today?',
      dailyGoal: 'Daily Study Goal',
      streak: 'Day Streak',
      cardsDue: 'Flashcards to Revise',
      testsTaken: 'Quizzes Completed',
      hoursStudied: 'Hours Studied',
      quickActions: 'Quick Study Shortcuts',
      startTimer: 'Start Study Timer',
      practiceFlashcards: 'Revise Flashcards',
      writeNotes: 'Write Lecture Notes',
      takeQuiz: 'Take Practice Quiz',
      upcomingExams: 'Upcoming Exams Countdown',
      noExams: 'No exams added yet. Add your term exams, pre-boards, or tests!',
      recentTasks: 'Your Study Tasks & Homework',
    },
    flashcards: {
      title: 'Formula & Concept Flashcards',
      subtitle: 'Fast revision cards to memorize formulas, equations, and definitions',
      createDeck: 'Create New Deck / Subject',
      addCard: 'Add New Flashcard',
      startReview: 'Start Revision Now',
      frontQuestion: 'Front (Question / Formula / Term)',
      backAnswer: 'Back (Answer / Explanation)',
      difficulty: 'How well did you know this?',
      easy: 'Easy (Know it well)',
      medium: 'Medium (Need revision)',
      hard: 'Hard (Forgot / Tough)',
    },
    notes: {
      title: 'Cornell Lecture Notes',
      subtitle: 'Questions on left, notes in middle, and summary at bottom for 2x faster recall',
      newNote: 'Create New Note',
      cuesCol: 'Key Questions & Formulas (Left)',
      notesCol: 'Lecture Explanations (Center)',
      summaryRow: 'Quick Chapter Summary (Bottom)',
      aiSummaryBtn: 'AI Auto-Summary',
      aiCuesBtn: 'AI Generate Questions',
      quizFromNotes: 'Practice Quiz from this Note',
    },
    quizzes: {
      title: 'Practice Tests & Recall Quizzes',
      subtitle: 'Self-test your preparation with instant answers and simple explanations',
      generateQuiz: 'Create New Practice Test',
      startQuiz: 'Start Test',
      score: 'Your Score',
      questionsCount: 'Questions',
      checkAnswer: 'Check My Answer',
      nextQuestion: 'Next Question',
      retry: 'Practice Again',
    },
    planner: {
      title: 'Homework & Exam Countdown Planner',
      subtitle: 'Keep track of homework deadlines, chapter targets, and board exam dates',
      addTask: 'Add Homework / Task',
      addExam: 'Add Exam Date',
      daysLeft: 'Days Remaining',
      completed: 'Completed',
      pending: 'To Do',
    },
    tutor: {
      title: 'Aura • AI Study Buddy',
      subtitle: 'Ask doubts in Physics, Chemistry, Maths, Biology, Commerce or Arts in easy words',
      askPlaceholder: 'Ask any doubt from your syllabus (e.g., Explain Newton’s 3rd Law in simple words)...',
      sendBtn: 'Ask AI',
      suggestedTopics: 'Suggested 11th & 12th Doubts:',
    },
  },
  hi: {
    appName: 'XITRES MIND',
    tagline: '11वीं और 12वीं के लिए स्मार्ट स्टडी',
    langName: 'हिंदी',
    toggleLang: 'View in English',
    tabs: {
      dashboard: 'होम / डैशबोर्ड',
      timer: 'पढ़ाई टाइमर',
      flashcards: 'फ़्लैशकार्ड्स (रिवीज़न)',
      notes: 'क्लास नोट्स',
      quizzes: 'प्रैक्टिस टेस्ट / क्विज़',
      planner: 'स्टडी प्लानर & एग्ज़ाम',
      tutor: 'AI स्टडी दोस्त',
    },
    tabSubtitles: {
      dashboard: 'रोज़ाना पढ़ाई का समय, स्ट्रीक और रिवीज़न का हिसाब रखें',
      timer: '25 मिनट से 24 घंटे तक का टाइमर लगाएं और बिना डिस्टर्ब हुए पढ़ाई करें',
      flashcards: 'फ़ॉर्मूले, डेफिनिशन और इम्पोर्टेंट सवाल आसानी से याद करें',
      notes: 'क्लास नोट्स लिखें: साइड में सवाल और नीचे पूरे चैप्टर का आसान सारांश',
      quizzes: '11वीं, 12वीं बोर्ड और एंट्रेंस एग्ज़ाम में ज़्यादा मार्क्स लाने के लिए टेस्ट दें',
      planner: 'होमवर्क, चैप्टर टारगेट और एग्ज़ाम की तारीखों का ध्यान रखें',
      tutor: 'सिलेबस का कोई भी डाउट आसान और सीधी हिंदी-इंग्लिश में समझें',
    },
    header: {
      feynman: 'फ़ाइनमैन आसान तरीका',
      sound: 'पढ़ाई की आवाज़ें',
      focus: 'फोकस',
      login: 'फोन लॉगिन',
      whatsApp: 'व्हाट्सएप क्रिएटर',
    },
    timer: {
      title: 'पढ़ाई फोकस स्टूडियो',
      deepWork: 'पढ़ाई का सेशन',
      breakTime: 'ब्रेक और आराम',
      inSession: 'पढ़ाई चालू है',
      start: 'शुरू करें',
      pause: 'रोकें',
      reset: 'रीसेट करें',
      skip: 'ब्रेक पर जाएं',
      zenEnter: 'ज़ेन फुलस्क्रीन',
      zenExit: 'फुलस्क्रीन बंद करें',
      studyFocus: 'पढ़ाई फोकस',
      shortBreak: 'छोटा ब्रेक (5 मिनट)',
      longBreak: 'बड़ा ब्रेक (15 मिनट)',
      selectDuration: 'पढ़ाई का समय चुनें (25 मिनट से 24 घंटे की मैराथन):',
      customTime: 'अपनी मर्ज़ी का टाइम',
      hideCustom: 'छुपाएं',
      setExactTime: 'जितने घंटे और मिनट पढ़ना चाहते हैं सेट करें:',
      hours: 'घंटे (0-24)',
      minutes: 'मिनट (0-59)',
      applyTime: 'टाइमर सेट करें',
      linkTask: 'किस चैप्टर या होमवर्क के लिए पढ़ना है:',
      noTask: 'सामान्य पढ़ाई (सभी विषय)',
      ambientSound: 'बैकग्राउंड में रिलैक्सिंग म्यूज़िक / साउंड',
      quotes: [
        '“11वीं और 12वीं में रोज़ाना थोड़ा पढ़ना, आख़िरी रात की रटाई से 100 गुना बेहतर है।”',
        '“आज का हर 1 घंटा फोकस, आपको आपके मनपसंद कॉलेज के करीब ले जाता है।”',
        '“चैप्टर को रटने के बजाय समझना सीखें, नंबर अपने आप अच्छे आएंगे।”',
        '“मुश्किल फ़ॉर्मूलों से मत डरो, 3-4 बार लिखकर प्रैक्टिस करोगे तो आसान लगने लगेगा।”',
        '“फोन साइड में रखो, गहरी सांस लो, और इस चैप्टर को आज पूरा खत्म करते हैं!”',
      ],
    },
    dashboard: {
      welcome: 'स्वागत है, टॉपर!',
      subWelcome: 'आज 11वीं और 12वीं की पढ़ाई में क्या नया सीखना है?',
      dailyGoal: 'आज का टारगेट',
      streak: 'लगातार पढ़ाई के दिन',
      cardsDue: 'रिवीज़न के कार्ड्स',
      testsTaken: 'दिए गए टेस्ट',
      hoursStudied: 'कुल पढ़ाई के घंटे',
      quickActions: 'जल्दी शुरू करें',
      startTimer: 'पढ़ाई टाइमर शुरू करें',
      practiceFlashcards: 'फ़्लैशकार्ड्स याद करें',
      writeNotes: 'क्लास नोट्स लिखें',
      takeQuiz: 'प्रैक्टिस टेस्ट दें',
      upcomingExams: 'आने वाले एग्ज़ाम की उल्टी गिनती',
      noExams: 'अभी कोई एग्ज़ाम नहीं जोड़ा गया। अपनी टेस्ट या बोर्ड की तारीखें जोड़ें!',
      recentTasks: 'होमवर्क और चैप्टर टारगेट्स',
    },
    flashcards: {
      title: 'फ़ॉर्मूला और कॉन्सेप्ट फ़्लैशकार्ड्स',
      subtitle: 'फ़ॉर्मूले, समीकरण और डेफिनिशन जल्दी याद करने के लिए स्मार्ट कार्ड्स',
      createDeck: 'नया सब्जेक्ट / डेक बनाएं',
      addCard: 'नया फ़्लैशकार्ड जोड़ें',
      startReview: 'रिवीज़न शुरू करें',
      frontQuestion: 'आगे (सवाल / फ़ॉर्मूला / नियम)',
      backAnswer: 'पीछे (जवाब / आसान व्याख्या)',
      difficulty: 'यह सवाल आपको कैसा लगा?',
      easy: 'आसान (अच्छे से याद है)',
      medium: 'ठीक-ठाक (एक बार और पढ़ना है)',
      hard: 'कठिन (भूल गया था / मुश्किल है)',
    },
    notes: {
      title: 'कॉर्नेल क्लास नोट्स',
      subtitle: 'लेफ्ट में सवाल, बीच में नोट्स और नीचे आसान समरी ताकि एग्ज़ाम में तेज़ी से याद आए',
      newNote: 'नया नोट बनाएं',
      cuesCol: 'मुख्य सवाल और फ़ॉर्मूले (लेफ्ट)',
      notesCol: 'क्लास की व्याख्या (बीच में)',
      summaryRow: 'पूरे चैप्टर का निचोड़ / समरी (नीचे)',
      aiSummaryBtn: 'AI ऑटो-समरी बनाएं',
      aiCuesBtn: 'AI से सवाल बनवाएं',
      quizFromNotes: 'इस नोट का प्रैक्टिस टेस्ट दें',
    },
    quizzes: {
      title: 'प्रैक्टिस टेस्ट और क्विज़',
      subtitle: 'अपनी तैयारी खुद चेक करें और तुरंत सही जवाब और व्याख्या देखें',
      generateQuiz: 'नया टेस्ट बनाएं',
      startQuiz: 'टेस्ट शुरू करें',
      score: 'आपका स्कोर',
      questionsCount: 'कुल सवाल',
      checkAnswer: 'उत्तर चेक करें',
      nextQuestion: 'अगला सवाल',
      retry: 'दोबारा टेस्ट दें',
    },
    planner: {
      title: 'होमवर्क और एग्ज़ाम प्लानर',
      subtitle: 'स्कूल होमवर्क, कोचिंग असाइनमेंट और बोर्ड एग्ज़ाम की तारीखें एक जगह रखें',
      addTask: 'नया होमवर्क / टास्क जोड़ें',
      addExam: 'एग्ज़ाम की तारीख जोड़ें',
      daysLeft: 'दिन बचे हैं',
      completed: 'पूरा हो गया',
      pending: 'बाकी है',
    },
    tutor: {
      title: 'ऑरा • AI स्टडी दोस्त',
      subtitle: 'फिजिक्स, केमिस्ट्री, मैथ्स, बायो, कॉमर्स या आर्ट्स का कोई भी डाउट आसान भाषा में पूछें',
      askPlaceholder: 'अपने सिलेबस का कोई भी सवाल या डाउट पूछें (जैसे: न्यूटन का तीसरा नियम आसान हिंदी में समझाओ)...',
      sendBtn: 'पूछें',
      suggestedTopics: '11वीं और 12वीं के आम डाउट्स:',
    },
  },
};
