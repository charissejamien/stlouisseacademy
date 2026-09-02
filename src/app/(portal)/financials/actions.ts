"use server";

import { createClient } from "@/lib/supabase/server";
import { getActiveSchoolYear } from "@/app/actions";

export async function getFinancialsSummary() {
  const supabase = await createClient();

  // 1. Get the active school year ID
  const activeSchoolYearId = await getActiveSchoolYear();

  if (!activeSchoolYearId) {
    return {
      totalBilled: 0,
      totalCollected: 0,
      totalBalance: 0,
    };
  }

  // 2. Query student_account_card for the active school year
  const { data: accounts, error } = await supabase
    .from("student_account_card") 
    .select(`
      adjusted_total_tuition_fee,
      total_paid,
      tuition_balance,
      school_year_id,
      school_years!inner (
        is_active
      )
    `)
    .eq("school_year_id", activeSchoolYearId);

  if (error) {
    console.error("Error fetching financial summary:", error);
    throw new Error(`Failed to load financials: ${error.message}`);
  }

  // 3. Aggregate totals across all accounts
  let totalBilled = 0;
  let totalCollected = 0;
  let totalBalance = 0;

  if (accounts && accounts.length > 0) {
    for (const account of accounts) {
      totalBilled += Number(account.adjusted_total_tuition_fee) || 0;
      totalCollected += Number(account.total_paid) || 0;
      totalBalance += Number(account.tuition_balance) || 0;
    }
  }

  return {
    totalBilled,
    totalCollected,
    totalBalance,
  };
}