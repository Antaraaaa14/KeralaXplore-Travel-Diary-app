import { TravelMode } from './types';
import { IconName } from './components/Icon';

export const TRAVEL_MODES: { value: TravelMode; label: string; icon: IconName }[] = [
  { value: TravelMode.CAR, label: 'Car', icon: 'car' },
  { value: TravelMode.BUS, label: 'Bus', icon: 'bus' },
  // FIX: Added missing 'icon' property to the following travel modes to resolve TypeScript errors.
  // Also capitalized the labels for consistency with other modes in the UI.
  { value: TravelMode.TRAIN, label: 'Train', icon: 'train' },
  { value: TravelMode.WALK, label: 'Walk', icon: 'walk' },
  { value: TravelMode.BIKE, label: 'Bike', icon: 'bike' },
  { value: TravelMode.OTHER, label: 'Other', icon: 'other' },
];
