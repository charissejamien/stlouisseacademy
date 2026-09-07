"use server";

import { createClient } from "@/lib/supabase/server";

export interface StudentFinancialRow {
  id: string;
  student_id: string;

  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix: string | null;

  grade_level: string;
  section_name: string;

  base_tuition: number;
  miscellaneous: number;
  total_tuition_fee: number;

  adjusted_base_tuition: number;
  adjusted_miscellaneous: number;
  adjusted_total_tuition_fee: number;

  total_tuition_paid: number;
  tuition_balance: number;

  total_books_fee: number;
  total_books_paid: number;
  books_balance: number;

  total_aircon_paid: number;

  balance_remaining: number;
}

interface SchoolYearJoin {
  is_active: boolean;
}

interface SectionJoin {
  section_name: string;
}

interface EnrollmentJoin {
  grade_level: string;
  student_type: string;
  isESC: boolean | null;
  created_at: string;
  school_years: SchoolYearJoin | null;
  sections: SectionJoin | null;
}

interface StudentAccountCardJoin {
  id: string;

  base_tuition: number | null;
  miscellaneous: number | null;

  adjusted_base_tuition: number | null;
  adjusted_miscellaneous: number | null;
  adjusted_total_tuition_fee: number | null;

  total_books_fee: number | null;

  // Reconciled payment totals
  total_tuition_paid: number | null;
  total_books_paid: number | null;
  total_aircon_paid: number | null;

  // Reconciled balances
  tuition_balance: number | null;
  books_balance: number | null;

  school_years: SchoolYearJoin | null;
}

interface SupabaseStudentFinancialQueryResult {
  id: string;
  student_id: string;

  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix: string | null;

  enrollments: EnrollmentJoin[] | null;

  student_account_card: StudentAccountCardJoin[] | null;
}

export async function getAllStudentsFinancials(): Promise<
  StudentFinancialRow[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("students").select(
    `
        id,
        student_id,
        first_name,
        middle_name,
        last_name,
        suffix,

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
          )
        )
      `,
  );

  if (error) {
    throw new Error(`Failed to fetch student financials: ${error.message}`);
  }

  const students = (data ??
    []) as unknown as SupabaseStudentFinancialQueryResult[];

  return students.map((student) => {
    /*
     * ----------------------------------------
     * ACTIVE ENROLLMENT
     * ----------------------------------------
     */

    const activeEnrollment =
      student.enrollments?.find(
        (enrollment) => enrollment.school_years?.is_active === true,
      ) ?? student.enrollments?.[0];

    /*
     * ----------------------------------------
     * ACTIVE ACCOUNT CARD
     * ----------------------------------------
     */

    const activeAssessment =
      student.student_account_card?.find(
        (account) => account.school_years?.is_active === true,
      ) ?? student.student_account_card?.[0];

    /*
     * ----------------------------------------
     * BASIC STUDENT INFO
     * ----------------------------------------
     */

    const gradeLevel = activeEnrollment?.grade_level ?? "Unassigned";

    const sectionName =
      activeEnrollment?.sections?.section_name ?? "Unassigned";

    /*
     * ----------------------------------------
     * ORIGINAL TUITION
     * ----------------------------------------
     */

    const baseTuition = Number(activeAssessment?.base_tuition ?? 0);

    const miscellaneous = Number(activeAssessment?.miscellaneous ?? 0);

    const totalTuitionFee = baseTuition + miscellaneous;

    const adjustedBaseTuition = Number(
      activeAssessment?.adjusted_base_tuition ?? baseTuition,
    );

    const adjustedMiscellaneous = Number(
      activeAssessment?.adjusted_miscellaneous ?? miscellaneous,
    );

    const adjustedTotalTuitionFee = Number(
      activeAssessment?.adjusted_total_tuition_fee ??
        adjustedBaseTuition + adjustedMiscellaneous,
    );

    const totalBooksFee = Number(activeAssessment?.total_books_fee ?? 0);

    const totalTuitionPaid = Number(activeAssessment?.total_tuition_paid ?? 0);

    const totalBooksPaid = Number(activeAssessment?.total_books_paid ?? 0);

    const totalAirconPaid = Number(activeAssessment?.total_aircon_paid ?? 0);

    const tuitionBalance = Number(activeAssessment?.tuition_balance ?? 0);

    const booksBalance = Number(activeAssessment?.books_balance ?? 0);

    const balanceRemaining = tuitionBalance + booksBalance;

    return {
      id: student.id,
      student_id: student.student_id,

      first_name: student.first_name,
      middle_name: student.middle_name,
      last_name: student.last_name,
      suffix: student.suffix,

      grade_level: gradeLevel,
      section_name: sectionName,

      base_tuition: baseTuition,
      miscellaneous: miscellaneous,
      total_tuition_fee: totalTuitionFee,

      adjusted_base_tuition: adjustedBaseTuition,

      adjusted_miscellaneous: adjustedMiscellaneous,

      adjusted_total_tuition_fee: adjustedTotalTuitionFee,

      total_tuition_paid: totalTuitionPaid,

      tuition_balance: tuitionBalance,

      total_books_fee: totalBooksFee,

      total_books_paid: totalBooksPaid,

      books_balance: booksBalance,

      total_aircon_paid: totalAirconPaid,

      balance_remaining: balanceRemaining,
    };
  });
}
