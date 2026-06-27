"use server";

import { createClient } from "@/lib/supabase/server";

// 📄 Strict Type Interface Mapping for your audit_students table data contract
export interface StudentAuditLogRecord {
    id: string; // int8 row tracker id sequence
    student_id: string;
    school_year_id: string;
    field_changed: string;
    old_value: string | null;
    new_value: string;
    edited_by: string;
    created_at: string;
}

// 📄 Strict Type Interface Mapping for your audit_payments table data contract
export interface PaymentAuditLogRecord {
    id: string; // int8 row tracker id sequence
    student_id: string;
    school_year_id: string;
    action_taken: "INSERT" | "UPDATE" | "DELETE";
    or_number: string;
    amount_before: number | null;
    amount_after: number;
    edited_by: string;
    created_at: string;
}

/**
 * Retrieves the complete chronological history checklist from the audit_students database table.
 * Sorted descendingly by created_at time bounds to show latest edits first.
 */
export async function getStudentAuditLogs(): Promise<StudentAuditLogRecord[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("audit_students")
        .select("id, student_id, school_year_id, field_changed, old_value, new_value, edited_by, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Database query exception retrieving student log matrices:", error);
        throw new Error(`Failed to synchronize student log data strings: ${error.message}`);
    }

    return data || [];
}

/**
 * Retrieves the complete chronological history checklist from the audit_payments database table.
 * Sorted descendingly by created_at time bounds to show latest edits first.
 */
export async function getPaymentAuditLogs(): Promise<PaymentAuditLogRecord[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("audit_payments")
        .select("id, student_id, school_year_id, action_taken, or_number, amount_before, amount_after, edited_by, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Database query exception retrieving financial ledger log matrices:", error);
        throw new Error(`Failed to synchronize payment log data strings: ${error.message}`);
    }

    return data || [];
}
