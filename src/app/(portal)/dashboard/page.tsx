"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser } from "./actions";

import RegistrarDashboard from "@/components/(portal)/dashboard/RegistrarDashboard";
import ParentDashboard from "@/components/(portal)/dashboard/ParentDashboard";

interface UserData {
  first_name: string;
  role: "superadmin" | "admin" | "executive" | "registrar" | "parent";
}

export default function Dashboard() {
  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const { data: user, isLoading } = useQuery<UserData>({
    queryKey: ["user"],
    queryFn: getUser,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full text-muted-foreground">
        Unable to load user profile.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6 pb-6">
      {/* Welcome Banner */}
      <div className="w-full rounded-xl bg-gradient-to-r from-[#3153DE] to-[#3F95E8] p-7 md:p-10 text-white shadow-sm shrink-0">
        <p className="text-md text-gray-100 font-medium">{date}</p>

        <h2 className="pt-3 text-2xl md:text-3xl font-semibold tracking-tight">
          Welcome back, {user.first_name}!
        </h2>
      </div>

      {/* Dashboard Sub-components View */}
      <div className="flex-1 min-h-0">
        {(user.role === "registrar" ||
          user.role === "admin" ||
          user.role === "superadmin" ||
          user.role === "executive") && <RegistrarDashboard />}

        {user.role === "parent" && <ParentDashboard />}
      </div>
    </div>
  );
}