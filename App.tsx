import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HotelAnalysis from './pages/HotelAnalysis';
import ReportView from './pages/ReportView';
import CRMLeads from './pages/CRMLeads';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ErrorBoundary from './components/ErrorBoundary';
import { AppProvider } from './context/AppContext';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analyze" element={<HotelAnalysis />} />
              <Route path="/report" element={<ReportView />} />
              <Route path="/leads" element={<CRMLeads />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;