"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { reconcileStudentAccounts } from "@/app/(portal)/reconcile/actions";
import toast from "react-hot-toast";

export default function ReconcileButton() {
  const [isPending, setIsPending] = useState(false);

  const handleReconcile = async () => {
    try {
      setIsPending(true);
      const res = await reconcileStudentAccounts();
      toast.success(
        `Successfully reconciled ${res.updatedCount} student accounts!`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Reconciliation failed.",
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
      {isPending
        ? "Reconciling Accounts..."
        : "Reconcile Missing Student Finances"}
    </Button>
  );
}
