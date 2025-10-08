import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_OPTIONS } from '@/utils/constants';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  const currentLanguage = LANGUAGE_OPTIONS.find(
    lang => lang.code === i18n.language
  ) || LANGUAGE_OPTIONS[0];

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentLanguage.nativeName}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">
              Select Language / भाषा चुनें
            </h2>
          </div>

          <div className="py-1">
            {LANGUAGE_OPTIONS.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                  i18n.language === language.code
                    ? 'bg-primary-100 text-primary-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="font-medium">{language.nativeName}</div>
                  <div className="text-gray-500 text-xs">{language.name}</div>
                </div>
                {i18n.language === language.code && (
                  <div className="text-primary-600">✓</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
