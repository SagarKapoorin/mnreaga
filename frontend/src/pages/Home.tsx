import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DistrictSelector } from '@components/district/DistrictSelector';
import { AutoDetectLocation } from '@components/district/AutoDetectLocation';
import { Card } from '@components/common/Card';
import { MapPin, TrendingUp, Users, IndianRupee } from 'lucide-react';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleDistrictSelect = (districtName: string) => {
    navigate(`/district/${encodeURIComponent(districtName)}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🇮🇳</div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {t('heroTitle') || 'MGNREGA Dashboard'}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          {t('heroDescription') || 
            'Track and understand MGNREGA performance in your district. Simple, visual, and accessible for everyone.'}
        </p>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-primary-600">12.15 Cr</div>
            <div className="text-sm text-gray-600">{t('beneficiaries') || 'Beneficiaries'}</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-2xl font-bold text-success-600">100</div>
            <div className="text-sm text-gray-600">{t('guaranteedDays') || 'Days Guaranteed'}</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl mb-2">🏗️</div>
            <div className="text-2xl font-bold text-warning-600">700+</div>
            <div className="text-sm text-gray-600">{t('districts') || 'Districts'}</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-purple-600">₹1L Cr+</div>
            <div className="text-sm text-gray-600">{t('budget') || 'Annual Budget'}</div>
          </Card>
        </div>
      </div>

      {/* District Selection */}
      <Card className="max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {t('selectYourDistrict') || 'Select Your District'}
        </h2>

        {/* Auto-detect Location */}
        <AutoDetectLocation onDistrictDetected={handleDistrictSelect} />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              {t('or') || 'OR'}
            </span>
          </div>
        </div>

        {/* Manual Selection */}
        <DistrictSelector onSelect={handleDistrictSelect} />
      </Card>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary-100 rounded-full">
              <TrendingUp className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {t('visualTrends') || 'Visual Trends'}
          </h3>
          <p className="text-gray-600 text-sm">
            {t('visualTrendsDesc') || 'Easy-to-understand charts and graphs showing district performance over time'}
          </p>
        </Card>

        <Card className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-success-100 rounded-full">
              <Users className="w-8 h-8 text-success-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {t('compareDistricts') || 'Compare Districts'}
          </h3>
          <p className="text-gray-600 text-sm">
            {t('compareDistrictsDesc') || 'See how your district performs compared to state and national averages'}
          </p>
        </Card>

        <Card className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-warning-100 rounded-full">
              <MapPin className="w-8 h-8 text-warning-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {t('multiLanguage') || 'Multiple Languages'}
          </h3>
          <p className="text-gray-600 text-sm">
            {t('multiLanguageDesc') || 'Available in Hindi, English, and major regional languages'}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Home;
