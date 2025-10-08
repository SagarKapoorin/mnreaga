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
            The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) is an Indian labour law
            and social security measure that guarantees the ‘right to work’ by providing at least 100 days
            of wage employment in a financial year to every rural household that volunteers for unskilled
            manual work.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Enacted on August 25, 2005, MGNREGA is one of the largest work guarantee programmes in the
            world, covering over 12 crore beneficiaries across rural India.
          </p>
        </Card>

        <Card className="p-8 bg-white">
          <h2 className="text-2xl font-semibold text-primary-700 mb-4">
            {t('aboutDashboard')}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            This dashboard visualizes MGNREGA performance data in a user-friendly way. Features include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Simple and visual representation with icons and color-coding</li>
            <li>Multilingual support for major Indian languages</li>
            <li>Audio narration for low-literacy accessibility</li>
            <li>Data sourced and updated directly from official government portals</li>
          </ul>
        </Card>
      </div>

      <Card className="p-8 bg-white">
        <h2 className="text-2xl font-semibold text-primary-700 mb-4">
          {t('dataSource')}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          All data is fetched from the official Open Government Data (OGD) Platform India (data.gov.in).
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
