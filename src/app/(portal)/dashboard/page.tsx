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
      <div className="flex justify-center items-center min-h-[50vh] text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-muted-foreground">
        Unable to load user profile.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen px-4 pt-4 md:px-0 md:pt-0">
      <div className="mx-auto w-full">
        <div className="w-full rounded-xl bg-gradient-to-r from-[#3153DE] to-[#3F95E8] p-7 md:p-10 text-white shadow-sm">
          <p className="text-md text-gray-100 font-medium">{date}</p>

          <h2 className="pt-3 text-2xl md:text-3xl font-semibold tracking-tight">
            Welcome back, {user.first_name}!
          </h2>
        </div>

        {/* Administrative roles can view the registrar/admin operational dashboard */}
        {(user.role === "registrar" ||
          user.role === "admin" ||
          user.role === "superadmin" ||
          user.role === "executive") && <RegistrarDashboard />}

        {/* Parent specific view */}
        {user.role === "parent" && <ParentDashboard />}
      </div>
    </div>
  );
}
