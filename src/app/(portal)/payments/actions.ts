"use server";

import { createClient } from "@/lib/supabase/server";

export async function getRecentPayments() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .select(
      `
            id,
            or_number,
            amount,
            payment_specifics,
            created_at,
            students (
                first_name,
                last_name
            )
        `,
    )
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(`Failed to fetch recent payments: ${error.message}`);
  }

  return data;
}
