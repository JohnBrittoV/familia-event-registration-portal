import React from "react";
import { useAuth } from "../context/AuthContext";
import { AdminLayout } from "../components/layout/AdminLayout";

export const AdminExport = () => {
    return(
        <>
            <AdminLayout>
                <div className="flex items-center justify-center h-screen">
                    <p>Coming soon</p>
                </div>
            </AdminLayout>
        </>   
    )
}