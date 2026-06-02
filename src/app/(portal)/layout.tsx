import React from "react";

export default function PortalGroupRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            
            <div className="flex-1 flex flex-col min-w-0">
                {children}
            </div>

            <footer className="mt-auto w-full border-t border-input/30 bg-white/50 py-4 text-center text-[11px] text-muted-foreground/60 tracking-wide pb-24 md:pb-4">
                St. Louisse Academy 2026. All rights reserved.
            </footer>
            
        </div>
    );
}