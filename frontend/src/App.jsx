// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppProvider';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Layout>
      </AppProvider>
    </Router>
  );
}

export default App;