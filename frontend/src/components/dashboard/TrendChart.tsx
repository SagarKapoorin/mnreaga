import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AreaChart,
  Area,
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
    <Card className="w-full">
      <h2 className="text-xl font-semibold mb-6">{t('performanceTrend')}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="gradientPersonDays" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientJobCards" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', borderRadius: 8, borderColor: '#ddd' }}
            cursor={{ fill: 'rgba(200,200,200,0.1)' }}
          />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 10 }} />
          <Area
            type="monotone"
            dataKey="personDays"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#gradientPersonDays)"
            activeDot={{ r: 6 }}
            name={t('personDays')}
          />
          <Area
            type="monotone"
            dataKey="jobCards"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#gradientJobCards)"
            activeDot={{ r: 6 }}
            name={t('jobCards')}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};
