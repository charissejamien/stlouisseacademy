"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser } from "./actions";

import RegistrarDashboard from "@/components/(portal)/dashboard/RegistrarDashboard";
import ParentDashboard from "@/components/(portal)/dashboard/ParentDashboard";

export default function Dashboard() {
    
    const date = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const {
        data: user,
        isLoading,
    } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Unable to load user.</div>;
    }

    return (
        <div className="flex h-screen">
            <div className="mx-auto w-full">
                <div className="w-full rounded-xl bg-gradient-to-r from-[#3153DE] to-[#6CB3F8] p-10 text-white">
                    <p className="text-sm text-gray-200">
                        {date}
                    </p>

                    <h2 className="pt-5 text-2xl font-medium">
                        Welcome back, {user.first_name}!
                    </h2>

                    <p className="pt-1 text-sm">
                        Always stay updated in your school system
                    </p>
                </div>

                {user.role === "registrar" && (
                    <RegistrarDashboard />
                )}

                {user.role === "parent" && (
                    <ParentDashboard />
                )}
            </div>
        </div>
    );
}
