import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import type { MonthlyPerformance } from '@typings/performance.types';
import { Card } from '@components/common/Card';
import apiService from '@services/api';

export const LeaderboardTable: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery<MonthlyPerformance[]>({
    queryKey: ['leaderboard'],
    queryFn: () => apiService.get<MonthlyPerformance[]>('/districts/current'),
  });

  if (isLoading || !data) {
    return null;
  }

  const sorted = [...data].sort((a, b) => {
    const sa = a.performanceScore ?? 0;
    const sb = b.performanceScore ?? 0;
    return sb - sa;
  });

  return (
    <Card className="col-span-full mt-8">
      <h2 className="text-xl font-semibold mb-4">
        {t('leaderboard') || 'District Leaderboard'}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">#</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">{t('district') || 'District'}</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">{t('performanceScore') || 'Score'}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sorted.map((item, index) => (
              <tr key={item.districtName}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{index + 1}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{item.districtName}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 text-right">{item.performanceScore ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

