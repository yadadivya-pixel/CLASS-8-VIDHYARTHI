import React, { useEffect } from 'react';

interface CelebrationScreenProps {
  onCelebrationEnd: () => void;
}

const CelebrationScreen: React.FC<CelebrationScreenProps> = ({ onCelebrationEnd }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onCelebrationEnd();
    }, 3000); 

    return () => clearTimeout(timer);
  }, [onCelebrationEnd]);

  return (
    <div className="flex flex-col items-center justify-center h-screen animate-fade-in text-center fixed inset-0">
      <h1 className="text-4xl sm:text-6xl font-extrabold text-white text-shadow-lg mb-4"
        style={{textShadow: '2px 2px 8px rgba(0,0,0,0.5)'}}>
        Congratulations!
      </h1>
      <p className="text-xl sm:text-2xl text-white/90" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.5)'}}>
        You completed the quiz!
      </p>
    </div>
  );
};

export default CelebrationScreen;
