"use server";

import { createClient } from "@/lib/supabase/server";

export interface ExpenseListItem {
    id: string;
    expense_number: string;
    description: string;
    amount: number;
    payment_method: string;
    date: string;
    category_id: string;
    category_name?: string;
}

// ==========================================
// MAIN EXPENSES REGISTRY RECORD OPERATIONS
// ==========================================

export async function getExpenses(): Promise<ExpenseListItem[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("expenses")
        .select(`
            id,
            expense_number,
            description,
            amount,
            payment_method,
            date,
            category_id,
            expenses_categories ( name )
        `)
        .order("date", { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((item: any) => ({
        id: item.id,
        expense_number: item.expense_number,
        description: item.description,
        amount: Number(item.amount || 0),
        payment_method: item.payment_method,
        date: item.date,
        category_id: item.category_id,
        category_name: item.expenses_categories?.name || "Uncategorized"
    }));
}

export async function saveExpense(payload: {
    description: string;
    categoryId: string;
    amount: string;
    paymentMethod: string;
    date: string;
}): Promise<void> {
    const supabase = await createClient();

    const { count, error: countError } = await supabase
        .from("expenses")
        .select("id", { count: "exact", head: true });

    if (countError) throw new Error(countError.message);
    
    const nextSequence = String((count || 0) + 1).padStart(3, '0');
    const computedVoucherNumber = `EXP-2026-${nextSequence}`;

    const { error } = await supabase
        .from("expenses")
        .insert({
            expense_number: computedVoucherNumber,
            description: payload.description.trim(),
            category_id: payload.categoryId,
            amount: parseFloat(payload.amount),
            payment_method: payload.paymentMethod,
            date: payload.date
        });

    if (error) throw new Error(error.message);
}

export async function deleteExpense(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
}