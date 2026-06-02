"use client";

import { LayoutDashboard, CalendarCheck, GraduationCap, CreditCard, User, LogOut } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ParentNavigation({ children }: { children: React.ReactNode }) {
    // Shared links definition for both layouts
    const links = [
        { label: "Dashboard", link: "/parent/dashboard", icon: LayoutDashboard },
        { label: "Attendance", link: "/parent/attendance", icon: CalendarCheck },
        { label: "Grades", link: "/parent/grades", icon: GraduationCap },
        { label: "Billing", link: "/parent/billing", icon: CreditCard },
        { label: "Profiles", link: "/parent/profiles", icon: User },
    ];

    const [selectedLink, setSelectedLink] = useState("Dashboard");

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-background">
            
            {/* 🖥️ DESKTOP LAYOUT: SIDEBAR STYLE MATCHED TO REGISTRAR */}
            <aside className="hidden md:flex flex-col bg-gradient-to-t from-[#3153DE] to-[#4580FF] px-12 rounded-md ml-5 my-10 w-64 h-[calc(100vh-5rem)] shrink-0 shadow-md">
                <div className="flex justify-center my-5 py-5">
                    <Image src="/logo.svg" alt="logo" width={80} height={80} />
                </div>
                
                <nav className="flex-1 flex flex-col pt-4">
                    {links.map((l, index) => (
                        <div key={index} className="py-4">
                            <Link 
                                href={l.link} 
                                onClick={() => setSelectedLink(l.label)} 
                                className={`${selectedLink === l.label ? "text-white font-semibold" : "text-[#A9C7FF]"} flex gap-3 items-center hover:text-white transition-colors duration-200`}
                            >
                                <l.icon size={18} />
                                {l.label}
                            </Link>
                        </div>
                    ))}
                </nav>

                <div className="text-[#A9C7FF] pb-8 flex gap-3 items-center cursor-pointer hover:text-white transition-colors duration-200 mt-auto border-t border-white/10 pt-4">
                    <LogOut size={18} />
                    <p>Logout</p>
                </div>
            </aside>

            {/* MAIN PORTAL SCREEN VIEWPORT WRAPPER */}
            <main className="flex-1 flex flex-col min-w-0 pb-24 md:pb-0">
                {/* Mobile Top Header - Visible only on mobile screens */}
                <header className="md:hidden bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Image src="/logo.svg" alt="logo" width={32} height={32} />
                        <span className="font-bold text-[#3153DE] tracking-tight">SLA Parent Portal</span>
                    </div>
                </header>

                {/* Main Dynamic View Content */}
                <div className="p-6 md:p-10">
                    {children}
                </div>
            </main>

            {/* 📱 MOBILE LAYOUT: THUMB-FRIENDLY BOTTOM TAB NAVIGATION BAR */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-r from-[#3153DE] to-[#4580FF] flex justify-around items-center px-2 rounded-t-xl shadow-xl z-50 border-t border-white/10 animate-in fade-in slide-in-from-bottom-5 duration-300">
                {links.map((l, index) => (
                    <Link
                        key={index}
                        href={l.link}
                        onClick={() => setSelectedLink(l.label)}
                        className={`flex flex-col items-center justify-center w-16 h-full gap-1.5 transition-all duration-200 ${
                            selectedLink === l.label 
                                ? "text-white font-bold scale-110" 
                                : "text-[#A9C7FF]/80"
                        }`}
                    >
                        {/* Custom wrapper highlights active navigation point icon with subtle contrast */}
                        <div className={`p-1.5 rounded-md ${selectedLink === l.label ? 'bg-white/10 text-white' : ''}`}>
                            <l.icon size={20} />
                        </div>
                        <span className="text-[10px] tracking-wide font-medium">{l.label}</span>
                    </Link>
                ))}
            </nav>

        </div>
    );
}