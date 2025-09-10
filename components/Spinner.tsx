
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-brand-primary rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
