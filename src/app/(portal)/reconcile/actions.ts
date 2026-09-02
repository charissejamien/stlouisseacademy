"use server";

import { createClient } from "@/lib/supabase/server";

export async function reconcileStudentAccounts() {
  const supabase = await createClient();

  // 1. Fetch active school year
  const { data: activeSY, error: syError } = await supabase
    .from("school_years")
    .select("id")
    .eq("is_active", true)
    .single();

  if (syError || !activeSY) {
    throw new Error("No active school year found for reconciliation.");
  }

  // 2. Fetch standard tuition fees per grade level templates
  const { data: feeTemplates, error: feeError } = await supabase
    .from("tuition_fees")
    .select("grade_level, base_tuition, miscellaneous, total_tuition");

  if (feeError || !feeTemplates) {
    throw new Error("Failed to load tuition fee templates.");
  }

  const feeMap = new Map();
  feeTemplates.forEach((fee) => {
    feeMap.set(fee.grade_level, {
      base_tuition: fee.base_tuition ?? 0,
      miscellaneous: fee.miscellaneous ?? 0,
      total_tuition: fee.total_tuition ?? 0,
    });
  });

  // 3. Fetch all active student enrollments for the current school year
  const { data: enrollments, error: enrollError } = await supabase
    .from("enrollments")
    .select("student_id, grade_level")
    .eq("school_year_id", activeSY.id);

  if (enrollError || !enrollments) {
    throw new Error("Failed to fetch student enrollments.");
  }

  let updatedCount = 0;

  // 4. Loop and check/insert missing student_account_card records
  for (const enrollment of enrollments) {
    const template = feeMap.get(enrollment.grade_level);
    if (!template) continue;

    // Check if account card already exists for this student & school year
    const { data: existingCard } = await supabase
      .from("student_account_card")
      .select("id, base_tuition")
      .eq("student_id", enrollment.student_id)
      .eq("school_year_id", activeSY.id)
      .maybeSingle();

    if (
      !existingCard ||
      existingCard.base_tuition === null ||
      existingCard.base_tuition === 0
    ) {
      const cardPayload = {
        student_id: enrollment.student_id,
        school_year_id: activeSY.id,
        base_tuition: template.base_tuition,
        miscellaneous: template.miscellaneous,
        adjusted_base_tuition: template.base_tuition,
        adjusted_miscellaneous: template.miscellaneous,
        adjusted_total_tuition_fee: template.total_tuition,
        total_books_fee: 0,
      };

      if (existingCard?.id) {
        // Update existing empty card
        await supabase
          .from("student_account_card")
          .update(cardPayload)
          .eq("id", existingCard.id);
      } else {
        // Insert new card
        await supabase.from("student_account_card").insert(cardPayload);
      }

      updatedCount++;
    }
  }

  return { success: true, updatedCount };
}
