"use server";

import { createClient } from "@/lib/supabase/server";

export async function getSchoolYears() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("school_years")
    .select("id, start_year, end_year");

  if (error) {
    console.error("Error fetching school years:", error);
    return [];
  }

  return data ?? [];
}

export async function getGradeLevels() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("grade_levels")
    .select("grade_level")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching grade levels:", error);
    return [];
  }

  return data ?? [];
}

export type BillingPeriod = {
  id: string;
  period_name: string;
};

export async function getBillingPeriods(): Promise<BillingPeriod[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("billing_periods")
    .select("id, period_name")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching billing periods:", error);

    throw new Error("Failed to fetch billing periods");
  }

  return data ?? [];
}

export async function getDiscounts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("discounts")
    .select("id, name, amount")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch discounts: ${error.message}`);
  }

  return data ?? [];
}

export async function getBooks() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("books")
    .select("id, grade_level, amount");

  if (error) {
    console.error("Error fetching books:", error);
    return [];
  }

  return data ?? [];
}
