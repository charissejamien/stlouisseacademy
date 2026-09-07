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
  suffix: string | null;
  gender: string;
  date_of_birth: string | null;
  lrn: string | null;
  address: string | null;

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

interface SectionJoin {
  name: string;
}

interface EnrollmentJoin {
  grade_level: string;
  student_type: string;
  isESC: boolean | null;
  created_at: string;
  school_years: SchoolYearJoin | null;
  sections: SectionJoin | null;
}

interface AccountDiscountSnapshotJoin {
  discount_id: string;
  snapshot_name: string;
  snapshot_rate: number;
}

interface StudentAccountCardJoin {
  id: string;
  base_tuition: number | null;
  miscellaneous: number | null;
  adjusted_base_tuition: number | null;
  adjusted_miscellaneous: number | null;
  adjusted_total_tuition_fee: number | null;

  total_books_fee: number | null;

  // Newly stored reconciliation values
  total_tuition_paid: number | null;
  total_books_paid: number | null;
  total_aircon_paid: number | null;
  tuition_balance: number | null;
  books_balance: number | null;

  school_years: SchoolYearJoin | null;
  student_account_discounts: AccountDiscountSnapshotJoin[] | null;
}

interface SupabaseStudentProfileQueryResult {
  id: string;
  student_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix: string | null;
  gender: string | null;
  date_of_birth: string | null;
  lrn: string | null;
  address: string | null;
  created_at: string;

  enrollments: EnrollmentJoin[] | null;
  student_account_card: StudentAccountCardJoin[] | null;
  payments: PaymentJoin[] | null;
}

