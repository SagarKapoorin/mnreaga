import React from 'react';
import { useTranslation } from 'react-i18next';
import type { HistoricalDataType } from '@typings/performance.types';
import { Card } from '@components/common/Card';

interface HistoricalDataProps {
  data: HistoricalDataType;
}

export const HistoricalData: React.FC<HistoricalDataProps> = ({ data }) => {
  const { t } = useTranslation();
  if (!data || !data.records || data.records.length === 0) {
    return null;
  }
  return (
    <Card className="w-full mt-8">
      <h2 className="text-xl font-semibold mb-4">
        {t('historicalData') || 'Historical Data'}
      </h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-primary-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-primary-700">{t('month') || 'Month'}</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-primary-700">{t('jobCards') || 'Job Cards'}</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-primary-700">{t('personDays') || 'Person Days'}</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-primary-700">{t('performanceScore') || 'Performance Score'}</th>
            </tr>
          </thead>
          <tbody>
            {data.records.map((rec, idx) => (
              <tr
                key={`${rec.month}-${rec.year}`}
                className={`${idx % 2 === 0 ? 'bg-white' : 'bg-primary-50'} hover:bg-primary-100 transition-colors`}
              >
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{`${rec.month} ${rec.year}`}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 text-right">{rec.jobCardsIssued.toLocaleString()}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 text-right">{rec.personDaysGenerated.toLocaleString()}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 text-right">{rec.performanceScore ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

