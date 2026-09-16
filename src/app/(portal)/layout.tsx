import React from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  AppSidebar,
  UserProfile,
  UserRole,
} from "@/components/shared/app-sidebar";

export default async function PortalGroupRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("first_name, last_name, email, role")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/login");
  }

  const userProfile: UserProfile = {
    first_name: profile.first_name,
    last_name: profile.last_name,
    email: profile.email,
    role: profile.role as UserRole,
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <SidebarProvider>
        {/* Desktop */}
        <div className="hidden h-full w-full overflow-hidden px-5 md:flex">
          <AppSidebar role={userProfile.role} userProfile={userProfile} />

          <main className="h-full min-w-0 flex-1 overflow-y-auto pr-2">
            <SidebarTrigger />
            {children}
          </main>
        </div>

        {/* Mobile */}
        <div className="h-screen overflow-y-auto md:hidden">
          <main className="min-h-full px-4 pb-20 pt-4">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