export async function getStudentById(
  studentUUID: string,
): Promise<CompleteStudentProfile> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .select(
      `
        id,
        student_id,
        first_name,
        middle_name,
        last_name,
        suffix,
        gender,
        date_of_birth,
        lrn,
        address,
        created_at,

        enrollments (
            grade_level,
            student_type,
            isESC,
            created_at,
            school_years (
                is_active
            ),
            sections (
                section_name
            )
        ),

        student_account_card (
            id,
            base_tuition,
            miscellaneous,
            adjusted_base_tuition,
            adjusted_miscellaneous,
            adjusted_total_tuition_fee,
            total_books_fee,
            total_tuition_paid,
            total_books_paid,
            total_aircon_paid,
            tuition_balance,
            books_balance,
            school_years (
                is_active
            ),
            student_account_discounts (
                id,
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
      `,
    )
    .eq("id", studentUUID);

  if (error) {
    throw new Error(`Failed to fetch student: ${error.message}`);
  }

  const studentRow = data?.[0];

  if (!studentRow) {
    throw new Error("Student not found.");
  }

  const student = studentRow as unknown as SupabaseStudentProfileQueryResult;

  // --------------------------------------------------
  // ACTIVE ENROLLMENT
  // --------------------------------------------------

  const activeEnrollment =
    student.enrollments?.find((e) => e.school_years?.is_active === true) ??
    student.enrollments?.[0];

  // --------------------------------------------------
  // ACTIVE ACCOUNT CARD
  // --------------------------------------------------

  const activeAssessment =
    student.student_account_card?.find(
      (a) => a.school_years?.is_active === true,
    ) ?? student.student_account_card?.[0];

  // --------------------------------------------------
  // BASIC STUDENT / ENROLLMENT INFORMATION
  // --------------------------------------------------

  const currentGradeLevel = activeEnrollment?.grade_level ?? "Unassigned";

  const sectionName = activeEnrollment?.sections?.name ?? "Unassigned Room";

  const enrollmentDateSource =
    activeEnrollment?.created_at ?? student.created_at;

  // --------------------------------------------------
  // TUITION ASSESSMENT
  // --------------------------------------------------

  const baseTuition = Number(activeAssessment?.base_tuition ?? 0);

  const miscellaneousFees = Number(activeAssessment?.miscellaneous ?? 0);

  const grossTuitionTotal = baseTuition + miscellaneousFees;

  const adjustedBase = Number(
    activeAssessment?.adjusted_base_tuition ?? baseTuition,
  );

  const adjustedMisc = Number(
    activeAssessment?.adjusted_miscellaneous ?? miscellaneousFees,
  );

  const finalTuitionAssessment = Number(
    activeAssessment?.adjusted_total_tuition_fee ?? adjustedBase + adjustedMisc,
  );

  const totalDiscountsDeducted = Math.max(
    0,
    grossTuitionTotal - finalTuitionAssessment,
  );

  // --------------------------------------------------
  // BOOKS ASSESSMENT
  // --------------------------------------------------

  const totalBooksAssessment = Number(activeAssessment?.total_books_fee ?? 0);

  // --------------------------------------------------
  // DISCOUNTS
  // --------------------------------------------------

  const activeDiscounts = activeAssessment?.student_account_discounts ?? [];

  const discountDescriptions: string[] = [];

  if (activeEnrollment?.isESC) {
    discountDescriptions.push("ESC Subsidy");
  }

  for (const d of activeDiscounts) {
    discountDescriptions.push(`${d.snapshot_name} (${d.snapshot_rate}%)`);
  }

  const discountSummaryText =
    discountDescriptions.length > 0
      ? discountDescriptions.join(", ")
      : "None Applied";

  const appliedDiscountIds = activeDiscounts.map((d) => d.discount_id);

  // --------------------------------------------------
  // PAYMENT TOTALS
  //
  // IMPORTANT:
  // These are now READ directly from
  // student_account_card.
  //
  // The reconciliation function is responsible
  // for calculating and storing them.
  // --------------------------------------------------

  const totalPaid = Number(activeAssessment?.total_tuition_paid ?? 0);

  const totalBooksPaid = Number(activeAssessment?.total_books_paid ?? 0);

  const tuitionBalance = Number(activeAssessment?.tuition_balance ?? 0);

  const booksBalance = Number(activeAssessment?.books_balance ?? 0);

  // Total remaining balance across tuition + books
  const balanceRemaining = tuitionBalance + booksBalance;

  // --------------------------------------------------
  // TRANSACTIONS
  //
  // We still get payments here because the UI needs
  // the individual transaction history.
  //
  // We are NOT using them to calculate balances.
  // --------------------------------------------------

  const payments = student.payments ?? [];

  const transactions: TransactionRow[] = payments.map((payment) => ({
    id: payment.or_number ?? `OR-${payment.id.slice(0, 4).toUpperCase()}`,

    context: payment.payment_specifics ?? "Enrollment Fee",

    amount: Number(payment.amount ?? 0),

    date: new Date(payment.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),

    method: payment.mode_of_payment ?? "Cash",
  }));

  // --------------------------------------------------
  // RETURN COMPLETE PROFILE
  // --------------------------------------------------

  return {
    id: student.id,
    student_id: student.student_id,

    first_name: student.first_name,
    middle_name: student.middle_name,
    last_name: student.last_name,
    suffix: student.suffix,

    gender: student.gender ?? "Not Specified",

    date_of_birth: student.date_of_birth
      ? new Date(student.date_of_birth).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null,

    lrn: student.lrn,
    address: student.address,

    grade_level: currentGradeLevel,
    section_name: sectionName,
    advisor_name: "Not Assigned",

    date_enrolled: new Date(enrollmentDateSource).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),

    classification: activeEnrollment?.student_type ?? "Regular",

    // Tuition assessment
    base_tuition: baseTuition,
    miscellaneous_fees: miscellaneousFees,
    gross_tuition_total: grossTuitionTotal,

    total_discounts_deducted: totalDiscountsDeducted,

    discount_summary_text: discountSummaryText,

    applied_discount_ids: appliedDiscountIds,

    total_assessment: finalTuitionAssessment,

    // Stored payment totals
    total_paid: totalPaid,
    tuition_balance: tuitionBalance,

    // Books
    total_books_fee: totalBooksAssessment,
    total_books_paid: totalBooksPaid,
    books_balance: booksBalance,

    // Overall remaining balance
    balance_remaining: balanceRemaining,

    // Individual payment history
    transactions,
  };
}
