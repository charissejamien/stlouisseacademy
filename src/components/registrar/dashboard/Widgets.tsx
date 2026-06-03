"use client";

import Link from "next/link";
import { UserPlus, CreditCard, FileText, Banknote } from "lucide-react";

export default function Widgets() {
    // 💡 Enhanced array mapping including explicit icons, custom background tones, and descriptive subtexts
    const links = [
        {
            label: "Enroll a Student", 
            link: "/registrar/enrollment", 
            icon: UserPlus,
            color: "text-blue-600 bg-blue-50 border-blue-100",
            description: "Register new student profiles"
        },
        {
            label: "Create Payment", 
            link: "/registrar/payments", // Fixed to point to your real payments channel
            icon: CreditCard,
            color: "text-emerald-600 bg-emerald-50 border-emerald-100",
            description: "Process tuition remittance"
        },
        {
            label: "DCPR", 
            link: "/registrar/dcpr", 
            icon: FileText,
            color: "text-amber-600 bg-amber-50 border-amber-100",
            description: "Daily Collection & Payment Report"
        },
        {
            label: "Create Payroll", 
            link: "/registrar/payroll", 
            icon: Banknote,
            color: "text-purple-600 bg-purple-50 border-purple-100",
            description: "Manage employee salaries"
        },
    ];

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {links.map((l, index) => {
                const IconComponent = l.icon;
                
                return (
                    <Link 
                        key={index} 
                        href={l.link} 
                        className="group bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:border-sla-blue/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[140px] relative overflow-hidden"
                    >
                        {/* Top Section: Icon Row */}
                        <div className={`p-3 rounded-lg w-fit border ${l.color} group-hover:scale-105 transition-transform duration-200`}>
                            <IconComponent className="w-5 h-5" />
                        </div>

                        {/* Bottom Section: Text Content Stack */}
                        <div className="mt-4 flex flex-col gap-0.5">
                            <h4 className="font-bold text-slate-800 text-base group-hover:text-sla-blue transition-colors duration-150">
                                {l.label}
                            </h4>
                            <p className="text-xs text-muted-foreground font-medium line-clamp-1">
                                {l.description}
                            </p>
                        </div>

                        {/* Interactive Right Indicator Chevron Background Highlight */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-sla-blue">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}