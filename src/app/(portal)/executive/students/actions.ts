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
    total_books_fee: number;    // 📚 Standardized property
    total_books_paid: number;   // 📚 Standardized property
    balance_remaining: number;
    transactions: TransactionRow[];
}

interface SupabaseSchoolYearJoin {
    is_active: boolean;
}

interface SupabaseEnrollmentJoin {
    grade_level: string;
    student_type: string;
    status?: string;
    school_years: SupabaseSchoolYearJoin | null;
}

interface SupabaseParentJoin {
    first_name: string;
    last_name: string;
}

interface SupabaseStudentAccountCardJoin {
    total_tuition_fee: number | null;
    total_books_fee: number | null;
    school_years: SupabaseSchoolYearJoin | null;
}

interface SupabasePaymentJoin {
    id: string;
    or_number: string | null;
    amount: number | null;
    mode_of_payment: string | null;
    created_at: string;
    payment_specifics: string | null;
}

interface SupabaseMasterStudentQueryResult {
    id: string;
    student_id: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    gender: string;
    created_at: string;
    parents: SupabaseParentJoin | null;
    enrollments: SupabaseEnrollmentJoin[] | null;
}

interface SupabaseStudentProfileQueryResult {
    id: string;
    student_id: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    created_at: string;
    enrollments: SupabaseEnrollmentJoin[] | null;
    student_account_card: SupabaseStudentAccountCardJoin[] | null;
    payments: SupabasePaymentJoin[] | null;
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

    const typedData = data as unknown as SupabaseMasterStudentQueryResult[];

    return typedData.map((student) => {
        const activeEnrollment = student.enrollments?.find(
            (e) => e.school_years?.is_active === true
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

    const { data, error } = await supabase
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
                total_books_fee,
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

    if (error || !data) {
        console.error("Error fetching absolute student account metadata details:", error);
        throw new Error(`Failed to map student profile parameters: ${error?.message || "Record not found"}`);
    }

    const student = data as unknown as SupabaseStudentProfileQueryResult;

    // ⚡ Isolate active school year contexts or fallback cleanly to baseline indices
    const activeEnrollment = student.enrollments?.find((e) => e.school_years?.is_active === true) || student.enrollments?.[0];
    const activeAssessment = student.student_account_card?.find((a) => a.school_years?.is_active === true) || student.student_account_card?.[0];

    // Isolate base values from account card parameters safely
    const totalTuitionAssessment = Number(activeAssessment?.total_tuition_fee || 0);
    const totalBooksAssessment = Number(activeAssessment?.total_books_fee || 0);
    const combinedGrossAssessment = totalTuitionAssessment + totalBooksAssessment;

    // Filter payment histories dynamically to calculate separate ledger balances
    const paymentsArray = student.payments || [];
    
    const tuitionPaid = paymentsArray
        .filter((pay) => !pay.payment_specifics?.toLowerCase().includes("book"))
        .reduce((sum, pay) => sum + Number(pay.amount || 0), 0);

    const booksPaid = paymentsArray
        .filter((pay) => pay.payment_specifics?.toLowerCase().includes("book"))
        .reduce((sum, pay) => sum + Number(pay.amount || 0), 0);

    const sumTotalPaid = tuitionPaid + booksPaid;
    const calculatedRemainingBalance = Math.max(0, combinedGrossAssessment - sumTotalPaid);

    // Map transaction table rows layout
    const formattedTransactions: TransactionRow[] = paymentsArray.map((pay) => ({
        id: pay.or_number || `OR-${pay.id.slice(0, 4).toUpperCase()}`,
        context: pay.payment_specifics || "Enrollment Fee",
        amount: Number(pay.amount || 0),
        date: new Date(pay.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        }),
        method: pay.mode_of_payment || "Cash"
    }));

    return {
        id: student.id,
        student_id: student.student_id,
        first_name: student.first_name,
        middle_name: student.middle_name,
        last_name: student.last_name,
        grade_level: activeEnrollment?.grade_level || "Not Assigned",
        section_name: "Unassigned Room", 
        advisor_name: "No Advisor Linked", 
        date_enrolled: new Date(student.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        }),
        classification: activeEnrollment?.student_type || "Regular",
        total_assessment: totalTuitionAssessment,
        total_paid: tuitionPaid,
        total_books_fee: totalBooksAssessment,
        total_books_paid: booksPaid,
        balance_remaining: calculatedRemainingBalance,
        transactions: formattedTransactions
    };
}