"use client";

import EnrollmentForm from "./EnrollmentForm";

export type EnrollmentClientContainerProps = {
  schoolYears: { id: string; start_year: string; end_year: string }[];
  gradeLevels: { grade_level: string }[];
  billingPeriods: { id: string; period_name: string }[];
  discounts: { id: string; name: string; amount: number }[];
  tuitionFees: {
    grade_level: string;
    base_tuition: number;
    miscellaneous: number;
    total_tuition: number;
  }[];
  books: { id: string; grade_level: string; amount: number }[];
  subsidies: { id: string; subsidy_name: string; amount: number }[];
};

export default function EnrollmentClientContainer({
  schoolYears,
  gradeLevels,
  billingPeriods,
  discounts,
  tuitionFees,
  books,
  subsidies, // Destructure subsidies
}: EnrollmentClientContainerProps) {
  return (
    <div className="h-screen overflow-hidden">
      <div className="w-11/12 max-w-6xl h-full mx-auto py-5 flex flex-col min-h-0">
        <div className="space-y-1 shrink-0 mb-5">
          <h1 className="font-bold text-lg">Enrollment Management</h1>

          <p className="text-sm text-muted-foreground">
            Manage student enrollments and process enrollment requests for new
            students.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
          <EnrollmentForm
            schoolYears={schoolYears}
            gradeLevels={gradeLevels}
            billingPeriods={billingPeriods}
            discounts={discounts}
            tuitionFees={tuitionFees}
            books={books}
            subsidies={subsidies}
          />
        </div>
      </div>
    </div>
  );
}
