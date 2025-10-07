import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@components/common/Layout';
import { Loading } from '@components/common/Loading';

const Home = React.lazy(() => import('@/pages/Home'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Comparison = React.lazy(() => import('@/pages/Comparison'));
const About = React.lazy(() => import('@/pages/About'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

const App: React.FC = () => {
  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/district/:districtName" element={<Dashboard />} />
          <Route path="/compare" element={<Comparison />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
