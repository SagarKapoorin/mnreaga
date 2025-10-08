import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDistrictData } from '@hooks/useDistrictData';
import { Card } from '@components/common/Card';
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

interface DistrictComparisonChartProps {
  district1: string;
  district2: string;
}

export const DistrictComparisonChart: React.FC<DistrictComparisonChartProps> = ({
  district1,
  district2,
}) => {
  const { t } = useTranslation();
  const {
    data: data1,
    isLoading: loading1,
  } = useDistrictData(district1);
  const {
    data: data2,
    isLoading: loading2,
  } = useDistrictData(district2);

  if (loading1 || loading2 || !data1 || !data2) {
    return null;
  }

  const chartData = [
    {
      name: data1.districtName,
      personDays: data1.personDaysGenerated,
      jobCards: data1.jobCardsIssued,
    },
    {
      name: data2.districtName,
      personDays: data2.personDaysGenerated,
      jobCards: data2.jobCardsIssued,
    },
  ];

  return (
    <Card className="mt-8">
      <h2 className="text-xl font-semibold mb-4">
        {t('comparisonBetween') || 'Comparison Between Districts'}
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
            name={t('personDays') || 'Person Days'}
            radius={[6, 6, 0, 0]}
            barSize={40}
          />
          <Bar
            dataKey="jobCards"
            fill="#22c55e"
            name={t('jobCards') || 'Job Cards'}
            radius={[6, 6, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};