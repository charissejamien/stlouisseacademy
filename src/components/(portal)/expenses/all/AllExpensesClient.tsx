"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllExpensesGroupedByDate } from "@/app/(portal)/expenses/all/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function AllExpensesClient() {
  const router = useRouter();

  const currentYearMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentYearMonth);

  const { data, isLoading } = useQuery({
    queryKey: ["all-expenses-grouped", selectedMonth],
    queryFn: () => getAllExpensesGroupedByDate(selectedMonth),
  });

  const formatCurrency = (value: number) =>
    `₱${Number(value).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDateLabel = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate grand total for the whole month based on returned rows
  const grandTotalMonth =
    data?.rows?.reduce((sum, row) => sum + row.dailyTotal, 0) ?? 0;

  // Format month name for the header summary text (e.g., "September 2026")
  const monthNameLabel = new Date(`${selectedMonth}-01`).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      {/* Header with Back Button Stacked Above and Month Filter */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-4 border-b">
        <div className="space-y-3">
          {/* Blue Back Arrow Button Positioned Above */}
          <Button
            variant="default"
            size="sm"
            onClick={() => router.push("/expenses")}
            className="text-blue-800 bg-transparent hover:bg-blue-50 gap-2 p-0 h-auto font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Expenses
          </Button>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Expenses Overview
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Complete historical matrix of daily expenses categorized by
              column. Click any date row to view detailed entries.
            </p>
          </div>
        </div>

        {/* Month Filter Picker */}
        <div className="flex items-center gap-2 bg-white border px-3 py-2 rounded-xl shadow-sm self-start sm:self-auto">
          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border-0 h-auto p-0 focus-visible:ring-0 text-sm font-semibold bg-transparent"
          />
        </div>
      </div>

      {/* Main Master Ledger Card */}
      <Card className="shadow-sm border bg-white overflow-hidden rounded-xl pt-0">
        <CardHeader className="bg-muted/30 border-b py-4 px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            {monthNameLabel} Expenses
          </CardTitle>
          <div className="text-sm">
            <span className="text-muted-foreground text-xs uppercase mr-2 font-medium">
              Total Disbursed Expenses:
            </span>
            <span className="font-semibold text-red-600 text-base">
              {formatCurrency(grandTotalMonth)}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ) : data?.rows && data.rows.length > 0 ? (
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="font-semibold text-foreground px-6 py-3.5">
                    Date
                  </TableHead>
                  {data.categories.map((cat) => (
                    <TableHead
                      key={cat}
                      className="capitalize font-semibold text-foreground px-4 py-3.5"
                    >
                      {cat}
                    </TableHead>
                  ))}
                  <TableHead className="text-right font-semibold text-foreground px-6 py-3.5">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rows.map((row) => (
                  <TableRow
                    key={row.date_disbursed}
                    onClick={() =>
                      router.push(`/expenses/${row.date_disbursed}`)
                    }
                    className="transition-colors hover:bg-muted/50 cursor-pointer"
                  >
                    <TableCell className="font-medium text-foreground py-4 px-6 whitespace-nowrap flex items-center gap-2 text-xs sm:text-sm">
                      {formatDateLabel(row.date_disbursed)}
                    </TableCell>
                    {data.categories.map((cat) => {
                      const amount = row.expenses[cat] || 0;
                      return (
                        <TableCell
                          key={cat}
                          className="py-4 px-4 text-muted-foreground text-xs sm:text-sm"
                        >
                          {amount > 0 ? formatCurrency(amount) : " "}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-right font-semibold text-red-600 py-4 px-6 text-xs sm:text-sm whitespace-nowrap">
                      {formatCurrency(row.dailyTotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-sm font-medium">
                No expense history found for {monthNameLabel}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
