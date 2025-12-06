import React from 'react';
import { FamousHotel } from '../types';

const hotels: FamousHotel[] = [
  {
    id: 1,
    name: 'Taj Malabar Resort & Spa',
    location: 'Cochin',
    description: 'A beautiful heritage hotel offering stunning views of Cochin harbour.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=870&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 2,
    name: 'Kumarakom Lake Resort',
    location: 'Kumarakom',
    description: 'A luxury resort on the banks of Lake Vembanad, known for its traditional architecture.',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=725&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 3,
    name: 'The Leela Kovalam',
    location: 'Kovalam',
    description: 'India\'s only cliff-top beach resort, offering panoramic views of the Arabian Sea.',
    imageUrl: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=870&auto=format&fit=crop',
    rating: 4,
  },
];

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg
    className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-slate-300'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.24 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
  </svg>
);

const Rating: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex items-center" aria-label={`Rating: ${value} out of 5 stars`}>
    {[...Array(5)].map((_, i) => (
      <StarIcon key={i} filled={i < value} />
    ))}
  </div>
);


const FamousHotels: React.FC = () => {
  return (
    <div className="mt-16">
        <div className="text-center mb-10">
             <h2 className="text-3xl font-bold text-slate-800 mb-2">
                Famous Hotels in Kerala
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
                Experience world-class hospitality at some of the best hotels the state has to offer.
            </p>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {hotels.map((hotel) => (
          <article key={hotel.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
            <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-48 object-cover" />
            <div className="p-5">
              <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-slate-800">{hotel.name}</h3>
                  <Rating value={hotel.rating} />
              </div>
              <p className="text-slate-500 text-sm font-medium mt-1">{hotel.location}</p>
              <p className="text-slate-600 mt-2 text-sm">{hotel.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default FamousHotels;