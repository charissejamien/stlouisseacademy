"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface DailyExpenseSummary {
  date_disbursed: string;
  total_amount: number;
  transaction_count: number;
}

export async function getDailyExpenseSummaries(): Promise<
  DailyExpenseSummary[]
> {
  const supabase = await createClient();

  // Fetch all expenses to group by disbursement date
  const { data, error } = await supabase
    .from("expenses")
    .select("date_disbursed, amount")
    .order("date_disbursed", { ascending: false });

  if (error)
    throw new Error(`Failed to fetch expense summaries: ${error.message}`);

  // Group expenses by date_disbursed manually in code for clear aggregation
  const summaryMap = new Map<
    string,
    { total_amount: number; transaction_count: number }
  >();

  for (const item of data ?? []) {
    const date = item.date_disbursed;
    const amount = Number(item.amount ?? 0);

    if (!summaryMap.has(date)) {
      summaryMap.set(date, { total_amount: 0, transaction_count: 0 });
    }

    const current = summaryMap.get(date)!;
    summaryMap.set(date, {
      total_amount: current.total_amount + amount,
      transaction_count: current.transaction_count + 1,
    });
  }

  // Convert Map back to an array
  const summaries: DailyExpenseSummary[] = Array.from(summaryMap.entries()).map(
    ([date_disbursed, stats]) => ({
      date_disbursed,
      total_amount: stats.total_amount,
      transaction_count: stats.transaction_count,
    }),
  );

  return summaries;
}

export async function getTodayExpenses() {
  const supabase = await createClient();
  const todayString = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("expenses")
    .select(
      `
            id,
            expense_number,
            description,
            amount,
            payment_method,
            expenses_categories (
                name
            )
        `,
    )
    .eq("date_disbursed", todayString);

  if (error)
    throw new Error(`Failed to fetch today's expenses: ${error.message}`);

  return (data ?? []).map((item) => {
    const cat = Array.isArray(item.expenses_categories)
      ? item.expenses_categories[0]
      : item.expenses_categories;
    return {
      id: item.id,
      expense_number: item.expense_number,
      description: item.description,
      amount: Number(item.amount),
      payment_method: item.payment_method,
      category_name: cat?.name ?? "Uncategorized",
    };
  });
}

export async function getExpenseCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expenses_categories")
    .select("id, name");
  if (error) throw new Error(`Failed to fetch categories: ${error.message}`);
  return data;
}

export async function createExpense(formData: {
  description: string;
  amount: number;
  payment_method: string;
  category_id: string;
  date_disbursed: string;
}) {
  const supabase = await createClient();

  const { data: activeSchoolYear, error: syError } = await supabase
    .from("school_years")
    .select("id")
    .eq("is_active", true)
    .single();

  if (syError || !activeSchoolYear) {
    throw new Error("Failed to record expense: No active school year found.");
  }

  // 2. Generate sequential expense number (e.g., "0001", "0002")
  const { count } = await supabase
    .from("expenses")
    .select("*", { count: "exact", head: true });

  const nextNumber = String((count ?? 0) + 1).padStart(4, "0");

  // 3. Insert expense record including the active school_year_id
  const { error: insertError } = await supabase.from("expenses").insert({
    expense_number: nextNumber,
    description: formData.description,
    amount: formData.amount,
    payment_method: formData.payment_method,
    category_id: formData.category_id,
    date_disbursed: formData.date_disbursed,
    school_year_id: activeSchoolYear.id,
  });

  if (insertError) {
    throw new Error(`Failed to record expense: ${insertError.message}`);
  }

  revalidatePath("/expenses");
  return { success: true };
}
