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
import { formatNumber } from '@utils/formatters';

interface DistrictComparisonChartProps {
  districts: string[];
}

export const DistrictComparisonChart: React.FC<DistrictComparisonChartProps> = ({
  districts,
}) => {
  const { t } = useTranslation();

  const districtData = districts.map(districtId => {
    const { data, isLoading } = useDistrictData(districtId);
    return { data, isLoading };
  });

  const allLoading = districtData.some(d => d.isLoading);
  const allData = districtData.map(d => d.data).filter(Boolean);

  if (allLoading || allData.length === 0) {
    return null;
  }

  const colors = ['#3b82f6', '#22c55e'];

  const barChartData = [
    {
      metric: 'Employment',
      [allData[0]!.districtName]: allData[0]!.employmentProvided,
      [allData[1]!.districtName]: allData[1]!.employmentProvided,
    },
    {
      metric: 'Person Days',
      [allData[0]!.districtName]: allData[0]!.personDaysGenerated,
      [allData[1]!.districtName]: allData[1]!.personDaysGenerated,
    },
  ];


  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{payload[0].payload.metric}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">
        {t('overallComparison') || 'Performance Comparison'}
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={barChartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="metric"
            tick={{ fill: '#374151', fontSize: 12 }}
          />
          <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: 10 }}
          />
          <Bar
            dataKey={allData[0]!.districtName}
            fill={colors[0]}
            radius={[6, 6, 0, 0]}
            maxBarSize={80}
          />
          <Bar
            dataKey={allData[1]!.districtName}
            fill={colors[1]}
            radius={[6, 6, 0, 0]}
            maxBarSize={80}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};