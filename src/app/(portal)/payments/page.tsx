import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PaymentsClient from "@/components/(portal)/payments/PaymentsClient";

export const metadata: Metadata = {
  title: "Payments | St. Louisse Academy",
};

export default async function PaymentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: userData, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !userData) {
    redirect("/unauthorized");
  }

  const allowedRoles = ["superadmin", "admin", "executive", "registrar"];
  if (!allowedRoles.includes(userData.role)) {
    redirect("/unauthorized");
  }

  return <PaymentsClient />;
}
