"use server";

import { createClient } from "@/lib/supabase/server";

export async function getTuitionFees() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tuition_fees")
    .select("grade_level, base_tuition, miscellaneous, total_tuition");

  if (error) {
    console.error("Error fetching tuition fees:", error);
    return [];
  }

  return data ?? [];
}

export async function searchParents(query: string) {
  const supabase = await createClient();

  if (!query || query.trim() === "") return [];

  const { data, error } = await supabase
    .from("parents")
    .select(
      "id, first_name, middle_name, last_name, gender, address, contact_number, email, suffix",
    )
    .or(
      `first_name.ilike.%${query}%,last_name.ilike.%${query}%,contact_number.ilike.%${query}%`,
    )
    .limit(5);

  if (error) {
    console.error("Error searching parents:", error);
    return [];
  }

  return data ?? [];
}

type ProcessEnrollmentInput = {
  students: {
    school_year: string;
    grade_level: string;
    student_type: string;
    lrn?: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    suffix?: string;
    address: string;
    date_of_birth?: string;
    gender: "Male" | "Female";

    discounts: {
      id: string;
      name: string;
      amount: number;
    }[];

    payments: {
      billing_period: string;
      amount: string;
    }[];
  }[];

  payment_date: string;
  or_number: string;
  payment_mode: "Cash" | "GCash" | "Bank Transfer";
};

export async function processEnrollment(input: ProcessEnrollmentInput) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("process_enrollment", {
    p_input: input,
  });

  if (error) {
    console.error("Error processing enrollment:", error);

    throw new Error(error.message || "Failed to process enrollment.");
  }

  return data;
}

export async function getSubsidies() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subsidies")
    .select("id, subsidy_name, amount");

  if (error) {
    console.error("Error fetching subsidies:", error);
    return [];
  }

  return data ?? [];
}
