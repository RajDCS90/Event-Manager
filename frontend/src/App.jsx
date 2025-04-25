import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
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
import { SocialMediaProvider } from "./context/SocialMediaContext";
import { ToastProvider } from "./context/ToastContext";
import { ToastContainer } from "react-toastify";
import { MandalProvider } from "./context/MandalContext";

// Create wrapper components to handle URL parameters
const EventsWithParams = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get('tab') || 'upcoming';

  return <EventsComponent defaultTab={tab} />;
};

const GrievancesWithParams = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get('tab') || 'upcoming';

  return <GrievancesComponent defaultTab={tab} />;
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
        <MandalProvider>
          <SocialMediaProvider>
            <GrievanceProvider>
              <EventProvider>
                <PartyAndYouthProvider>
                  <ToastContainer />
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

                    {/* Updated to use wrapper components */}
                    <Route
                      path="/events"
                      element={
                        <PublicLayout>
                          <EventsWithParams />
                        </PublicLayout>
                      }
                    />

                    <Route
                      path="/grievance"
                      element={
                        <PublicLayout>
                          <GrievancesWithParams />
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
          </SocialMediaProvider>
          </MandalProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;