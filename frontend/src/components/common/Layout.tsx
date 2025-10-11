import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@components/language/LanguageSwitcher';
import { AudioPlayer } from '@components/language/AudioPlayer';
import { NavLink } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="text-4xl animate-pulse">🇮🇳</div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                {t('appTitle')}
              </h1>
              <p className="text-xs md:text-sm text-white/80 font-medium">
                {t('appSubtitle')}
              </p>
            </div>
          </div>
          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? 'text-white underline font-semibold'
                  : 'text-white/80 hover:text-white transition-colors'
              }
            >
              {t('navHome')}
            </NavLink>
            <NavLink
              to="/compare"
              className={({ isActive }) =>
                isActive
                  ? 'text-white underline font-semibold'
                  : 'text-white/80 hover:text-white transition-colors'
              }
            >
              {t('navCompare')}
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? 'text-white underline font-semibold'
                  : 'text-white/80 hover:text-white transition-colors'
              }
            >
              {t('navAbout')}
            </NavLink>
          </nav>
          {/* Controls: Language + Audio */}
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            <AudioPlayer
              text={`${t('appTitle')}. ${t('appSubtitle')}`} 
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-100">{t('aboutMGNREGA')}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {t('footerDescription')}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-100">{t('quickLinks')}</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="https://nrega.nic.in" target="_blank" rel="noopener noreferrer"
                     className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                    <span className="mr-2 group-hover:mr-3 transition-all">→</span>
                    {t('officialMGNREGAWebsite')}
                  </a>
                </li>
                <li>
                  <a href="https://data.gov.in" target="_blank" rel="noopener noreferrer"
                     className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                    <span className="mr-2 group-hover:mr-3 transition-all">→</span>
                    {t('openGovernmentData')}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-100">{t('contact')}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {t('helplineText')}
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-10 pt-8 text-center text-sm text-gray-400">
            <p>{t('footerCopy')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
