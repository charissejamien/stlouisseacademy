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
    gender: string;
    grade_level: string;
    section_name: string;
    advisor_name: string;
    date_enrolled: string;
    classification: string;
    base_tuition: number;
    miscellaneous_fees: number;
    gross_tuition_total: number;
    total_assessment: number;     
    total_paid: number;
    total_books_fee: number;
    total_books_paid: number;
    tuition_balance: number;
    books_balance: number;
    balance_remaining: number;
    total_discounts_deducted: number;
    discount_summary_text: string;
    applied_discount_ids: string[]; 
    transactions: TransactionRow[];
}

export interface DiscountOption {
    id: string;
    name: string;
    amount: number;
    category: string;
}

export interface SyncDiscountsPayload {
    studentId: string;
    discountIds: string[]; 
}

// ==========================================
// STRICT TYPES FOR RAW SUPABASE JOIN SCHEMAS
// ==========================================

interface SchoolYearJoin {
    is_active: boolean;
}

interface EnrollmentJoin {
    grade_level: string;
    student_type: string;
    status: string;
    isESC: boolean | null;
    school_years: SchoolYearJoin | null;
}

interface ParentJoin {
    first_name: string;
    last_name: string;
}

interface AccountDiscountSnapshotJoin {
    discount_id: string;
    snapshot_name: string;
    snapshot_rate: number;
}

interface StudentAccountCardJoin {
    id: string;
    total_tuition_fee: number | null;
    total_books_fee: number | null;
    school_years: SchoolYearJoin | null;
    student_account_discounts: AccountDiscountSnapshotJoin[] | null;
}

interface PaymentJoin {
    id: string;
    or_number: string | null;
    amount: number | null;
    mode_of_payment: string | null;
    created_at: string;
    payment_specifics: string | null;
}

interface SupabaseStudentProfileQueryResult {
    id: string;
    student_id: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    gender: string | null;
    created_at: string;
    enrollments: EnrollmentJoin[] | null;
    parents: ParentJoin[] | null;
    student_account_card: StudentAccountCardJoin[] | null;
    payments: PaymentJoin[] | null;
}

/**
 * 🎯 FETCH MASTER LIST DATA FOR ALL STUDENTS
 */
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
            enrollments (
                grade_level,
                student_type,
                status,
                school_years ( is_active )
            ),
            parents (
                first_name,
                last_name
            )
        `);

    if (error) {
        console.error("Error executing master roster extraction:", error);
        throw new Error(`Failed to load directory: ${error.message}`);
    }

    const typedData = (data ?? []) as unknown as SupabaseStudentProfileQueryResult[];

    return typedData.map((student): MasterStudentRow => {
        const activeEnrollment = student.enrollments?.find((e: EnrollmentJoin) => e.school_years?.is_active === true) || student.enrollments?.[0];
        
        let assignedParent = "No Parent Linked";
        if (student.parents && student.parents.length > 0) {
            const p = student.parents[0];
            assignedParent = `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim();
        }

        return {
            id: student.id,
            student_id: student.student_id,
            first_name: student.first_name,
            middle_name: student.middle_name,
            last_name: student.last_name,
            gender: student.gender ?? "Not Specified",
            date_added: new Date(student.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            }),
            grade_level: activeEnrollment?.grade_level ?? "Unassigned",
            student_type: activeEnrollment?.student_type ?? "Regular",
            status: activeEnrollment?.status ?? "Pending",
            parent_name: assignedParent
        };
    });
}

/**
 * 🎯 FETCH SINGLE STUDENT SPECIFIC DETAILS WITH GRANULAR TUITION BREAKDOWNS
 */
