import { useQuery } from '@tanstack/react-query';
import apiService from '@services/api';
import type { HistoricalDataType } from '@typings/performance.types';

interface UseHistoricalDataOptions {
  districtName: string;
  months?: number;
}

export const useHistoricalData = ({ 
  districtName, 
  months = 12 
}: UseHistoricalDataOptions) => {
  return useQuery<HistoricalDataType>({
    queryKey: ['historical', districtName, months],
    queryFn: () => 
      apiService.get<HistoricalDataType>(`/districts/${districtName}/history`, {
        months,
      }),
    enabled: !!districtName,
    staleTime: 60 * 60 * 1000,
  });
};
