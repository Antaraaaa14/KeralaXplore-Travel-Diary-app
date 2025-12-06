import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { AppView } from '../types';

interface HeaderProps {
  onLogout: () => void;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenChatbot: () => void;
  isProUser: boolean;
  onOpenUpgradeModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, activeView, onNavigate, onOpenChatbot, isProUser, onOpenUpgradeModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);


  useEffect(() => {
    if (isMenuOpen) {
      const menuElement = menuRef.current;
      if (!menuElement) return;

      const focusableElements = menuElement.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const previousActiveElement = document.activeElement as HTMLElement;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsMenuOpen(false);
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
        previousActiveElement?.focus();
      };
    }
  }, [isMenuOpen]);


  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsMenuOpen(false);
  };

  const handleUpgradeClick = () => {
    onOpenUpgradeModal();
    setIsMenuOpen(false);
  }

  const navButtonStyle = (view: AppView, isMobile: boolean = false) => {
    const baseStyle = isMobile 
      ? 'flex items-center space-x-3 px-4 py-3 rounded-lg text-md font-semibold w-full text-left'
      : 'flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-semibold';
    
    return `${baseStyle} transition-colors duration-200 ${
      activeView === view 
        ? 'bg-blue-600 text-white shadow-sm' 
        : 'text-slate-600 hover:bg-slate-100'
    }`;
  };

  const MobileMenu = () => (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 sm:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      ></div>
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-30 transform transition-transform duration-300 ease-in-out sm:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="main-menu"
      >
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-8">
            <Icon name="logo" className="w-8 h-8 text-blue-600" />
            <h1 id="main-menu" className="text-xl font-bold text-slate-800">KeralaXplore</h1>
          </div>
          <nav className="flex flex-col space-y-2">
            <button onClick={() => handleNavClick('explore')} className={navButtonStyle('explore', true)}>
              <Icon name="explore" className="w-6 h-6" />
              <span>Explore Kerala</span>
            </button>
            <button onClick={() => handleNavClick('diary')} className={navButtonStyle('diary', true)}>
              <Icon name="diary" className="w-6 h-6" />
              <span>Travel Diary</span>
            </button>
             <button onClick={() => handleNavClick('calendar')} className={navButtonStyle('calendar', true)}>
              <Icon name="calendar" className="w-6 h-6" />
              <span>Trip Calendar</span>
            </button>
            <button onClick={() => handleNavClick('weather')} className={navButtonStyle('weather', true)}>
              <Icon name="weather" className="w-6 h-6" />
              <span>Weather</span>
            </button>
            <button onClick={() => handleNavClick('map')} className={navButtonStyle('map', true)}>
              <Icon name="map" className="w-6 h-6" />
              <span>Map of Kerala</span>
            </button>
            <button onClick={() => handleNavClick('hotels')} className={navButtonStyle('hotels', true)}>
              <Icon name="hotel" className="w-6 h-6" />
              <span>Famous Hotels</span>
            </button>
            <button onClick={() => handleNavClick('food')} className={navButtonStyle('food', true)}>
              <Icon name="food" className="w-6 h-6" />
              <span>Famous Food</span>
            </button>
             <hr className="my-2 border-slate-200" />
             <button 
              onClick={() => handleNavClick('emergency')} 
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-md font-semibold w-full text-left transition-colors ${activeView === 'emergency' ? 'bg-red-600 text-white' : 'text-red-600 hover:bg-red-50'}`}
            >
              <Icon name="emergency" className="w-6 h-6" />
              <span>Emergency Contacts</span>
            </button>
          </nav>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
            {!isProUser && (
              <button 
                onClick={handleUpgradeClick} 
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition-colors mb-2 font-semibold"
              >
                <Icon name="star" className="w-6 h-6" />
                <span>Upgrade to PRO</span>
              </button>
            )}
           <button 
            onClick={onOpenChatbot} 
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors mb-2"
          >
            <Icon name="chatbot" className="w-6 h-6 text-blue-600" />
            <span className="font-semibold">App Guide</span>
          </button>
          <button 
            onClick={handleLogoutClick} 
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Icon name="logout" className="w-6 h-6" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              ref={menuButtonRef}
              onClick={() => setIsMenuOpen(true)}
              className="p-2 -ml-2 rounded-md text-slate-600 hover:bg-slate-100 sm:hidden"
              aria-label="Open menu"
              aria-controls="main-menu"
              aria-expanded={isMenuOpen}
            >
              <Icon name="menu" className="w-6 h-6" />
            </button>
            <Icon name="logo" className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">
              KeralaXplore
            </h1>
          </div>

          <div className="hidden sm:flex items-center space-x-1 bg-slate-200/80 p-1 rounded-lg">
            <button onClick={() => onNavigate('explore')} className={navButtonStyle('explore')} aria-label="Explore Kerala">
              <Icon name="explore" className="w-5 h-5" />
              <span>Explore</span>
            </button>
             <button onClick={() => onNavigate('diary')} className={navButtonStyle('diary')} aria-label="Travel Diary">
              <Icon name="diary" className="w-5 h-5" />
              <span>Diary</span>
            </button>
             <button onClick={() => onNavigate('calendar')} className={navButtonStyle('calendar')} aria-label="Trip Calendar">
              <Icon name="calendar" className="w-5 h-5" />
              <span>Calendar</span>
            </button>
            <button onClick={() => onNavigate('weather')} className={navButtonStyle('weather')} aria-label="Weather">
              <Icon name="weather" className="w-5 h-5" />
              <span>Weather</span>
            </button>
            <button onClick={() => onNavigate('map')} className={navButtonStyle('map')} aria-label="Map of Kerala">
              <Icon name="map" className="w-5 h-5" />
              <span>Map</span>
            </button>
             <button onClick={() => onNavigate('hotels')} className={navButtonStyle('hotels')} aria-label="Famous Hotels">
              <Icon name="hotel" className="w-5 h-5" />
              <span>Hotels</span>
            </button>
            <button onClick={() => onNavigate('food')} className={navButtonStyle('food')} aria-label="Famous Food">
              <Icon name="food" className="w-5 h-5" />
              <span>Food</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
             {!isProUser && (
                <button
                    onClick={onOpenUpgradeModal}
                    className="hidden sm:flex items-center space-x-2 bg-amber-400 text-amber-900 hover:bg-amber-500 rounded-md py-2 px-3 transition-colors duration-200"
                    aria-label="Upgrade to PRO"
                >
                    <Icon name="star" className="w-5 h-5" />
                    <span className="text-sm font-semibold">Upgrade</span>
                </button>
            )}
            <button 
              onClick={() => onNavigate('emergency')} 
              className="hidden sm:flex items-center space-x-2 text-red-600 hover:bg-red-50 rounded-md py-2 px-3 transition-colors duration-200" aria-label="Emergency Contacts">
              <Icon name="emergency" className="w-5 h-5" />
              <span className="text-sm font-semibold">Emergency</span>
            </button>
             <button
              onClick={onOpenChatbot}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Open AI Guide"
            >
              <Icon name="chatbot" className="w-6 h-6" />
            </button>
            <button
              onClick={onLogout}
              className="hidden sm:flex items-center space-x-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-md py-2 px-3 transition-colors duration-200"
              aria-label="Logout"
            >
              <Icon name="logout" className="w-5 h-5" />
              <span className="text-sm font-semibold hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu />
    </>
  );
};

export default Header;