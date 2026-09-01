"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getDailyExpenseSummaries,
  getTodayExpenses,
  getExpenseCategories,
} from "@/app/(portal)/expenses/actions";
import AddExpense from "./AddExpenses";
import DisbursedToday from "./DisbursedToday";
import DailyExpenseSummary from "./DailyExpenseSummary";
import ExpensesOverview from "./ExpensesOverview";
import { createClient } from "@/lib/supabase/client";

export default function ExpensesClient() {
  const { data: dailySummaries, isLoading: summaryLoading } = useQuery({
    queryKey: ["expense-daily-summaries"],
    queryFn: () => getDailyExpenseSummaries(),
  });

  const { data: todayExpenses, isLoading: todayLoading } = useQuery({
    queryKey: ["expenses-today"],
    queryFn: () => getTodayExpenses(),
  });

  const { data: categories } = useQuery({
    queryKey: ["expense-categories"],
    queryFn: () => getExpenseCategories(),
  });

  const { data: allItemizedExpenses } = useQuery({
    queryKey: ["all-itemized-expenses"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("expenses")
        .select("amount, expenses_category(name)");
      return data ?? [];
    },
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-5rem)] flex flex-col py-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Expenses Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor daily cash disbursements, review historical date summaries,
            and track operational costs.
          </p>
        </div>
        <AddExpense />
      </div>

      {/* Main Split Layout: Top 50% & Bottom 50% */}
      <div className="flex-1 min-h-0 grid grid-rows-2 gap-6 pt-6 overflow-hidden">
        {/* Top 50%: Disbursed Today */}
        <div className="min-h-0 overflow-hidden">
          <DisbursedToday expenses={todayExpenses} isLoading={todayLoading} />
        </div>

        {/* Bottom 50%: 2fr for Category Overview, 1fr for Compact Daily Summaries */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 min-h-0 overflow-hidden">
          <div className="min-h-0 overflow-hidden">
            <ExpensesOverview
              categories={categories}
              allExpenses={allItemizedExpenses}
            />
          </div>
          <div className="min-h-0 overflow-hidden">
            <DailyExpenseSummary
              summaries={dailySummaries}
              isLoading={summaryLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
