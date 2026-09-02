"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Banknote, ReceiptText, WalletCards, ArrowUpRight } from "lucide-react";
// Import your server action for financials summary data
// import { getFinancialsSummary } from "@/app/(portal)/financials/actions";

export default function FinancialsClient() {
  // Placeholder query - connect this to your backend server action
  const { data: financials, isLoading } = useQuery({
    queryKey: ["financials-summary"],
    queryFn: async () => {
      return {
        totalBilled: 0,
        totalCollected: 0,
        totalBalance: 0,
      };
    },
  });

  return (
    <div className="w-full h-full min-h-0 flex flex-col gap-8 mx-auto">
      <div>
        <h3 className="text-3xl font-semibold tracking-tight text-slate-900">
          Financial Dashboard
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Overview of school collections, total tuition billings, and account receivables for the active school year.
        </p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Billed Card */}
        <Card className="border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Billed (Assessments)
            </CardTitle>
            <ReceiptText className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32 rounded-md mt-1" />
            ) : (
              <p className="text-3xl font-bold text-slate-900">
                ₱
                {(financials?.totalBilled ?? 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            )}
            <p className="text-xs text-slate-400 mt-1">Total charges for active enrollments</p>
          </CardContent>
        </Card>

        {/* Total Collected Card */}
        <Card className="border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Total Collected
            </CardTitle>
            <Banknote className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32 rounded-md mt-1" />
            ) : (
              <p className="text-3xl font-bold text-emerald-600">
                ₱
                {(financials?.totalCollected ?? 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            )}
            <p className="text-xs text-slate-400 mt-1">Total revenue collected to date</p>
          </CardContent>
        </Card>

        {/* Total Outstanding Balance Card */}
        <Card className="border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Outstanding Balance
            </CardTitle>
            <WalletCards className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32 rounded-md mt-1" />
            ) : (
              <p className="text-3xl font-bold text-amber-600">
                ₱
                {(financials?.totalBalance ?? 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            )}
            <p className="text-xs text-slate-400 mt-1">Total unpaid student receivables</p>
          </CardContent>
        </Card>
      </div>

      {/* Next: Detailed Ledger / Breakdown Section can go here */}
      <div className="flex-1 min-h-0 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
        <h4 className="font-semibold text-slate-900 text-base mb-2">Recent Financial Activities</h4>
        <p className="text-xs text-slate-400">Detailed collection timelines and ledger logs will appear here.</p>
      </div>
    </div>
  );
}