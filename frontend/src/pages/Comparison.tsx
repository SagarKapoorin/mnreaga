import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoTooltip } from '@components/tooltip/InfoTooltip';
import { Card } from '@components/common/Card';
import { DistrictSelector } from '@components/district/DistrictSelector';
import { DistrictComparisonChart } from '@components/dashboard/DistrictComparisonChart';

const Comparison: React.FC = () => {
  const { t } = useTranslation();
  const [district1, setDistrict1] = useState<string>('');
  const [district2, setDistrict2] = useState<string>('');

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        {t('compareDistricts') || 'Compare Districts'}
        <InfoTooltip
          text={t('comparisonDesc') || 'Select up to 3 districts to compare their MGNREGA performance'}
          className="ml-2"
        />
      </h1>

      <Card className="p-6 mb-6 grid gap-6 md:grid-cols-2">
        {/* First District Selector */}
        <div>
          <h2 className="text-lg font-semibold mb-2">
            {t('selectFirstDistrict') || 'Select First District'}
          </h2>
          <DistrictSelector
            onSelect={(id) => setDistrict1(id)}
            placeholder={t('searchDistrict')}
          />
        </div>

        {/* Second District Selector */}
        <div className={`${!district1 ? 'opacity-50 pointer-events-none' : ''}`}> 
          <h2 className="text-lg font-semibold mb-2">
            {t('selectSecondDistrict') || 'Select Second District'}
          </h2>
          <DistrictSelector
            onSelect={(id) => setDistrict2(id)}
            exclude={[district1]}
            placeholder={t('searchDistrict')}
          />
        </div>
      </Card>

      {district1 && district2 && (
        <DistrictComparisonChart
          district1={district1}
          district2={district2}
        />
      )}
    </div>
  );
};

export default Comparison;
