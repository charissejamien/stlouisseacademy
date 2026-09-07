"use server";

import { createClient } from "@/lib/supabase/server";

export async function reconcileStudentPaymentTotals() {
  const supabase = await createClient();

  // 1. Fetch all student account cards
  const { data: accountCards, error: cardsError } = await supabase
    .from("student_account_card")
    .select("id, student_id, adjusted_total_tuition_fee, total_books_fee");

  if (cardsError) {
    throw new Error(
      `Failed to fetch student account cards: ${cardsError.message}`,
    );
  }

  if (!accountCards || accountCards.length === 0) {
    return {
      success: true,
      updatedCount: 0,
      message: "No student account cards found.",
    };
  }

  // 2. Get unique student IDs
  const studentIds = [
    ...new Set(
      accountCards
        .map((card) => card.student_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  if (studentIds.length === 0) {
    return {
      success: true,
      updatedCount: 0,
      message: "No students found on account cards.",
    };
  }

  // 3. Fetch payments in batches
  //
  // Doing all student IDs in one `.in()` query can create
  // a very large request and cause `fetch failed`.
  const BATCH_SIZE = 100;

  const allPayments: Array<{
    student_id: string | null;
    amount: number | string | null;
    payment_specifics: string | null;
  }> = [];

  for (let i = 0; i < studentIds.length; i += BATCH_SIZE) {
    const batch = studentIds.slice(i, i + BATCH_SIZE);

    const { data: payments, error: paymentsError } = await supabase
      .from("payments")
      .select("student_id, amount, payment_specifics")
      .in("student_id", batch);

    if (paymentsError) {
      console.error("Payment batch failed:", {
        batchStart: i,
        batchSize: batch.length,
        error: paymentsError,
      });

      throw new Error(
        `Failed to fetch student payments: ${paymentsError.message}`,
      );
    }

    if (payments) {
      allPayments.push(...payments);
    }
  }

  // 4. Store totals per student
  const paymentsByStudent = new Map<
    string,
    {
      total_tuition_paid: number;
      total_books_paid: number;
      total_aircon_paid: number;
    }
  >();

  // 5. Classify every payment
  for (const payment of allPayments) {
    if (!payment.student_id) {
      continue;
    }

    const amount = Number(payment.amount) || 0;

    const specifics = String(payment.payment_specifics ?? "")
      .trim()
      .toLowerCase();

    if (!paymentsByStudent.has(payment.student_id)) {
      paymentsByStudent.set(payment.student_id, {
        total_tuition_paid: 0,
        total_books_paid: 0,
        total_aircon_paid: 0,
      });
    }

    const totals = paymentsByStudent.get(payment.student_id)!;

    // -----------------------------------------
    // BOOKS
    // -----------------------------------------
    if (specifics.includes("books")) {
      totals.total_books_paid += amount;
      continue;
    }

    // -----------------------------------------
    // AIRCON
    // -----------------------------------------
    if (specifics.includes("aircon")) {
      totals.total_aircon_paid += amount;
      continue;
    }

    // -----------------------------------------
    // TUITION
    // -----------------------------------------
    const isTuitionPayment =
      specifics.includes("installment") ||
      specifics.includes("entrance fee") ||
      specifics.includes("partial payment") ||
      specifics.includes("full payment");

    if (isTuitionPayment) {
      totals.total_tuition_paid += amount;
      continue;
    }
  }

  // 6. Update every student account card
  let updatedCount = 0;

  for (const card of accountCards) {
    const totals = paymentsByStudent.get(card.student_id) ?? {
      total_tuition_paid: 0,
      total_books_paid: 0,
      total_aircon_paid: 0,
    };

    const totalTuitionFee = Number(card.adjusted_total_tuition_fee) || 0;

    const totalBooksFee = Number(card.total_books_fee) || 0;

    const tuitionBalance = Math.max(
      totalTuitionFee - totals.total_tuition_paid,
      0,
    );

    const booksBalance = Math.max(totalBooksFee - totals.total_books_paid, 0);

    const { error: updateError } = await supabase
      .from("student_account_card")
      .update({
        total_tuition_paid: totals.total_tuition_paid,
        total_books_paid: totals.total_books_paid,
        total_aircon_paid: totals.total_aircon_paid,
        tuition_balance: tuitionBalance,
        books_balance: booksBalance,
      })
      .eq("id", card.id);

    if (updateError) {
      throw new Error(
        `Failed to update account card ${card.id}: ${updateError.message}`,
      );
    }

    updatedCount++;
  }

  return {
    success: true,
    updatedCount,
    paymentCount: allPayments.length,
  };
}
