export interface MonthlyPerformance {
  month: string;
  year: number;
  districtName: string;
  stateName: string;
  
  jobCardsIssued: number;
  jobCardsWithEmployment: number;
  employmentProvided: number;
  personDaysGenerated: number;
  averageDaysPerHousehold: number;
  
  totalExpenditureCrores: number;
  wageExpenditureCrores: number;
  materialExpenditureCrores: number;
  
  worksCompleted: number;
  worksInProgress: number;
  
  scWorkers: number;
  stWorkers: number;
  womenWorkers: number;
  
  performanceScore?: number;
  rank?: number;
  comparison?: 'above' | 'below' | 'average';
}

export interface HistoricalDataType {
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
