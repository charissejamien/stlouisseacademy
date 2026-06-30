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
    total_books_fee: number;
    total_books_paid: number;
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
    isESC: boolean | null; // 🎯 INJECTED
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
/**
 * Retrieves full academic and financial profiles for an individual student,
 * aggregating account logs dynamically via server execution context.
 * @param studentUUID The primary key UUID value of the target student record row
 */
export async function getStudentInformation(studentUUID: string): Promise<CompleteStudentProfile> {
    const supabase = await createClient();

    // 🎯 1. Added 'isESC' into the enrollments select query, and fetched the active subsidy rate in parallel
    const [profileResult, subsidyResult] = await Promise.all([
        supabase
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
                    isESC,
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
            .single(),
        supabase
            .from("discounts")
            .select("name, amount")
            .eq("category", "Subsidy")
    ]);

    if (profileResult.error || !profileResult.data) {
        console.error("Error fetching absolute student account metadata details:", profileResult.error);
        throw new Error(`Failed to map student profile parameters: ${profileResult.error?.message || "Record not found"}`);
    }

    const student = profileResult.data as unknown as SupabaseStudentProfileQueryResult;

    // Resolve the active ESC configuration value dynamically from your settings table
    const escDbRecord = (subsidyResult.data || []).find(s => /esc/i.test(s.name || ""));
    const activeEscSubsidyAmount = escDbRecord ? Number(escDbRecord.amount || 0) : 9000;

    // Isolate active school year contexts cleanly
    const activeEnrollment = student.enrollments?.find((e) => e.school_years?.is_active === true) || student.enrollments?.[0];
    const activeAssessment = student.student_account_card?.find((a) => a.school_years?.is_active === true) || student.student_account_card?.[0];

    // Isolate base values from account card parameters safely
    let totalTuitionAssessment = Number(activeAssessment?.total_tuition_fee || 0);
    const totalBooksAssessment = Number(activeAssessment?.total_books_fee || 0);

    // 🎯 2. APPLY DYNAMIC DEDUCTION: If student has isESC flagged as true, deduct the active subsidy rate
    if (activeEnrollment?.isESC) {
        totalTuitionAssessment = Math.max(0, totalTuitionAssessment - activeEscSubsidyAmount);
    }

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
        total_assessment: totalTuitionAssessment, // Now cleanly reflects the subsidy reduction
        total_paid: tuitionPaid,
        total_books_fee: totalBooksAssessment,
        total_books_paid: booksPaid,
        balance_remaining: calculatedRemainingBalance,
        transactions: formattedTransactions
    };
}


export interface UpdateStudentProfilePayload {
    studentId: string;
    schoolYearId: string;
    editedBy: string;
    firstName: string;
    lastName: string;
    gradeLevel: string;
    classroomSection: string;
    facultyAdvisor: string;
}

export interface UpdateStudentProfilePayload {
    studentId: string;
    schoolYearId: string;
    editedBy: string;
    firstName: string;
    lastName: string;
    gradeLevel: string;
    classroomSection: string;
    facultyAdvisor: string;
}

interface AuditLogInsertion {
    student_id: string;
    school_year_id: string;
    field_changed: string;
    old_value: string | null;
    new_value: string;
    edited_by: string;
}

/**
 * Updates a student profile record and sequentially computes differentials 
 * to insert row history inside your existing audit_students table.
 */
export async function updateStudentProfileRegistry(payload: UpdateStudentProfilePayload): Promise<void> {
    const supabase = await createClient();

    // 1. 🌟 FIXED: Use inner relational lookup to fetch grade_level from enrollments table
    const { data: currentStudent, error: fetchError } = await supabase
        .from("students")
        .select(`
            first_name, 
            last_name, 
            enrollments(grade_level)
        `)
        .eq("id", payload.studentId)
        .single();

    if (fetchError || !currentStudent) {
        console.error("Failed to fetch historical profile state for auditing:", fetchError);
        throw new Error("Could not verify historical record parameters.");
    }

    // Safely extract the inner relation array item if it exists
    // (Handles fallback string gracefully if no enrollment record exists yet)
    const enrollmentRecords = currentStudent.enrollments as unknown as { grade_level: string }[] | { grade_level: string } | null;
    const historicalGradeLevel = Array.isArray(enrollmentRecords)
        ? enrollmentRecords[0]?.grade_level
        : (enrollmentRecords as { grade_level: string })?.grade_level || "";

    // 2. Perform the primary table updates
    const { error: updateError } = await supabase
        .from("students")
        .update({
            first_name: payload.firstName,
            last_name: payload.lastName,
        })
        .eq("id", payload.studentId);

    if (updateError) {
        console.error("Failed to modify target student directory line:", updateError);
        throw new Error(`Profile update failed: ${updateError.message}`);
    }

    // 3. 🌟 OPTIONAL: Update the grade_level column directly inside the enrollments table 
    // to match the modified value chosen in the dropdown.
    const { error: enrollmentUpdateError } = await supabase
        .from("enrollments")
        .update({ grade_level: payload.gradeLevel })
        .eq("student_id", payload.studentId);

    if (enrollmentUpdateError) {
        console.warn("Warning: Enrollment grade_level sync failed:", enrollmentUpdateError);
    }

    // 4. Evaluate changed fields inside TypeScript application context
    const auditLogs: AuditLogInsertion[] = [];

    const checkAndLog = (fieldKey: string, dbValue: string | null, newValue: string) => {
        if ((dbValue || "").trim() !== newValue.trim()) {
            auditLogs.push({
                student_id: payload.studentId,
                school_year_id: payload.schoolYearId,
                field_changed: fieldKey,
                old_value: dbValue,
                new_value: newValue,
                edited_by: payload.editedBy
            });
        }
    };

    checkAndLog("first_name", currentStudent.first_name, payload.firstName);
    checkAndLog("last_name", currentStudent.last_name, payload.lastName);
    checkAndLog("grade_level", historicalGradeLevel, payload.gradeLevel);
    // checkAndLog("section_name", currentStudent.section_name, payload.classroomSection);
    // checkAndLog("advisor_name", currentStudent.advisor_name, payload.facultyAdvisor);

    // 5. Batch insert into your existing audit_students table if edits occurred
    if (auditLogs.length > 0) {
        const { error: auditError } = await supabase
            .from("audit_students")
            .insert(auditLogs);

        if (auditError) {
            console.error("Non-blocking warning: Audit log tracks failed to record:", auditError);
        }
    }
}