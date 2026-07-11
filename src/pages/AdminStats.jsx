import React from "react";
import { useAuth } from "../context/AuthContext";
import { AdminLayout } from "../components/layout/AdminLayout";
import { Greeting } from "../components/features/Greeting";

export const AdminStats = () => {
    
    const { user } = useAuth();
        
    return(
        <>
            <AdminLayout>
                <Greeting 
                    name={user?.displayName} 
                    role="Admin" 
                    subtitle="Monitor portal activity and manage user access."/>
            </AdminLayout>
        </>
    )
}