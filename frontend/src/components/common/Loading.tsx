import React from 'react';
import { useTranslation } from 'react-i18next';

export const Loading: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-lg text-gray-600">{t('loading')}</p>
    </div>
  );
};
