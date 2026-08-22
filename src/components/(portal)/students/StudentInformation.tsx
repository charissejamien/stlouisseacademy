"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  GraduationCap,
  VenusAndMars,
  ShieldCheck,
  UserCheck,
  CalendarDays,
  Tag,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { getStudentById } from "@/app/(portal)/students/[id]/actions";

export default function StudentInformation({
  id,
}: {
  id: string;
}) {
  const {
    data: student,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudentById(id),
    enabled: !!id,
  });

  // ------------------------------------------
  // Loading
  // ------------------------------------------

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-sm text-slate-500">
          Loading student information...
        </p>
      </div>
    );
  }

  // ------------------------------------------
  // Error
  // ------------------------------------------

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="font-semibold text-red-700">
          Failed to load student information.
        </p>

        <p className="mt-1 text-sm text-red-600">
          {error instanceof Error
            ? error.message
            : "Something went wrong."}
        </p>
      </div>
    );
  }

  // ------------------------------------------
  // No student
  // ------------------------------------------

  if (!student) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-500">
          Student not found.
        </p>
      </div>
    );
  }

  // ------------------------------------------
  // Derived values
  // ------------------------------------------

  const fullName = [
    student.last_name,
    ", ",
    student.first_name,
    student.middle_name
      ? ` ${student.middle_name}`
      : "",
  ].join("");

  return (
    <div className="space-y-5">

      {/* ==========================================
          STUDENT PROFILE
      ========================================== */}

      <section>
        <Card className="w-full py-5">
          <CardContent className="flex gap-10">

            {/* Student Avatar / ID */}
            <div className="flex flex-col items-center space-y-3">
              <div className="flex h-35 w-35 items-center justify-center rounded-lg bg-blue-100/70">
                <UserCheck className="h-12 w-12 text-blue-400" />
              </div>

              <h3 className="font-bold text-slate-700">
                ID: {student.student_id}
              </h3>
            </div>

            {/* Student Details */}
            <div className="flex flex-1 flex-col justify-between gap-10 pt-7">

              <div>
                <p className="text-sm text-slate-500">
                  Student Profile
                </p>

                <h2 className="text-2xl font-bold text-slate-800">
                  {fullName}
                </h2>
              </div>

              {/* Student Metadata */}
              <div className="grid grid-cols-4 gap-6">

                {/* Grade */}
                <div className="flex items-start gap-2.5">
                  <GraduationCap className="mt-0.5 h-4 w-4 text-slate-400" />

                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold uppercase text-slate-400">
                      Grade
                    </h4>

                    <p className="truncate text-sm font-semibold text-slate-700">
                      {student.grade_level}
                    </p>
                  </div>
                </div>

                {/* Gender */}
                <div className="flex items-start gap-2.5">
                  <VenusAndMars className="mt-0.5 h-4 w-4 text-slate-400" />

                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold uppercase text-slate-400">
                      Gender
                    </h4>

                    <p className="truncate text-sm font-semibold text-slate-700">
                      {student.gender}
                    </p>
                  </div>
                </div>

                {/* Section */}
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-slate-400" />

                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold uppercase text-slate-400">
                      Section
                    </h4>

                    <p className="truncate text-sm font-semibold text-slate-700">
                      {student.section_name}
                    </p>
                  </div>
                </div>

                {/* Advisor */}
                <div className="flex items-start gap-2.5">
                  <UserCheck className="mt-0.5 h-4 w-4 text-slate-400" />

                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold uppercase text-slate-400">
                      Advisor
                    </h4>

                    <p className="truncate text-sm font-semibold text-slate-700">
                      {student.advisor_name}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </CardContent>
        </Card>
      </section>


      {/* ==========================================
          FINANCIAL INFORMATION
      ========================================== */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* ========================================
            ASSESSMENT CARD
        ======================================== */}

        <section>
          <Card>
            <CardContent className="flex flex-col gap-5 pt-5">

              {/* Enrollment Date */}
              <div className="flex items-center justify-between border-b pb-2 text-xs">
                <span className="font-medium text-slate-400">
                  Enrollment Date:
                </span>

                <span className="flex items-center gap-1 font-bold text-slate-800">
                  <CalendarDays className="h-3.5 w-3.5 text-slate-400" />

                  {student.date_enrolled}
                </span>
              </div>


              {/* Tuition */}
              <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs">

                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  Tuition Fees
                </span>

                {/* Base Tuition */}
                <div className="flex justify-between text-slate-500">
                  <span>Base Tuition:</span>

                  <span className="font-semibold text-slate-700">
                    ₱
                    {student.base_tuition.toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>

                {/* Miscellaneous */}
                <div className="flex justify-between text-slate-500">
                  <span>Miscellaneous Fees:</span>

                  <span className="font-semibold text-slate-700">
                    ₱
                    {student.miscellaneous_fees.toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>


                {/* Discounts */}
                {student.total_discounts_deducted > 0 && (
                  <div className="my-1 flex flex-col gap-1 rounded-lg border border-indigo-100 bg-white/80 p-2 text-[11px]">

                    <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-indigo-600">
                      <Tag className="h-2.5 w-2.5 text-indigo-500" />

                      <span>
                        Discounts Applied
                      </span>
                    </div>

                    <p className="text-[10px] font-semibold leading-relaxed text-slate-700">
                      {student.discount_summary_text}
                    </p>

                    <div className="mt-0.5 flex justify-between border-t border-indigo-50/50 pt-1 text-[10px] font-bold text-indigo-700">
                      <span>
                        Total Discount:
                      </span>

                      <span>
                        -₱
                        {student.total_discounts_deducted.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                      </span>
                    </div>
                  </div>
                )}


                {/* Total Assessment */}
                <div className="flex justify-between border-t pt-2 font-bold text-slate-800">
                  <span>
                    Total Assessment:
                  </span>

                  <span>
                    ₱
                    {student.total_assessment.toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>

              </div>


              {/* ====================================
                  PAYMENTS
              ==================================== */}

              <div className="flex flex-col gap-2 rounded-xl border border-emerald-100/50 bg-emerald-50/20 p-3 text-xs">

                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Payments & Balance
                </span>

                {/* Tuition Paid */}
                <div className="flex justify-between text-slate-500">
                  <span>
                    Total Tuition Paid:
                  </span>

                  <span className="font-semibold text-emerald-600">
                    ₱
                    {student.total_paid.toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>

                {/* Tuition Balance */}
                <div className="flex justify-between border-t border-emerald-100 pt-2 text-xs font-bold text-slate-900">
                  <span>
                    Tuition Balance Due:
                  </span>

                  <span
                    className={
                      student.tuition_balance === 0
                        ? "text-emerald-600"
                        : "text-slate-900"
                    }
                  >
                    ₱
                    {student.tuition_balance.toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>

              </div>


              {/* ====================================
                  BOOKS
              ==================================== */}

              <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs">

                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Books Account
                </span>

                {/* Books Assessment */}
                <div className="flex justify-between text-slate-500">
                  <span>
                    Books Assessment:
                  </span>

                  <span className="font-semibold text-slate-700">
                    ₱
                    {student.total_books_fee.toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>

                {/* Books Paid */}
                <div className="flex justify-between text-slate-500">
                  <span>
                    Books Paid:
                  </span>

                  <span className="font-semibold text-emerald-600">
                    ₱
                    {student.total_books_paid.toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>

                {/* Books Balance */}
                <div className="flex justify-between border-t pt-2 font-bold text-slate-800">
                  <span>
                    Books Balance Due:
                  </span>

                  <span
                    className={
                      student.books_balance === 0
                        ? "text-emerald-600"
                        : "text-slate-900"
                    }
                  >
                    ₱
                    {student.books_balance.toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>

              </div>

            </CardContent>
          </Card>
        </section>


        {/* ========================================
            TRANSACTION HISTORY
        ======================================== */}

        <section>
          <Card>
            <CardContent className="pt-5">

              <div className="mb-4">
                <h3 className="font-semibold text-slate-800">
                  Payment History
                </h3>

                <p className="text-xs text-slate-400">
                  Student payment transactions
                </p>
              </div>

              {student.transactions.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center">
                  <p className="text-sm text-slate-400">
                    No payment transactions found.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col divide-y">

                  {student.transactions.map(
                    (transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-700">
                            {transaction.context}
                          </p>

                          <p className="text-[11px] text-slate-400">
                            {transaction.date}
                            {" · "}
                            {transaction.method}
                          </p>

                          <p className="text-[10px] text-slate-400">
                            {transaction.id}
                          </p>
                        </div>

                        <span className="shrink-0 text-sm font-bold text-emerald-600">
                          ₱
                          {transaction.amount.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </div>
                    )
                  )}

                </div>
              )}

            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}