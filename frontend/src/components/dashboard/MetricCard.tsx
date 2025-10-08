import React from 'react';
import { formatNumber } from '@/utils/formatters';
import { Card } from '@components/common/Card';

interface MetricCardProps {
  icon: string;
  title: string;
  value: number;
  percentage: string;
  color: 'pink' | 'indigo' | 'teal';
}

const colorClasses = {
  pink: 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-500 text-pink-700',
  indigo: 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-500 text-cyan-700',
  teal: 'bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-500 text-teal-700',
};

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  percentage,
  color,
}) => {
  return (
    <Card className={`${colorClasses[color]} border-l-4 group hover:border-l-8 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold mb-2">{title}</p>
          <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">{formatNumber(value)}</p>
          <p className="text-sm mt-2 font-medium">{percentage}% of total</p>
        </div>
        <div className="text-6xl opacity-20 transform group-hover:scale-110 group-hover:opacity-30 transition-all duration-300">{icon}</div>
      </div>
    </Card>
  );
};
