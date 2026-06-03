"use server";

import { createClient } from "@/lib/supabase/server";

export interface StudentFinancialSummary {
    studentName: string;
    gradeLevel: string;
    schoolYear: string;
    remainingBalance: number;
    baseTuition: number;
    miscellaneous: number;
    totalTuition: number;
    bookFee: number;
    lastPaymentAmount: number | null;
    lastPaymentDate: string | null;
}

export interface PaymentHistoryRecord {
    id: string;
    or_number: string;
    amount: number;
    mode_of_payment: string;
    billing_period: string;
    created_at: string;
}

/**
 * Compiles a live financial summary for a targeted student account row
 */
export async function getStudentBalanceSummary(studentId: string): Promise<StudentFinancialSummary> {
    const supabase = await createClient();

    // 1. Fetch basic student structural identity parameters
    const { data: student, error: studentError } = await supabase
        .from("students")
        .select("first_name, middle_name, last_name, grade_level")
        .eq("id", studentId)
        .single();

    if (studentError || !student) {
        throw new Error("Target student execution entity record not found.");
    }

    const studentFullName = [student.first_name, student.middle_name, student.last_name]
        .filter(Boolean)
        .join(" ");

    // 2. Locate current active global school year profile metadata
    const { data: activeSy } = await supabase
        .from("school_years")
        .select("start_year, end_year")
        .eq("is_active", true)
        .single();
    
    const currentSyString = activeSy ? `SY ${activeSy.start_year}-${activeSy.end_year}` : "SY 2025-2026";

    // 3. Resolve tuition parameters assigned to this placement tier
    const { data: tuition } = await supabase
        .from("tuition_fees")
        .select("base_tuition, miscellaneous, total_tuition")
        .eq("grade_level", student.grade_level)
        .maybeSingle();

    // 4. Resolve book distribution requirements
    const { data: books } = await supabase
        .from("book_fees")
        .select("amount")
        .eq("grade_level", student.grade_level)
        .maybeSingle();

    // 5. Query calculated ledger balances assigned to this child context
    const { data: ledger } = await supabase
        .from("student_balances")
        .select("remaining_balance")
        .eq("student_id", studentId)
        .maybeSingle();

    // 6. Look up the single most recent verified transaction row
    const { data: recentPayment } = await supabase
        .from("payments")
        .select("amount, created_at")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    const base_tuition = Number(tuition?.base_tuition || 0);
    const miscellaneous = Number(tuition?.miscellaneous || 0);
    const book_fee = Number(books?.amount || 0);

    return {
        studentName: studentFullName,
        gradeLevel: student.grade_level,
        schoolYear: currentSyString,
        remainingBalance: Number(ledger?.remaining_balance ?? (base_tuition + miscellaneous + book_fee)),
        baseTuition: base_tuition,
        miscellaneous: miscellaneous,
        totalTuition: base_tuition + miscellaneous,
        bookFee: book_fee,
        lastPaymentAmount: recentPayment ? Number(recentPayment.amount) : null,
        lastPaymentDate: recentPayment ? recentPayment.created_at : null
    };
}

/**
 * Pulls all past transactional receipt listings associated with this student
 */
export async function getStudentPaymentHistory(studentId: string): Promise<PaymentHistoryRecord[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("payments")
        .select("id, or_number, amount, mode_of_payment, billing_period, created_at")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
}