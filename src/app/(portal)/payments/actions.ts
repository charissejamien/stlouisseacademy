"use server"

import { createClient } from "@/lib/supabase/server"

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
    .select(`
      id,
      student_id,
      first_name,
      middle_name,
      last_name
    `)
    .order("last_name", { ascending: true })
    .order("first_name", { ascending: true });

  if (error) {
    console.error("Error loading students for payment search:", error);
    throw new Error(`Failed to load students: ${error.message}`);
  }

  return (data ?? []) as PaymentStudent[];
}

export async function getBillingPeriods() {

    const supabase = await createClient();

  const { data, error } = await supabase
    .from("billing_periods")
    .select("id, period_name")
    .order("id", { ascending: true });

  if (error) throw error;

  return data;
}

type Payment = {
  or_number: string;
  amount: number;
  mode_of_payment: string;
  student_id: string;
  payment_specifics: string;
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