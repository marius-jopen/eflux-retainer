import settingsData from '@/settings.json';
import type { CalculationInputs } from './calculations';

export const defaultSettings: CalculationInputs = {
  retainer: settingsData.retainer,
  hours: settingsData.hours,
  developerRetainerHours: settingsData.developerRetainerHours,
  developerRetainerRate: settingsData.developerRetainerRate,
  clientRate1: settingsData.clientRate1,
  clientRate2: settingsData.clientRate2,
  clientRate3: settingsData.clientRate3,
  developerRate1: settingsData.developerRate1,
  developerRate2: settingsData.developerRate2,
  developerRate3: settingsData.developerRate3,
};

