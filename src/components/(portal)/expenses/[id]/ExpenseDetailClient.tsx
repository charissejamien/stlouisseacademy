"use client";

import { useQuery } from "@tanstack/react-query";
import { getExpensesByDate } from "@/app/(portal)/expenses/[id]/actions";
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
import { ArrowLeft, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

interface ExpenseDetailClientProps {
  dateStr: string;
}

export default function ExpenseDetailClient({
  dateStr,
}: ExpenseDetailClientProps) {
  const router = useRouter();

  const { data: expenses, isLoading } = useQuery({
    queryKey: ["expenses-by-date", dateStr],
    queryFn: () => getExpensesByDate(dateStr),
  });

  const formatCurrency = (value: number) =>
    `₱${Number(value).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formattedDateTitle = new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const totalAmount =
    expenses?.reduce((sum, item) => sum + item.amount, 0) ?? 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-4 border-b">
        <div className="space-y-3">
          <Button
            variant="default"
            size="sm"
            onClick={() => router.push("/expenses/all")}
            className="text-blue-800 bg-transparent hover:bg-blue-50 gap-2 p-0 h-auto font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Overview
          </Button>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Disbursements for {formattedDateTitle}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Detailed itemized ledger of all transactions recorded on this
              date.
            </p>
          </div>
        </div>
      </div>

      {/* Itemized Table Card */}
      <Card className="shadow-sm border bg-white overflow-hidden rounded-xl">
        <CardHeader className="bg-muted/30 border-b py-4 px-6 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-600" />
            Transaction Logs
          </CardTitle>
          <div className="text-sm">
            <span className="text-muted-foreground text-xs uppercase mr-2 font-medium">
              Total Disbursed:
            </span>
            <span className="font-bold text-red-600 text-lg">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold text-foreground px-6 py-3.5">
                  Description
                </TableHead>
                <TableHead className="font-semibold text-foreground px-6 py-3.5">
                  Category
                </TableHead>
                <TableHead className="font-semibold text-foreground px-6 py-3.5">
                  Method
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground px-6 py-3.5">
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 px-6">
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ) : expenses && expenses.length > 0 ? (
                expenses.map((item) => (
                  <TableRow
                    key={item.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <TableCell className="font-medium text-foreground py-4 px-6">
                      {item.description}
                    </TableCell>
                    <TableCell className="py-4 px-6 capitalize text-sm text-muted-foreground">
                      {item.category_name}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-sm text-muted-foreground">
                      {item.payment_method}
                    </TableCell>
                    <TableCell className="text-right font-bold text-foreground py-4 px-6">
                      {formatCurrency(item.amount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-12 italic"
                  >
                    No expense records found for this date.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
