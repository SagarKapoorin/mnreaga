import { useQuery } from '@tanstack/react-query';
import apiService from '@services/api';
import type { MonthlyPerformance } from '@typings/performance.types';

export const useDistrictData = (districtName: string, enabled = true) => {
  return useQuery<MonthlyPerformance>({
    queryKey: ['district', districtName],
    queryFn: () => apiService.get<MonthlyPerformance>(`/districts/${districtName}`),
    enabled: enabled && !!districtName,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
