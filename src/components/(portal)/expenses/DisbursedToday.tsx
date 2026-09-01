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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  payment_method: string;
  category_name: string;
}

interface DisbursedTodayProps {
  expenses?: ExpenseItem[];
  isLoading: boolean;
}

export default function DisbursedToday({
  expenses,
  isLoading,
}: DisbursedTodayProps) {
  const router = useRouter();
  const todayString = new Date().toISOString().split("T")[0];

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

  const totalTodayAmount =
    expenses?.reduce((sum, item) => sum + item.amount, 0) ?? 0;

  return (
    <Card
      onClick={() => router.push(`/expenses/${todayString}`)}
      className="shadow-sm border bg-white flex flex-col h-full overflow-hidden rounded-xl cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
    >
      <CardHeader className="flex flex-row items-center justify-between pb-3 bg-muted/30 border-b shrink-0">
        <div>
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-600" />
            Disbursed Today ({formatDate(todayString)})
          </CardTitle>
        </div>
        <div className="text-right">
          <span className="text-xs uppercase tracking-wider text-muted-foreground block">
            Total Amount Disbursed
          </span>
          <span className="text-2xl font-bold text-red-600">
            {formatCurrency(totalTodayAmount)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0 z-10">
            <TableRow>
              <TableHead className="font-semibold text-foreground">
                Description
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Category
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Method
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-6">
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ) : expenses && expenses.length > 0 ? (
              expenses.map((item) => (
                <TableRow
                  key={item.id}
                  className="transition-colors hover:bg-muted/40"
                >
                  <TableCell className="font-medium text-foreground py-3.5">
                    {item.description}
                  </TableCell>
                  <TableCell className="py-3.5 capitalize text-sm text-muted-foreground">
                    {item.category_name}
                  </TableCell>
                  <TableCell className="py-3.5 text-sm text-muted-foreground">
                    {item.payment_method}
                  </TableCell>
                  <TableCell className="text-right font-bold text-foreground py-3.5">
                    {formatCurrency(item.amount)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-10 italic"
                >
                  No expenses disbursed today yet. (Click to view log)
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
