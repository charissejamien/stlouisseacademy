"use server";

import { createClient } from "@/lib/supabase/server";

export interface DCPRSummaryLog {
    id: string; 
    date: string;
    totalCashCollected: number;
    totalPaymentsCount: number;
    isVerifiedByOwner: boolean;
}

export interface PaymentRowItem {
    id: string;
    studentName: string;   // ✅ Swapped to prioritize individual student profile
    orNumber: string;
    allocation: string;    // ✅ Entrance Fee, May Installment, etc.
    amount: number;
    parentTotalCollection: number; // For grouping multi-item receipts cleanly
}

// 📡 Action 1: Query list of all operational payment dates and verification statuses
export async function getDCPRHistorySummaries(): Promise<DCPRSummaryLog[]> {
    const supabase = await createClient();

    const { data: payments, error: paymentError } = await supabase
        .from("payments")
        .select("amount, created_at, or_number")
        .order("created_at", { ascending: false });

    if (paymentError) throw new Error(paymentError.message);
    if (!payments || payments.length === 0) return [];

    const { data: verifications, error: verificationError } = await supabase
        .from("dcpr_verifications")
        .select("collection_date, is_verified");

    if (verificationError) throw new Error(verificationError.message);

    const verificationMap: Record<string, boolean> = {};
    verifications?.forEach(v => {
        if (v.collection_date) {
            const formattedVerDate = new Date(v.collection_date).toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric"
            });
            verificationMap[formattedVerDate] = !!v.is_verified;
        }
    });

    const groups: Record<string, { totalAmount: number; count: Set<string> }> = {};

    payments.forEach((payment) => {
        const dateStr = new Date(payment.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });

        if (!groups[dateStr]) {
            groups[dateStr] = {
                totalAmount: 0,
                count: new Set()
            };
        }

        groups[dateStr].totalAmount += Number(payment.amount || 0);
        groups[dateStr].count.add(payment.or_number);
    });

    return Object.keys(groups).map((dateKey) => ({
        id: dateKey,
        date: dateKey,
        totalCashCollected: groups[dateKey].totalAmount,
        totalPaymentsCount: groups[dateKey].count.size,
        isVerifiedByOwner: !!verificationMap[dateKey] 
    }));
}

// 📡 Action 2: Query real-time transactional line items filtered by target date
export async function getDPRRowsByDate(dateString: string): Promise<PaymentRowItem[]> {
    const supabase = await createClient();

    const { data: payments, error } = await supabase
        .from("payments")
        .select(`
            id,
            amount,
            or_number,
            billing_period,
            created_at,
            students (
                first_name,
                last_name
            )
        `);

    if (error) throw new Error(error.message);
    if (!payments) return [];

    // Filter array to only extract rows from the clicked report date index
    const filteredPayments = payments.filter((payment) => {
        const checkDate = new Date(payment.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
        return checkDate === dateString;
    });

    // Compute the parent receipt compound total groups for clean rowSpan groupings
    const orTotals: Record<string, number> = {};
    filteredPayments.forEach(p => {
        orTotals[p.or_number] = (orTotals[p.or_number] || 0) + Number(p.amount || 0);
    });

    return filteredPayments.map((p: any) => {
        const studentData = p.students;
        const studentFullName = studentData 
            ? `${studentData.first_name} ${studentData.last_name}` 
            : "Student Profile Detached";

        return {
            id: p.id,
            studentName: studentFullName, 
            orNumber: p.or_number,
            allocation: p.billing_period || "General Fees", // Displays targeted dynamic allocation month / tag name
            amount: Number(p.amount || 0),
            parentTotalCollection: orTotals[p.or_number]
        };
    });
}