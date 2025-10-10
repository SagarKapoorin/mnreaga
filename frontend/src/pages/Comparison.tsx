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

  const { data: data1, isLoading: loading1 } = useDistrictData(district1, !!district1);
  const { data: data2, isLoading: loading2 } = useDistrictData(district2, !!district2);

  const districts = [
    { id: district1, data: data1, loading: loading1 },
    { id: district2, data: data2, loading: loading2 },
  ].filter(d => d.id && d.data);


  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        {t('compareDistricts') || 'Compare Districts'}
        <InfoTooltip
          text={t('comparisonDesc') || 'Select 2 districts to compare their MGNREGA performance'}
          className="ml-2"
        />
      </h1>

      <Card className="p-6 mb-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold mb-3">
              {t('selectFirstDistrict') || 'District 1'}
            </h2>
            <DistrictSelector
              onSelect={(id) => setDistrict1(id)}
              placeholder={t('searchDistrict')}
            />
            {district1 && data1 && (
              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                <p className="text-base font-bold text-blue-900">{data1.districtName}</p>
                <p className="text-sm text-blue-600">{data1.stateName}</p>
              </div>
            )}
          </div>

          <div className={`${!district1 ? 'opacity-50 pointer-events-none' : ''}`}>
            <h2 className="text-lg font-semibold mb-3">
              {t('selectSecondDistrict') || 'District 2'}
            </h2>
            <DistrictSelector
              onSelect={(id) => setDistrict2(id)}
              exclude={[district1]}
              placeholder={t('searchDistrict')}
            />
            {district2 && data2 && (
              <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-600 rounded">
                <p className="text-base font-bold text-green-900">{data2.districtName}</p>
                <p className="text-sm text-green-600">{data2.stateName}</p>
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
                const colors = ['bg-blue-50 text-blue-900', 'bg-green-50 text-green-900'];
                return (
                  <div key={d.id} className={`mb-2 p-3 rounded ${colors[idx]}`}>
                    <p className="text-xs font-medium opacity-80">{d.data?.districtName}</p>
                    <p className="text-xl font-bold">
                      {formatNumber(d.data?.employmentProvided || 0)}
                    </p>
                  </div>
                );
              })}
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Person Days Generated</h3>
              {districts.map((d, idx) => {
                const colors = ['bg-blue-50 text-blue-900', 'bg-green-50 text-green-900'];
                return (
                  <div key={d.id} className={`mb-2 p-3 rounded ${colors[idx]}`}>
                    <p className="text-xs font-medium opacity-80">{d.data?.districtName}</p>
                    <p className="text-xl font-bold">
                      {formatNumber(d.data?.personDaysGenerated || 0)}
                    </p>
                  </div>
                );
              })}
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Avg Days/Household</h3>
              {districts.map((d, idx) => {
                const colors = ['bg-blue-50 text-blue-900', 'bg-green-50 text-green-900'];
                return (
                  <div key={d.id} className={`mb-2 p-3 rounded ${colors[idx]}`}>
                    <p className="text-xs font-medium opacity-80">{d.data?.districtName}</p>
                    <p className="text-xl font-bold">
                      {d.data?.averageDaysPerHousehold.toFixed(1) || 0}
                    </p>
                  </div>
                );
              })}
            </Card>

            <Card className="p-5 min-w-[286px]">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Total Expenditure</h3>
              {districts.map((d, idx) => {
                const colors = ['bg-blue-50 text-blue-900', 'bg-green-50 text-green-900'];
                return (
                  <div key={d.id} className={`mb-2 p-3 rounded ${colors[idx]}`}>
                    <p className="text-xs font-medium opacity-80">{d.data?.districtName}</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(d.data?.totalExpenditureCrores || 0)}
                    </p>
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
