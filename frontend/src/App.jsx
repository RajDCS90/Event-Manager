// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppProvider';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/common/ProtectedRoute';
import { GrievanceProvider } from './context/GrievanceContext';
import { EventProvider } from './context/EventContext';

function App() {
  return (
      <AppProvider>
      <GrievanceProvider>
        <EventProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
        </EventProvider>
        </GrievanceProvider>
      </AppProvider>
  );
}

export default App;