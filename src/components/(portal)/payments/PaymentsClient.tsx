"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import RecentPayments from "@/components/(portal)/payments/RecentPayments";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

export default function PaymentsClient() {
  const router = useRouter();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10 space-y-8 pb-12">
      {/* Page Header with Title, Description, and Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Payments
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage student payment transactions, review daily collection
            receipts, and record incoming fees.
          </p>
        </div>

        <Button
          onClick={() => router.push("/payments/new")}
          className="w-full sm:w-auto shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Payment
        </Button>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Recent Transactions */}
        <div className="space-y-3 w-full overflow-hidden">
          <Label className="text-base font-semibold">Recent Transactions</Label>
          <div className="overflow-x-auto">
            <Suspense
              fallback={<Skeleton className="w-full h-[300px] rounded-xl" />}
            >
              <RecentPayments />
            </Suspense>
          </div>
        </div>

        {/* DCPR Section */}
        <div className="space-y-3 w-full">
          <Label className="text-base font-semibold">DCPR</Label>
          <div className="w-full bg-white p-3 shadow-sm border rounded-xl">
            <Button className="w-full h-auto bg-white text-foreground flex flex-col items-start py-8 px-5 hover:bg-muted/50 transition-all border border-transparent shadow-none hover:border-border">
              <p className="text-xs text-muted-foreground font-normal">
                Aug 14, 2026 (Today)
              </p>
              <p className="w-full text-2xl font-bold tracking-tight text-emerald-600 mt-2 text-left">
                ₱31,203.00
              </p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
