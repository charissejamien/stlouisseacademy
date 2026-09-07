"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { reconcileStudentPaymentTotals } from "@/app/(portal)/reconcile/actions";
import toast from "react-hot-toast";

export default function ReconcileButton() {
  const [isPending, setIsPending] = useState(false);

  const handleReconcile = async () => {
    try {
      setIsPending(true);

      const res = await reconcileStudentPaymentTotals();

      toast.success(
        `Successfully updated ${res.updatedCount} student account cards!`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Payment reconciliation failed.",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      onClick={handleReconcile}
      disabled={isPending}
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
    >
      {isPending ? "Recalculating Finances..." : "Reconcile Student Payments"}
    </Button>
  );
}
