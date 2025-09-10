
import React, { useState, useEffect } from 'react';
import type { Subject, Book } from '../types';
import { getBooks } from '../services/geminiService';
import Spinner from './Spinner';
import BookOpenIcon from './icons/BookOpenIcon';

interface BookSelectionScreenProps {
  subject: Subject;
  onBookSelect: (book: Book) => void;
}

const BookSelectionScreen: React.FC<BookSelectionScreenProps> = ({ subject, onBookSelect }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedBooks = await getBooks(subject.name);
        setBooks(fetchedBooks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [subject.name]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <Spinner />
        <p className="mt-4 text-lg text-gray-600">Finding books for {subject.name}...</p>
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

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-2 text-center">Select a Book</h1>
      <p className="text-md text-gray-500 mb-8 text-center">Choose a textbook for {subject.name}.</p>
      <div className="space-y-4">
        {books.map((book, index) => (
          <button
            key={index}
            onClick={() => onBookSelect(book)}
            className="w-full flex items-center p-5 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-indigo-50 transform hover:scale-105 transition-all duration-200 ease-in-out border border-gray-200"
          >
            <div className="p-3 bg-brand-primary rounded-lg mr-5">
              <BookOpenIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-lg text-brand-dark">{book.title}</p>
              <p className="text-gray-500">{book.publication}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookSelectionScreen;
