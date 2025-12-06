import React from 'react';

const places = [
  {
    id: 1,
    name: 'Munnar Tea Gardens',
    description: 'Lush green rolling hills covered in tea plantations.',
    imageUrl: 'https://i.ibb.co/Cj6LSB6/munnar.jpg',
  },
  {
    id: 2,
    name: 'Alleppey Backwaters',
    description: 'Serene network of lakes, canals, and lagoons.',
    imageUrl: 'https://i.ibb.co/yBgQFpV3/Alleppey-Backwater.jpg',
  },

   {
  id: 3,
  name: 'Fort Kochi',
  description: 'Historic area with Chinese fishing nets and colonial architecture.',
  imageUrl: 'https://i.ibb.co/fVvBVsSm/fort-kochi-new.jpg',
}

  {
    id: 4,
    name: 'Varkala Beach',
    description: 'Famous for its cliff-side views of the Arabian Sea.',
    imageUrl: 'https://i.ibb.co/m5GBB5qq/Varkala-Beach.jpg',
  },
  {
    id: 5,
    name: 'Athirappilly Waterfalls',
    description: 'The largest waterfall in Kerala, often called the "Niagara of India".',
    imageUrl: 'https://i.ibb.co/21WkWGXL/VAthirappilly-Waterfalls.jpg',
  },
  {
    id: 6,
    name: 'Thekkady',
    description: 'Home to the Periyar National Park and diverse wildlife.',
    imageUrl: 'https://i.ibb.co/gM8bcTJn/Thekkady.jpg',
  },
];


const KeralaXplore: React.FC = () => {
  return (
    <div className="animate-fade-in">
        <div className="text-center mb-10">
             <h2 className="text-3xl font-bold text-slate-800 mb-2">
                Explore Famous Places in Kerala
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
                Discover the beauty and culture of "God's Own Country" through its most iconic destinations.
            </p>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {places.map((place) => (
          <article key={place.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
            <img src={place.imageUrl} alt={place.name} className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-800">{place.name}</h3>
              <p className="text-slate-600 mt-1 text-sm">{place.description}</p>
            </div>
          </article>
        ))}
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

export default KeralaXplore;