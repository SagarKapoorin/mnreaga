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
    <Card className={`min-w-0 p-8 ${colorClass} border-l-4 relative overflow-visible group hover:border-l-8 transition-all duration-300`}>
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 opacity-5 text-9xl transform group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
          <button
            onClick={handleSpeak}
            className="p-2 rounded-xl hover:bg-white/50 transition-all duration-200 hover:scale-110"
            aria-label="Listen"
            disabled={isSpeaking}
          >
            <Volume2
              className={`w-5 h-5 ${isSpeaking ? 'animate-pulse text-primary-600' : 'text-gray-600'}`}
            />
          </button>
        </div>

        <div className="flex flex-wrap items-center mb-4">
          <h3 className="metric-label whitespace-normal break-words flex-1 min-w-0">{title}</h3>
          {description && (
            <InfoTooltip text={description} className="ml-2 flex-shrink-0 mt-1" />
          )}
        </div>
        
        <p className="metric-large mb-3">
          {typeof value === 'number' ? formatNumber(value) : value}
        </p>

        {subtitle && (
          <p className="text-sm text-gray-600 font-medium mb-4 whitespace-normal break-words">{subtitle}</p>
        )}

      </div>
    </Card>
  );
};
