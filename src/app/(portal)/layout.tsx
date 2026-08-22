import React from "react";
import RegistrarSidebar from "@/components/(portal)/sidebar/RegistrarSidebar";

export default function PortalGroupRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen gap-10 p-7 flex bg-background">
            
            <div className="w-[14%] h-full">
                <RegistrarSidebar/>
            </div>
            <div className="w-[85%] h-full w-full">
                {children}
            </div>
            
        </div>
    );
}