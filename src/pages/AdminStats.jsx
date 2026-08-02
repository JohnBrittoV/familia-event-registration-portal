import React from "react";
import { useAuth } from "../context/AuthContext";
import { Greeting } from "../components/features/Greeting";

export const AdminStats = () => {
    
    const { user } = useAuth();
        
    return(
        <>
            <Greeting 
                    name={user?.displayName} 
                    role="Admin" 
                    subtitle="Monitor portal activity and manage user access."/>
        </>
    )
}