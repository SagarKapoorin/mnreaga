import React from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, children, className }) => (
  <div className={`relative inline-block z-[9999] ${className || ''}`}>
    <div className="group">
      {children || <Info className="w-4 h-4 text-gray-400" aria-hidden="true" />}      
      <div
        role="tooltip"
        className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-max max-w-xs p-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[10000]"
      >
        {text}
      </div>
    </div>
  </div>
);