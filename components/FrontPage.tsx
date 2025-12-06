import React, { useState, useEffect } from 'react';
import { Slide } from '../types';
import { Icon } from './Icon';

const slides: Slide[] = [
  {
    id: 1,
    name: 'Kathakali',
    description: 'A classical Indian dance-drama known for its elaborate makeup, costumes, and detailed gestures, traditionally presenting stories from Hindu epics.',
    imageUrl: 'https://i.ibb.co/rGLd6zCd/kathakali.jpg',
  },
  {
    id: 2,
    name: 'Theyyam',
    description: 'A vibrant and ancient ritual form of worship from northern Kerala, where performers in divine costumes embody deities and bless devotees.',
    imageUrl: 'https://i.ibb.co/27PnwZd0/theyyam.jpg',
  },
  {
    id: 3,
    name: 'Kerala Backwaters',
    description: 'A serene network of lakes and canals fringed by lush greenery. Houseboat cruises offer a unique way to experience rural Kerala life.',
    imageUrl: 'https://i.ibb.co/k2vN12LH/backwaters.jpg',
  },
  {
    id: 4,
    name: 'Thrissur Pooram',
    description: 'One of the most spectacular temple festivals, known for its grand procession of caparisoned elephants and traditional music.',
    imageUrl: 'https://i.ibb.co/gFBFzfG3/thrissur-pooram.jpg',
  },
  {
    id: 5,
    name: 'Onam Sadya',
    description: 'A grand vegetarian feast central to the Onam festival, served on a banana leaf and showcasing the rich culinary heritage of the region.',
    imageUrl: 'https://i.ibb.co/DPbdBYc2/sadya.jpg',
  },
];

interface FrontPageProps {
  onEnter: () => void;
}

const FrontPage: React.FC<FrontPageProps> = ({ onEnter }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      goToNext();
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  const goToSlide = (slideIndex: number) => {
      setCurrentIndex(slideIndex);
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-black">
      <div className="w-full h-full flex transition-transform ease-in-out duration-1000" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {slides.map((slide) => (
          <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
            <img src={slide.imageUrl} alt={slide.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          </div>
        ))}
      </div>
      
      <div className="absolute top-0 left-0 p-8 flex items-center space-x-3">
        <Icon name="logo" className="w-10 h-10 text-white" />
        <h1 className="text-3xl font-bold text-white tracking-tight" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>KeralaXplore</h1>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white flex flex-col items-center text-center">
        <div 
            className="max-w-xl"
            aria-live="polite"
            aria-atomic="true"
        >
            <h2 className="text-4xl md:text-5xl font-bold mb-3 transition-opacity duration-500" key={slides[currentIndex].id}>{slides[currentIndex].name}</h2>
            <p className="text-base md:text-lg text-slate-200 mb-8 transition-opacity duration-500" key={slides[currentIndex].id + 'desc'}>{slides[currentIndex].description}</p>
        </div>
        <button
          onClick={onEnter}
          className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Get Started
        </button>

        <div className="mt-8 text-center text-sm" aria-label="Language selection">
          <button className="text-white font-semibold hover:underline px-2 transition-opacity">English</button>
          <span className="text-slate-400 mx-1">•</span>
          <button className="text-slate-300 hover:text-white hover:underline px-2 transition-opacity">हिन्दी</button>
          <span className="text-slate-400 mx-1">•</span>
          <button className="text-slate-300 hover:text-white hover:underline px-2 transition-opacity">മലയാളം</button>
        </div>

        <div className="flex justify-center mt-4 space-x-2">
            {slides.map((slide, slideIndex) => (
                <button key={slide.id} onClick={() => goToSlide(slideIndex)} className={`h-2 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'}`} aria-label={`Go to slide ${slideIndex + 1}`}></button>
            ))}
        </div>
      </div>

      <button onClick={goToPrevious} className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors" aria-label="Previous slide">
        <Icon name="arrow-left" className="w-6 h-6" />
      </button>
      <button onClick={goToNext} className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors" aria-label="Next slide">
        <Icon name="arrow-right" className="w-6 h-6" />
      </button>

    </div>
  );
};

export default FrontPage;