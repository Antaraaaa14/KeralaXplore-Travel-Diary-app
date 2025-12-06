import React, { useState, useEffect, useCallback } from 'react';
import { Trip, AppView } from './types';
import Header from './components/Header';
import TripList from './components/TripList';
import FloatingActionButton from './components/FloatingActionButton';
import TripForm from './components/TripForm';
import ConsentModal from './components/ConsentModal';
import LoginPage from './components/LoginPage';
import KeralaXplore from './components/KeralaXplore';
import FamousHotels from './components/FamousHotels';
import FamousFood from './components/FamousFood';
import KeralaMap from './components/KeralaMap';
import FrontPage from './components/FrontPage';
import GuideChatbot from './components/GuideChatbot';
import TripCalendar from './components/TripCalendar';
import WeatherReport from './components/WeatherReport';
import UpgradeModal from './components/UpgradeModal';
import EmergencyContacts from './components/EmergencyContacts';

const App: React.FC = () => {
  const [hasSeenFrontPage, setHasSeenFrontPage] = useState<boolean>(false);
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<AppView>('explore');
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [defaultTripDate, setDefaultTripDate] = useState<string | undefined>(undefined);
  const [isProUser, setIsProUser] = useState<boolean>(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedFrontPageSeen = localStorage.getItem('keralaxplore_frontpage_seen');
      if (storedFrontPageSeen === 'true') {
        setHasSeenFrontPage(true);
      }

      const storedConsent = localStorage.getItem('keralaxplore_consent');
      if (storedConsent === 'true') {
        setHasConsented(true);
      }
      
      const storedAuth = localStorage.getItem('keralaxplore_auth');
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }

      const storedPro = localStorage.getItem('keralaxplore_is_pro');
      if (storedPro === 'true') {
        setIsProUser(true);
      }

      const storedTrips = localStorage.getItem('keralaxplore_trips');
      if (storedTrips) {
        setTrips(JSON.parse(storedTrips));
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
    }
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      try {
        localStorage.setItem('keralaxplore_trips', JSON.stringify(trips));
      } catch (error) {
        console.error("Failed to save trips to localStorage:", error);
      }
    }
  }, [trips, isInitialLoad]);

  const handleEnterApp = () => {
    try {
      localStorage.setItem('keralaxplore_frontpage_seen', 'true');
    } catch (error) {
      console.error("Failed to save front page seen status to localStorage:", error);
    }
    setHasSeenFrontPage(true);
  };

  const handleConsent = () => {
    try {
      localStorage.setItem('keralaxplore_consent', 'true');
    } catch (error) {
      console.error("Failed to save consent to localStorage:", error);
    }
    setHasConsented(true);
  };

  const handleLogin = () => {
    try {
      localStorage.setItem('keralaxplore_auth', 'true');
    } catch (error) {
      console.error("Failed to save auth to localStorage:", error);
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try {
      // Clear all session-related data to reset the app flow
      localStorage.removeItem('keralaxplore_auth');
      localStorage.removeItem('keralaxplore_consent');
      localStorage.removeItem('keralaxplore_frontpage_seen');
      // Note: We don't log out of PRO status, as it might be a "purchased" feature.
    } catch (error) {
      console.error("Failed to clear session from localStorage:", error);
    }
    // Reset all state flags to redirect to the initial slideshow
    setIsAuthenticated(false);
    setHasConsented(false);
    setHasSeenFrontPage(false);
    setActiveView('explore'); // Reset to default view for the next session
  };

  const handleUpgrade = () => {
    try {
      localStorage.setItem('keralaxplore_is_pro', 'true');
    } catch (error) {
      console.error("Failed to save pro status to localStorage:", error);
    }
    setIsProUser(true);
    setIsUpgradeModalOpen(false);
  };

  const openModalForNew = (date?: string) => {
    setEditingTrip(null);
    setDefaultTripDate(date || new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const openModalForEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setDefaultTripDate(undefined);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTrip(null);
    setDefaultTripDate(undefined);
  };

  const handleSaveTrip = (trip: Trip) => {
    if (editingTrip) {
      setTrips(prevTrips => prevTrips.map(t => t.id === trip.id ? trip : t).sort((a,b) => (a.date + a.startTime).localeCompare(b.date + b.startTime)));
    } else {
      setTrips(prevTrips => [...prevTrips, trip].sort((a,b) => (a.date + a.startTime).localeCompare(b.date + b.startTime)));
    }
    closeModal();
  };

  const handleDeleteTrip = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      setTrips(prevTrips => prevTrips.filter(trip => trip.id !== id));
    }
  }, []);
  
  const totalPhotos = trips.filter(trip => trip.photoUrl).length;

  if (isInitialLoad) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="text-lg text-slate-500">Loading...</div>
        </div>
    );
  }

  if (!hasSeenFrontPage) {
    return <FrontPage onEnter={handleEnterApp} />;
  }
    
  if (!hasConsented) {
    return <ConsentModal onConsent={handleConsent} />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Header 
        onLogout={handleLogout} 
        activeView={activeView}
        onNavigate={setActiveView}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        isProUser={isProUser}
        onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
      />
      <main className="p-4 sm:p-6 pb-24 max-w-4xl mx-auto">
        {activeView === 'diary' && (
          <TripList trips={trips} onEdit={openModalForEdit} onDelete={handleDeleteTrip} />
        )}
        {activeView === 'explore' && <KeralaXplore />}
        {activeView === 'calendar' && (
          <TripCalendar 
            trips={trips} 
            onAdd={openModalForNew} 
            onEdit={openModalForEdit} 
            onDelete={handleDeleteTrip} 
          />
        )}
        {activeView === 'weather' && <WeatherReport />}
        {activeView === 'hotels' && <FamousHotels />}
        {activeView === 'food' && <FamousFood />}
        {activeView === 'map' && <KeralaMap />}
        {activeView === 'emergency' && <EmergencyContacts />}
      </main>
      {activeView === 'diary' && <FloatingActionButton onClick={() => openModalForNew()} />}
      {isModalOpen && (
        <TripForm 
          onClose={closeModal} 
          onSave={handleSaveTrip} 
          initialData={editingTrip}
          defaultDate={defaultTripDate}
          isProUser={isProUser}
          photoCount={totalPhotos}
          onOpenUpgradeModal={() => {
              closeModal();
              setIsUpgradeModalOpen(true);
          }}
        />
      )}
      {isUpgradeModalOpen && (
        <UpgradeModal 
          onClose={() => setIsUpgradeModalOpen(false)} 
          onUpgrade={handleUpgrade}
        />
      )}
      <GuideChatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default App;