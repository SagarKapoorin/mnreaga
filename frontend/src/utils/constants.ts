export const STATES = [
  { code: 'UP', name: 'Uttar Pradesh' },
  { code: 'RJ', name: 'Rajasthan' },
  { code: 'MP', name: 'Madhya Pradesh' },
  { code: 'BR', name: 'Bihar' },
  { code: 'WB', name: 'West Bengal' },
  { code: 'MH', name: 'Maharashtra' },
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'AP', name: 'Andhra Pradesh' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'GJ', name: 'Gujarat' },
  { code: 'OR', name: 'Odisha' },
  { code: 'TG', name: 'Telangana' },
  { code: 'KL', name: 'Kerala' },
  { code: 'JH', name: 'Jharkhand' },
  { code: 'AS', name: 'Assam' },
  { code: 'PB', name: 'Punjab' },
  { code: 'CT', name: 'Chhattisgarh' },
  { code: 'HR', name: 'Haryana' },
  { code: 'HP', name: 'Himachal Pradesh' },
  { code: 'UK', name: 'Uttarakhand' },
] as const;

export const METRIC_ICONS = {
  jobCards: '👥',
  employment: '📅',
  wages: '💰',
  works: '🏗️',
  women: '👩',
  sc: '⚖️',
  st: '🌳',
  households: '🏘️',
  personDays: '📊',
} as const;

export const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English', nativeName: 'English', ttsCode: 'en-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', ttsCode: 'hi-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', ttsCode: 'te-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', ttsCode: 'ta-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', ttsCode: 'bn-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', ttsCode: 'mr-IN' },
] as const;

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: 15000,
  RETRY_COUNT: 2,
} as const;

export const CACHE_TIMES = {
  DISTRICT_DATA: 30 * 60 * 1000,
  HISTORICAL_DATA: 60 * 60 * 1000,
  STATES_LIST: 24 * 60 * 60 * 1000,
} as const;
