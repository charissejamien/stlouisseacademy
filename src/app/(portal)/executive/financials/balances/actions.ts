"use server";

import { createClient } from "@/lib/supabase/server";

export interface StudentListItem {
    id: string;
    fullName: string;
    feeAmount: number;
    amountPaid: number;
    isFullyPaid: boolean;
}

export interface GradeSummaryGroup {
    gradeLevel: string;
    totalAssessed: number;
    totalCollected: number;
    totalOutstanding: number;
    students: StudentListItem[];
}

export interface DashboardSummaryMetrics {
    booksAssessed: number;
    booksCollected: number;
    booksOutstanding: number;
    tuitionAssessed: number;
    tuitionCollected: number;
    tuitionOutstanding: number;
    combinedAssessed: number;
    combinedCollected: number;
    combinedOutstanding: number;
}

interface JoinedStudentData {
    first_name: string;
    last_name: string;
}

// 🌟 FIX: Define a strict type for the account card rows to remove the 'any' ESLint block
interface AccountCardRow {
    student_id: string | null;
    total_books_fee?: number | null;
    total_tuition_fee?: number | null;
}

/**
 * Shared internal processor to handle modular code structure for both ledger fields.
 */
async function getGroupedLedgerData(
    activeSchoolYearId: string, 
    feeColumn: "total_books_fee" | "total_tuition_fee", 
    isTuitionMode: boolean,
    targetGrades: string[] // Pass allowed grades dynamically down
): Promise<Record<string, GradeSummaryGroup>> {
    const supabase = await createClient();

    const [accountsResult, enrollmentsResult, paymentsResult] = await Promise.all([
        supabase.from("student_account_card").select(`student_id, ${feeColumn}`),
        supabase.from("enrollments").select(`student_id, grade_level, students (first_name, last_name)`).eq("school_year_id", activeSchoolYearId),
        supabase.from("payments").select("student_id, amount, payment_specifics")
    ]);

    if (accountsResult.error || enrollmentsResult.error || paymentsResult.error) {
        throw new Error(`Failed to synchronize unified financial data metrics.`);
    }

    const studentPaymentsMap = new Map<string, number>();
    
    (paymentsResult.data || []).forEach((payment) => {
        if (!payment.student_id) return;
        const specifics = payment.payment_specifics ? payment.payment_specifics.toString().trim() : "";
        const isBooksPayment = /books/i.test(specifics);

        if (isTuitionMode && !isBooksPayment) {
            const currentPaid = studentPaymentsMap.get(payment.student_id) || 0;
            studentPaymentsMap.set(payment.student_id, currentPaid + Number(payment.amount || 0));
        } else if (!isTuitionMode && isBooksPayment) {
            const currentPaid = studentPaymentsMap.get(payment.student_id) || 0;
            studentPaymentsMap.set(payment.student_id, currentPaid + Number(payment.amount || 0));
        }
    });

    const feesMap = new Map<string, number>();
    
    // 🎯 ESLINT FIX: Cast data accurately as an array of AccountCardRow instead of using 'any'
    const accountRows = accountsResult.data as unknown as AccountCardRow[] | null;
    (accountRows || []).forEach((card) => {
        if (card.student_id) {
            const feeValue = Number(card[feeColumn] || 0);
            feesMap.set(card.student_id, feeValue);
        }
    });

    const groups: Record<string, GradeSummaryGroup> = {};
    targetGrades.forEach((grade) => {
        groups[grade] = {
            gradeLevel: grade.match(/^\d+$/) ? `Grade ${grade}` : grade,
            totalAssessed: 0,
            totalCollected: 0,
            totalOutstanding: 0,
            students: []
        };
    });

    (enrollmentsResult.data || []).forEach((row) => {
        if (!row.student_id || !row.grade_level) return;
        const rawGrade = row.grade_level.toString().trim();
        
        const dynamicLookupKey = targetGrades.find(
            g => g.toLowerCase() === rawGrade.toLowerCase() || `grade ${g}`.toLowerCase() === rawGrade.toLowerCase()
        );

        if (!dynamicLookupKey) return;

        const studentInfo = row.students as unknown as JoinedStudentData | null;
        const studentName = studentInfo ? `${studentInfo.last_name}, ${studentInfo.first_name}` : "Unknown Student";
        
        const feeAmount = feesMap.get(row.student_id) || 0;
        const amountPaid = studentPaymentsMap.get(row.student_id) || 0;
        const balance = feeAmount - amountPaid;
        const isFullyPaid = feeAmount > 0 && amountPaid >= feeAmount;

        groups[dynamicLookupKey].totalAssessed += feeAmount;
        groups[dynamicLookupKey].totalCollected += amountPaid;
        groups[dynamicLookupKey].totalOutstanding += balance > 0 ? balance : 0;
        groups[dynamicLookupKey].students.push({
            id: row.student_id,
            fullName: studentName,
            feeAmount,
            amountPaid,
            isFullyPaid
        });
    });

    targetGrades.forEach((g) => {
        groups[g].students.sort((a, b) => a.fullName.localeCompare(b.fullName));
    });

    return groups;
}

export async function getBooksFeeByGradeGrouped(activeSchoolYearId: string) {
    const elementaryGrades = ["Nursery", "Pre-Kindergarten", "Kindergarten", "1", "2", "3", "4", "5", "6"];
    return getGroupedLedgerData(activeSchoolYearId, "total_books_fee", false, elementaryGrades);
}

export async function getTuitionFeeByGradeGrouped(activeSchoolYearId: string) {
    // 🎯 INCLUDES HIGH SCHOOL GRADES: Added 7, 8, 9, 10 for Tuition mappings
    const tuitionGrades = ["Nursery", "Pre-Kindergarten", "Kindergarten", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    return getGroupedLedgerData(activeSchoolYearId, "total_tuition_fee", true, tuitionGrades);
}

export async function getDashboardSummaryMetrics(activeSchoolYearId: string): Promise<DashboardSummaryMetrics> {
    const [booksData, tuitionData] = await Promise.all([
        getBooksFeeByGradeGrouped(activeSchoolYearId),
        getTuitionFeeByGradeGrouped(activeSchoolYearId)
    ]);

    let booksAssessed = 0, booksCollected = 0, booksOutstanding = 0;
    let tuitionAssessed = 0, tuitionCollected = 0, tuitionOutstanding = 0;

    Object.values(booksData).forEach(g => {
        booksAssessed += g.totalAssessed;
        booksCollected += g.totalCollected;
        booksOutstanding += g.totalOutstanding;
    });

    Object.values(tuitionData).forEach(g => {
        tuitionAssessed += g.totalAssessed;
        tuitionCollected += g.totalCollected;
        tuitionOutstanding += g.totalOutstanding;
    });

    return {
        booksAssessed,
        booksCollected,
        booksOutstanding,
        tuitionAssessed,
        tuitionCollected,
        tuitionOutstanding,
        combinedAssessed: booksAssessed + tuitionAssessed,
        combinedCollected: booksCollected + tuitionCollected,
        combinedOutstanding: booksOutstanding + tuitionOutstanding
    };
}