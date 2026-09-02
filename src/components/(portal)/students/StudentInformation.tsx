"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Tag,
  Banknote,
  X,
  User,
  CalendarDays,
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
  // Loading (Shadcn Skeleton matching exact layout)
  // ------------------------------------------

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <section>
          <Card className="w-full border shadow-xs">
            <CardContent className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 p-6 md:p-8">
              <div className="flex flex-col items-center space-y-3 shrink-0">
                <Skeleton className="h-28 w-28 md:h-32 md:w-32 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              <div className="flex flex-1 flex-col justify-between gap-6 w-full">
                <div className="space-y-3 text-center md:text-left">
                  <Skeleton className="h-7 w-48 rounded-md" />
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                    <Skeleton className="h-9 w-full rounded-md" />
                    <Skeleton className="h-9 w-full rounded-md" />
                    <Skeleton className="h-9 w-full rounded-md" />
                    <Skeleton className="h-9 w-full rounded-md" />
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border shadow-xs h-full">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </CardContent>
          </Card>
          <Card className="border shadow-xs h-full">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </CardContent>
          </Card>
        </div>
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
    student.suffix ? ` ${student.suffix}` : "",
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
    <div className="space-y-6 pb-12">
      {/* ==========================================
          STUDENT PROFILE
      ========================================== */}

      <section>
        <Card className="w-full border shadow-xs">
          <CardContent className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 p-6 md:p-8">
            {/* Student Circular Avatar & ID */}
            <div className="flex flex-col items-center space-y-3 shrink-0">
              <div className="flex h-28 w-28 md:h-32 md:w-32 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-inner border-4 border-slate-50">
                <User size={52} strokeWidth={1.5} />
              </div>

              <div className="text-center">
                <span className="inline-block px-3 py-1 pb-0 font-semibold text-slate-700 text-xs">
                  STUDENT ID: {student.student_id}
                </span>
              </div>
            </div>

            {/* Student Details & Structured Metadata Rows */}
            <div className="flex flex-1 flex-col justify-between gap-6 w-full">
              <div className="space-y-3 text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                  {fullName}
                </h2>

                {student.lrn && (
                  <p className="text-xs text-slate-500 font-medium">
                    LRN: <span className="text-slate-700 font-semibold">{student.lrn}</span>
                  </p>
                )}

                {/* Explicit Name Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 text-left">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">First Name</span>
                    <span className="text-sm font-semibold text-slate-900">{student.first_name || " "}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Middle Name</span>
                    <span className="text-sm font-semibold text-slate-900">{student.middle_name || " "}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Last Name</span>
                    <span className="text-sm font-semibold text-slate-900">{student.last_name || " "}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Suffix</span>
                    <span className="text-sm font-semibold text-slate-900">{student.suffix || " "}</span>
                  </div>
                </div>
              </div>

              {/* 4-Row Metadata Layout */}
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 text-left">

                {/* Row 1: Gender & Birth Date (Forced 2 columns on mobile) */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50/40 p-3 rounded-xl border border-slate-100/80">
                  <div className="space-y-0.5">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gender</h4>
                    <p className="text-sm font-semibold text-slate-800 capitalize">
                      {student.gender || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Birth Date</h4>
                    <p className="text-sm font-semibold text-slate-800">
                      {student.date_of_birth || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Row 2: Grade Level & Section (Forced 2 columns on mobile) */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50/40 p-3 rounded-xl border border-slate-100/80">
                  <div className="space-y-0.5">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Grade Level</h4>
                    <p className="text-sm font-semibold text-slate-800">
                      {student.grade_level || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Section</h4>
                    <p className="text-sm font-semibold text-slate-800">
                      {student.section_name || "Unassigned"}
                    </p>
                  </div>
                </div>

                {/* Row 3: Advisor (Full Width) */}
                <div className="bg-slate-50/40 p-3 rounded-xl border border-slate-100/80 space-y-0.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Advisor</h4>
                  <p className="text-sm font-semibold text-slate-800">
                    {student.advisor_name || "N/A"}
                  </p>
                </div>

                {/* Row 4: Address (Full Width) */}
                <div className="bg-slate-50/40 p-3 rounded-xl border border-slate-100/80 space-y-0.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Address</h4>
                  <p className="text-sm font-semibold text-slate-800">
                    {student.address || "N/A"}
                  </p>
                </div>

              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ==========================================
          FINANCIAL INFORMATION
      ========================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ========================================
            ASSESSMENT CARD
        ======================================== */}

        <section>
          <Card className="border shadow-xs h-full">
            <CardContent className="flex flex-col gap-5 p-6">
              {/* Enrollment Date */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
                <span className="font-medium text-slate-400 uppercase tracking-wide text-[10px]">
                  Enrollment Date
                </span>

                <span className="flex items-center gap-1.5 font-bold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                  <CalendarDays className="h-3.5 w-3.5 text-blue-600" />
                  {student.date_enrolled}
                </span>
              </div>

              {/* Tuition & Adjustments */}
              <div className="flex flex-col gap-2.5 rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-xs">
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
                  <div className="my-1 flex flex-col gap-1 rounded-lg border border-indigo-100 bg-white p-3 text-[11px] shadow-2xs">
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
                <div className="flex justify-between border-t border-slate-200 pt-3 font-bold text-slate-900 text-sm">
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

              <div className="flex flex-col gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/20 p-4 text-xs">
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

              <div className="flex flex-col gap-2.5 rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-xs">
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
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-800">
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
          <Card className="border shadow-xs h-full flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="mb-4">
                <h3 className="font-semibold text-slate-900">
                  Payment History
                </h3>

                <p className="text-xs text-slate-400 mt-0.5">
                  Official financial ledger transactions recorded for this student
                </p>

                {/* Filter Buttons */}
                <div className="flex items-center gap-2 mt-4">
                  {(["All", "Tuition", "Books", "Others"] as const).map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          selectedCategory === cat
                            ? "bg-blue-600 text-white shadow-xs"
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
                <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center my-auto">
                  <p className="text-sm text-slate-400">
                    No payment transactions found.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[550px] overflow-y-auto pr-1">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      onClick={() => setActiveTransaction(transaction)}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white shadow-2xs hover:border-blue-200 hover:bg-blue-50/20 cursor-pointer transition-all gap-3"
                    >
                      {/* Left: Icon & Details */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Banknote className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex flex-col">
                          <span className="text-[11px] font-bold text-slate-500 uppercase">
                            OR: {transaction.id}
                          </span>

                          <span className="text-sm font-semibold text-indigo-600 truncate mt-0.5">
                            {transaction.context}
                          </span>
                        </div>
                      </div>

                      {/* Right: Amount & Date */}
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-xs font-medium text-slate-400">
                          {transaction.date}
                        </span>

                        <span className="text-sm font-bold text-slate-900 mt-0.5">
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
          TRANSACTION DETAIL MODAL
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

            <div className="text-center pb-4 border-b border-slate-100">
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
              <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                <span className="text-slate-500">OR Number</span>
                <span className="font-bold text-slate-900">
                  {activeTransaction.id}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                <span className="text-slate-500">Date</span>
                <span className="font-semibold text-slate-900">
                  {activeTransaction.date}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                <span className="text-slate-500">Particulars</span>
                <span className="font-semibold text-indigo-600 text-right">
                  {activeTransaction.context}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 rounded-xl shadow-xs"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}