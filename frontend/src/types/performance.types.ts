export interface MonthlyPerformance {
  month: string;
  year: number;
  districtName: string;
  stateName: string;
  
  // Core metrics
  jobCardsIssued: number;
  jobCardsWithEmployment: number;
  employmentProvided: number;
  personDaysGenerated: number;
  averageDaysPerHousehold: number;
  
  // Financial metrics
  totalExpenditureCrores: number;
  wageExpenditureCrores: number;
  materialExpenditureCrores: number;
  
  // Work completion
  worksCompleted: number;
  worksInProgress: number;
  
  // Social composition
  scWorkers: number;
  stWorkers: number;
  womenWorkers: number;
  
  // Performance indicators
  performanceScore?: number;
  rank?: number;
  comparison?: 'above' | 'below' | 'average';
}

export interface HistoricalData {
  records: MonthlyPerformance[];
  startDate: string;
  endDate: string;
}

export interface ComparisonData {
  district: MonthlyPerformance;
  stateAverage: MonthlyPerformance;
  nationalAverage: MonthlyPerformance;
}

export interface LeaderboardEntry {
  districtName: string;
  stateName: string;
  performanceScore: number;
  rank: number;
  personDaysGenerated: number;
}
