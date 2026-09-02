"use server";

import { createClient } from "@/lib/supabase/server";

export type PaymentStudent = {
  id: string;
  student_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
};

export async function getPaymentStudents(): Promise<PaymentStudent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .select(
      `
      id,
      student_id,
      first_name,
      middle_name,
      last_name
    `,
    )
    .order("last_name", { ascending: true })
    .order("first_name", { ascending: true });

  if (error) {
    console.error("Error loading students for payment search:", error);
    throw new Error(`Failed to load students: ${error.message}`);
  }

  return (data ?? []) as PaymentStudent[];
}

type Payment = {
  or_number: string;
  amount: number;
  mode_of_payment: string;
  student_id: string;
  payment_specifics: string;
  created_at?: string; // Added created_at property here
};

export async function createPayments(payments: Payment[]) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .insert(payments)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}