// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/common/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage"; // Import the LandingPage component
import ProtectedRoute from "./components/common/ProtectedRoute";
import { GrievanceProvider } from "./context/GrievanceContext";
import { EventProvider } from "./context/EventContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <GrievanceProvider>
          <EventProvider>
            <Routes>
              {/* Landing page as the default route */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Login route */}
              <Route path="/login" element={<Login />} />
              
              {/* Redirect /dashboard to /dashboard/* route */}
              <Route path="/dashboard" element={<Navigate to="/dashboard/home" />} />
              
              {/* Protected dashboard routes */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </EventProvider>
        </GrievanceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;