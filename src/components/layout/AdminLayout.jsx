import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminDashboardHeader";
import { useState } from "react";

export const AdminLayout = ({ children}) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return(

        <div className="flex h-screen bg-slate-50 
                        dark:bg-slate-900 overflow-hidden">
            
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>

            <div className="flex flex-col flex-1 w-full 
                            overflow-hidden">
                
                <AdminHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                
                <main className="flex-1 overflow-y-auto 
                                 p-4 md:p-6 lg:p-8">
                    {children}

                </main>

            </div>

        </div>
    );
};

