import type { MonthlyPerformance, HistoricalData } from '@typings/performance.types';
import type { District } from '@typings/district.types';

// Fake district list for development
export const fakeDistricts: District[] = [
  { id: '0202', name: 'Vizianagaram', state: 'Andhra Pradesh', stateCode: '02' },
  { id: '0204', name: 'East Godavari', state: 'Andhra Pradesh', stateCode: '02' },
  { id: '0219', name: 'Bapatla', state: 'Andhra Pradesh', stateCode: '02' },
];

// Fake current performance per district
export const fakeCurrent: Record<string, MonthlyPerformance> = {
  '0202': {
    month: 'Dec',
    year: 2024,
    districtName: 'Vizianagaram',
    stateName: 'Andhra Pradesh',
    jobCardsIssued: 640000,
    jobCardsWithEmployment: 580000,
    employmentProvided: 500000,
    personDaysGenerated: 750000,
    averageDaysPerHousehold: 42,
    totalExpenditureCrores: 120,
    wageExpenditureCrores: 80,
    materialExpenditureCrores: 40,
    worksCompleted: 9000,
    worksInProgress: 2000,
    scWorkers: 120000,
    stWorkers: 50000,
    womenWorkers: 350000,
    performanceScore: 78,
    rank: 5,
    comparison: 'above',
  },
  '0204': {
    month: 'Dec',
    year: 2024,
    districtName: 'East Godavari',
    stateName: 'Andhra Pradesh',
    jobCardsIssued: 400000,
    jobCardsWithEmployment: 360000,
    employmentProvided: 300000,
    personDaysGenerated: 600000,
    averageDaysPerHousehold: 38,
    totalExpenditureCrores: 90,
    wageExpenditureCrores: 60,
    materialExpenditureCrores: 30,
    worksCompleted: 7000,
    worksInProgress: 1500,
    scWorkers: 90000,
    stWorkers: 30000,
    womenWorkers: 250000,
    performanceScore: 70,
    rank: 15,
    comparison: 'average',
  },
  '0219': {
    month: 'Dec',
    year: 2024,
    districtName: 'Bapatla',
    stateName: 'Andhra Pradesh',
    jobCardsIssued: 300000,
    jobCardsWithEmployment: 270000,
    employmentProvided: 240000,
    personDaysGenerated: 450000,
    averageDaysPerHousehold: 36,
    totalExpenditureCrores: 75,
    wageExpenditureCrores: 50,
    materialExpenditureCrores: 25,
    worksCompleted: 6000,
    worksInProgress: 1000,
    scWorkers: 80000,
    stWorkers: 25000,
    womenWorkers: 200000,
    performanceScore: 65,
    rank: 25,
    comparison: 'below',
  },
};

// Fake historical data per district (last 6 months)
export const fakeHistory: Record<string, HistoricalData> = {
  '0202': {
    records: [
      { ...fakeCurrent['0202'], month: 'Nov', jobCardsIssued: 620000, personDaysGenerated: 720000, performanceScore: 76 },
      { ...fakeCurrent['0202'], month: 'Oct', jobCardsIssued: 600000, personDaysGenerated: 700000, performanceScore: 75 },
      { ...fakeCurrent['0202'], month: 'Sep', jobCardsIssued: 580000, personDaysGenerated: 680000, performanceScore: 74 },
      { ...fakeCurrent['0202'], month: 'Aug', jobCardsIssued: 560000, personDaysGenerated: 660000, performanceScore: 73 },
      { ...fakeCurrent['0202'], month: 'Jul', jobCardsIssued: 540000, personDaysGenerated: 640000, performanceScore: 72 },
      { ...fakeCurrent['0202'], month: 'Jun', jobCardsIssued: 520000, personDaysGenerated: 620000, performanceScore: 71 },
    ],
    startDate: '2024-06-01',
    endDate: '2024-11-01',
  },
  '0204': {
    records: [
      { ...fakeCurrent['0204'], month: 'Nov', jobCardsIssued: 380000, personDaysGenerated: 580000, performanceScore: 68 },
      { ...fakeCurrent['0204'], month: 'Oct', jobCardsIssued: 360000, personDaysGenerated: 560000, performanceScore: 67 },
      { ...fakeCurrent['0204'], month: 'Sep', jobCardsIssued: 340000, personDaysGenerated: 540000, performanceScore: 66 },
      { ...fakeCurrent['0204'], month: 'Aug', jobCardsIssued: 320000, personDaysGenerated: 520000, performanceScore: 65 },
      { ...fakeCurrent['0204'], month: 'Jul', jobCardsIssued: 300000, personDaysGenerated: 500000, performanceScore: 64 },
      { ...fakeCurrent['0204'], month: 'Jun', jobCardsIssued: 280000, personDaysGenerated: 480000, performanceScore: 63 },
    ],
    startDate: '2024-06-01',
    endDate: '2024-11-01',
  },
  '0219': {
    records: [
      { ...fakeCurrent['0219'], month: 'Nov', jobCardsIssued: 280000, personDaysGenerated: 430000, performanceScore: 63 },
      { ...fakeCurrent['0219'], month: 'Oct', jobCardsIssued: 260000, personDaysGenerated: 410000, performanceScore: 62 },
      { ...fakeCurrent['0219'], month: 'Sep', jobCardsIssued: 240000, personDaysGenerated: 390000, performanceScore: 61 },
      { ...fakeCurrent['0219'], month: 'Aug', jobCardsIssued: 220000, personDaysGenerated: 370000, performanceScore: 60 },
      { ...fakeCurrent['0219'], month: 'Jul', jobCardsIssued: 200000, personDaysGenerated: 350000, performanceScore: 59 },
      { ...fakeCurrent['0219'], month: 'Jun', jobCardsIssued: 180000, personDaysGenerated: 330000, performanceScore: 58 },
    ],
    startDate: '2024-06-01',
    endDate: '2024-11-01',
  },
};
import type { ComparisonData } from '@typings/performance.types';

// Fake comparison data per district
export const fakeComparison: Record<string, ComparisonData> = {
  '0202': {
    district: fakeCurrent['0202'],
    stateAverage: { ...fakeCurrent['0204'], districtName: 'State Average' },
    nationalAverage: { ...fakeCurrent['0219'], districtName: 'National Average' },
  },
  '0204': {
    district: fakeCurrent['0204'],
    stateAverage: { ...fakeCurrent['0202'], districtName: 'State Average' },
    nationalAverage: { ...fakeCurrent['0219'], districtName: 'National Average' },
  },
  '0219': {
    district: fakeCurrent['0219'],
    stateAverage: { ...fakeCurrent['0202'], districtName: 'State Average' },
    nationalAverage: { ...fakeCurrent['0204'], districtName: 'National Average' },
  },
};