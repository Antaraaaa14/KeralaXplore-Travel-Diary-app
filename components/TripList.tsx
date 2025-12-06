
import React from 'react';
import { Trip } from '../types';
import TripCard from './TripCard';

interface TripListProps {
  trips: Trip[];
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
}

const TripList: React.FC<TripListProps> = ({ trips, onEdit, onDelete }) => {
  if (trips.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="inline-block bg-blue-100 text-blue-600 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-700">No Trips Logged Yet</h3>
        <p className="text-slate-500 mt-2">
          Click the '+' button below to add your first trip of the day.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trips.map(trip => (
        <TripCard key={trip.id} trip={trip} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default TripList;