export async function getStudentInformation(studentUUID: string): Promise<CompleteStudentProfile> {
    const supabase = await createClient();

    const [profileResult, subsidyResult] = await Promise.all([
        supabase
            .from("students")
            .select(`
                id,
                student_id,
                first_name,
                middle_name,
                last_name,
                gender,
                created_at,
                enrollments (
                    grade_level,
                    student_type,
                    isESC,
                    school_years ( is_active )
                ),
                student_account_card (
                    id,
                    total_tuition_fee,
                    total_books_fee,
                    school_years ( is_active ),
                    student_account_discounts (
                        discount_id,
                        snapshot_name,
                        snapshot_rate
                    )
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
            .single(),
        supabase
            .from("discounts")
            .select("name, amount")
            .eq("category", "Subsidy")
    ]);

    if (profileResult.error || !profileResult.data) {
        throw new Error(`Failed to map student profile parameters: ${profileResult.error?.message || "Record not found"}`);
    }

    const student = profileResult.data as unknown as SupabaseStudentProfileQueryResult;

    const escDbRecord = (subsidyResult.data ?? []).find((s) => /esc/i.test(s.name ?? ""));
    const activeEscSubsidyAmount = escDbRecord ? Number(escDbRecord.amount ?? 0) : 9000;

    const activeEnrollment = student.enrollments?.find((e: EnrollmentJoin) => e.school_years?.is_active === true) || student.enrollments?.[0];
    const activeAssessment = student.student_account_card?.find((a: StudentAccountCardJoin) => a.school_years?.is_active === true) || student.student_account_card?.[0];

    const currentGradeLevel = activeEnrollment?.grade_level ?? "Unassigned";

    let baseTuition = 0;
    let miscellaneousFees = 0;

    if (currentGradeLevel !== "Unassigned") {
        const { data: feeStructure } = await supabase
            .from("tuition_fees")
            .select("base_tuition, miscellaneous")
            .eq("grade_level", currentGradeLevel)
            .maybeSingle();

        if (feeStructure) {
            baseTuition = Number(feeStructure.base_tuition ?? 0);
            miscellaneousFees = Number(feeStructure.miscellaneous ?? 0);
        } else {
            baseTuition = Number(activeAssessment?.total_tuition_fee ?? 0);
        }
    }

    let runningBaseTuition = baseTuition;

    if (activeEnrollment?.isESC) {
        runningBaseTuition = Math.max(0, runningBaseTuition - activeEscSubsidyAmount);
    }

    const activeDiscountsList = activeAssessment?.student_account_discounts ?? [];
    
    const aggregateDiscountPercentage = activeDiscountsList.reduce((sum: number, item: AccountDiscountSnapshotJoin) => {
        return sum + Number(item.snapshot_rate ?? 0);
    }, 0);

    const discountSummaryString = activeDiscountsList.length > 0 
        ? activeDiscountsList.map((d: AccountDiscountSnapshotJoin) => `${d.snapshot_name} (${d.snapshot_rate}%)`).join(", ")
        : "None Applied";

    const appliedIds = activeDiscountsList.map((d: AccountDiscountSnapshotJoin) => d.discount_id);

    const totalDiscountsDeductedCash = runningBaseTuition * (aggregateDiscountPercentage / 100);
    const finalTuitionAssessment = Math.max(0, runningBaseTuition - totalDiscountsDeductedCash) + miscellaneousFees;

    const totalBooksAssessment = Number(activeAssessment?.total_books_fee ?? 0);
    const paymentsArray = student.payments ?? [];
    
    const tuitionPaid = paymentsArray
        .filter((pay: PaymentJoin) => !pay.payment_specifics?.toLowerCase().includes("book"))
        .reduce((sum: number, pay: PaymentJoin) => sum + Number(pay.amount ?? 0), 0);

    const booksPaid = paymentsArray
        .filter((pay: PaymentJoin) => pay.payment_specifics?.toLowerCase().includes("book"))
        .reduce((sum: number, pay: PaymentJoin) => sum + Number(pay.amount ?? 0), 0);

    const tuitionBalanceRemaining = Math.max(0, finalTuitionAssessment - tuitionPaid);
    const booksBalanceRemaining = Math.max(0, totalBooksAssessment - booksPaid);
    const combinedRemainingBalance = tuitionBalanceRemaining + booksBalanceRemaining;

    const formattedTransactions: TransactionRow[] = paymentsArray.map((pay: PaymentJoin): TransactionRow => ({
        id: pay.or_number || `OR-${pay.id.slice(0, 4).toUpperCase()}`,
        context: pay.payment_specifics || "Enrollment Fee",
        amount: Number(pay.amount ?? 0),
        date: new Date(pay.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        method: pay.mode_of_payment || "Cash"
    }));

    return {
        id: student.id,
        student_id: student.student_id,
        first_name: student.first_name,
        middle_name: student.middle_name,
        last_name: student.last_name,
        gender: student.gender ?? "Not Specified", 
        grade_level: currentGradeLevel,
        section_name: "Unassigned Room", 
        advisor_name: "No Advisor Linked", 
        date_enrolled: new Date(student.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        classification: activeEnrollment?.student_type ?? "Regular",
        base_tuition: baseTuition,
        miscellaneous_fees: miscellaneousFees,
        gross_tuition_total: baseTuition + miscellaneousFees,
        total_assessment: finalTuitionAssessment,
        total_paid: tuitionPaid,
        total_books_fee: totalBooksAssessment,
        total_books_paid: booksPaid,
        tuition_balance: tuitionBalanceRemaining,
        books_balance: booksBalanceRemaining,
        balance_remaining: combinedRemainingBalance,
        total_discounts_deducted: totalDiscountsDeductedCash,
        discount_summary_text: discountSummaryString, 
        applied_discount_ids: appliedIds,
        transactions: formattedTransactions
    };
}

/**
 * 🎯 FETCH ALL STACKABLE DISCOUNT OPTIONS
 */
export async function getAvailableDiscountOptions(): Promise<DiscountOption[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("discounts")
        .select("id, name, amount, category")
        .neq("category", "Subsidy");

    if (error) throw new Error(error.message);
    return (data ?? []).map((d) => ({
        id: d.id,
        name: d.name,
        amount: Number(d.amount ?? 0),
        category: d.category
    }));
}

/**
 * 🎯 SYNC MULTIPLE SELECTIVE DISCOUNTS AT ONCE
 */
export async function syncStudentDiscounts(payload: SyncDiscountsPayload): Promise<void> {
    const supabase = await createClient();

    const { data: accountCard, error: cardError } = await supabase
        .from("student_account_card")
        .select(`id, school_years!inner ( is_active )`)
        .eq("student_id", payload.studentId)
        .eq("school_years.is_active", true)
        .maybeSingle();

    if (cardError || !accountCard) {
        throw new Error("Could not find an active financial card account mapping for this student.");
    }

    const { error: deleteError } = await supabase
        .from("student_account_discounts")
        .delete()
        .eq("student_account_card_id", accountCard.id);

    if (deleteError) throw new Error(`Sync cleanup failed: ${deleteError.message}`);

    if (payload.discountIds.length === 0) return; 

    const { data: discountRules, error: rulesError } = await supabase
        .from("discounts")
        .select("id, name, amount")
        .in("id", payload.discountIds);

    if (rulesError || !discountRules) throw new Error("Failed to load discount templates.");

    const rowsToInsert = discountRules.map((rule) => ({
        student_account_card_id: accountCard.id,
        discount_id: rule.id,
        snapshot_name: rule.name,
        snapshot_rate: Number(rule.amount ?? 0)
    }));

    const { error: insertError } = await supabase
        .from("student_account_discounts")
        .insert(rowsToInsert);

    if (insertError) throw new Error(`Failed to assign stacked options: ${insertError.message}`);
}

export interface UpdateStudentProfilePayload {
    studentId: string;
    schoolYearId: string;
    editedBy: string;
    firstName: string;
    lastName: string;
    gender: string;
    gradeLevel: string;
    classroomSection: string;
    facultyAdvisor: string;
}

export async function updateStudentProfileRegistry(payload: UpdateStudentProfilePayload): Promise<void> {
    const supabase = await createClient();

    const { error: updateError } = await supabase
        .from("students")
        .update({ first_name: payload.firstName, last_name: payload.lastName, gender: payload.gender })
        .eq("id", payload.studentId);

    if (updateError) throw new Error(`Profile update failed: ${updateError.message}`);

    await supabase.from("enrollments").update({ grade_level: payload.gradeLevel }).eq("student_id", payload.studentId);
}