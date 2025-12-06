import React, { useState, useEffect, useRef } from 'react';
import { Trip } from '../types';
import { TRAVEL_MODES } from '../constants';
import { Icon } from './Icon';

interface TripFormProps {
  onClose: () => void;
  onSave: (trip: Trip) => void;
  initialData: Trip | null;
  defaultDate?: string;
  isProUser: boolean;
  photoCount: number;
  onOpenUpgradeModal: () => void;
}

const PHOTO_LIMIT = 30;

const TripForm: React.FC<TripFormProps> = ({ onClose, onSave, initialData, defaultDate, isProUser, photoCount, onOpenUpgradeModal }) => {
  const [formData, setFormData] = useState<Omit<Trip, 'id'>>({
    date: '',
    origin: '',
    destination: '',
    startTime: '',
    mode: TRAVEL_MODES[0].value,
    travelers: '',
    photoUrl: ''
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        origin: initialData.origin,
        destination: initialData.destination,
        startTime: initialData.startTime,
        mode: initialData.mode,
        travelers: initialData.travelers,
        photoUrl: initialData.photoUrl || ''
      });
      if (initialData.photoUrl) {
        setPhotoPreview(initialData.photoUrl);
      }
    } else {
        setFormData(prev => ({
            ...prev,
            date: defaultDate || new Date().toISOString().split('T')[0]
        }))
    }
  }, [initialData, defaultDate]);
  
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleModeChange = (mode: string) => {
    setFormData(prev => ({ ...prev, mode }));
  };
  
  const handleRadioKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % TRAVEL_MODES.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + TRAVEL_MODES.length) % TRAVEL_MODES.length;
    }
    const nextMode = TRAVEL_MODES[nextIndex].value;
    handleModeChange(nextMode);
    
    // Set focus to the next button
    const buttons = e.currentTarget.parentElement?.querySelectorAll('[role="radio"]');
    if (buttons && buttons[nextIndex]) {
        (buttons[nextIndex] as HTMLButtonElement).focus();
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, photoUrl: result }));
        setPhotoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removePhoto = () => {
      setFormData(prev => ({...prev, photoUrl: ''}));
      setPhotoPreview(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.origin || !formData.destination || !formData.startTime) {
        alert("Please fill in Date, Origin, Destination, and Start Time.");
        return;
    }
    const tripData: Trip = {
      id: initialData ? initialData.id : Date.now().toString(),
      ...formData,
    };
    onSave(tripData);
  };
  
  const isLimitReached = !isProUser && photoCount >= PHOTO_LIMIT && !formData.photoUrl;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 sm:p-8 animate-modal-scale-up" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="form-title" className="text-2xl font-bold text-slate-800">{initialData ? 'Edit Trip' : 'Add a New Trip'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full" aria-label="Close form">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date</label>
              <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
            </div>
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-slate-700">Start Time</label>
              <input type="time" name="startTime" id="startTime" value={formData.startTime} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
            </div>
          </div>
           <div>
            <label htmlFor="origin" className="block text-sm font-medium text-slate-700">Origin</label>
            <input type="text" name="origin" id="origin" value={formData.origin} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
          </div>
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-slate-700">Destination</label>
            <input type="text" name="destination" id="destination" value={formData.destination} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
          </div>
          <div>
            <label id="transport-mode-label" className="block text-sm font-medium text-slate-700 mb-2">Mode of Transport</label>
            <div role="radiogroup" aria-labelledby="transport-mode-label" className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {TRAVEL_MODES.map(({ value, label, icon }, index) => (
                <button 
                  type="button" 
                  key={value} 
                  role="radio"
                  aria-checked={formData.mode === value}
                  tabIndex={formData.mode === value ? 0 : -1}
                  onClick={() => handleModeChange(value)} 
                  onKeyDown={(e) => handleRadioKeyDown(e, index)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors ${formData.mode === value ? 'bg-blue-100 border-blue-500 text-blue-600' : 'bg-slate-50 border-transparent hover:bg-slate-100 text-slate-600'}`}>
                  <Icon name={icon} className="w-6 h-6" />
                  <span className="text-xs mt-1 font-semibold">{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Trip Photo (optional)</label>
            {isLimitReached ? (
                <div className="mt-2 p-4 rounded-lg bg-amber-50 border border-amber-200 text-center">
                    <Icon name="star" className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-amber-800">You've reached the {PHOTO_LIMIT}-photo limit!</p>
                    <p className="text-xs text-amber-700 mt-1 mb-3">Upgrade to PRO to add unlimited photos.</p>
                    <button
                        type="button"
                        onClick={onOpenUpgradeModal}
                        className="bg-amber-400 text-amber-900 font-bold py-2 px-4 rounded-md hover:bg-amber-500 transition-colors"
                    >
                        Upgrade to PRO
                    </button>
                </div>
            ) : (
                <div className="mt-2 flex items-center space-x-4">
                  <div className="w-24 h-24 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                      {photoPreview ? (
                          <img src={photoPreview} alt="Trip preview" className="w-full h-full object-cover" />
                      ) : (
                          <Icon name="photo" className="w-8 h-8 text-slate-400" />
                      )}
                  </div>
                  <div className="flex flex-col space-y-2">
                      <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handlePhotoChange} 
                          accept="image/*" 
                          className="hidden" 
                          id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer bg-white py-2 px-3 border border-slate-300 rounded-md shadow-sm text-sm leading-4 font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <span>Upload a photo</span>
                      </label>
                      {photoPreview && (
                          <button type="button" onClick={removePhoto} className="text-sm text-red-600 hover:text-red-800 text-left">
                              Remove photo
                          </button>
                      )}
                  </div>
                </div>
            )}
          </div>
          <div>
            <label htmlFor="travelers" className="block text-sm font-medium text-slate-700">Accompanying Travelers (optional)</label>
            <textarea name="travelers" id="travelers" value={formData.travelers} onChange={handleChange} rows={2} placeholder="e.g., 2 family members, John Doe" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
          </div>
          <div className="pt-4 flex justify-end">
            <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300">
              Save Trip
            </button>
          </div>
        </form>
      </div>
       <style>{`
        @keyframes modal-scale-up {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-modal-scale-up { animation: modal-scale-up 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default TripForm;