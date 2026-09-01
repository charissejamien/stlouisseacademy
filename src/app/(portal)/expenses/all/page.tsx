import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AllExpensesClient from "@/components/(portal)/expenses/all/AllExpensesClient";

export const metadata: Metadata = {
  title: "All Expenses History | St. Louisse Academy",
};

export default async function AllExpensesPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) redirect("/login");

  const { data: userData, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !userData) redirect("/unauthorized");

  const allowedRoles = ["superadmin", "admin", "executive", "registrar"];
  if (!allowedRoles.includes(userData.role)) redirect("/unauthorized");

  return <AllExpensesClient />;
}
