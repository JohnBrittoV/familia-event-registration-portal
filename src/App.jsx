import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { Welcome } from "./pages/Welcome";
import { PendingAccess } from "./pages/PendingAccess";
import { UserDashboard } from "./pages/UserDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { db } from "./config/firebase.config"

console.log("Firebase initialized successfully:", db.app.name);

export const App = () => {
  return( 
    <Router>
      <Routes>

        {/* Public routes */}

        <Route path="/" element={<Welcome/>}/>
        <Route path="/pending" element={<PendingAccess/>}/>

        {/* Protected routes */}

        <Route 
          path="/dashboard" 
          element={
                  <ProtectedRoute>
                    <UserDashboard/>
                  </ProtectedRoute>
                }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowAdminOnly={true}>
              <AdminDashboard/>
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </Router>
  )
}

