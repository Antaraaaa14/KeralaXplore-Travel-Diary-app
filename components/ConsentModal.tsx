import React, { useEffect, useRef } from 'react';

interface ConsentModalProps {
  onConsent: () => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ onConsent }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    // Focus the button when the modal opens
    buttonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent tabbing out of the modal. Since there's only one focusable element,
      // we can just prevent tabbing altogether.
      if (e.key === 'Tab') {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 sm:p-8 text-center animate-fade-in-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-title"
      >
        <h2 id="consent-title" className="text-2xl font-bold text-slate-800 mb-4">Welcome to KeralaXplore Travel Diary</h2>
        <p className="text-slate-600 mb-6">
          To help you document your journey, this application collects trip-related information like your origin, destination, time, and mode of travel. Your participation is valuable for enhancing your travel planning experience.
        </p>
        <p className="text-slate-600 mb-8">
          By clicking "Agree & Continue", you consent to the collection of your travel data.
        </p>
        <button
          ref={buttonRef}
          onClick={onConsent}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
        >
          Agree & Continue
        </button>
      </div>
       <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ConsentModal;