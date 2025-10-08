import React from 'react';
import { useTranslation } from 'react-i18next';

export const Loading: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 animate-fade-in">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-blue-400 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
      </div>
      <p className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent animate-pulse">{t('loading')}</p>
    </div>
  );
};
