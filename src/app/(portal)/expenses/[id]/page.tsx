import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExpenseDetailClient from "@/components/(portal)/expenses/[id]/ExpenseDetailClient";

export const metadata: Metadata = {
  title: "Daily Expense Details | St. Louisse Academy",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExpenseDetailPage({ params }: PageProps) {
  const { id } = await params;
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

  return <ExpenseDetailClient dateStr={id} />;
}
