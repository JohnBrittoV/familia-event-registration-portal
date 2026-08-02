import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";
import { UserDashboardHeader } from "./UserDashboardHeader";
import { AdminHeader } from "./AdminDashboardHeader";
import { useAuth } from "../../context/AuthContext";

export const DashboardLayout = ({ children}) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { dbUser } = useAuth();
    const isAdminOrOwner = ['admin', 'owner'].includes(dbUser?.role);

    return(

        <div className="flex h-screen bg-slate-50 
                        dark:bg-slate-900 overflow-hidden">
            
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>

            <div className="flex flex-col flex-1 w-full 
                            overflow-hidden">
                
                {isAdminOrOwner ? (
                        <AdminHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                    ) : (
                        <UserDashboardHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                    )}
                
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

