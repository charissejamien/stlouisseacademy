"use client";

import { useEffect } from "react";
import {
  Controller,
  UseFormReturn,
  useFieldArray,
  useWatch,
  Path,
} from "react-hook-form";

import {
  Field,
  FieldError,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EnrollmentFormValues } from "./EnrollmentForm";

type FeeAssessmentProps = {
  form: UseFormReturn<EnrollmentFormValues>;
  discounts: {
    id: string;
    name: string;
    amount: number;
  }[];
  tuitionFees: {
    grade_level: string;
    base_tuition: number;
    miscellaneous: number;
    total_tuition: number;
  }[];
  books: {
    id: string;
    grade_level: string;
    amount: number;
  }[];
  subsidies: {
    id: string;
    subsidy_name: string;
    amount: number;
  }[];
  isPending: boolean;
  isValid: boolean;
  onPrevious: () => void;
  onContinue: () => void;
};

export default function FeeAssessment({
  form,
  discounts,
  tuitionFees,
  books,
  subsidies,
  isPending,
  isValid,
  onPrevious,
  onContinue,
}: FeeAssessmentProps) {
  const students = form.watch("students");

  const formatCurrency = (value: number) =>
    `₱${value.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="space-y-5">
      {students.map((student, studentIndex) => (
        <StudentFeeAssessment
          key={`${student.first_name}-${studentIndex}`}
          form={form}
          studentIndex={studentIndex}
          discounts={discounts}
          tuitionFees={tuitionFees}
          books={books}
          subsidies={subsidies}
          isPending={isPending}
          formatCurrency={formatCurrency}
        />
      ))}

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onPrevious}
        >
          Previous
        </Button>

        <Button
          type="button"
          disabled={isPending || !isValid}
          onClick={onContinue}
        >
          Continue to Fee Settlement
        </Button>
      </div>
    </div>
  );
}

function StudentFeeAssessment({
  form,
  studentIndex,
  discounts,
  tuitionFees,
  books,
  subsidies,
  isPending,
  formatCurrency,
}: {
  form: UseFormReturn<EnrollmentFormValues>;
  studentIndex: number;
  discounts: {
    id: string;
    name: string;
    amount: number;
  }[];
  tuitionFees: {
    grade_level: string;
    base_tuition: number;
    miscellaneous: number;
    total_tuition: number;
  }[];
  books: {
    id: string;
    grade_level: string;
    amount: number;
  }[];
  subsidies: {
    id: string;
    subsidy_name: string;
    amount: number;
  }[];
  isPending: boolean;
  formatCurrency: (value: number) => string;
}) {
  const student = form.watch(`students.${studentIndex}`);

  const {
    fields: discountFields,
    append: appendDiscount,
    remove: removeDiscount,
  } = useFieldArray({
    control: form.control,
    name: `students.${studentIndex}.discounts`,
  });

  const tuitionFee = tuitionFees.find(
    (fee) => fee.grade_level === student.grade_level,
  );

  const totalBooksFee = books
    .filter((book) => book.grade_level === student.grade_level)
    .reduce((sum, book) => sum + (Number(book.amount) || 0), 0);

  // Check if JHS (Grades 7 to 10)
  const normalizedGrade = student.grade_level?.toLowerCase() || "";
  const isJhsGrade = [
    "7",
    "8",
    "9",
    "10",
    "grade 7",
    "grade 8",
    "grade 9",
    "grade 10",
  ].includes(normalizedGrade);

  // Find ESC subsidy amount from database
  const escSubsidyObj = subsidies.find((s) =>
    s.subsidy_name.toLowerCase().includes("esc"),
  );
  const escVoucherAmount = escSubsidyObj ? Number(escSubsidyObj.amount) : 9000;

  const discountValues = useWatch({
    control: form.control,
    name: `students.${studentIndex}.discounts`,
  });

  const selectedDiscountPercentage = (discountValues ?? [])
    .filter((discount) => discount.id)
    .reduce((total, discount) => total + (Number(discount.amount) || 0), 0);

  const discountPercentage = Math.min(selectedDiscountPercentage, 100);

  // 1. Base Tuition after regular discounts
  const baseTuitionAfterDiscount = tuitionFee
    ? tuitionFee.base_tuition * (1 - discountPercentage / 100)
    : 0;

  // 2. Cascading ESC Subsidy Logic
  const isEscEligible = Boolean(student.is_esc);
  let adjustedBaseTuition = baseTuitionAfterDiscount;
  let adjustedMiscellaneous = tuitionFee ? tuitionFee.miscellaneous : 0;

  if (isJhsGrade && isEscEligible) {
    let remainingSubsidy = escVoucherAmount;

    // Deduct from base tuition first
    if (remainingSubsidy >= adjustedBaseTuition) {
      remainingSubsidy -= adjustedBaseTuition;
      adjustedBaseTuition = 0;
    } else {
      adjustedBaseTuition -= remainingSubsidy;
      remainingSubsidy = 0;
    }

    // If subsidy remains, deduct from miscellaneous
    if (remainingSubsidy > 0) {
      if (remainingSubsidy >= adjustedMiscellaneous) {
        adjustedMiscellaneous = 0;
      } else {
        adjustedMiscellaneous -= remainingSubsidy;
      }
    }
  }

  const adjustedTotalTuition = adjustedBaseTuition + adjustedMiscellaneous;

  useEffect(() => {
    form.setValue(
      `students.${studentIndex}.adjusted_base_tuition` as Path<EnrollmentFormValues>,
      adjustedBaseTuition,
    );
    form.setValue(
      `students.${studentIndex}.adjusted_miscellaneous` as Path<EnrollmentFormValues>,
      adjustedMiscellaneous,
    );
    form.setValue(
      `students.${studentIndex}.adjusted_total_tuition_fee` as Path<EnrollmentFormValues>,
      adjustedTotalTuition,
    );
  }, [
    adjustedBaseTuition,
    adjustedMiscellaneous,
    adjustedTotalTuition,
    form,
    studentIndex,
  ]);

  return (
    <div className="bg-card rounded-lg border p-4 sm:p-5">
      <FieldSet className="gap-5">
        <div>
          <FieldTitle className="text-foreground text-[16px]">
            {student.first_name + " " + student.last_name ||
              `Student ${studentIndex + 1}`}{" "}
            — Fee Assessment
          </FieldTitle>

          {student.grade_level && (
            <p className="text-sm text-muted-foreground font-medium mt-1">
              Grade {student.grade_level}
            </p>
          )}
        </div>

        {/* Standard Fee Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Field>
            <FieldLabel>Base Tuition</FieldLabel>
            <Input
              value={tuitionFee ? formatCurrency(tuitionFee.base_tuition) : ""}
              readOnly
              disabled={isPending}
            />
          </Field>

          <Field>
            <FieldLabel>Miscellaneous</FieldLabel>
            <Input
              value={tuitionFee ? formatCurrency(tuitionFee.miscellaneous) : ""}
              readOnly
              disabled={isPending}
            />
          </Field>

          <Field>
            <FieldLabel>Books Fee</FieldLabel>
            <Input
              value={formatCurrency(totalBooksFee)}
              readOnly
              disabled={isPending}
            />
          </Field>

          <Field>
            <FieldLabel>Total Tuition</FieldLabel>
            <Input
              value={tuitionFee ? formatCurrency(tuitionFee.total_tuition) : ""}
              readOnly
              disabled={isPending}
            />
          </Field>
        </div>

        {/* ESC Subsidy Toggle (Grades 7 to 10 Only) */}
        {isJhsGrade && (
          <div className="border-t pt-5 bg-muted/30 p-4 rounded-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold">ESC Subsidy (DepEd)</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Applies a ₱{escVoucherAmount.toLocaleString()} voucher toward
                  Base Tuition and Miscellaneous fees.
                </p>
              </div>

              <Controller
                name={
                  `students.${studentIndex}.is_esc` as Path<EnrollmentFormValues>
                }
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-center gap-1 bg-background border p-1 rounded-lg">
                    <Button
                      type="button"
                      size="sm"
                      variant={field.value === true ? "default" : "ghost"}
                      onClick={() => field.onChange(true)}
                      disabled={isPending}
                      className="h-8 px-4 text-xs font-medium"
                    >
                      Eligible (Yes)
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        field.value === false || field.value === undefined
                          ? "default"
                          : "ghost"
                      }
                      onClick={() => field.onChange(false)}
                      disabled={isPending}
                      className="h-8 px-4 text-xs font-medium"
                    >
                      Not Eligible (No)
                    </Button>
                  </div>
                )}
              />
            </div>
          </div>
        )}

        {/* Discounts Section */}
        <div className="border-t pt-5">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Discounts</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Select applicable discounts. Deducted from the base tuition.
              </p>
            </div>

            {discountFields.map((discountField, discountIndex) => {
              const selectedDiscountIds = discountFields.map((d) => d.id);
              const availableDiscounts = discounts.filter(
                (d) =>
                  d.id === discountField.id ||
                  !selectedDiscountIds.includes(d.id),
              );

              return (
                <div
                  key={discountField.id}
                  className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_100px_auto] gap-3 items-end"
                >
                  <Controller
                    name={`students.${studentIndex}.discounts.${discountIndex}.id`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Discount</FieldLabel>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={(value) => {
                            const selected = discounts.find(
                              (d) => d.id === value,
                            );
                            if (!selected) return;
                            field.onChange(selected.id);
                            form.setValue(
                              `students.${studentIndex}.discounts.${discountIndex}.name`,
                              selected.name,
                              { shouldDirty: true, shouldValidate: true },
                            );
                            form.setValue(
                              `students.${studentIndex}.discounts.${discountIndex}.amount`,
                              selected.amount,
                              { shouldDirty: true, shouldValidate: true },
                            );
                          }}
                        >
                          <SelectTrigger disabled={isPending}>
                            <SelectValue placeholder="Select discount" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {availableDiscounts.map((d) => (
                              <SelectItem key={d.id} value={d.id}>
                                {d.name} — {d.amount}%
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={isPending}
                    onClick={() => removeDiscount(discountIndex)}
                  >
                    Remove
                  </Button>
                </div>
              );
            })}

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={
                  isPending || discountFields.length >= discounts.length
                }
                onClick={() => appendDiscount({ id: "", name: "", amount: 0 })}
              >
                Add Discount
              </Button>
            </div>
          </div>
        </div>

        {/* Adjusted Totals Display */}
        {tuitionFee && (
          <div className="border-t pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field>
                <FieldLabel>Adjusted Base Tuition</FieldLabel>
                <Input
                  value={formatCurrency(adjustedBaseTuition)}
                  readOnly
                  disabled={isPending}
                />
              </Field>

              <Field>
                <FieldLabel>Adjusted Miscellaneous</FieldLabel>
                <Input
                  value={formatCurrency(adjustedMiscellaneous)}
                  readOnly
                  disabled={isPending}
                />
              </Field>

              <Field>
                <FieldLabel>Adjusted Total Tuition</FieldLabel>
                <Input
                  value={formatCurrency(adjustedTotalTuition)}
                  readOnly
                  disabled={isPending}
                />
              </Field>
            </div>
          </div>
        )}
      </FieldSet>
    </div>
  );
}
