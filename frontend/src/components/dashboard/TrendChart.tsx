import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@components/common/Card';
import type { MonthlyPerformance } from '@typings/performance.types';

interface TrendChartProps {
  data: MonthlyPerformance[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const { t } = useTranslation();

  const chartData = data.map((item) => ({
    month: `${item.month.substring(0, 3)} ${item.year}`,
    personDays: item.personDaysGenerated,
    jobCards: item.jobCardsIssued,
  }));

  return (
    <Card className="col-span-full">
      <h2 className="text-xl font-semibold mb-6">{t('performanceTrend')}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="personDays"
            stroke="#3b82f6"
            strokeWidth={3}
            name={t('personDays')}
          />
          <Line
            type="monotone"
            dataKey="jobCards"
            stroke="#22c55e"
            strokeWidth={3}
            name={t('jobCards')}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
