
import React from 'react';
import { SUBJECTS } from '../constants';
import type { Subject } from '../types';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface HomeScreenProps {
  onSubjectSelect: (subject: Subject) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSubjectSelect }) => {
  return (
    <div className="text-center animate-fade-in">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark mb-2">Welcome, Student!</h1>
      <p className="text-lg text-gray-500 mb-10">Choose a subject to begin your learning journey.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {SUBJECTS.map((subject) => (
          <button
            key={subject.name}
            onClick={() => onSubjectSelect(subject)}
            className={`group relative text-white font-bold py-12 px-6 rounded-2xl bg-gradient-to-br ${subject.color} shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-center space-x-4">
              <subject.icon className="h-12 w-12" />
              <span className="text-2xl tracking-wide">{subject.name}</span>
            </div>
             <div className="absolute bottom-4 right-4 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-300 ease-in-out">
                <ChevronRightIcon className="w-8 h-8 opacity-70"/>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
