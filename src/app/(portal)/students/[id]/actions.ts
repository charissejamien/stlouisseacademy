"use server";

import { createClient } from "@/lib/supabase/server";

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

    total_discounts_deducted: number;
    discount_summary_text: string;
    applied_discount_ids: string[];

    total_assessment: number;

    total_paid: number;
    tuition_balance: number;

    total_books_fee: number;
    total_books_paid: number;
    books_balance: number;

    balance_remaining: number;

    transactions: TransactionRow[];
}

interface PaymentJoin {
    id: string;
    or_number: string | null;
    amount: number | null;
    mode_of_payment: string | null;
    created_at: string;
    payment_specifics: string | null;
}

interface SchoolYearJoin {
    is_active: boolean;
}

interface EnrollmentJoin {
    grade_level: string;
    student_type: string;
    isESC: boolean | null;
    school_years: SchoolYearJoin | null;
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

interface SupabaseStudentProfileQueryResult {
    id: string;
    student_id: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    gender: string | null;
    created_at: string;

    enrollments: EnrollmentJoin[] | null;
    student_account_card: StudentAccountCardJoin[] | null;
    payments: PaymentJoin[] | null;
}

export async function getStudentById(
    studentUUID: string
): Promise<CompleteStudentProfile> {
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
                    school_years (
                        is_active
                    )
                ),

                student_account_card (
                    id,
                    total_tuition_fee,
                    total_books_fee,

                    school_years (
                        is_active
                    ),

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
            .eq("category", "Subsidy"),
    ]);

    if (profileResult.error) {
        throw new Error(
            `Failed to fetch student: ${profileResult.error.message}`
        );
    }

    if (!profileResult.data) {
        throw new Error("Student not found.");
    }

    const student =
        profileResult.data as unknown as SupabaseStudentProfileQueryResult;

    const activeEnrollment =
        student.enrollments?.find(
            (enrollment) => enrollment.school_years?.is_active === true
        ) ?? student.enrollments?.[0];

    const activeAssessment =
        student.student_account_card?.find(
            (account) => account.school_years?.is_active === true
        ) ?? student.student_account_card?.[0];

    const currentGradeLevel =
        activeEnrollment?.grade_level ?? "Unassigned";

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
            miscellaneousFees = Number(
                feeStructure.miscellaneous ?? 0
            );
        } else {
            baseTuition = Number(
                activeAssessment?.total_tuition_fee ?? 0
            );
        }
    } else {
        baseTuition = Number(
            activeAssessment?.total_tuition_fee ?? 0
        );
    }

    const grossTuitionTotal =
        baseTuition + miscellaneousFees;

    // --------------------------------------------------
    // ESC subsidy
    // --------------------------------------------------

    const escSubsidyRecord = (subsidyResult.data ?? []).find(
        (subsidy) => /esc/i.test(subsidy.name ?? "")
    );

    const escSubsidyAmount = escSubsidyRecord
        ? Number(escSubsidyRecord.amount ?? 0)
        : 9000;

    const escDeduction = activeEnrollment?.isESC
        ? Math.min(grossTuitionTotal, escSubsidyAmount)
        : 0;

    // --------------------------------------------------
    // Account discounts
    // --------------------------------------------------

    const activeDiscounts =
        activeAssessment?.student_account_discounts ?? [];

    const discountPercentage =
        activeDiscounts.reduce(
            (total, discount) =>
                total + Number(discount.snapshot_rate ?? 0),
            0
        );

    // Apply percentage discounts after ESC
    const tuitionAfterEsc =
        Math.max(0, grossTuitionTotal - escDeduction);

    const percentageDiscountAmount =
        tuitionAfterEsc * (discountPercentage / 100);

    const totalDiscountsDeducted =
        escDeduction + percentageDiscountAmount;

    // --------------------------------------------------
    // Final assessment
    // --------------------------------------------------

    const finalTuitionAssessment =
        Math.max(
            0,
            tuitionAfterEsc - percentageDiscountAmount
        );

    const totalBooksAssessment =
        Number(activeAssessment?.total_books_fee ?? 0);

    const payments = student.payments ?? [];

    const tuitionPayments = payments.filter(
        (payment) =>
            !payment.payment_specifics
                ?.toLowerCase()
                .includes("book")
    );

    const bookPayments = payments.filter(
        (payment) =>
            payment.payment_specifics
                ?.toLowerCase()
                .includes("book")
    );

    const totalPaid = tuitionPayments.reduce(
        (total, payment) =>
            total + Number(payment.amount ?? 0),
        0
    );

    const totalBooksPaid = bookPayments.reduce(
        (total, payment) =>
            total + Number(payment.amount ?? 0),
        0
    );


    const tuitionBalance = Math.max(
        0,
        finalTuitionAssessment - totalPaid
    );

    const booksBalance = Math.max(
        0,
        totalBooksAssessment - totalBooksPaid
    );

    const balanceRemaining =
        tuitionBalance + booksBalance;

    const discountDescriptions: string[] = [];

    if (escDeduction > 0) {
        discountDescriptions.push(
            `ESC Subsidy (₱${escDeduction.toLocaleString()}`
        );
    }

    for (const discount of activeDiscounts) {
        discountDescriptions.push(
            `${discount.snapshot_name} (${discount.snapshot_rate}%)`
        );
    }

    const discountSummaryText =
        discountDescriptions.length > 0
            ? discountDescriptions.join(", ")
            : "None Applied";

    const appliedDiscountIds =
        activeDiscounts.map(
            (discount) => discount.discount_id
        );

    const transactions: TransactionRow[] =
        payments.map((payment) => ({
            id:
                payment.or_number ??
                `OR-${payment.id.slice(0, 4).toUpperCase()}`,

            context:
                payment.payment_specifics ??
                "Enrollment Fee",

            amount: Number(payment.amount ?? 0),

            date: new Date(
                payment.created_at
            ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),

            method:
                payment.mode_of_payment ??
                "Cash",
        }));

    return {
        id: student.id,
        student_id: student.student_id,

        first_name: student.first_name,
        middle_name: student.middle_name,
        last_name: student.last_name,

        gender:
            student.gender ??
            "Not Specified",

        grade_level: currentGradeLevel,

        section_name:
            "Unassigned Room",

        advisor_name:
            "No Advisor Linked",

        date_enrolled:
            new Date(student.created_at).toLocaleDateString(
                "en-US",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }
            ),

        classification:
            activeEnrollment?.student_type ??
            "Regular",

        base_tuition: baseTuition,

        miscellaneous_fees:
            miscellaneousFees,

        gross_tuition_total:
            grossTuitionTotal,

        total_discounts_deducted:
            totalDiscountsDeducted,

        discount_summary_text:
            discountSummaryText,

        applied_discount_ids:
            appliedDiscountIds,

        total_assessment:
            finalTuitionAssessment,

        total_paid:
            totalPaid,

        tuition_balance:
            tuitionBalance,

        total_books_fee:
            totalBooksAssessment,

        total_books_paid:
            totalBooksPaid,

        books_balance:
            booksBalance,

        balance_remaining:
            balanceRemaining,

        transactions,
    };
}