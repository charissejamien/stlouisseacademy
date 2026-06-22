"use server";

import { createClient } from "@/lib/supabase/server";

export interface RapidEnrollmentPayload {
    studentIdNumber: string; 
    firstName: string;
    lastName: string;
    gradeLevel: string;
    enrollmentFeePaid: number; // Downpayment value context
    tuitionTotalAssessment: number; // Gross tuition pricing tier context
    booksTotalAssessment: number;   // ✅ Added gross book value pricing context
}

export async function rapidEnrollStudent(payload: RapidEnrollmentPayload) {
    const supabase = await createClient();

    // 1. Fetch the institutional runtime timeline to ensure proper relation binding
    const { data: activeSY, error: syError } = await supabase
        .from("school_years")
        .select("id")
        .eq("is_active", true)
        .single();

    if (syError || !activeSY) {
        throw new Error("Could not find an active school year for baseline financial routing reference.");
    }

    const targetTimestamp = new Date().toISOString();

    // 2. Insert the student row with zero parent or hardware requirements
    const { data: student, error: studentError } = await supabase
        .from("students")
        .insert({
            student_id: payload.studentIdNumber.trim(),
            first_name: payload.firstName.trim(),
            last_name: payload.lastName.trim(),
            parent: null,         // Explicitly unlinked for staging mode
            created_at: targetTimestamp 
        })
        .select("id")
        .single();

    if (studentError || !student) {
        console.error("Failed rapid student insertion:", studentError);
        throw new Error(`Directory insertion failed: ${studentError?.message || "Record not returned"}`);
    }

    // 3. Log the historical enrollment context mapping metadata row
    const { error: enrollmentError } = await supabase
        .from("enrollments")
        .insert({
            student_id: student.id,
            school_year_id: activeSY.id,
            grade_level: payload.gradeLevel,
            student_type: "Regular",
            status: "Enrolled",
            created_at: targetTimestamp
        });

    if (enrollmentError) {
        throw new Error(`Student profile saved, but active enrollment block context failed: ${enrollmentError.message}`);
    }

    // 4. 🚀 CRITICAL FIX: Initialize the complete structural fee balance accounting card ledger
    const { error: assessmentError } = await supabase
        .from("student_account_card")
        .insert({
            student_id: student.id,
            school_year_id: activeSY.id,
            total_tuition_fee: payload.tuitionTotalAssessment,
            total_books_fee: payload.booksTotalAssessment, // ✅ Saved safely to database layout column framework
            created_at: targetTimestamp 
        });

    if (assessmentError) {
        throw new Error(`Student created, but initial billing profile parameters failed to bind: ${assessmentError.message}`);
    }

    // 5. Log the accompanying financial remittance parameter
    const { error: paymentError } = await supabase
        .from("payments") 
        .insert({
            student_id: student.id,
            amount: payload.enrollmentFeePaid,
            mode_of_payment: "Cash",
            or_number: `OR-MIG-${payload.studentIdNumber.trim()}`, // Distinguishable migration identification string tag
            billing_period: "Downpayment / Enrollment Fee",
            payment_specifics: "Initial Rapid Enrollment Remittance Verification",
            created_at: targetTimestamp
        });

    if (paymentError) {
        console.error("Failed to log accompanying financial record:", paymentError);
        throw new Error(`Student baseline profile committed, but payment ledger write failed: ${paymentError.message}`);
    }

    return { success: true };
}

export async function linkStudentsToParent(studentIds: string[], parentId: string) {
    const supabase = await createClient();

    if (!studentIds || studentIds.length === 0) {
        throw new Error("No student records selected for linking.");
    }

    const { error } = await supabase
        .from("students")
        .update({ parent: parentId }) // Verified reference match name
        .in("id", studentIds); 

    if (error) {
        console.error("Failed batch parent reconciliation write:", error);
        throw new Error(`Reconciliation failed: ${error.message}`);
    }

    return { success: true };
}

export async function getStagedStudents() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("students")
        .select("id, first_name, last_name")
        .is("parent", null);

    if (error) {
        console.error("Server-side staging fetch failed:", error);
        throw new Error(error.message);
    }

    return data || [];
}