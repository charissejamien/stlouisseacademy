"use server";

import { createClient } from "@/lib/supabase/server";

export interface DailyCategoryExpenseRow {
  date_disbursed: string;
  expenses: {
    [categoryName: string]: number;
  };
  dailyTotal: number;
}

export async function getAllExpensesGroupedByDate(monthFilter?: string) {
  const supabase = await createClient();

  // 1. Fetch all expenses with their category names
  const query = supabase
    .from("expenses")
    .select(
      `
      date_disbursed,
      amount,
      expenses_category (
        name
      )
    `,
    )
    .order("date_disbursed", { ascending: false });

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch history: ${error.message}`);

  // 2. Fetch all unique categories from the category table
  const { data: categoriesData } = await supabase
    .from("expenses_category")
    .select("name");
  const categoryNamesSet = new Set<string>(
    (categoriesData ?? []).map((c) => c.name.trim().toLowerCase()),
  );

  // Also dynamically include any category found in actual expenses just in case
  (data ?? []).forEach((item) => {
    const cat = Array.isArray(item.expenses_category)
      ? item.expenses_category[0]
      : item.expenses_category;
    if (cat?.name) {
      categoryNamesSet.add(cat.name.trim().toLowerCase());
    }
  });

  const categoryNames = Array.from(categoryNamesSet);

  // 3. Group by date_disbursed
  const dateMap = new Map<string, { [key: string]: number }>();

  for (const item of data ?? []) {
    const date = item.date_disbursed;

    if (monthFilter && !date.startsWith(monthFilter)) continue;

    const cat = Array.isArray(item.expenses_category)
      ? item.expenses_category[0]
      : item.expenses_category;
    const catName = (cat?.name ?? "uncategorized").trim().toLowerCase();
    const amount = Number(item.amount ?? 0);

    if (!dateMap.has(date)) {
      const initialCats: { [key: string]: number } = {};
      categoryNames.forEach((c) => {
        initialCats[c] = 0;
      });
      dateMap.set(date, initialCats);
    }

    const dateCats = dateMap.get(date)!;
    // If a category appears that wasn't in our initial set, initialize it on the fly
    if (dateCats[catName] === undefined) {
      dateCats[catName] = 0;
    }
    dateCats[catName] += amount;
  }

  // 4. Transform Map into an array format for components
  const result: DailyCategoryExpenseRow[] = Array.from(dateMap.entries()).map(
    ([date_disbursed, cats]) => {
      const dailyTotal = Object.values(cats).reduce((sum, val) => sum + val, 0);
      return {
        date_disbursed,
        expenses: cats,
        dailyTotal,
      };
    },
  );

  return {
    rows: result,
    categories: categoryNames,
  };
}
