import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoTooltip } from '@components/tooltip/InfoTooltip';
import { Card } from '@components/common/Card';
import { DistrictSelector } from '@components/district/DistrictSelector';
import { DistrictComparisonChart } from '@components/dashboard/DistrictComparisonChart';
import { useDistrictData } from '@hooks/useDistrictData';
import { formatNumber, formatCurrency } from '@utils/formatters';

const Comparison: React.FC = () => {
  const { t } = useTranslation();
  const [district1, setDistrict1] = useState<string>('');
  const [district2, setDistrict2] = useState<string>('');
  const [district3, setDistrict3] = useState<string>('');

  const { data: data1, isLoading: loading1 } = useDistrictData(district1, !!district1);
  const { data: data2, isLoading: loading2 } = useDistrictData(district2, !!district2);
  const { data: data3, isLoading: loading3 } = useDistrictData(district3, !!district3);

  const districts = [
    { id: district1, data: data1, loading: loading1 },
    { id: district2, data: data2, loading: loading2 },
    { id: district3, data: data3, loading: loading3 },
  ].filter(d => d.id && d.data);

  const calculatePercentageDiff = (value1: number, value2: number) => {
    if (value2 === 0) return 0;
    return ((value1 - value2) / value2) * 100;
  };

  const getBestPerformer = (metric: 'personDays' | 'employment' | 'avgDays' | 'expenditure') => {
    if (districts.length < 2) return null;

    const getValue = (d: typeof districts[0]) => {
      if (!d.data) return 0;
      switch (metric) {
        case 'personDays': return d.data.personDaysGenerated;
        case 'employment': return d.data.employmentProvided;
        case 'avgDays': return d.data.averageDaysPerHousehold;
        case 'expenditure': return d.data.totalExpenditureCrores;
        default: return 0;
      }
    };

    return districts.reduce((best, current) =>
      getValue(current) > getValue(best) ? current : best
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        {t('compareDistricts') || 'Compare Districts'}
        <InfoTooltip
          text={t('comparisonDesc') || 'Select up to 3 districts to compare their MGNREGA performance'}
          className="ml-2"
        />
      </h1>

      <Card className="p-6 mb-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h2 className="text-lg font-semibold mb-2">
              {t('selectFirstDistrict') || 'Select First District'}
            </h2>
            <DistrictSelector
              onSelect={(id) => setDistrict1(id)}
              placeholder={t('searchDistrict')}
            />
            {district1 && data1 && (
              <div className="mt-3 p-3 bg-blue-50 border-2 border-blue-500 rounded-lg">
                <p className="text-sm font-semibold text-blue-900">{data1.districtName}</p>
                <p className="text-xs text-blue-700">{data1.stateName}</p>
              </div>
            )}
          </div>

          <div className={`${!district1 ? 'opacity-50 pointer-events-none' : ''}`}>
            <h2 className="text-lg font-semibold mb-2">
              {t('selectSecondDistrict') || 'Select Second District'}
            </h2>
            <DistrictSelector
              onSelect={(id) => setDistrict2(id)}
              exclude={[district1]}
              placeholder={t('searchDistrict')}
            />
            {district2 && data2 && (
              <div className="mt-3 p-3 bg-green-50 border-2 border-green-500 rounded-lg">
                <p className="text-sm font-semibold text-green-900">{data2.districtName}</p>
                <p className="text-xs text-green-700">{data2.stateName}</p>
              </div>
            )}
          </div>

          <div className={`${!district2 ? 'opacity-50 pointer-events-none' : ''}`}>
            <h2 className="text-lg font-semibold mb-2">
              {t('selectThirdDistrict') || 'Select Third District (Optional)'}
            </h2>
            <DistrictSelector
              onSelect={(id) => setDistrict3(id)}
              exclude={[district1, district2]}
              placeholder={t('searchDistrict')}
            />
            {district3 && data3 && (
              <div className="mt-3 p-3 bg-amber-50 border-2 border-amber-500 rounded-lg">
                <p className="text-sm font-semibold text-amber-900">{data3.districtName}</p>
                <p className="text-xs text-amber-700">{data3.stateName}</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {districts.length >= 2 && (
        <>
          <DistrictComparisonChart districts={districts.map(d => d.id)} />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Employment Generation</h3>
              {districts.map((d, idx) => {
                const best = getBestPerformer('employment');
                const isBest = best?.id === d.id;
                const colors = ['border-blue-500 bg-blue-50', 'border-green-500 bg-green-50', 'border-amber-500 bg-amber-50'];
                return (
                  <div key={d.id} className={`mb-2 p-3 rounded-lg border-2 ${colors[idx]} ${isBest ? 'ring-2 ring-yellow-400' : ''}`}>
                    <p className="text-xs font-medium text-gray-700">{d.data?.districtName}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatNumber(d.data?.employmentProvided || 0)}
                    </p>
                    {isBest && <span className="text-xs text-yellow-700 font-semibold">🏆 Best</span>}
                  </div>
                );
              })}
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Person Days Generated</h3>
              {districts.map((d, idx) => {
                const best = getBestPerformer('personDays');
                const isBest = best?.id === d.id;
                const colors = ['border-blue-500 bg-blue-50', 'border-green-500 bg-green-50', 'border-amber-500 bg-amber-50'];
                return (
                  <div key={d.id} className={`mb-2 p-3 rounded-lg border-2 ${colors[idx]} ${isBest ? 'ring-2 ring-yellow-400' : ''}`}>
                    <p className="text-xs font-medium text-gray-700">{d.data?.districtName}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatNumber(d.data?.personDaysGenerated || 0)}
                    </p>
                    {isBest && <span className="text-xs text-yellow-700 font-semibold">🏆 Best</span>}
                  </div>
                );
              })}
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Avg Days/Household</h3>
              {districts.map((d, idx) => {
                const best = getBestPerformer('avgDays');
                const isBest = best?.id === d.id;
                const colors = ['border-blue-500 bg-blue-50', 'border-green-500 bg-green-50', 'border-amber-500 bg-amber-50'];
                return (
                  <div key={d.id} className={`mb-2 p-3 rounded-lg border-2 ${colors[idx]} ${isBest ? 'ring-2 ring-yellow-400' : ''}`}>
                    <p className="text-xs font-medium text-gray-700">{d.data?.districtName}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {d.data?.averageDaysPerHousehold.toFixed(1) || 0}
                    </p>
                    {isBest && <span className="text-xs text-yellow-700 font-semibold">🏆 Best</span>}
                  </div>
                );
              })}
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Total Expenditure</h3>
              {districts.map((d, idx) => {
                const best = getBestPerformer('expenditure');
                const isBest = best?.id === d.id;
                const colors = ['border-blue-500 bg-blue-50', 'border-green-500 bg-green-50', 'border-amber-500 bg-amber-50'];
                return (
                  <div key={d.id} className={`mb-2 p-3 rounded-lg border-2 ${colors[idx]} ${isBest ? 'ring-2 ring-yellow-400' : ''}`}>
                    <p className="text-xs font-medium text-gray-700">{d.data?.districtName}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(d.data?.totalExpenditureCrores || 0)}
                    </p>
                    {isBest && <span className="text-xs text-yellow-700 font-semibold">🏆 Best</span>}
                  </div>
                );
              })}
            </Card>
          </div>

          {districts.length >= 2 && data1 && data2 && (
            <Card className="p-6 mt-6">
              <h2 className="text-xl font-bold mb-4">Performance Insights</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Employment Rate</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{data1.districtName}:</span>
                      <span className="font-bold">{((data1.employmentProvided / data1.jobCardsIssued) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{data2.districtName}:</span>
                      <span className="font-bold">{((data2.employmentProvided / data2.jobCardsIssued) * 100).toFixed(1)}%</span>
                    </div>
                    {data3 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{data3.districtName}:</span>
                        <span className="font-bold">{((data3.employmentProvided / data3.jobCardsIssued) * 100).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Women Workers Share</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{data1.districtName}:</span>
                      <span className="font-bold">{((data1.womenWorkers / data1.employmentProvided) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{data2.districtName}:</span>
                      <span className="font-bold">{((data2.womenWorkers / data2.employmentProvided) * 100).toFixed(1)}%</span>
                    </div>
                    {data3 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{data3.districtName}:</span>
                        <span className="font-bold">{((data3.womenWorkers / data3.employmentProvided) * 100).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Work Completion Rate</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{data1.districtName}:</span>
                      <span className="font-bold">{((data1.worksCompleted / (data1.worksCompleted + data1.worksInProgress)) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{data2.districtName}:</span>
                      <span className="font-bold">{((data2.worksCompleted / (data2.worksCompleted + data2.worksInProgress)) * 100).toFixed(1)}%</span>
                    </div>
                    {data3 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{data3.districtName}:</span>
                        <span className="font-bold">{((data3.worksCompleted / (data3.worksCompleted + data3.worksInProgress)) * 100).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Wage to Material Ratio</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{data1.districtName}:</span>
                      <span className="font-bold">{(data1.wageExpenditureCrores / data1.materialExpenditureCrores).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{data2.districtName}:</span>
                      <span className="font-bold">{(data2.wageExpenditureCrores / data2.materialExpenditureCrores).toFixed(2)}</span>
                    </div>
                    {data3 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{data3.districtName}:</span>
                        <span className="font-bold">{(data3.wageExpenditureCrores / data3.materialExpenditureCrores).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      {districts.length < 2 && district1 && (
        <Card className="p-6 text-center text-gray-500">
          <p>Select at least one more district to see comparison</p>
        </Card>
      )}
    </div>
  );
};

export default Comparison;
