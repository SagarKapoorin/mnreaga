import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@components/common/Card';
import { DistrictSelector } from '@components/district/DistrictSelector';
import { ComparisonChart } from '@components/dashboard/ComparisonChart';

const Comparison: React.FC = () => {
  const { t } = useTranslation();
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  const handleAddDistrict = (districtName: string) => {
    if (!selectedDistricts.includes(districtName) && selectedDistricts.length < 3) {
      setSelectedDistricts([...selectedDistricts, districtName]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t('compareDistricts') || 'Compare Districts'}</h1>
      
      <Card>
        <p className="text-gray-600 mb-4">
          {t('comparisonDesc') || 'Select up to 3 districts to compare their MGNREGA performance'}
        </p>
        <DistrictSelector onSelect={handleAddDistrict} />
      </Card>

      {/* Show comparison charts here */}
      {selectedDistricts.length === 0 && (
        <p className="text-gray-500">
          {t('selectDistrictsToCompare') || 'Select districts to compare'}
        </p>
      )}
      {selectedDistricts.map((district) => (
        <ComparisonChart key={district} districtName={district} />
      ))}
    </div>
  );
};

export default Comparison;
