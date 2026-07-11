import React from "react";
import { useAuth } from "../context/AuthContext";
import { AdminLayout } from "../components/layout/AdminLayout";

export const AdminStats = () => {
    
    const { user } = useAuth();
        
    return(
        <>
            <AdminLayout>
        
            </AdminLayout>
        </>
    )
}