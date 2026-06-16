    "use server";

import { createClient } from "@/lib/supabase/server";

export interface RapidEnrollmentPayload {
    studentIdNumber: string; // The identifier from your doc
    firstName: string;
    lastName: string;
    gradeLevel: string;
    enrollmentFeePaid: number; // For your financial cross-checking
}


export async function rapidEnrollStudent(payload: RapidEnrollmentPayload) {
    const supabase = await createClient();

    // 1. Insert the student row with zero parent or hardware requirements
    const { data: student, error: studentError } = await supabase
        .from("students")
        .insert({
            student_id: payload.studentIdNumber.trim(),
            first_name: payload.firstName.trim(),
            last_name: payload.lastName.trim(),
            grade_level: payload.gradeLevel,
            parent_id: null,      // Explicitly unlinked for now
            rfid_tag_id: null     // Configured later at the gate/desk
        })
        .select("id")
        .single();

    if (studentError) {
        console.error("Failed rapid student insertion:", studentError);
        throw new Error(`Directory insertion failed: ${studentError.message}`);
    }

    // 2. Immediately log the payment transaction to capture the financial footprint
    const { error: paymentError } = await supabase
        .from("payments") // Adjust table name to match your ledger schema
        .insert({
            student_id: student.id,
            amount: payload.enrollmentFeePaid,
            payment_type: "Enrollment Fee",
            status: "Cleared",
            remarks: "Migrated from ongoing manual enrollment log sheets"
        });

    if (paymentError) {
        console.error("Failed to log accompanying financial record:", paymentError);
        throw new Error(`Student created, but payment log failed: ${paymentError.message}`);
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
        .update({ parent_id: parentId })
        .in("id", studentIds); // Batch updates every ID in the array instantly

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