import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@components/language/LanguageSwitcher';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🇮🇳</div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {t('appTitle')}
              </h1>
              <p className="text-xs md:text-sm text-gray-600">
                {t('appSubtitle')}
              </p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">{t('aboutMGNREGA')}</h3>
              <p className="text-sm text-gray-300">
                {t('footerDescription')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">{t('quickLinks')}</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://nrega.nic.in" target="_blank" rel="noopener noreferrer">
                    Official MGNREGA Website
                  </a>
                </li>
                <li>
                  <a href="https://data.gov.in" target="_blank" rel="noopener noreferrer">
                    Open Government Data
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">{t('contact')}</h3>
              <p className="text-sm text-gray-300">
                {t('helplineText')}
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            © 2025 MGNREGA Dashboard. Data sourced from data.gov.in
          </div>
        </div>
      </footer>
    </div>
  );
};
