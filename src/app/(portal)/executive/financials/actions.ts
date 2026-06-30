"use server";

import { createClient } from "@/lib/supabase/server";

// ==========================================
// CLIENT RESPONSE EXPORT INTERFACES
// ==========================================

export interface FinancialSummaryMetrics {
    grossAssessed: number;
    totalCollected: number;
    outstandingReceivables: number;
    efficiencyRate: number;
    unlinkedSiblingsCount: number;
}

export interface GradeTierBreakdown {
    grade: string;
    assessed: number;
    collected: number;
    uncollected: number;
    progress: number;
}

export interface InflowChannelMetrics {
    cashAmount: number;
    cashCount: number;
    gcashAmount: number;
    gcashCount: number;
    bankAmount: number;
    bankCount: number;
}

export interface AuditTransactionRecord {
    id: string;
    parentName: string;
    studentName: string;
    context: string;
    method: string;
    amount: number;
    date: string;
    status: string;
}

export interface ExecutiveFinancialDataset {
    metrics: FinancialSummaryMetrics;
    gradeBreakdown: GradeTierBreakdown[];
    channels: InflowChannelMetrics;
    recentTransactions: AuditTransactionRecord[];
}

// ==========================================
// DATABASE QUERY DEFINITIONS (ANTI-ANY GUARD)
// ==========================================

interface AccountCardRow {
    student_id: string | null;
    total_tuition_fee: number | null;
    total_books_fee: number | null;
}

interface EnrollmentRow {
    student_id: string | null;
    grade_level: string | null;
}

interface NamePayload {
    first_name: string | null;
    last_name: string | null;
}

interface RelationalStudentData {
    first_name: string | null;
    last_name: string | null;
    parent: NamePayload | NamePayload[] | null;
}

interface PaymentRow {
    or_number: string | null;
    amount: number | null;
    mode_of_payment: string | null;
    payment_specifics: string | null;
    created_at: string;
    students: RelationalStudentData | RelationalStudentData[] | null;
}

// ==========================================
// EXECUTIVE LEDGER SERVICE FUNCTION
// ==========================================

/**
 * Compiles a real-time consolidated executive ledger tracking matrix by gathering 
 * metrics across core financial tables referencing your master student UUID.
 */
