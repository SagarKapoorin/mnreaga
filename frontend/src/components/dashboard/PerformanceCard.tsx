import React from 'react';
import { Card } from '@components/common/Card';
import { useTextToSpeech } from '@hooks/useTextToSpeech';
import { Volume2 } from 'lucide-react';
import { formatNumber } from '@utils/formatters';
import { InfoTooltip } from '@components/tooltip/InfoTooltip';

interface PerformanceCardProps {
  icon: string;
  title: string;
  value: number | string;
  subtitle?: string;
  colorClass: string;
  description?: string;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  colorClass,
  description,
}) => {
  const { speak, isSpeaking } = useTextToSpeech();

  const handleSpeak = () => {
    const text = `${title}: ${value}${subtitle ? `, ${subtitle}` : ''}`;
    speak(text);
  };

  return (
    <Card className={`${colorClass} border-l-4 relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 opacity-5 text-8xl">
        {icon}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="text-5xl">{icon}</div>
          <button
            onClick={handleSpeak}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Listen"
            disabled={isSpeaking}
          >
            <Volume2 
              className={`w-5 h-5 ${isSpeaking ? 'animate-pulse text-primary-600' : 'text-gray-600'}`}
            />
          </button>
        </div>

        <div className="flex items-center mb-2">
          <h3 className="metric-label">{title}</h3>
          {description && (
            <InfoTooltip text={description} className="ml-2" />
          )}
        </div>
        
        <p className="metric-large mb-1">
          {typeof value === 'number' ? formatNumber(value) : value}
        </p>

        {subtitle && (
          <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
        )}

      </div>
    </Card>
  );
};
