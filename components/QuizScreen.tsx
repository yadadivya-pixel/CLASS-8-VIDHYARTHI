import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Question, QuizScreenProps, QuizResult } from '../types';
import { getQuestions } from '../services/geminiService';
import { QUIZ_LENGTH } from '../constants';
import Spinner from './Spinner';

const DifficultyBadge: React.FC<{ difficulty: 'Easy' | 'Medium' | 'Hard' }> = ({ difficulty }) => {
    const colors = {
        Easy: 'bg-green-100 text-green-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        Hard: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full ${colors[difficulty]}`}>
            {difficulty}
        </span>
    );
};

const correctFeedback = [
    "Brilliant! You're a true scholar!",
    "That's it! You've got the magic touch!",
    "Correct! Your wisdom shines brightly!",
    "Yes! You're on fire today!",
    "Perfect! A genius at work!",
    "Incredible! Is there anything you don't know?",
    "Precisely! Your knowledge is vast."
];

const incorrectFeedback = [
    "Not quite. But every misstep is a lesson learned!",
    "A valiant effort! The right answer was so close.",
    "Close! The path to knowledge has many turns.",
    "Don't fret! The greatest minds stumble sometimes.",
    "That was a tricky one! Let's review it later."
];

const skipFeedback = [
    "A wise choice. Sometimes we must choose our battles!",
    "Onward to the next challenge! This one can wait.",
    "No problem! Let's find a question you love.",
];

const motivationalFeedback = [
    "Remember, the journey of a thousand miles begins with a single step.",
    "You're doing wonderfully. Keep that amazing brain working!",
    "I believe in you! You have the power to solve anything.",
    "Stay focused, great student. Your destiny is knowledge!",
    "Take a deep breath. You've got this!"
];


