
import type { Subject } from './types';
import MathIcon from './components/icons/MathIcon';
import ScienceIcon from './components/icons/ScienceIcon';
import EnglishIcon from './components/icons/EnglishIcon';
import SocialIcon from './components/icons/SocialIcon';

export const SUBJECTS: Subject[] = [
  { name: 'Mathematics', icon: MathIcon, color: 'from-blue-500 to-indigo-600' },
  { name: 'Science', icon: ScienceIcon, color: 'from-green-500 to-emerald-600' },
  { name: 'English', icon: EnglishIcon, color: 'from-red-500 to-rose-600' },
  { name: 'Social Science', icon: SocialIcon, color: 'from-yellow-500 to-amber-600' },
];

export const QUIZ_LENGTH = 50;
