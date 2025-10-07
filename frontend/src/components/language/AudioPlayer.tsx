import React from 'react';
import { useTextToSpeech } from '@hooks/useTextToSpeech';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  /** Text to speak */
  text: string;
  /** BCP-47 language code, e.g. 'hi-IN' */
  lang?: string;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, lang, className }) => {
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const handleToggle = () => {
    if (isSpeaking) stop();
    else speak(text, lang);
  };
  return (
    <button
      onClick={handleToggle}
      aria-label={isSpeaking ? 'Stop narration' : 'Play narration'}
      className={className}
    >
      {isSpeaking ? (
        <VolumeX className="w-5 h-5 text-gray-600" />
      ) : (
        <Volume2 className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
};