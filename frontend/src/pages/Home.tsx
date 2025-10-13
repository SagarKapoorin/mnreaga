import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DistrictSelector } from '@components/district/DistrictSelector';
import { AutoDetectLocation } from '@components/district/AutoDetectLocation';
import { Card } from '@components/common/Card';
import { MapPin, TrendingUp, Users } from 'lucide-react';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleDistrictSelect = (districtName: string) => {
    navigate(`/district/${encodeURIComponent(districtName)}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16 animate-fade-in">
        <div className="text-7xl mb-6 animate-bounce-slow inline-block">🇮🇳</div>
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 via-blue-600 to-primary-700 bg-clip-text text-transparent mb-6 leading-tight">
          {t('heroTitle') || 'MGNREGA Dashboard'}
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-10 leading-relaxed font-medium">
          {t('heroDescription') ||
            'Track and understand MGNREGA performance in your district. Simple, visual, and accessible for everyone.'}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200 hover:from-primary-100 hover:to-blue-100">
            <div className="text-4xl mb-3 animate-pulse">👥</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">12.15 Cr</div>
            <div className="text-sm text-gray-700 font-medium mt-2">{t('beneficiaries') || 'Beneficiaries'}</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-success-50 to-emerald-50 border-success-200 hover:from-success-100 hover:to-emerald-100">
            <div className="text-4xl mb-3 animate-pulse">📅</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-success-600 to-emerald-600 bg-clip-text text-transparent">100</div>
            <div className="text-sm text-gray-700 font-medium mt-2">{t('guaranteedDays') || 'Days Guaranteed'}</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-warning-50 to-amber-50 border-warning-200 hover:from-warning-100 hover:to-amber-100">
            <div className="text-4xl mb-3 animate-pulse">🏗️</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-warning-600 to-amber-600 bg-clip-text text-transparent">700+</div>
            <div className="text-sm text-gray-700 font-medium mt-2">{t('districts') || 'Districts'}</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:from-orange-100 hover:to-red-100">
            <div className="text-4xl mb-3 animate-pulse">💰</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">₹1L Cr+</div>
            <div className="text-sm text-gray-700 font-medium mt-2">{t('budget') || 'Annual Budget'}</div>
          </Card>
        </div>
      </div>

      {/* District Selection */}
      <Card className="max-w-2xl mx-auto mb-12 bg-gradient-to-br from-white to-blue-50/50 shadow-2xl">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <Card className="text-center group hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-primary-100 to-blue-100 rounded-2xl group-hover:shadow-lg transition-shadow duration-300">
              <TrendingUp className="w-10 h-10 text-primary-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-800">
            {t('visualTrends') || 'Visual Trends'}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {t('visualTrendsDesc') || 'Easy-to-understand charts and graphs showing district performance over time'}
          </p>
        </Card>

        <Card className="text-center group hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-success-100 to-emerald-100 rounded-2xl group-hover:shadow-lg transition-shadow duration-300">
              <Users className="w-10 h-10 text-success-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-800">
            {t('compareDistricts') || 'Compare Districts'}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {t('compareDistrictsDesc') || 'See how your district performs compared to state and national averages'}
          </p>
        </Card>

        <Card className="text-center group hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-warning-100 to-amber-100 rounded-2xl group-hover:shadow-lg transition-shadow duration-300">
              <MapPin className="w-10 h-10 text-warning-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-800">
            {t('multiLanguage') || 'Multiple Languages'}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {t('multiLanguageDesc') || 'Available in Hindi, English, and major regional languages'}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Home;
