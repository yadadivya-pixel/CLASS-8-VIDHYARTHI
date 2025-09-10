import React, { useState, useEffect } from 'react';
import type { Subject, Book, Chapter, Difficulty } from '../types';
import { getChapters } from '../services/geminiService';
import Spinner from './Spinner';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface ChapterSelectionScreenProps {
  subject: Subject;
  book: Book;
  onStartQuiz: (chapter: Chapter, difficulty: Difficulty) => void;
}

const ChapterSelectionScreen: React.FC<ChapterSelectionScreenProps> = ({ subject, book, onStartQuiz }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedChapters = await getChapters(subject.name, book.title, book.publication);
        setChapters(fetchedChapters);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, [subject.name, book.title, book.publication]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <Spinner />
        <p className="mt-4 text-lg text-gray-600">Loading chapters from {book.title}...</p>
      </div>
    );
  }

  if (error) {
    return (
        <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Oops! Something went wrong.</h2>
            <p>{error}</p>
        </div>
    );
  }

  if (selectedChapter) {
    return (
      <div className="animate-fade-in text-center p-4">
        <h2 className="text-2xl font-bold text-brand-dark mb-2">Selected Chapter</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">{selectedChapter.name}</p>
        
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h3 className="text-xl font-semibold text-brand-dark mb-6">Choose a Difficulty</h3>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {(['Classic', 'Easy', 'Medium', 'Hard'] as Difficulty[]).map(difficulty => (
              <button
                key={difficulty}
                onClick={() => onStartQuiz(selectedChapter, difficulty)}
                className="py-4 px-6 bg-brand-primary text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        <button
            onClick={() => setSelectedChapter(null)}
            className="mt-8 text-gray-600 hover:text-brand-primary font-semibold inline-flex items-center"
        >
            <ChevronRightIcon className="w-5 h-5 mr-1 transform rotate-180" />
            Back to Chapters
        </button>
      </div>
    );
  }


  return (
    <div className="animate-fade-in pb-24">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-2">Select a Chapter</h1>
        <p className="text-md text-gray-500">{book.title} - {book.publication}</p>
      </div>
      <ul className="bg-white rounded-xl shadow-lg border border-gray-200 divide-y divide-gray-200">
        {chapters.map((chapter, index) => (
          <li key={index}>
            <button
              onClick={() => setSelectedChapter(chapter)}
              className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="text-lg text-brand-text"><span className="font-semibold mr-2">{index + 1}.</span> {chapter.name}</span>
              <ChevronRightIcon className="w-6 h-6 text-gray-400"/>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChapterSelectionScreen;