import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EnrollmentClientContainer from "@/components/(portal)/enrollment/EnrollmentClientContainer";

import {
  getSchoolYears,
  getGradeLevels,
  getBillingPeriods,
  getDiscounts,
  getBooks,
} from "../actions";

import { getTuitionFees, getSubsidies } from "./actions";

export const metadata: Metadata = {
  title: "Enrollment | St. Louisse Academy",
};

export default async function Enrollment() {
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

  const [
    schoolYears,
    gradeLevels,
    billingPeriods,
    discounts,
    tuitionFees,
    books,
    subsidies,
  ] = await Promise.all([
    getSchoolYears(),
    getGradeLevels(),
    getBillingPeriods(),
    getDiscounts(),
    getTuitionFees(),
    getBooks(),
    getSubsidies(),
  ]);

  return (
    <EnrollmentClientContainer
      schoolYears={schoolYears ?? []}
      gradeLevels={gradeLevels ?? []}
      billingPeriods={billingPeriods}
      discounts={discounts}
      tuitionFees={tuitionFees}
      books={books}
      subsidies={subsidies}
    />
  );
}