export async function getExecutiveFinancialOverview(schoolYearId: string): Promise<ExecutiveFinancialDataset> {
    const supabase = await createClient();

    // 1. Execute parallel single-pass lookups across your distinct related tables
    const [accountsResult, enrollmentsResult, paymentsResult] = await Promise.all([
        supabase.from("student_account_card").select("student_id, total_tuition_fee, total_books_fee"),
        supabase.from("enrollments").select("student_id, grade_level").eq("school_year_id", schoolYearId),
        supabase.from("payments").select(`
            or_number, amount, mode_of_payment, payment_specifics, created_at,
            students!inner (
                first_name,
                last_name,
                parent:parent_id (first_name, last_name)
            )
        `).order("created_at", { ascending: false })
    ]);

    // Error Handlers
    if (accountsResult.error || enrollmentsResult.error || paymentsResult.error) {
        console.error("Critical core finance table aggregation failure:", {
            accountsError: accountsResult.error,
            enrollmentsError: enrollmentsResult.error,
            paymentsError: paymentsResult.error
        });
        throw new Error("Failed to synchronize relational ledger layers.");
    }

    const accounts = accountsResult.data as unknown as AccountCardRow[] | null;
    const enrollments = enrollmentsResult.data as unknown as EnrollmentRow[] | null;
    const payments = paymentsResult.data as unknown as PaymentRow[] | null;

    // 2. Map structural lists into quick memory-map lookups using student UUID keys
    const accountMap = new Map<string, { tuition: number; books: number }>();
    accounts?.forEach((acc) => {
        if (acc.student_id) {
            accountMap.set(acc.student_id, {
                tuition: Number(acc.total_tuition_fee || 0),
                books: Number(acc.total_books_fee || 0)
            });
        }
    });

    // 3. Compute High-Level Metrics and Grade-Tier progress arrays simultaneously
    let grossAssessed = 0;
    let totalCollected = 0;
    const gradeMap: Record<string, { assessed: number; collected: number }> = {};

    // Gather total collections directly from your payments table tracking lines
    payments?.forEach((p) => {
        totalCollected += Number(p.amount || 0);
    });

    enrollments?.forEach((enrollment) => {
        const studentUUID = enrollment.student_id;
        if (!studentUUID) return;

        const matchingFees = accountMap.get(studentUUID) || { tuition: 0, books: 0 };
        const totalStudentCost = matchingFees.tuition + matchingFees.books;
        grossAssessed += totalStudentCost;

        const grade = enrollment.grade_level || "Unassigned Track";
        if (!gradeMap[grade]) {
            gradeMap[grade] = { assessed: 0, collected: 0 };
        }
        
        gradeMap[grade].assessed += totalStudentCost;
    });

    const outstandingReceivables = grossAssessed - totalCollected;
    const efficiencyRate = grossAssessed > 0 ? (totalCollected / grossAssessed) * 100 : 0;

    // Build Grade Breakdown Matrix Array
    const gradeBreakdown: GradeTierBreakdown[] = Object.entries(gradeMap).map(([grade, data]) => {
        const collectedEstimation = Math.min(data.assessed, data.assessed * (efficiencyRate / 100));
        const uncollected = data.assessed - collectedEstimation;
        const progress = data.assessed > 0 ? Math.round((collectedEstimation / data.assessed) * 100) : 0;

        return { grade, assessed: data.assessed, collected: collectedEstimation, uncollected, progress };
    }).sort((a, b) => a.grade.localeCompare(b.grade, undefined, { numeric: true, sensitivity: "base" }));

    // 4. Compute Inflow Channels
    let cashAmount = 0, cashCount = 0;
    let gcashAmount = 0, gcashCount = 0;
    let bankAmount = 0, bankCount = 0;

    payments?.forEach((p) => {
        const amt = Number(p.amount || 0);
        const mop = (p.mode_of_payment || "").toLowerCase();

        if (mop.includes("cash") && !mop.includes("g-cash")) {
            cashAmount += amt;
            cashCount++;
        } else if (mop.includes("g-cash") || mop.includes("gcash")) {
            gcashAmount += amt;
            gcashCount++;
        } else {
            bankAmount += amt;
            bankCount++;
        }
    });

    // 5. Parse Recent Transactions Table Contracts safely handling relational objects vs arrays
    const recentTransactions: AuditTransactionRecord[] = (payments || []).map((p) => {
    // Normalize single vs array responses from relational queries
    const baseStudent = p.students;
    const studentInfo: RelationalStudentData | null = Array.isArray(baseStudent) 
        ? baseStudent[0] 
        : baseStudent;

    const baseParent = studentInfo?.parent;
    
    // 🎯 FIX: Add '|| null' at the end of the evaluation string
    const parentInfo: NamePayload | null = Array.isArray(baseParent) 
        ? baseParent[0] 
        : (baseParent || null); 
    
    const studentName = studentInfo?.first_name && studentInfo?.last_name 
        ? `${studentInfo.first_name} ${studentInfo.last_name}` 
        : "System Profile";
        
    const parentName = parentInfo?.first_name && parentInfo?.last_name 
        ? `${parentInfo.first_name} ${parentInfo.last_name}` 
        : "Over-the-counter";

    return {
        id: p.or_number || "N/A",
        parentName,
        studentName,
        context: p.payment_specifics || "School Account Remittance",
        method: p.mode_of_payment || "Cash",
        amount: Number(p.amount || 0),
        date: new Date(p.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        status: "Success"
    };
});

    return {
        metrics: { grossAssessed, totalCollected, outstandingReceivables, efficiencyRate, unlinkedSiblingsCount: 0 },
        gradeBreakdown,
        channels: { cashAmount, cashCount, gcashAmount, gcashCount, bankAmount, bankCount },
        recentTransactions
    };
}