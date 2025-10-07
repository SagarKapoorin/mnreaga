import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import apiService from '@services/api';
import type { District } from '@typings/district.types';
import { Search } from 'lucide-react';

interface DistrictSelectorProps {
  onSelect: (districtId: string) => void;
  exclude?: string[];
  placeholder?: string;
}

export const DistrictSelector: React.FC<DistrictSelectorProps> = ({
  onSelect,
  exclude = [],
  placeholder,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: districts = [], isLoading } = useQuery<District[]>({
    queryKey: ['districts'],
    queryFn: () => apiService.get<District[]>('/districts'),
  });

  if (isLoading) {
    return <div className="text-center py-4">{t('loading') || 'Loading...'}</div>;
  }

  const filtered = districts
    .filter((d) => !exclude.includes(d.id))
    .filter((d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={
            placeholder || t('searchDistrict') || 'Search district...'
          }
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
        />
      </div>
      <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
        {filtered.map((d) => (
          <button
            key={d.id}
            onClick={() => onSelect(d.id)}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
          >
            <span className="text-lg">{d.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
