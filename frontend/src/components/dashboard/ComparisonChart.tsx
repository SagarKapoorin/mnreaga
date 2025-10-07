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
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="personDays" fill="#3b82f6" name={t('personDays')} />
          <Bar dataKey="jobCards" fill="#22c55e" name={t('jobCards')} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
