import React from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import RegistrarSidebar from "@/components/(portal)/sidebar/RegistrarSidebar";
import TeacherSidebar from "@/components/(portal)/sidebar/TeachersSidebar";
import ExecutiveSidebar from "@/components/(portal)/sidebar/ExecutiveSidebar";
import ParentSidebar from "@/components/(portal)/sidebar/ParentsSidebar";
import ParentsMobileNav from "@/components/(portal)/sidebar/ParentsMobileNav";
import SuperAdminSidebar from "@/components/(portal)/sidebar/SuperAdminSidebar";

type UserRole =
    | "parent"
    | "teacher"
    | "admin"
    | "registrar"
    | "executive"
    | "superadmin"
    | "staff";

const sidebars: Partial<Record<UserRole, React.ReactNode>> = {
    parent: <ParentSidebar />,
    teacher: <TeacherSidebar />,
    // admin: <AdminSidebar />,
    registrar: <RegistrarSidebar />,
    executive: <ExecutiveSidebar />,
    superadmin: <SuperAdminSidebar />,
    // staff: <StaffSidebar />,
};

function isUserRole(role: unknown): role is UserRole {
    return (
        role === "parent" ||
        role === "teacher" ||
        role === "admin" ||
        role === "registrar" ||
        role === "executive" ||
        role === "superadmin" ||
        role === "staff"
    );
}

export default async function PortalGroupRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // const supabase = await createClient();

    // const {
    //     data: { user },
    // } = await supabase.auth.getUser();

    // if (!user) {
    //     redirect("/login");
    // }

    // const { data: profile, error } = await supabase
    //     .from("users")
    //     .select("role")
    //     .eq("id", user.id)
    //     .single();

    // if (error || !profile) {
    //     redirect("/login");
    // }

    // if (!isUserRole(profile.role)) {
    //     redirect("/login");
    // }

    // const isParent = profile.role === "parent";

    return (
        <div className="min-h-screen bg-background">

            {/* Desktop Layout */}
            <div className="hidden h-screen gap-10 p-7 md:flex">

                {/* Sidebar */}
                <aside className="h-full w-[14%]">
                    {sidebars[profile.role]}
                </aside>

                {/* Main Content */}
                <main className="h-full min-w-0 flex-1">
                    {children}
                </main>
            </div>

            {/* Mobile Layout */}
            <div className="min-h-screen md:hidden">

                {/* Main Content */}
                <main
                    className={[
                        "min-h-screen",
                        isParent
                            ? "pb-20"
                            : "pb-20",
                    ].join(" ")}
                >
                    {children}
                </main>

                {/* Parent Mobile Navigation */}
                {isParent && <ParentsMobileNav />}
            </div>
        </div>
    );
}
