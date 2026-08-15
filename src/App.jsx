import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Welcome } from "./pages/Welcome";
import { PendingAccess } from "./pages/PendingAccess";
import { UserDashboard } from "./pages/UserDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { PrayerDashboard } from "./modules/prayer-offerings/pages/PrayerDashboard";
import { PrayerAdminPage } from "./modules/prayer-offerings/pages/PrayerAdminPage";
import { NotFound } from "./components/common/NotFound";
import { NoNetwork } from "./components/common/NoNetwork";
import { db } from "./config/firebase.config"

import { AdminParticipants } from "./pages/AdminParticipantsPage";
import { ResponsiblePersons } from "./pages/ResponsiblePersons";
import { AdminStats } from "./pages/AdminStats";
import { AdminExport } from "./pages/AdminExport";
import { AdminPendingAccess } from './pages/AdminPendingAccess';
import { AdminPrayerPartners } from "./pages/AdminPrayerPartners";
import { AdminParticipantsConfirmation } from "./pages/AdminParticipantsConfirmation";
import { AdminAccommodationPage } from "./components/features/Accommodation/Pages/AdminAccommodationPage";

import { RPNewParticipant } from "./pages/RPNewParticipant";
import { RPMySubmissions } from "./pages/RPMySubmissions";
import { RPGlobalRoster } from "./pages/RPGlobalRoaster";
import { RPExport } from "./pages/RPExport";
import { RPTechSupport } from "./pages/RPTechSupport";
import { RPParticipantProfile } from "./pages/RPParticipantProfile";
import { useNetworkStatus } from "./hooks/useNetworkStatus";

console.log("Firebase initialized successfully:", db.app.name);

export const App = () => {
  
  const { isOnline, checkConnection } = useNetworkStatus();
  
  if (!isOnline) {
    return <NoNetwork onRetry={checkConnection} />;
  }

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
            <Route path="/admin/pending-access" element={<AdminPendingAccess/>}/>
            <Route path="/admin/prayer-partners" element={<AdminPrayerPartners/>}/>
            <Route path="/admin/participants-confirmation" element={<AdminParticipantsConfirmation/>}/>
            <Route path="/admin/room-management" element={<AdminAccommodationPage/>}/>
        
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
            <Route path="/rp/global-registrations" element={<RPGlobalRoster />} />
            <Route path="/rp/reports" element={<RPExport />} />
            <Route path="/rp/tech-support" element={<RPTechSupport />} />
            <Route path="/rp/participant/:id" element={<RPParticipantProfile />} />

        </Route>

        <Route path="*" element={<NotFound/>}/>
        
      </Routes>
    </Router>
  )
}

