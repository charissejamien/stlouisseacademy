"use server";

import { createClient } from "@/lib/supabase/server";

export async function getExpensesByDate(dateStr: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("expenses")
    .select(
      `
      id,
      description,
      amount,
      payment_method,
      date_disbursed,
      expenses_categories (
        name
      )
    `,
    )
    .eq("date_disbursed", dateStr)
    .order("created_at", { ascending: false });

  if (error)
    throw new Error(`Failed to fetch daily expenses: ${error.message}`);

  return (data ?? []).map((item) => {
    const cat = Array.isArray(item.expenses_categories)
      ? item.expenses_categories[0]
      : item.expenses_categories;
    return {
      id: item.id,
      description: item.description,
      amount: Number(item.amount),
      payment_method: item.payment_method,
      category_name: cat?.name ?? "Uncategorized",
    };
  });
}
