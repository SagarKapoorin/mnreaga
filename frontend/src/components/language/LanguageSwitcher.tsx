import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_OPTIONS } from '@/utils/constants';
import { Globe, X } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('selectedLanguage', langCode);
    setIsOpen(false);
  };

  const currentLanguage = LANGUAGE_OPTIONS.find(
    lang => lang.code === i18n.language
  ) || LANGUAGE_OPTIONS[0];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentLanguage.nativeName}
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md md:mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Select Language / भाषा चुनें
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-2">
              {LANGUAGE_OPTIONS.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full text-left px-4 py-4 rounded-lg mb-2 transition-colors ${
                    i18n.language === language.code
                      ? 'bg-primary-100 border-2 border-primary-500'
                      : 'bg-white hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl mb-1">{language.nativeName}</div>
                      <div className="text-sm text-gray-600">{language.name}</div>
                    </div>
                    {i18n.language === language.code && (
                      <div className="text-primary-600 text-2xl">✓</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
