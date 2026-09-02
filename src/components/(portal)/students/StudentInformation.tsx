"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  GraduationCap,
  VenusAndMars,
  ShieldCheck,
  UserCheck,
  CalendarDays,
  Tag,
  Banknote,
  X,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { getStudentById } from "@/app/(portal)/students/[id]/actions";

export default function StudentInformation({ id }: { id: string }) {
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | "Tuition" | "Books" | "Others"
  >("All");
  const [activeTransaction, setActiveTransaction] = useState<any | null>(null);

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
        <p className="text-sm text-slate-500">Loading student information...</p>
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
          {error instanceof Error ? error.message : "Something went wrong."}
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
        <p className="text-sm text-slate-500">Student not found.</p>
      </div>
    );
  }

  // ------------------------------------------
  // Derived values & filtering
  // ------------------------------------------

  const fullName = [
    student.last_name,
    ", ",
    student.first_name,
    student.middle_name ? ` ${student.middle_name}` : "",
  ].join("");

  const filteredTransactions = student.transactions.filter((tx) => {
    const context = tx.context.toLowerCase();
    if (selectedCategory === "Tuition")
      return (
        context.includes("tuition") ||
        context.includes("installment") ||
        context.includes("entrance")
      );
    if (selectedCategory === "Books") return context.includes("book");
    if (selectedCategory === "Others")
      return (
        !context.includes("tuition") &&
        !context.includes("installment") &&
        !context.includes("entrance") &&
        !context.includes("book")
      );
    return true;
  });

  return (
    <div className="space-y-5">
      {/* ==========================================
          STUDENT PROFILE
      ========================================== */}

      <section>
        <Card className="w-full py-5">
          <CardContent className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 px-4 md:px-6">
            {/* Student Avatar / ID */}
            <div className="flex flex-col items-center space-y-3 shrink-0">
              <div className="flex h-28 w-28 md:h-35 md:w-35 items-center justify-center rounded-lg bg-blue-100/70">
                <UserCheck className="h-10 w-10 md:h-12 md:w-12 text-blue-400" />
              </div>

              <h3 className="font-bold text-slate-700 text-sm md:text-base">
                ID: {student.student_id}
              </h3>
            </div>

            {/* Student Details */}
            <div className="flex flex-1 flex-col justify-between gap-6 md:gap-10 pt-2 md:pt-7 w-full">
              <div className="text-center md:text-left">
                <p className="text-sm text-slate-500">Student Profile</p>

                <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                  {fullName}
                </h2>
              </div>

              {/* Student Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 border-t pt-4 md:border-0 md:pt-0">
                {/* Grade */}
                <div className="flex items-start gap-2.5">
                  <GraduationCap className="mt-0.5 h-4 w-4 text-slate-400 shrink-0" />

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
                  <VenusAndMars className="mt-0.5 h-4 w-4 text-slate-400 shrink-0" />

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
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-slate-400 shrink-0" />

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
                  <UserCheck className="mt-0.5 h-4 w-4 text-slate-400 shrink-0" />

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
            <CardContent className="flex flex-col gap-5 pt-5 px-4 md:px-6">
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

              {/* Tuition & Adjustments */}
              <div className="flex flex-col gap-2.5 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  Tuition & Fee Breakdown
                </span>

                {/* Base Tuition */}
                <div className="flex justify-between text-slate-500">
                  <span>Base Tuition:</span>
                  <span className="font-semibold text-slate-700">
                    ₱
                    {student.base_tuition.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Miscellaneous */}
                <div className="flex justify-between text-slate-500">
                  <span>Miscellaneous Fees:</span>
                  <span className="font-semibold text-slate-700">
                    ₱
                    {student.miscellaneous_fees.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="border-t border-slate-200 my-1"></div>

                {/* Gross Total */}
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Gross Total:</span>
                  <span>
                    ₱
                    {student.gross_tuition_total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Discounts */}
                {student.total_discounts_deducted > 0 && (
                  <div className="my-1 flex flex-col gap-1 rounded-lg border border-indigo-100 bg-white/90 p-2.5 text-[11px]">
                    <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-indigo-600">
                      <Tag className="h-2.5 w-2.5 text-indigo-500" />
                      <span>Discounts Applied</span>
                    </div>

                    <p className="text-[10px] font-semibold leading-relaxed text-slate-700">
                      {student.discount_summary_text}
                    </p>

                    <div className="mt-0.5 flex justify-between border-t border-indigo-50 pt-1 text-[10px] font-bold text-indigo-700">
                      <span>Total Discount:</span>
                      <span>
                        -₱
                        {student.total_discounts_deducted.toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2 },
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {/* Total Assessment */}
                <div className="flex justify-between border-t pt-3 font-bold text-slate-900 text-sm">
                  <span>Total Assessment:</span>
                  <span className="text-indigo-600">
                    ₱
                    {student.total_assessment.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              {/* ====================================
                  PAYMENTS & BALANCES
              ==================================== */}

              <div className="flex flex-col gap-2 rounded-xl border border-emerald-100/60 bg-emerald-50/20 p-3.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Payments & Tuition Balance
                </span>

                {/* Tuition Paid */}
                <div className="flex justify-between text-slate-500">
                  <span>Total Tuition Paid:</span>
                  <span className="font-semibold text-emerald-600">
                    ₱
                    {student.total_paid.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Tuition Balance */}
                <div className="flex justify-between border-t border-emerald-100 pt-2 text-xs font-bold text-slate-900">
                  <span>Tuition Balance Due:</span>
                  <span
                    className={
                      student.tuition_balance === 0
                        ? "text-emerald-600"
                        : "text-slate-900"
                    }
                  >
                    ₱
                    {student.tuition_balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              {/* ====================================
                  BOOKS ACCOUNT
              ==================================== */}

              <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Books Account
                </span>

                {/* Books Assessment */}
                <div className="flex justify-between text-slate-500">
                  <span>Books Assessment:</span>
                  <span className="font-semibold text-slate-700">
                    ₱
                    {student.total_books_fee.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Books Paid */}
                <div className="flex justify-between text-slate-500">
                  <span>Books Paid:</span>
                  <span className="font-semibold text-emerald-600">
                    ₱
                    {student.total_books_paid.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Books Balance */}
                <div className="flex justify-between border-t pt-2 font-bold text-slate-800">
                  <span>Books Balance Due:</span>
                  <span
                    className={
                      student.books_balance === 0
                        ? "text-emerald-600"
                        : "text-slate-900"
                    }
                  >
                    ₱
                    {student.books_balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
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
            <CardContent className="pt-5 px-4 md:px-6">
              <div className="mb-4">
                <h3 className="font-semibold text-slate-800">
                  Payment History
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Student payment transactions
                </p>

                {/* Filter Buttons */}
                <div className="flex items-center gap-2 mt-3">
                  {(["All", "Tuition", "Books", "Others"] as const).map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          selectedCategory === cat
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center">
                  <p className="text-sm text-slate-400">
                    No payment transactions found.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      onClick={() => setActiveTransaction(transaction)}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-blue-200 hover:bg-blue-50/20 cursor-pointer transition-all gap-3"
                    >
                      {/* Left: Icon & Details (OR Number top, Payment Specifics bottom) */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Banknote className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex flex-col">
                          <span className="text-xs font-bold text-slate-900 uppercase">
                            OR : {transaction.id}
                          </span>

                          <span className="text-sm font-semibold text-indigo-600 truncate mt-0.5">
                            {transaction.context}
                          </span>
                        </div>
                      </div>

                      {/* Right: Amount & Date (Date top, Amount bottom) */}
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-xs font-medium text-slate-500">
                          {transaction.date}
                        </span>

                        <span className="text-base font-bold text-blue-950 mt-0.5">
                          ₱
                          {transaction.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* ==========================================
          TRANSACTION DETAIL MODAL (Maya Style)
      ========================================== */}
      {activeTransaction && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveTransaction(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center pb-4 border-b">
              <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Banknote size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Transaction Details
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Official Receipt Record
              </p>
            </div>

            <div className="py-5 space-y-4 text-sm">
              <div className="flex justify-between py-1 border-b border-dashed">
                <span className="text-slate-500">OR Number</span>
                <span className="font-bold text-slate-900">
                  {activeTransaction.id}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed">
                <span className="text-slate-500">Date</span>
                <span className="font-semibold text-slate-900">
                  {activeTransaction.date}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed">
                <span className="text-slate-500">Particulars</span>
                <span className="font-semibold text-indigo-600 text-right">
                  {activeTransaction.context}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed">
                <span className="text-slate-500">Mode of Payment</span>
                <span className="inline-flex capitalize items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">
                  {activeTransaction.method}
                </span>
              </div>
              <div className="flex justify-between py-2 items-center">
                <span className="text-slate-700 font-bold">
                  Total Amount Paid
                </span>
                <span className="text-xl font-extrabold text-blue-950">
                  ₱
                  {activeTransaction.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            <Button
              onClick={() => setActiveTransaction(null)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 rounded-xl shadow-sm"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
