"use server";

import { createClient } from "@/lib/supabase/server";

export interface MasterStudentRow {
    id: string;
    student_id: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    gender: string;
    date_added: string;
    grade_level: string;
    student_type: string;
    status: string;
    parent_name: string;
}

export async function getMasterStudentList(): Promise<MasterStudentRow[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("students")
        .select(`
            id,
            student_id,
            first_name,
            middle_name,
            last_name,
            gender,
            created_at,
            parents (
                first_name,
                last_name
            ),
            enrollments (
                grade_level,
                student_type,
                status,
                school_years (
                    is_active
                )
            )
        `);

    if (error) {
        console.error("Master student list server fetch error:", error);
        throw new Error(`Failed to pull student matrix dataset: ${error.message}`);
    }

    if (!data) return [];

    return data.map((student: any) => {
        const activeEnrollment = student.enrollments?.find(
            (e: any) => e.school_years?.is_active === true
        ) || student.enrollments?.[0];

        const parentProfile = student.parents;
        const compiledParentName = parentProfile
            ? `${parentProfile.first_name} ${parentProfile.last_name}`
            : "Staged (Unlinked)";

        return {
            id: student.id,
            student_id: student.student_id,
            first_name: student.first_name,
            middle_name: student.middle_name,
            last_name: student.last_name,
            gender: student.gender,
            date_added: new Date(student.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
            grade_level: activeEnrollment?.grade_level || "Not Assigned",
            student_type: activeEnrollment?.student_type || "Regular",
            status: activeEnrollment?.status || "Staged (Unlinked)",
            parent_name: compiledParentName,
        };
    });
}

export interface TransactionRow {
    id: string;
    context: string;
    amount: number;
    date: string;
    method: string;
}

export interface CompleteStudentProfile {
    id: string;
    student_id: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    grade_level: string;
    section_name: string;
    advisor_name: string;
    date_enrolled: string;
    classification: string;
    total_assessment: number;
    total_paid: number;
    balance_remaining: number;
    transactions: TransactionRow[];
}

/**
 * Retrieves full academic and financial profiles for an individual student,
 * aggregating account logs dynamically via server execution context.
 * * @param studentUUID The primary key UUID value of the target student record row
 */
export async function getStudentInformation(studentUUID: string): Promise<CompleteStudentProfile> {
    const supabase = await createClient();

    // 🏆 Relational multi-table join match query following your table constraints
    const { data: student, error } = await supabase
        .from("students")
        .select(`
            id,
            student_id,
            first_name,
            middle_name,
            last_name,
            created_at,
            enrollments (
                grade_level,
                student_type,
                school_years ( is_active )
            ),
            student_account_card (
                total_tuition_fee,
                school_years ( is_active )
            ),
            payments (
                id,
                or_number,
                amount,
                mode_of_payment,
                created_at,
                payment_specifics
            )
        `)
        .eq("id", studentUUID)
        .single();

    if (error || !student) {
        console.error("Error fetching absolute student account metadata details:", error);
        throw new Error(`Failed to map student profile parameters: ${error?.message || "Record not found"}`);
    }

    // ⚡ Isolate active school year contexts or fallback cleanly to baseline indices
    const activeEnrollment = student.enrollments?.find((e: any) => e.school_years?.is_active === true) || student.enrollments?.[0];
    const activeAssessment = student.student_account_card?.find((a: any) => a.school_years?.is_active === true) || student.student_account_card?.[0];

    // Calculate aggregated financial values from your payments table loop array
    const baseTotalAssessment = activeAssessment?.total_tuition_fee || 0;
    const sumTotalPaid = student.payments?.reduce((sum: number, pay: any) => sum + (pay.amount || 0), 0) || 0;
    const calculatedRemainingBalance = Math.max(0, baseTotalAssessment - sumTotalPaid);

    // Map your custom transaction rows layout
    const formattedTransactions: TransactionRow[] = (student.payments || []).map((pay: any) => ({
        id: pay.or_number || `OR-${pay.id.slice(0, 4).toUpperCase()}`,
        context: pay.payment_specifics || "Enrollment Fee",
        amount: pay.amount || 0,
        date: new Date(pay.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        }),
        method: pay.mode_of_payment || "Cash"
    }));

    return {
        id: student.id, // Keep the raw UUID for reference structures
        student_id: student.student_id, // e.g., "20260001"
        first_name: student.first_name,
        middle_name: student.middle_name,
        last_name: student.last_name,
        grade_level: activeEnrollment?.grade_level || "Not Assigned",
        // Fallbacks for section allocations until assigned through your sectioning workspace
        section_name: "Unassigned Room", 
        advisor_name: "No Advisor Linked", 
        date_enrolled: new Date(student.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        }),
        classification: activeEnrollment?.student_type || "Regular",
        total_assessment: baseTotalAssessment,
        total_paid: sumTotalPaid,
        balance_remaining: calculatedRemainingBalance,
        transactions: formattedTransactions
    };
}