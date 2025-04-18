import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/common/Layout";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { GrievanceProvider } from "./context/GrievanceContext";
import { EventProvider } from "./context/EventContext";
import { AuthProvider } from "./context/AuthContext";
import { PartyAndYouthProvider } from "./context/P&YContext";
import SocialMediaUploader from "./components/socialmedia/SocialMediaUploader";
import EventsComponent from "./components/Event/EventsComponent";
import PublicLayout from "./pages/PublicLayout";
import GrievancesComponent from "./components/Grievance/GrievancesComponent";
import Home from "./components/Home/Home";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <GrievanceProvider>
          <EventProvider>
            <PartyAndYouthProvider>
              <Routes>
                {/* Public routes with header */}
                <Route
                  path="/"
                  element={
                    <PublicLayout>
                      <LandingPage />
                    </PublicLayout>
                  }
                />

                <Route
                  path="/login"
                  element={
                    <PublicLayout>
                      <Login />
                    </PublicLayout>
                  }
                />

                <Route
                  path="/events"
                  element={
                    <PublicLayout>
                      <EventsComponent />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/grievance"
                  element={
                    <PublicLayout>
                      <GrievancesComponent />
                    </PublicLayout>
                  }
                />

                {/* Redirect /dashboard to /dashboard/home route */}
                <Route
                  path="/dashboard"
                  element={<Navigate to="/dashboard/home" replace />}
                />

                {/* Make the EventsAndGrievancesPage render at /dashboard/home */}
                <Route
                  path="/dashboard/home"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Home />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

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
                <Route
                  path="/social-media"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <SocialMediaUploader />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </PartyAndYouthProvider>
          </EventProvider>
        </GrievanceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