const QuizScreen: React.FC<QuizScreenProps> = ({ subject, book, chapter, difficulty, onQuizComplete, setGenieState }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  
  const timeoutsRef = useRef<number[]>([]);
  const motivationIntervalRef = useRef<number | null>(null);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if(motivationIntervalRef.current) {
        clearInterval(motivationIntervalRef.current);
        motivationIntervalRef.current = null;
    }
  }, []);

  const setDefaultGenieState = useCallback(() => {
    setGenieState({ message: "Focus now... you can do this! Read the question carefully.", action: 'idle' });
  }, [setGenieState]);

  useEffect(() => {
    setDefaultGenieState();
    
    motivationIntervalRef.current = window.setInterval(() => {
        const message = motivationalFeedback[Math.floor(Math.random() * motivationalFeedback.length)];
        setGenieState({ message, action: 'talk' });
    }, 25000);

    return () => clearAllTimeouts();
  }, [setDefaultGenieState, clearAllTimeouts]);

  const fetchQuestionBatch = useCallback(async (batch: number) => {
    setIsFetchingNext(true);
    try {
      const newQuestions = await getQuestions(subject.name, book.title, book.publication, chapter.name, batch, difficulty);
      if (newQuestions && newQuestions.length > 0) {
        setQuestions(prev => [...prev, ...newQuestions]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions.');
    } finally {
      setIsFetchingNext(false);
    }
  }, [subject.name, book.title, book.publication, chapter.name, difficulty]);

  useEffect(() => {
    const initializeQuiz = async () => {
      setLoading(true);
      setError(null);
      setGenieState({ message: "Let me conjure up some questions for you...", action: 'thinking' });
      await fetchQuestionBatch(1);
      setLoading(false);
      setDefaultGenieState();
    };
    initializeQuiz();
  }, [fetchQuestionBatch, setDefaultGenieState, setGenieState]);

  useEffect(() => {
    if (!isFetchingNext && questions.length > 0 && currentQuestionIndex === questions.length - 5 && questions.length < QUIZ_LENGTH) {
        const nextBatch = (questions.length / 10) + 1;
        fetchQuestionBatch(nextBatch);
    }
  }, [currentQuestionIndex, questions.length, fetchQuestionBatch, isFetchingNext]);

  // This effect handles the "thinking" state when waiting for more questions
  useEffect(() => {
    if (isFetchingNext && currentQuestionIndex >= questions.length) {
        // We're actively waiting for questions to continue the quiz.
        setGenieState({ message: "More questions are on their way!", action: 'thinking' });
    }
  }, [isFetchingNext, currentQuestionIndex, questions.length, setGenieState]);

  const handleNext = (userSelection: string | null) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = userSelection !== null && userSelection === currentQuestion.correctAnswer;
    
    const newResult: QuizResult = {
      question: currentQuestion,
      userAnswer: userSelection,
      isCorrect: isCorrect,
    };
    
    const updatedResults = [...results, newResult];
    setResults(updatedResults);

    const nextIndex = currentQuestionIndex + 1;
    const ranOutOfQuestions = nextIndex >= questions.length;

    if (nextIndex >= QUIZ_LENGTH || (ranOutOfQuestions && (!isFetchingNext || error))) {
        onQuizComplete(updatedResults);
    } else {
        setCurrentQuestionIndex(nextIndex);
        setSelectedAnswer(null);
        setIsAnswered(false);
    }
  };
  
  const handleAnswerSelect = (optionKey: string) => {
    if(isAnswered) return;
    clearAllTimeouts();

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = optionKey === currentQuestion.correctAnswer;
    
    if (isCorrect) {
        const message = correctFeedback[Math.floor(Math.random() * correctFeedback.length)];
        setGenieState({ message, action: 'correct' });
    } else {
        const message = incorrectFeedback[Math.floor(Math.random() * incorrectFeedback.length)];
        setGenieState({ message, action: 'incorrect' });
    }

    setSelectedAnswer(optionKey);
    setIsAnswered(true);

    const nextTimeout = window.setTimeout(() => {
        handleNext(optionKey);
        const resetTimeout = window.setTimeout(setDefaultGenieState, 500);
        timeoutsRef.current.push(resetTimeout);
    }, 1500);
    timeoutsRef.current.push(nextTimeout);
  };

  const handleSkip = () => {
    clearAllTimeouts();
    const message = skipFeedback[Math.floor(Math.random() * skipFeedback.length)];
    setGenieState({ message, action: 'skip' });
    handleNext(null);
    const resetTimeout = window.setTimeout(setDefaultGenieState, 1500);
    timeoutsRef.current.push(resetTimeout);
  };
  
  if (loading && questions.length === 0) {
    return (
      <div className="text-center py-20">
        <Spinner />
        <p className="mt-4 text-lg text-gray-600">Summoning questions from the ether...</p>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
        <div className="text-center p-8 bg-red-100/80 backdrop-blur-sm border border-red-400 text-red-700 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Could not start quiz.</h2>
            <p>{error}</p>
        </div>
    );
  }
  
  if (isFetchingNext && currentQuestionIndex >= questions.length) {
    return (
        <div className="w-full max-w-3xl mx-auto p-6 text-center">
            <Spinner />
            <p className="mt-4 text-lg text-gray-600">Loading more questions...</p>
        </div>
    );
  }

  if (questions.length === 0) {
      return <div className="text-center py-20 text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg p-8">No questions available for this chapter yet.</div>
  }

  const currentQuestion = questions[currentQuestionIndex];
  // This check prevents a crash if something unexpected happens
  if (!currentQuestion) {
      // This case should be rare given the logic in handleNext, but it's a safe fallback.
      return <div className="text-center py-20 text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg p-8">Loading question...</div>
  }
  
  const progressPercentage = ((currentQuestionIndex) / QUIZ_LENGTH) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto p-0 sm:p-6 animate-fade-in pb-32">
        <div className="mb-6 bg-black/10 backdrop-blur-sm p-4 rounded-xl">
            <p className="text-sm text-white/80 text-center">{subject.name} - {chapter.name}</p>
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center my-2">{`Question ${currentQuestionIndex + 1}/${QUIZ_LENGTH}`}</h2>
            <div className="w-full bg-gray-200/50 rounded-full h-2.5">
                <div className="bg-brand-secondary h-2.5 rounded-full" style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
            </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-white/20 relative">
            {difficulty === 'Classic' && <DifficultyBadge difficulty={currentQuestion.difficulty} />}
            <p className="text-lg sm:text-xl font-medium text-brand-text mb-8 min-h-[6rem] pr-20">{currentQuestion.question}</p>
            <div className="space-y-4">
                {Object.entries(currentQuestion.options).map(([key, value]) => {
                    const isSelected = selectedAnswer === key;
                    const isCorrect = currentQuestion.correctAnswer === key;
                    let buttonClass = 'bg-white/50 hover:bg-white/80 border-gray-300';
                    if (isAnswered) {
                        if (isCorrect) {
                            buttonClass = 'bg-green-200/80 border-green-500 text-green-900';
                        } else if (isSelected && !isCorrect) {
                            buttonClass = 'bg-red-200/80 border-red-500 text-red-900';
                        }
                    } else if (isSelected) {
                        buttonClass = 'bg-indigo-200/80 border-brand-primary';
                    }
                    
                    return (
                        <button
                            key={key}
                            onClick={() => handleAnswerSelect(key)}
                            disabled={isAnswered}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 text-brand-text font-medium text-md flex items-center ${buttonClass}`}
                        >
                            <span className="font-bold mr-4">{key}.</span>
                            <span>{value as string}</span>
                        </button>
                    );
                })}
            </div>
        </div>

        <div className="mt-8 flex justify-center items-center">
            <button
                onClick={handleSkip}
                disabled={isAnswered}
                className="py-3 px-8 bg-white/80 backdrop-blur-sm border-2 border-gray-300 text-gray-700 font-semibold rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50 transition-all"
            >
                Skip Question
            </button>
        </div>
    </div>
  );
};

export default QuizScreen;