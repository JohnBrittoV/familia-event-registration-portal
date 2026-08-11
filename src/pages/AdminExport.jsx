import React from "react";
import { useAuth } from "../context/AuthContext";
import { Greeting } from "../components/features/Greeting";

export const AdminExport = () => {

    const { user } = useAuth();

    return(
        <>
            <Greeting 
                    name={user?.displayName} 
                    role="Admin" 
                    subtitle="Download registration data and generate reports."/>
                       
            <div className="flex items-center justify-center h-screen">
                <p>Coming soon</p>
            </div>
                
        </>   
    )
}