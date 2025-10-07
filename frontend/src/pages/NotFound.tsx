import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('pageNotFound') || 'Page not found'}
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">
          <Home className="inline mr-2" />
          {t('backToHome') || 'Back to Home'}
        </button>
      </div>
    </div>
  );
};

export default NotFound;
