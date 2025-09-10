
import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { Screen, Subject, Book, Chapter, QuizResult, Difficulty, GenieState, ReportData } from './types';
import HomeScreen from './components/HomeScreen';
import BookSelectionScreen from './components/BookSelectionScreen';
import ChapterSelectionScreen from './components/ChapterSelectionScreen';
import QuizScreen from './components/QuizScreen';
import ReportScreen from './components/ReportScreen';
import CelebrationScreen from './components/CelebrationScreen';
import DynamicBackground from './components/DynamicBackground';
import HomeButton from './components/HomeButton';
import Genie from './components/Genie';
import { generateReport } from './services/geminiService';

const idleMessages = [
    "Are you still there?",
    "Hello? The world of knowledge awaits!",
    "Don't dally! Your next great discovery is just a click away.",
    "Need a moment to ponder? I understand. Great minds need time.",
    "Yoo-hoo! Still with me on this grand adventure?"
];

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [genieState, setGenieState] = useState<GenieState>({ message: '', action: 'idle' });
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const idleTimer = useRef<number | null>(null);

  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) {
        clearTimeout(idleTimer.current);
    }
    idleTimer.current = window.setTimeout(() => {
        // Don't show idle message during quiz, celebration, or while reading the report.
        if (currentScreen !== 'QUIZ' && currentScreen !== 'CELEBRATION' && currentScreen !== 'REPORT') {
            const message = idleMessages[Math.floor(Math.random() * idleMessages.length)];
            setGenieState({ message, action: 'talk' });
        }
    }, 45000); // 45 seconds
  }, [currentScreen]);

  useEffect(() => {
    const events: (keyof WindowEventMap)[] = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    const eventListener = () => resetIdleTimer();

    events.forEach(event => window.addEventListener(event, eventListener));
    resetIdleTimer(); // Start the timer on component mount

    return () => {
        events.forEach(event => window.removeEventListener(event, eventListener));
        if (idleTimer.current) {
            clearTimeout(idleTimer.current);
        }
    };
  }, [resetIdleTimer]);

  useEffect(() => {
    let message = '';
    switch (currentScreen) {
        case 'HOME':
            message = "Welcome! I am Vidya, your magical guide. Pick a subject to begin our grand adventure!";
            break;
        case 'CHAPTERS':
            message = "A fine choice! Now, pick a chapter and a difficulty to test your knowledge!";
            break;
        case 'REPORT':
            message = "Behold! Your scroll of knowledge. Let's see how you fared!";
            break;
        case 'QUIZ':
        case 'BOOKS':
        case 'CELEBRATION':
            // These screens have their own specific message triggers
            return;
    }
    setGenieState({ message, action: 'talk' });
  }, [currentScreen]);

  const handleGoHome = useCallback(() => {
    setCurrentScreen('HOME');
    setSelectedSubject(null);
    setSelectedBook(null);
    setSelectedChapter(null);
    setSelectedDifficulty(null);
    setQuizResults([]);
    setReportData(null);
    setIsGeneratingReport(false);
  }, []);

  const handleSubjectSelect = useCallback((subject: Subject) => {
    setSelectedSubject(subject);
    let message = '';
    switch (subject.name) {
        case 'Mathematics':
            message = "Mathematics! The cosmic language of numbers! Let's unravel its secrets.";
            break;
        case 'Science':
            message = "Science! From the tiniest atom to the vastest galaxy, let's explore!";
            break;
        case 'English':
            message = "English! A world of stories, poetry, and powerful words awaits. Shall we?";
            break;
        case 'Social Science':
            message = "Social Science! Let us journey through time and across lands to understand our world!";
            break;
        default:
            message = "An excellent choice! Which tome shall we consult for this adventure?";
    }
    setGenieState({ message, action: 'talk' });
    setCurrentScreen('BOOKS');
  }, []);

  const handleBookSelect = useCallback((book: Book) => {
    setSelectedBook(book);
    setCurrentScreen('CHAPTERS');
  }, []);

  const handleStartQuiz = useCallback((chapter: Chapter, difficulty: Difficulty) => {
    setSelectedChapter(chapter);
    setSelectedDifficulty(difficulty);
    setCurrentScreen('QUIZ');
  }, []);

  const handleQuizComplete = useCallback((results: QuizResult[]) => {
    setQuizResults(results);
    setCurrentScreen('CELEBRATION');

    const preGenerateReport = async () => {
        if (!selectedSubject || !selectedChapter) {
            console.error("Cannot generate report without subject or chapter.");
            return;
        }
        setIsGeneratingReport(true);
        setGenieState({ message: "Let me analyze your answers...", action: 'thinking' });
        setReportData(null);
        try {
            const generatedReport = await generateReport(selectedSubject.name, selectedChapter.name, results);
            setReportData(generatedReport);
        } catch (error) {
            console.error("Failed to pre-generate report:", error);
            setReportData(null);
        } finally {
            setIsGeneratingReport(false);
        }
    };

    preGenerateReport();
  }, [selectedSubject, selectedChapter, setGenieState]);

  const handleCelebrationEnd = useCallback(() => {
    setCurrentScreen('REPORT');
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen onSubjectSelect={handleSubjectSelect} />;
      case 'BOOKS':
        if (!selectedSubject) return null;
        return <BookSelectionScreen subject={selectedSubject} onBookSelect={handleBookSelect} />;
      case 'CHAPTERS':
        if (!selectedSubject || !selectedBook) return null;
        return <ChapterSelectionScreen subject={selectedSubject} book={selectedBook} onStartQuiz={handleStartQuiz} />;
      case 'QUIZ':
        if (!selectedSubject || !selectedBook || !selectedChapter || !selectedDifficulty) return null;
        return <QuizScreen subject={selectedSubject} book={selectedBook} chapter={selectedChapter} difficulty={selectedDifficulty} onQuizComplete={handleQuizComplete} setGenieState={setGenieState} />;
      case 'CELEBRATION':
        return <CelebrationScreen onCelebrationEnd={handleCelebrationEnd} />;
      case 'REPORT':
         if (!selectedSubject || !selectedBook || !selectedChapter) return null;
        return <ReportScreen results={quizResults} subject={selectedSubject} book={selectedBook} chapter={selectedChapter} preGeneratedReport={reportData} isGenerating={isGeneratingReport} />;
      default:
        return <HomeScreen onSubjectSelect={handleSubjectSelect} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-brand-text flex flex-col items-center p-4 sm:p-6 lg:p-8 relative">
      <DynamicBackground screen={currentScreen} subject={selectedSubject} />
      <main className="w-full max-w-4xl mx-auto z-10">
        {renderScreen()}
      </main>
      <Genie state={genieState} screen={currentScreen} />
      {currentScreen !== 'HOME' && <HomeButton onGoHome={handleGoHome} />}
    </div>
  );
};

export default App;