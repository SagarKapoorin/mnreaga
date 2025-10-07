import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@components/common/Card';
import { ExternalLink } from 'lucide-react';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        {t('aboutTitle') || 'About MGNREGA'}
      </h1>

      <Card className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          {t('whatIsMGNREGA') || 'What is MGNREGA?'}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) is an Indian 
          labour law and social security measure that aims to guarantee the 'right to work'. 
          It aims to enhance livelihood security in rural areas by providing at least 100 days 
          of guaranteed wage employment in a financial year to every household whose adult 
          members volunteer to do unskilled manual work.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Enacted on August 25, 2005, MGNREGA is one of the largest work guarantee programmes 
          in the world, covering over 12 crore beneficiaries across rural India.
        </p>
      </Card>

      <Card className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          {t('aboutDashboard') || 'About This Dashboard'}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          This dashboard makes MGNREGA performance data accessible to everyone, especially 
          citizens in rural India. We've designed it to be:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
          <li>Simple and visual - using icons and colors instead of complex numbers</li>
          <li>Multilingual - available in multiple Indian languages</li>
          <li>Accessible - with audio support for low-literacy users</li>
          <li>Up-to-date - data synced from official government sources</li>
        </ul>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold mb-4">
          {t('dataSource') || 'Data Source'}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          All data is sourced from the official Open Government Data (OGD) Platform India at data.gov.in
        </p>
        <a
          href="https://data.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          Visit data.gov.in
          <ExternalLink className="ml-2 w-4 h-4" />
        </a>
      </Card>
    </div>
  );
};

export default About;
