"use server";

import { createClient } from "@/lib/supabase/server";

export interface SiblingStudent {
    id: string;
    firstName: string;
    lastName: string;
    gradeLevel: string;
    totalTuition: number;
    remainingBalance: number;
}

interface PaymentPayload {
    student_id: string;
    or_number: string;
    amount: number;
    mode_of_payment: string;
    billing_period: string;
}

// 📡 Action 1: Dynamic student and active balances lookups 
export async function getStudentsAndBalancesByParent(parentId: string): Promise<SiblingStudent[]> {
    const supabase = await createClient();

    const { data: students, error: studentError } = await supabase
        .from("students")
        .select(`
            id,
            first_name,
            last_name,
            enrollments (
                grade_level
            ),
            student_account_card (
                total_tuition_fee
            )
        `)
        .eq("parent", parentId);

    if (studentError) throw new Error(studentError.message);
    if (!students || students.length === 0) return [];

    const studentIds = students.map(s => s.id);

    const { data: payments, error: paymentError } = await supabase
        .from("payments")
        .select("student_id, amount")
        .in("student_id", studentIds);

    if (paymentError) throw new Error(paymentError.message);

    return students.map(student => {
        const activeEnrollment = Array.isArray(student.enrollments) ? student.enrollments[0] : student.enrollments;
        const accountCard = Array.isArray(student.student_account_card) ? student.student_account_card[0] : student.student_account_card;
        
        const totalTuition = accountCard ? Number(accountCard.total_tuition_fee) : 0;
        
        const totalPaid = (payments || [])
            .filter(p => p.student_id === student.id)
            .reduce((sum, p) => sum + Number(p.amount || 0), 0);

        return {
            id: student.id,
            firstName: student.first_name,
            lastName: student.last_name,
            gradeLevel: activeEnrollment?.grade_level || "Not Specified",
            totalTuition: totalTuition,
            remainingBalance: totalTuition - totalPaid
        };
    });
}

// 💾 Action 2: Batch commit payment entries simultaneously
export async function createFamilyPayments(payments: PaymentPayload[]) {
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