import React from 'react';
import { FamousFood } from '../types';

const foods: FamousFood[] = [
  {
    id: 1,
    name: 'Sadya',
    description: 'A traditional vegetarian feast served on a banana leaf, featuring a variety of dishes.',
    imageUrl: 'https://i.ibb.co/BKFWbp16/sadya.jpg',
  },
  {
    id: 2,
    name: 'Puttu and Kadala Curry',
    description: 'Steamed cylinders of ground rice layered with coconut, served with black chickpea curry.',
    imageUrl: 'https://i.ibb.co/hxpc2K7j/puttu-kadala.jpg',
  },
  {
    id: 3,
    name: 'Appam with Stew',
    description: 'A type of pancake made with fermented rice batter and coconut milk, often paired with a mild stew.',
    imageUrl: 'https://i.ibb.co/qLM1YTVY/appam-stew.jpg',
  },
  {
    id: 4,
    name: 'Malabar Biryani',
    description: 'A flavorful and aromatic rice dish made with spices, ghee, and meat or vegetables.',
    imageUrl: 'https://i.ibb.co/bj93wJVc/malabar-biryani.jpg',
  },
  {
    id: 5,
    name: 'Idiyappam',
    description: 'Also known as string hoppers, these are rice flour noodles steamed and served with curry.',
    imageUrl: 'https://i.ibb.co/kd4DY80/idiyappam.jpg',
  },
  {
    id: 6,
    name: 'Masala Dosa',
    description: 'A thin, crispy crepe made from fermented rice and lentil batter, filled with spiced potatoes.',
    imageUrl: 'https://i.ibb.co/WvD6VJyr/masala-dosa.jpg',
  },
];


const FamousFood: React.FC = () => {
  return (
    <div className="animate-fade-in">
        <div className="text-center mb-10">
             <h2 className="text-3xl font-bold text-slate-800 mb-2">
                Famous Food of Kerala
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
                Savor the unique and delicious flavors from the kitchens of "God's Own Country".
            </p>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {foods.map((food) => (
          <article key={food.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
            <img src={food.imageUrl} alt={food.name} className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-800">{food.name}</h3>
              <p className="text-slate-600 mt-1 text-sm">{food.description}</p>
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

export default FamousFood;