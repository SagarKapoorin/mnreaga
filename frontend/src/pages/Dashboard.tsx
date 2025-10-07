import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDistrictData } from '@hooks/useDistrictData';
import { useHistoricalData } from '@hooks/useHistoricalData';
import { Loading } from '@components/common/Loading';
import { PerformanceCard } from '@components/dashboard/PerformanceCard';
import { TrendChart } from '@components/dashboard/TrendChart';
import { HistoricalData } from '@components/dashboard/HistoricalData';
import { LeaderboardTable } from '@components/dashboard/LeaderboardTable';
import { ComparisonChart } from '@components/dashboard/ComparisonChart';
import { MetricCard } from '@components/dashboard/MetricCard';
import { ArrowLeft, Share2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { districtName } = useParams<{ districtName: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: districtData, isLoading, error } = useDistrictData(districtName || '');
  const { data: historicalData, isLoading: historicalLoading } = useHistoricalData({
    districtName: districtName || '',
    months: 12,
  });

  if (isLoading || historicalLoading) {
    return <Loading />;
  }

  if (error || !districtData) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('dataNotFound') || 'Data Not Found'}
        </h2>
        <p className="text-gray-600 mb-6">
          {t('dataNotFoundDesc') || 'Unable to load data for this district. Please try another district.'}
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">
          <ArrowLeft className="inline mr-2" />
          {t('backToHome') || 'Back to Home'}
        </button>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `MGNREGA - ${districtData.districtName}`,
          text: `Check out MGNREGA performance for ${districtData.districtName}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {districtData.districtName}
            </h1>
            <p className="text-gray-600">{districtData.stateName}</p>
          </div>
        </div>
        <button
          onClick={handleShare}
          className="btn-secondary flex items-center space-x-2"
        >
          <Share2 className="w-4 h-4" />
          <span>{t('share') || 'Share'}</span>
        </button>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <PerformanceCard
          icon="👥"
          title={t('jobCardsIssued') || 'Job Cards Issued'}
          value={districtData.jobCardsIssued}
          subtitle={`${districtData.jobCardsWithEmployment} with employment`}
          colorClass="bg-blue-50 border-blue-500"
          description={t('jobCardsDesc') || 'Number of families registered for MGNREGA work'}
        />

        <PerformanceCard
          icon="📅"
          title={t('personDays') || 'Person Days Generated'}
          value={districtData.personDaysGenerated}
          subtitle={`Avg: ${districtData.averageDaysPerHousehold.toFixed(1)} days/household`}
          colorClass="bg-green-50 border-green-500"
          description={t('personDaysDesc') || 'Total days of employment provided'}
        />

        <PerformanceCard
          icon="💰"
          title={t('totalExpenditure') || 'Total Expenditure'}
          value={`₹${districtData.totalExpenditureCrores} Cr`}
          subtitle={`Wages: ₹${districtData.wageExpenditureCrores} Cr`}
          colorClass="bg-purple-50 border-purple-500"
          description={t('expenditureDesc') || 'Total money spent on MGNREGA in this district'}
        />

        <PerformanceCard
          icon="🏗️"
          title={t('worksCompleted') || 'Works Completed'}
          value={districtData.worksCompleted}
          subtitle={`${districtData.worksInProgress} in progress`}
          colorClass="bg-orange-50 border-orange-500"
          description={t('worksDesc') || 'Projects completed under MGNREGA'}
        />
      </div>

      {/* Social Composition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          icon="👩"
          title={t('womenWorkers') || 'Women Workers'}
          value={districtData.womenWorkers}
          percentage={(districtData.womenWorkers / districtData.employmentProvided * 100).toFixed(1)}
          color="pink"
        />
        <MetricCard
          icon="⚖️"
          title={t('scWorkers') || 'SC Workers'}
          value={districtData.scWorkers}
          percentage={(districtData.scWorkers / districtData.employmentProvided * 100).toFixed(1)}
          color="indigo"
        />
        <MetricCard
          icon="🌳"
          title={t('stWorkers') || 'ST Workers'}
          value={districtData.stWorkers}
          percentage={(districtData.stWorkers / districtData.employmentProvided * 100).toFixed(1)}
          color="teal"
        />
      </div>

      {/* Historical Trend */}
      {historicalData && historicalData.records.length > 0 && (
        <TrendChart data={historicalData.records} />
      )}
      {/* Historical Data Table */}
      {historicalData && historicalData.records.length > 0 && (
        <HistoricalData data={historicalData} />
      )}

      {/* District Leaderboard */}
      <LeaderboardTable />

      {/* Comparison with State/National */}
      <ComparisonChart districtName={districtName || ''} />
    </div>
  );
};

export default Dashboard;
