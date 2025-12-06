
import React from 'react';
import { Trip } from '../types';
import { Icon } from './Icon';

interface TripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
}

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        // Adding T00:00:00 ensures the date is parsed in UTC, avoiding timezone issues.
        return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', options);
    } catch (e) {
        console.error("Invalid date string:", dateString);
        return dateString;
    }
};

const TripCard: React.FC<TripCardProps> = ({ trip, onEdit, onDelete }) => {
  if (trip.photoUrl) {
    return (
      <article className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] duration-300">
        <img src={trip.photoUrl} alt={`View of ${trip.destination}`} className="w-full h-40 object-cover" />
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
               <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center text-sm text-slate-500">
                  <Icon name={trip.mode} className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="font-semibold uppercase tracking-wider">{trip.mode}</span>
                </div>
                 <div className="text-right">
                    <span className="text-lg font-semibold text-slate-800">{trip.startTime}</span>
                    <p className="text-xs text-slate-500">{formatDate(trip.date)}</p>
                 </div>
              </div>
              <div className="flex items-center mb-1">
                <span className="text-blue-500"><Icon name="origin" className="w-5 h-5" /></span>
                <p className="ml-2 text-slate-700 font-medium truncate">{trip.origin}</p>
              </div>
              <div className="flex items-center">
                <span className="text-slate-400"><Icon name="destination" className="w-5 h-5" /></span>
                <p className="ml-2 text-slate-800 font-semibold truncate">{trip.destination}</p>
              </div>
            </div>
          </div>

          {trip.travelers && (
            <div className="flex items-center mt-3 pt-3 border-t border-slate-100">
              <span className="text-slate-400"><Icon name="users" className="w-5 h-5" /></span>
              <p className="ml-2 text-sm text-slate-600">{trip.travelers}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={() => onEdit(trip)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors" aria-label={`Edit trip to ${trip.destination}`}>
              <Icon name="edit" className="w-5 h-5" />
            </button>
            <button onClick={() => onDelete(trip.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors" aria-label={`Delete trip to ${trip.destination}`}>
              <Icon name="delete" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] duration-300">
      <div className="flex items-stretch">
        <div className="flex-shrink-0 w-24 bg-blue-500 text-white flex flex-col items-center justify-center p-2 text-center">
          <Icon name={trip.mode} className="w-8 h-8 mb-1" />
          <span className="font-bold text-sm uppercase tracking-wider">{trip.mode}</span>
          <span className="text-2xl font-light mt-1">{trip.startTime}</span>
          <span className="text-xs opacity-80">{formatDate(trip.date)}</span>
        </div>
        <div className="flex-grow p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-2">
              <span className="text-blue-500"><Icon name="origin" className="w-5 h-5" /></span>
              <p className="ml-2 text-slate-700 font-medium truncate">{trip.origin}</p>
            </div>
            <div className="flex items-center">
              <span className="text-slate-400"><Icon name="destination" className="w-5 h-5" /></span>
              <p className="ml-2 text-slate-800 font-semibold truncate">{trip.destination}</p>
            </div>
            {trip.travelers && (
                <div className="flex items-center mt-3 pt-3 border-t border-slate-100">
                    <span className="text-slate-400"><Icon name="users" className="w-5 h-5" /></span>
                    <p className="ml-2 text-sm text-slate-600">{trip.travelers}</p>
                </div>
            )}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={() => onEdit(trip)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors" aria-label={`Edit trip to ${trip.destination}`}>
              <Icon name="edit" className="w-5 h-5" />
            </button>
            <button onClick={() => onDelete(trip.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors" aria-label={`Delete trip to ${trip.destination}`}>
              <Icon name="delete" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default TripCard;