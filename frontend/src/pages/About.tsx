import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@components/common/Card';
import { ExternalLink } from 'lucide-react';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 space-y-12">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
        {t('aboutTitle')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 bg-white">
          <h2 className="text-2xl font-semibold text-primary-700 mb-4">
            {t('whatIsMGNREGA')}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t('mgnregaDefinition')}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {t('mgnregaBackground')}
          </p>
        </Card>

        <Card className="p-8 bg-white">
          <h2 className="text-2xl font-semibold text-primary-700 mb-4">
            {t('aboutDashboard')}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t('dashboardFeaturesIntro')}
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>{t('featureVisual')}</li>
            <li>{t('featureMultilingual')}</li>
            <li>{t('featureAudio')}</li>
            <li>{t('featureDataSource')}</li>
          </ul>
        </Card>
      </div>

      <Card className="p-8 bg-white">
        <h2 className="text-2xl font-semibold text-primary-700 mb-4">
          {t('dataSource')}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          {t('dataFetchedFromOGD')}
        </p>
        <a
          href="https://data.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          {t('visitDataGov')}
          <ExternalLink className="ml-2 w-4 h-4" />
        </a>
      </Card>
    </div>
  );
};

export default About;
