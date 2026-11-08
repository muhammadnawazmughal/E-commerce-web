import React from 'react';
import { Sparkles } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading luxury collection...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-2 border-luxury-200 border-t-gold animate-spin"></div>
        <Sparkles className="w-5 h-5 text-gold absolute animate-pulse" />
      </div>
      {text && (
        <p className="mt-4 text-sm font-medium tracking-wider uppercase text-luxury-700 font-serif">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-50/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
