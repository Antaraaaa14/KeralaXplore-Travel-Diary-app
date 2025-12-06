export interface Trip {
  id: string;
  date: string; // "YYYY-MM-DD" format
  origin: string;
  destination: string;
  startTime: string; // "HH:MM" format
  mode: string;
  travelers: string;
  photoUrl?: string;
}

export interface FamousHotel {
  id: number;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  rating: number;
}

export interface FamousFood {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

export interface Slide {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  icon: 'sun' | 'cloud-sun' | 'cloud' | 'rain';
  feelsLike: number;
  humidity: number;
  windSpeed: number;
}

export enum TravelMode {
  CAR = 'car',
  BUS = 'bus',
  TRAIN = 'train',
  WALK = 'walk',
  BIKE = 'bike',
  OTHER = 'other'
}

export type AppView = 'diary' | 'explore' | 'hotels' | 'food' | 'map' | 'calendar' | 'weather' | 'emergency';