"use server";

import { createClient } from "@/lib/supabase/server";

export interface UserAccountProfile {
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  contact_number: string | null;
  role: string;
}

export async function getUserAccountProfile(): Promise<UserAccountProfile> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("first_name, middle_name, last_name, contact_number, role")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    throw new Error(`Failed to fetch user profile: ${error?.message || "Not found"}`);
  }

  return {
    first_name: profile.first_name,
    middle_name: profile.middle_name,
    last_name: profile.last_name,
    email: user.email ?? "No email provided",
    contact_number: profile.contact_number,
    role: profile.role,
  };
}