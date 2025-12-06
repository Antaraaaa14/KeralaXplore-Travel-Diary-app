import React, { useState, FormEvent } from 'react';
import { Icon } from './Icon';

const INITIAL_MAP_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4016629.324397443!2d74.4754117180436!3d10.53811933563968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0812ffd49cf55b%3A0x64bd90fbed387c99!2sKerala!5e0!3m2!1sen!2sin!4v1678886055598!5m2!1sen!2sin";

const KeralaMap: React.FC = () => {
  const [query, setQuery] = useState('');
  const [mapUrl, setMapUrl] = useState(INITIAL_MAP_URL);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const searchLocation = `${query}, Kerala, India`;
      const newUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchLocation)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
      setMapUrl(newUrl);
    } else {
      setMapUrl(INITIAL_MAP_URL);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Map of Kerala
        </h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          Navigate through the beautiful landscapes of Kerala. Explore districts, cities, and tourist spots.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-6">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Cochin, Munnar, Thekkady..."
            className="w-full pl-5 pr-12 py-3 border border-slate-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            aria-label="Search for a location in Kerala"
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-white bg-blue-600 rounded-r-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            aria-label="Search"
          >
            <Icon name="search" className="w-6 h-6" />
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <iframe
          key={mapUrl}
          src={mapUrl}
          width="100%"
          height="550"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Map of Kerala"
        ></iframe>
      </div>
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

export default KeralaMap;