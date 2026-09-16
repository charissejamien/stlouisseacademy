"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser } from "./actions";

import RegistrarDashboard from "@/components/(portal)/dashboard/RegistrarDashboard";
import ParentDashboard from "@/components/(portal)/dashboard/ParentDashboard";
import { Skeleton } from "@/components/ui/skeleton";

interface UserData {
  first_name: string;
  role: "superadmin" | "admin" | "executive" | "registrar" | "parent";
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col h-full space-y-6 pb-6 animate-pulse">
      <div className="w-full rounded-xl bg-muted/60 p-6 md:p-10 shadow-sm shrink-0 flex flex-col justify-between min-h-[140px]">
        <Skeleton className="h-4 w-36 bg-muted-foreground/20" />
        <Skeleton className="h-8 w-64 md:w-80 bg-muted-foreground/20" />
      </div>

      <div className="flex-1 min-h-0 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-4 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>

        <div className="rounded-xl border p-6 space-y-4 h-64">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
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
    return <DashboardSkeleton />;
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
      <div className="w-full rounded-xl bg-gradient-to-r from-[#3153DE] to-[#3F95E8] p-6 md:p-10 text-white shadow-sm shrink-0">
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
