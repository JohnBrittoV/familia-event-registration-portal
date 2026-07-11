import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { Welcome } from "./pages/Welcome";
import { PendingAccess } from "./pages/PendingAccess";
import { UserDashboard } from "./pages/UserDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { PrayerHomePage } from "./modules/prayer-offerings/pages/PrayerHomePage";
import { PrayerDashboard } from "./modules/prayer-offerings/pages/PrayerDashboard";
import { PrayerAdminPage } from "./modules/prayer-offerings/pages/PrayerAdminPage";
import { db } from "./config/firebase.config"
import { AdminParticipants } from "./pages/AdminParticipantsPage";
import { ResponsiblePersons } from "./pages/ResponsiblePersons";
import { PrayerPartners } from "./pages/PrayerPartners";
import { AdminStats } from "./pages/AdminStats";
import { AdminExport } from "./pages/AdminExport";

console.log("Firebase initialized successfully:", db.app.name);

export const App = () => {
  return( 
    <Router>
      <Routes>

        {/* Public routes */}

        <Route path="/" element={<Welcome/>}/>
        <Route path="/pending" element={<PendingAccess/>}/>
        <Route path="/prayer-offerings" element={<PrayerHomePage/>}/>

        {/* Protected routes - prayer dashboard */}
        <Route path="/prayer-dashboard" 
               element={
                  <ProtectedRoute allowAdminOnly={false}>
                    <PrayerDashboard/>
                  </ProtectedRoute>
              }/>

        {/* Protected routes - prayer bookings */}
        <Route path="/admin/prayer-bookings" element={
          <ProtectedRoute allowAdminOnly={true}>
              <PrayerAdminPage />
          </ProtectedRoute>
        }/>
        
        {/* Protected routes - User Dashboard */}
        <Route 
          path="/dashboard" 
          element={
                  <ProtectedRoute>
                    <UserDashboard/>
                  </ProtectedRoute>
                }
        />

        {/* Protected routes - Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowAdminOnly={true}>
              <AdminDashboard/>
            </ProtectedRoute>
          }
        />

        {/* Protected routes - Admin participants */}
        <Route
          path="/admin/participants"
          element={
            <ProtectedRoute allowAdminOnly={true}>
              <AdminParticipants/>
            </ProtectedRoute>
          }
        />

        {/* Protected routes - Admin responsible persons */}
        <Route
          path="/admin/responsible-persons"
          element={
            <ProtectedRoute allowAdminOnly={true}>
              <ResponsiblePersons/>
            </ProtectedRoute>
          }
        />

        {/* Protected routes - Admin prayer partners */}
        <Route
          path="/admin/prayer-partners"
          element={
            <ProtectedRoute allowAdminOnly={true}>
              <PrayerPartners/>
            </ProtectedRoute>
          }
        />
        
        {/* Protected routes - Admin statistics */}
        <Route
          path="/admin/stats"
          element={
            <ProtectedRoute allowAdminOnly={true}>
              <AdminStats/>
            </ProtectedRoute>
          }
        />

        {/* Protected routes - Admin Export */}
        <Route
          path="/admin/export"
          element={
            <ProtectedRoute allowAdminOnly={true}>
              <AdminExport/>
            </ProtectedRoute>
          }
        />      
        
      </Routes>
    </Router>
  )
}

