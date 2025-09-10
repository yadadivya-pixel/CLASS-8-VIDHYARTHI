import React, { useEffect } from 'react';
import type { Screen, Subject } from '../types';

interface DynamicBackgroundProps {
  screen: Screen;
  subject: Subject | null;
}

const backgrounds: Record<string, string[]> = {
  // General screens
  HOME: [
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2128&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2170&auto=format&fit=crop',
  ],
  BOOKS: [
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524995767962-b1f5b5a347c1?q=80&w=2070&auto=format&fit=crop',
  ],
  CHAPTERS: [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519682337058-2244f2181a62?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1491841550275-5b462bf98d5c?q=80&w=2070&auto=format&fit=crop',
  ],
  CELEBRATION: [
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop',
  ],
  
  // General subjects (fallback)
  Mathematics: [
    'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1635372722652-52a83ea7475a?q=80&w=1932&auto=format&fit=crop'
  ],
  Science: [
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2070&auto=format&fit=crop',
  ],
  English: [
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?q=80&w=2172&auto=format&fit=crop',
  ],
  'Social Science': [
    'https://images.unsplash.com/photo-1582367426201-ab4738525a1a?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1569032394033-2a96a7c32434?q=80&w=2070&auto=format&fit=crop',
  ],

  // Specific QUIZ backgrounds
  'Mathematics_QUIZ': [
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1453733190371-0a9bedd82893?q=80&w=2070&auto=format&fit=crop',
  ],
  'Science_QUIZ': [
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?q=80&w=2070&auto=format&fit=crop',
  ],
  'English_QUIZ': [
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505664194779-8beace7a2044?q=80&w=2070&auto=format&fit=crop',
  ],
  'Social Science_QUIZ': [
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1604646535552-3a52668a1215?q=80&w=2070&auto=format&fit=crop',
  ],

  // Specific REPORT backgrounds
  'Mathematics_REPORT': [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
  ],
  'Science_REPORT': [
    'https://images.unsplash.com/photo-1581093450021-4a7360aa9a2f?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614935151651-0bea55ce2834?q=80&w=2124&auto=format&fit=crop',
  ],
  'English_REPORT': [
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485322551133-3a4c27a9d925?q=80&w=2070&auto=format&fit=crop',
  ],
  'Social Science_REPORT': [
    'https://images.unsplash.com/photo-1503551329480-a5c788a1a36a?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590212157593-3603c418758c?q=80&w=2070&auto=format&fit=crop',
  ],

  // A special celebration one for English
  'English_CELEBRATION': [
    'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=2071&auto=format&fit=crop'
  ],
};

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ screen, subject }) => {
  useEffect(() => {
    // Fix: Explicitly type `finalKey` as string because it can be assigned composite keys or subject names, which are wider than the inferred `Screen` type.
    let finalKey: string = screen; // Default to screen-specific background

    if (subject) {
      const subjectScreenKey = `${subject.name}_${screen}`;
      const subjectKey = subject.name;

      // 1. Check for most specific key: Subject + Screen (e.g., 'Mathematics_QUIZ')
      if (backgrounds[subjectScreenKey]) {
        finalKey = subjectScreenKey;
      } 
      // 2. Check for general subject key on relevant screens
      else if (backgrounds[subjectKey] && ['BOOKS', 'CHAPTERS', 'QUIZ', 'REPORT'].includes(screen)) {
        finalKey = subjectKey;
      }
    }

    const urls = backgrounds[finalKey] || backgrounds['HOME'];
    const newUrl = urls[Math.floor(Math.random() * urls.length)];
    document.documentElement.style.setProperty('--bg-image-url', `url('${newUrl}')`);
  }, [screen, subject]);

  return null; // This component does not render anything itself
};

export default DynamicBackground;