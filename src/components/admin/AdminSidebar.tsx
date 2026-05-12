"use client";

import { LayoutDashboard, NotebookText, Wallet, WalletCards, FileText, LogOut } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AdminSidebar() {

    const [selectedLink, setSelectedLink] = useState("Dashboard");

    const links = [
        {label: "Dashboard", link: "/admin/dashboard", icon: LayoutDashboard},
        {label: "Students", link: "/admin/dashboard", icon: FileText},
        {label: "Teachers", link: "/admin/dashboard", icon: FileText},
        {label: "Inventory", link: "/admin/dashboard", icon: FileText},
        {label: "Finance", link: "/admin/dashboard", icon: FileText},
        {label: "Configuration", link: "/admin/configuration", icon: FileText},
    ]

    return(
        <div className="bg-sla-blue px-12 rounded-md ml-5 my-10 h-screen">
            <div className="flex justify-center my-5 py-5">
                <Image src="/logo.svg" alt="logo" width={100} height={100}/>
            </div>
            {links.map((l , index) => (
                <div key={index} className="py-4">
                    <Link href={l.link} onClick={() => setSelectedLink(l.label)} className={`${selectedLink===l.label? "text-white" : "text-[#A9C7FF]"} flex gap-2 items-center`}>
                        <l.icon size={18}/>
                        {l.label}
                    </Link>
                </div>
            ))}
            <div className="text-[#A9C7FF] pt-10 flex gap-2 items-center">
                <LogOut size={18}/>
                <p>Logout</p>
            </div>
        </div>
    );
}