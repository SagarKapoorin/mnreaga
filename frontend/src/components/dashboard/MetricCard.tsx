import React from 'react';
import { formatNumber, formatPercentage } from '@/utils/formatters';
import { Card } from '@components/common/Card';

interface MetricCardProps {
  icon: string;
  title: string;
  value: number;
  percentage: string;
  color: 'pink' | 'indigo' | 'teal';
}

const colorClasses = {
  pink: 'bg-pink-50 border-pink-500 text-pink-700',
  indigo: 'bg-indigo-50 border-indigo-500 text-indigo-700',
  teal: 'bg-teal-50 border-teal-500 text-teal-700',
};

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  percentage,
  color,
}) => {
  return (
    <Card className={`${colorClasses[color]} border-l-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold">{formatNumber(value)}</p>
          <p className="text-sm mt-1">{percentage}% of total</p>
        </div>
        <div className="text-5xl opacity-20">{icon}</div>
      </div>
    </Card>
  );
};
