import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Welcome } from "./pages/Welcome";
import { PendingAccess } from "./pages/PendingAccess";
import { UserDashboard } from "./pages/UserDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { PrayerDashboard } from "./modules/prayer-offerings/pages/PrayerDashboard";
import { PrayerAdminPage } from "./modules/prayer-offerings/pages/PrayerAdminPage";
import { db } from "./config/firebase.config"
import { AdminParticipants } from "./pages/AdminParticipantsPage";
import { ResponsiblePersons } from "./pages/ResponsiblePersons";
import { AdminStats } from "./pages/AdminStats";
import { AdminExport } from "./pages/AdminExport";
import { RPNewParticipant } from "./pages/RPNewParticipant";
import { RPMySubmissions } from "./pages/RPMySubmissions";
import { RPGlobalRoster } from "./pages/RPGlobalRoaster";

console.log("Firebase initialized successfully:", db.app.name);

export const App = () => {
  return( 
    <Router>
      <Routes>

        {/* Public Routes */}
        {/* ------------- */}

        <Route path="/" element={<Welcome/>}/>
        <Route path="/pending" element={<PendingAccess/>}/>
        <Route path="/prayer-dashboard" element={<PrayerDashboard />} />
        
        {/* Admin / Owner Routes  */}
        {/* --------------------- */}
        <Route element={
            <ProtectedRoute allowedRoles={['admin', 'owner']}>
                <DashboardLayout />
            </ProtectedRoute>

        }> 
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/participants" element={<AdminParticipants/>}/>
            <Route path="/admin/responsible-persons" element={<ResponsiblePersons/>}/>
            <Route path="/admin/stats" element={<AdminStats/>}/>
            <Route path="/admin/export" element={<AdminExport/>}/>
            <Route path="/admin/prayer-bookings" element={<PrayerAdminPage/>}/>
        </Route> 

        {/* Responsible persons & Standard user Routes  */}
        {/* ------------------------------------------- */}

        <Route element={
            <ProtectedRoute allowedRoles={['admin', 'owner', 'responsible_person', 'standard']}>
                <DashboardLayout/>
            </ProtectedRoute>
        }>
            <Route path="/rp/dashboard" element={<UserDashboard />} />
            <Route path="/rp/new-participant" element={<RPNewParticipant />} />
            <Route path="/rp/my-registrations" element={<RPMySubmissions />} />
            <Route path="/rp/global-participants" element={<RPGlobalRoster />} />
            <Route path="/rp/reports" element={<UserDashboard />} />
            <Route path="/rp/tech-support" element={<UserDashboard />} />

        </Route>
        
      </Routes>
    </Router>
  )
}

