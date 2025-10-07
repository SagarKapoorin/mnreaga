import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { STATES } from '@/utils/constants';
import { Search } from 'lucide-react';

interface DistrictSelectorProps {
  onSelect: (districtName: string) => void;
}

export const DistrictSelector: React.FC<DistrictSelectorProps> = ({ onSelect }) => {
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock districts - replace with actual API call
  const districts = [
    'Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Azamgarh',
    'Badaun', 'Bahraich', 'Ballia', 'Balrampur', 'Banda'
  ];

  const filteredDistricts = districts.filter(d =>
    d.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* State Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('selectState') || 'Select State'}
        </label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
        >
          <option value="">{t('chooseState') || 'Choose a state...'}</option>
          {STATES.map((state) => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      {/* District Search */}
      {selectedState && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('selectDistrict') || 'Select District'}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchDistrict') || 'Search district...'}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Districts List */}
          <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredDistricts.map((district) => (
              <button
                key={district}
                onClick={() => onSelect(district)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <span className="text-lg">{district}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
