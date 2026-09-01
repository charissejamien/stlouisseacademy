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
import { useQuery } from "@tanstack/react-query";
import { getRecentPayments } from "@/app/(portal)/payments/actions";

export default function RecentPayments() {
  const {
    data: payments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recent-payments"],
    queryFn: () => getRecentPayments(),
  });

  const formatCurrency = (value: number) =>
    `₱${Number(value).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  if (isLoading) {
    return (
      <div className="space-y-3 bg-white p-5 rounded-lg shadow-md">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-destructive text-sm">
        Failed to load recent transactions.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Student</TableHead>
            <TableHead>Payment Specifics</TableHead>
            <TableHead>OR Number</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments && payments.length > 0 ? (
            payments.map((payment) => {
              const student = Array.isArray(payment.students)
                ? payment.students[0]
                : payment.students;

              const studentName = student
                ? `${student.last_name}, ${student.first_name}`
                : "Unknown Student";

              return (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{studentName}</TableCell>
                  <TableCell>
                    {payment.payment_specifics ?? "Enrollment Fee"}
                  </TableCell>
                  <TableCell>{payment.or_number ?? "N/A"}</TableCell>
                  <TableCell className="text-right font-semibold text-emerald-600">
                    {formatCurrency(payment.amount ?? 0)}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground py-6"
              >
                No recent transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
