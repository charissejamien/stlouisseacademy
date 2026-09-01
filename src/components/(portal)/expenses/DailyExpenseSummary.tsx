"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DailySummaryItem {
  date_disbursed: string;
  total_amount: number;
  transaction_count: number;
}

interface DailyExpenseSummaryProps {
  summaries?: DailySummaryItem[];
  isLoading: boolean;
}

export default function DailyExpenseSummary({
  summaries,
  isLoading,
}: DailyExpenseSummaryProps) {
  const router = useRouter();

  const formatCurrency = (value: number) =>
    `₱${Number(value).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="shadow-sm border bg-white flex flex-col h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 bg-muted/30 border-b shrink-0">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Daily Expense Summaries
          </CardTitle>
        </div>
        <Link
          href="/expenses/all"
          className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
        >
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0 z-10">
            <TableRow>
              <TableHead className="font-semibold text-foreground w-[150px]">
                Disbursement Date
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground">
                Total Expenses
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={2} className="py-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </TableCell>
              </TableRow>
            ) : summaries && summaries.length > 0 ? (
              summaries.map((summary) => (
                <TableRow
                  key={summary.date_disbursed}
                  onClick={() =>
                    router.push(`/expenses/${summary.date_disbursed}`)
                  }
                  className="transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  <TableCell className="font-medium text-foreground flex items-center gap-2 py-3 text-xs sm:text-sm">
                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {formatDate(summary.date_disbursed)}
                  </TableCell>
                  <TableCell className="text-right font-bold  py-3 text-xs sm:text-sm">
                    {formatCurrency(summary.total_amount)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center text-muted-foreground py-8 text-xs"
                >
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
