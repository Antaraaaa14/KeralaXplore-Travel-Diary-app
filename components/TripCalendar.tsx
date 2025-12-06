import React, { useState, useMemo } from 'react';
import { Trip } from '../types';
import { Icon } from './Icon';
import TripCard from './TripCard';

interface TripCalendarProps {
  trips: Trip[];
  onAdd: (date: string) => void;
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
}

const TripCalendar: React.FC<TripCalendarProps> = ({ trips, onAdd, onEdit, onDelete }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split('T')[0]);

  const firstDayOfMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), [currentDate]);
  const lastDayOfMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0), [currentDate]);

  const tripsByDate = useMemo(() => {
    return trips.reduce((acc, trip) => {
      const date = trip.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(trip);
      return acc;
    }, {} as Record<string, Trip[]>);
  }, [trips]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const todayString = useMemo(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today.toISOString().split('T')[0];
  }, []);

  const calendarGrid = useMemo(() => {
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    let currentDateIterator = new Date(firstDayOfMonth);

    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
        (currentWeek as any[]).push(null);
    }
    
    while (currentDateIterator.getMonth() === firstDayOfMonth.getMonth()) {
        currentWeek.push(new Date(currentDateIterator));
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
        currentDateIterator.setDate(currentDateIterator.getDate() + 1);
    }

    if (currentWeek.length > 0) {
        while(currentWeek.length < 7) {
            (currentWeek as any[]).push(null);
        }
        weeks.push(currentWeek);
    }

    return weeks;
  }, [firstDayOfMonth]);

  const selectedTrips = selectedDate ? tripsByDate[selectedDate] || [] : [];
  const formattedSelectedDate = selectedDate 
    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="animate-fade-in">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Trip Calendar</h2>
            <p className="text-slate-500 max-w-lg mx-auto">Visualize your travel schedule and plan your next adventure.</p>
        </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-slate-100" aria-label="Previous month">
            <Icon name="arrow-left" className="w-6 h-6 text-slate-500" />
          </button>
          <h3 className="text-lg font-bold text-slate-800" aria-live="polite">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-slate-100" aria-label="Next month">
            <Icon name="arrow-right" className="w-6 h-6 text-slate-500" />
          </button>
        </div>
        <table className="w-full" role="grid" aria-labelledby="calendar-title">
            <caption id="calendar-title" className="sr-only">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</caption>
            <thead>
                <tr>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <th key={day} scope="col" className="py-2 text-center font-semibold text-sm text-slate-500 border-b border-r border-slate-200 last:border-r-0">{day}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {calendarGrid.map((week, weekIndex) => (
                    <tr key={weekIndex}>
                        {week.map((day, dayIndex) => {
                            if (!day) {
                                return <td key={`${weekIndex}-${dayIndex}`} className="h-20 sm:h-28 border-r border-b border-slate-200"></td>;
                            }
                            const dateString = day.toISOString().split('T')[0];
                            const isToday = dateString === todayString;
                            const isSelected = selectedDate === dateString;
                            const dayTrips = tripsByDate[dateString] || [];
                            const hasTrips = dayTrips.length > 0;
                             const ariaLabel = `${day.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}. ${hasTrips ? `${dayTrips.length} trip${dayTrips.length > 1 ? 's' : ''}` : 'No trips'}.`;

                            return (
                                <td key={dateString} className={`h-20 sm:h-28 border-r border-b border-slate-200 last:border-r-0 ${isSelected ? 'bg-blue-50' : ''}`}>
                                    <button
                                        onClick={() => setSelectedDate(dateString)}
                                        aria-label={ariaLabel}
                                        aria-pressed={isSelected}
                                        className={`w-full h-full p-2 flex flex-col items-start justify-between text-left transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500`}
                                    >
                                        <span className={`font-semibold ${isToday ? 'text-blue-600' : 'text-slate-700'}`}>{day.getDate()}</span>
                                        {hasTrips && (
                                            <div className="self-center">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full" aria-hidden="true"></div>
                                            </div>
                                        )}
                                    </button>
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
      
      {selectedDate && (
        <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800 mb-2 sm:mb-0">
                   Trips for <span className="text-blue-600">{formattedSelectedDate}</span>
                </h3>
                 <button 
                    onClick={() => onAdd(selectedDate)}
                    className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <Icon name="plus" className="w-5 h-5"/>
                    <span>Add Trip for this date</span>
                </button>
            </div>

            {selectedTrips.length > 0 ? (
                <div className="space-y-4">
                    {selectedTrips.map(trip => (
                        <TripCard key={trip.id} trip={trip} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 px-4 bg-white rounded-xl shadow-lg">
                    <div className="inline-block bg-slate-100 text-slate-500 p-3 rounded-full mb-3">
                        <Icon name="diary" className="w-8 h-8"/>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-700">No Trips Scheduled</h4>
                    <p className="text-slate-500 mt-1">Click "Add Trip" to plan your day.</p>
                </div>
            )}
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default TripCalendar;