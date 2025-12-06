import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';

interface UpgradeModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

const plans = [
    { id: 'weekly', name: 'Weekly', price: 49, interval: '/ week', popular: false },
    { id: 'monthly', name: 'Monthly', price: 99, interval: '/ month', popular: true },
    { id: 'yearly', name: 'Yearly', price: 999, interval: '/ year', popular: false },
];

const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose, onUpgrade }) => {
  const [selectedPlan, setSelectedPlan] = useState(plans.find(p => p.popular) || plans[1]);
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    const focusableElements = modalElement.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }

        if (e.key === 'Tab') {
            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    };

    firstElement?.focus();
    document.addEventListener('keydown', handleKeyDown);

    return () => {
        document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleRadioKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % plans.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + plans.length) % plans.length;
    }
    
    setSelectedPlan(plans[nextIndex]);
    
    // Set focus to the next button
    const buttons = e.currentTarget.parentElement?.querySelectorAll('[role="radio"]');
    if (buttons && buttons[nextIndex]) {
        (buttons[nextIndex] as HTMLButtonElement).focus();
    }
  };


  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 sm:p-8 text-center animate-fade-in-up" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-title"
      >
        <div className="flex justify-center items-center mx-auto w-16 h-16 rounded-full bg-amber-100 mb-4">
            <Icon name="star" className="w-8 h-8 text-amber-500" />
        </div>
        <h2 id="upgrade-title" className="text-2xl font-bold text-slate-800 mb-3">Upgrade to KeralaXplore-PRO</h2>
        <p className="text-slate-600 mb-6">
          Unlock premium features and enhance your travel diary experience with unlimited photo uploads.
        </p>
        
        <div role="radiogroup" aria-labelledby="upgrade-title" className="space-y-3 mb-8">
            {plans.map((plan, index) => (
                <div key={plan.id} className="relative">
                    <button 
                        role="radio"
                        aria-checked={selectedPlan.id === plan.id}
                        tabIndex={selectedPlan.id === plan.id ? 0 : -1}
                        onClick={() => setSelectedPlan(plan)}
                        onKeyDown={(e) => handleRadioKeyDown(e, index)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${selectedPlan.id === plan.id ? 'border-blue-600 bg-blue-50 scale-105 shadow-md' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-800">{plan.name}</span>
                            <div className="text-right">
                                <span className="text-lg font-bold text-slate-800">₹{plan.price}</span>
                                <span className="text-sm text-slate-500">{plan.interval}</span>
                            </div>
                        </div>
                    </button>
                    {plan.popular && (
                         <div className="absolute -top-2.5 right-4 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full" aria-hidden="true">
                            MOST POPULAR
                        </div>
                    )}
                </div>
            ))}
        </div>

        <button
          onClick={onUpgrade}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 shadow-lg"
        >
          Upgrade for ₹{selectedPlan.price} {selectedPlan.interval}
        </button>
         <button
          onClick={onClose}
          className="w-full mt-3 text-slate-600 font-semibold py-2 px-4 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300 transition-colors duration-300"
        >
          Maybe Later
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

export default UpgradeModal;