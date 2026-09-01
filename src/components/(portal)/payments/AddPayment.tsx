"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getPaymentStudents,
  createPayments,
  PaymentStudent,
} from "@/app/(portal)/payments/new/actions";

import { getBillingPeriods } from "@/app/(portal)/actions";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BillingPeriod = {
  id: string;
  period_name: string;
};

type StudentPayment = {
  billing_period: string;
  amount: string;
};

type SelectedStudent = PaymentStudent & {
  payments: StudentPayment[];
};

export default function AddPayment() {
  const [search, setSearch] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<SelectedStudent[]>(
    [],
  );

  const [date, setDate] = useState(
    new Intl.DateTimeFormat("en-CA").format(new Date()),
  );

  const [orNumber, setOrNumber] = useState("");
  const [modeOfPayment, setModeOfPayment] = useState("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load the student directory ONCE.
  const { data: students = [], isLoading: isStudentsLoading } = useQuery<
    PaymentStudent[]
  >({
    queryKey: ["paymentStudents"],
    queryFn: getPaymentStudents,
  });

  const { data: billingPeriods = [] } = useQuery<BillingPeriod[]>({
    queryKey: ["billing-periods"],
    queryFn: getBillingPeriods,
  });

  // Local/in-memory student search.
  const searchResults = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return [];
    }

    return students
      .filter((student) => {
        const fullName = [
          student.first_name,
          student.middle_name,
          student.last_name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const studentId = student.student_id?.toLowerCase() ?? "";

        return fullName.includes(term) || studentId.includes(term);
      })
      .slice(0, 10);
  }, [students, search]);

  const addStudent = (student: PaymentStudent) => {
    if (selectedStudents.some((s) => s.id === student.id)) {
      return;
    }

    setSelectedStudents((current) => [
      ...current,
      {
        ...student,
        payments: [
          {
            billing_period: "",
            amount: "",
          },
        ],
      },
    ]);

    setSearch("");
  };

  const removeStudent = (id: string) => {
    setSelectedStudents((current) =>
      current.filter((student) => student.id !== id),
    );
  };

  const addPayment = (studentId: string) => {
    setSelectedStudents((current) =>
      current.map((student) =>
        student.id === studentId
          ? {
              ...student,
              payments: [
                ...student.payments,
                {
                  billing_period: "",
                  amount: "",
                },
              ],
            }
          : student,
      ),
    );
  };

  const removePayment = (studentId: string, paymentIndex: number) => {
    setSelectedStudents((current) =>
      current.map((student) =>
        student.id === studentId
          ? {
              ...student,
              payments: student.payments.filter(
                (_, index) => index !== paymentIndex,
              ),
            }
          : student,
      ),
    );
  };

  const updatePayment = (
    studentId: string,
    paymentIndex: number,
    field: keyof StudentPayment,
    value: string,
  ) => {
    setSelectedStudents((current) =>
      current.map((student) =>
        student.id === studentId
          ? {
              ...student,
              payments: student.payments.map((payment, index) =>
                index === paymentIndex
                  ? {
                      ...payment,
                      [field]: value,
                    }
                  : payment,
              ),
            }
          : student,
      ),
    );
  };

  const totalPayment = selectedStudents.reduce((total, student) => {
    for (const payment of student.payments) {
      total += Number(payment.amount) || 0;
    }

    return total;
  }, 0);

  const handleSubmit = async () => {
    if (!orNumber) {
      return;
    }

    const payments = selectedStudents.flatMap((student) =>
      student.payments
        .filter(
          (payment) => payment.billing_period && Number(payment.amount) > 0,
        )
        .map((payment) => ({
          or_number: orNumber,
          amount: Number(payment.amount),
          mode_of_payment: modeOfPayment,
          student_id: student.id,
          payment_specifics: payment.billing_period,
        })),
    );

    if (payments.length === 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      await createPayments(payments);

      setSelectedStudents([]);
      setOrNumber("");
      setModeOfPayment("cash");
    } catch (error) {
      console.error("Failed to create payments:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      {/* Search */}
      <div className="relative max-w-xl shrink-0">
        <Input
          placeholder="Search student by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search && (
          <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-md border bg-background shadow-md">
            {isStudentsLoading ? (
              <div className="p-4 text-sm text-muted-foreground">
                Loading students...
              </div>
            ) : searchResults.length > 0 ? (
              <div className="p-1">
                {searchResults.map((student) => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => addStudent(student)}
                    className="flex w-full flex-col rounded-sm px-3 py-2 text-left hover:bg-muted"
                  >
                    <span className="font-medium">
                      {student.first_name}{" "}
                      {student.middle_name ? `${student.middle_name} ` : ""}
                      {student.last_name}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      ID: {student.student_id}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="p-4 text-sm text-muted-foreground">
                No students found.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_350px] gap-6">
        {/* Students */}
        <div className="min-h-0 overflow-y-auto pr-2 scrollbar-hide">
          <div className="space-y-4">
            {selectedStudents.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold">Students</h2>

                <p className="text-sm text-muted-foreground">
                  Add the billing periods and payments for each student.
                </p>
              </div>
            )}

            {selectedStudents.map((student) => (
              <Card key={student.id}>
                <CardContent className="p-5">
                  {/* Student */}
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Student
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {student.first_name}{" "}
                        {student.middle_name ? `${student.middle_name} ` : ""}
                        {student.last_name}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Student ID: {student.student_id}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStudent(student.id)}
                    >
                      Remove Student
                    </Button>
                  </div>

                  {/* Payments */}
                  <div className="space-y-3">
                    {student.payments.map((payment, index) => (
                      <div
                        key={index}
                        className="grid gap-4 rounded-lg border bg-muted/20 p-4 md:grid-cols-[minmax(0,1fr)_180px_auto] md:items-end"
                      >
                        {/* Billing Period */}
                        <div className="grid min-w-0 gap-2">
                          <Label>Billing Period</Label>

                          <Select
                            value={payment.billing_period}
                            onValueChange={(value) =>
                              updatePayment(
                                student.id,
                                index,
                                "billing_period",
                                value,
                              )
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select billing period" />
                            </SelectTrigger>

                            <SelectContent>
                              {billingPeriods.map((period) => (
                                <SelectItem
                                  key={period.id}
                                  value={period.period_name}
                                >
                                  {period.period_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Payment */}
                        <div className="grid gap-2">
                          <Label>Payment</Label>

                          <Input
                            type="number"
                            min="0"
                            placeholder="0.00"
                            value={payment.amount}
                            onChange={(e) =>
                              updatePayment(
                                student.id,
                                index,
                                "amount",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        {/* Remove */}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removePayment(student.id, index)}
                          disabled={student.payments.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add Billing Period */}
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => addPayment(student.id)}
                  >
                    + Add Billing Period
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Details */}
        <div className="min-h-0">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>

              <p className="text-sm text-muted-foreground">
                Enter the details for this payment.
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Date */}
              <div className="grid gap-2">
                <Label>Date</Label>

                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {/* OR Number */}
              <div className="grid gap-2">
                <Label>OR Number</Label>

                <Input
                  placeholder="Enter OR number"
                  value={orNumber}
                  onChange={(e) => setOrNumber(e.target.value)}
                />
              </div>

              {/* Mode */}
              <div className="grid gap-2">
                <Label>Mode of Payment</Label>

                <Select value={modeOfPayment} onValueChange={setModeOfPayment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>

                    <SelectItem value="gcash">GCash</SelectItem>

                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Total */}
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Total Payment</p>

                <p className="mt-1 text-3xl font-bold">
                  ₱
                  {totalPayment.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={isSubmitting || !orNumber || totalPayment <= 0}
              >
                {isSubmitting ? "Adding Payment..." : "Add Payment"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
