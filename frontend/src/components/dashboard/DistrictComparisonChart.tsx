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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
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

  const colors = ['#3b82f6', '#22c55e', '#f59e0b'];
  const colorsBg = ['rgba(59, 130, 246, 0.2)', 'rgba(34, 197, 94, 0.2)', 'rgba(245, 158, 11, 0.2)'];

  const barChartData = allData.map((data, idx) => ({
    name: data!.districtName,
    personDays: data!.personDaysGenerated,
    employment: data!.employmentProvided,
    expenditure: data!.totalExpenditureCrores,
    avgDays: data!.averageDaysPerHousehold,
    color: colors[idx],
  }));

  const radarData = [
    {
      metric: 'Person Days',
      ...allData.reduce((acc, data, idx) => {
        acc[data!.districtName] = (data!.personDaysGenerated / Math.max(...allData.map(d => d!.personDaysGenerated))) * 100;
        return acc;
      }, {} as Record<string, number>),
    },
    {
      metric: 'Employment',
      ...allData.reduce((acc, data, idx) => {
        acc[data!.districtName] = (data!.employmentProvided / Math.max(...allData.map(d => d!.employmentProvided))) * 100;
        return acc;
      }, {} as Record<string, number>),
    },
    {
      metric: 'Avg Days/HH',
      ...allData.reduce((acc, data, idx) => {
        acc[data!.districtName] = (data!.averageDaysPerHousehold / Math.max(...allData.map(d => d!.averageDaysPerHousehold))) * 100;
        return acc;
      }, {} as Record<string, number>),
    },
    {
      metric: 'Works Done',
      ...allData.reduce((acc, data, idx) => {
        acc[data!.districtName] = (data!.worksCompleted / Math.max(...allData.map(d => d!.worksCompleted))) * 100;
        return acc;
      }, {} as Record<string, number>),
    },
    {
      metric: 'Women %',
      ...allData.reduce((acc, data, idx) => {
        const womenPct = (data!.womenWorkers / data!.employmentProvided) * 100;
        acc[data!.districtName] = (womenPct / Math.max(...allData.map(d => (d!.womenWorkers / d!.employmentProvided) * 100))) * 100;
        return acc;
      }, {} as Record<string, number>),
    },
  ];

  const socialCompositionData = allData.map((data) => ({
    name: data!.districtName,
    SC: data!.scWorkers,
    ST: data!.stWorkers,
    Women: data!.womenWorkers,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{payload[0].payload.name}</p>
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
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">
          {t('overallComparison') || 'Overall Performance Comparison'}
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={barChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#374151', fontSize: 12, fontWeight: 600 }}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: 20 }}
              iconType="circle"
            />
            <Bar
              dataKey="personDays"
              name={t('personDays') || 'Person Days'}
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            >
              {barChartData.map((entry, index) => (
                <Bar key={`cell-${index}`} dataKey="personDays" fill={colors[index]} />
              ))}
            </Bar>
            <Bar
              dataKey="employment"
              name={t('employment') || 'Employment Provided'}
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            >
              {barChartData.map((entry, index) => (
                <Bar key={`cell-${index}`} dataKey="employment" fill={colors[index]} opacity={0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {t('performanceRadar') || 'Performance Radar'}
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
              {allData.map((data, idx) => (
                <Radar
                  key={idx}
                  name={data!.districtName}
                  dataKey={data!.districtName}
                  stroke={colors[idx]}
                  fill={colors[idx]}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              ))}
              <Legend iconType="circle" />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {t('socialComposition') || 'Social Composition'}
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={socialCompositionData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#374151', fontSize: 11, fontWeight: 600 }}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Bar dataKey="SC" fill="#8b5cf6" name="SC Workers" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ST" fill="#ec4899" name="ST Workers" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Women" fill="#f97316" name="Women Workers" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};