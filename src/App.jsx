import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { PendingAccess } from "./pages/PendingAccess";
import { Dashboard } from "./pages/Dashboard";
import { AdminPanel } from "./pages/AdminPanel";
import { Welcome } from "./pages/Welcome";
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
                    <Dashboard/>
                  </ProtectedRoute>
                }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowAdminOnly={true}>
              <AdminPanel/>
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </Router>
  )
}

