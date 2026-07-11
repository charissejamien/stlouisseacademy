"use client";

import Image from "next/image";

// 1. Import your custom responsive navigation layout wrapper
import ParentNavigation from "@/components/parents/ParentsSidebar";
// 2. Import your widget and dynamic student profile components
import AnnouncementsWidget from "@/components/parents/AnnouncementsWidget";
import StudentSummary from "@/components/parents/StudentSummary";
export default function ParentDashboardPage() {
    return (
        <div className="mt-5 w-[90%] mx-auto flex flex-col gap-5">
            <div>
                <h2 className="text-[24px] font-semibold">Dashboard</h2>
                <p className="mt-1 text-gray-600">Hello, Charisse.</p>
            </div>

            <div className="bg-[#3470ED] text-white p-5 rounded-xl shadow-sm">
                <p className="font-medium">Announcements</p>
                <p className="mt-1 text-[14px] font-thin">
                    <span className="font-normal">June 10, 2026</span> <br />
                    Advisory: This is a reminder to all parents and guardians to settle their outstanding balances for June.
                </p>
            </div>

            <div className="mt-2 flex flex-col gap-3">
                <p>Manage Students</p>

                <div>
                    <div className="bg-white p-5 rounded-md shadow-sm flex gap-3">
                        <Image src={"/logo.svg"} alt="" width={50} height={50} className="rounded-[50%]"/>
                        <div>
                            <p>Charisse Jamien</p>
                            <p className="text-[12px] text-gray-600">Grade  7</p>
                        </div>
                        
                    </div>
                </div>
                
            </div>
        </div>
    );
}