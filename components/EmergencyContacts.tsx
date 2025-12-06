import React from 'react';
import { Icon, IconName } from './Icon';

interface EmergencyContact {
  name: string;
  number: string;
  description: string;
  icon: IconName;
  iconBgColor: string;
  iconColor: string;
}

const contacts: EmergencyContact[] = [
  {
    name: 'National Emergency Number',
    number: '112',
    description: 'A single pan-India number for all emergencies.',
    icon: 'emergency',
    iconBgColor: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  {
    name: 'Police Control Room',
    number: '100',
    description: 'For reporting crimes and law & order situations.',
    icon: 'police',
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    name: 'Fire Station',
    number: '101',
    description: 'For fire-related emergencies and rescue operations.',
    icon: 'fire',
    iconBgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    name: 'Ambulance / Medical Help',
    number: '108',
    description: 'For immediate medical assistance and ambulance services.',
    icon: 'ambulance',
    iconBgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    name: 'Kerala Tourism Police',
    number: '9497900000',
    description: 'Dedicated police force to ensure the safety of tourists.',
    icon: 'police',
    iconBgColor: 'bg-teal-100',
    iconColor: 'text-teal-600',
  },
  {
    name: 'Disaster Management',
    number: '1077',
    description: 'State-level helpline for natural disasters and calamities.',
    icon: 'disaster',
    iconBgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    name: 'Women Helpline',
    number: '1091',
    description: 'For women in distress or facing harassment.',
    icon: 'users',
    iconBgColor: 'bg-pink-100',
    iconColor: 'text-pink-600',
  },
  {
    name: 'Child Helpline',
    number: '1098',
    description: 'Nationwide service for children in need of care and protection.',
    icon: 'users',
    iconBgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
];

const EmergencyContacts: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Emergency Contacts
        </h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          For your safety and assistance while travelling in Kerala. Tap the number to call.
        </p>
      </div>
      <div className="space-y-4 max-w-2xl mx-auto">
        {contacts.map((contact) => (
          <article key={contact.name} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] duration-300">
            <div className="flex items-center p-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${contact.iconBgColor}`}>
                <Icon name={contact.icon} className={`w-6 h-6 ${contact.iconColor}`} />
              </div>
              <div className="flex-grow ml-4">
                <h3 className="text-lg font-semibold text-slate-800">{contact.name}</h3>
                <p className="text-sm text-slate-600">{contact.description}</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <a
                  href={`tel:${contact.number}`}
                  className="flex items-center space-x-2 bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-colors"
                  aria-label={`Call ${contact.name} at ${contact.number}`}
                >
                  <Icon name="phone" className="w-5 h-5"/>
                  <span className="hidden sm:inline">{contact.number}</span>
                </a>
              </div>
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

export default EmergencyContacts;
