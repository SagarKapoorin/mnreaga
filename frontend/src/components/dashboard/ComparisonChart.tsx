import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@components/common/Card';
import apiService from '@services/api';
import type { ComparisonData } from '@typings/performance.types';

interface ComparisonChartProps {
  districtName: string;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ districtName }) => {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery<ComparisonData>({
    queryKey: ['comparison', districtName],
    queryFn: () => apiService.get<ComparisonData>(`/districts/${districtName}/compare`),
  });

  if (isLoading || !data) {
    return null;
  }

  const chartData = [
    {
      name: t('district') || 'District',
      personDays: data.district.personDaysGenerated,
      jobCards: data.district.jobCardsIssued,
    },
    {
      name: t('stateAvg') || 'State Avg',
      personDays: data.stateAverage.personDaysGenerated,
      jobCards: data.stateAverage.jobCardsIssued,
    },
    {
      name: t('nationalAvg') || 'National Avg',
      personDays: data.nationalAverage.personDaysGenerated,
      jobCards: data.nationalAverage.jobCardsIssued,
    },
  ];

  return (
    <Card className="mt-8">
      <h2 className="text-xl font-semibold mb-6">
        {t('comparison') || 'Comparison with Averages'}
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', borderRadius: 8, borderColor: '#ddd' }}
            cursor={{ fill: 'rgba(200,200,200,0.1)' }}
          />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 10 }} />
          <Bar
            dataKey="personDays"
            fill="#3b82f6"
            name={t('personDays')}
            radius={[6, 6, 0, 0]}
            barSize={40}
          />
          <Bar
            dataKey="jobCards"
            fill="#22c55e"
            name={t('jobCards')}
            radius={[6, 6, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
