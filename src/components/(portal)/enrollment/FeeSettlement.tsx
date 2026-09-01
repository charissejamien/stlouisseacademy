"use client";

import { Controller, UseFormReturn, useFieldArray } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Asterisk from "@/components/shared/Asterisk";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EnrollmentFormValues } from "./EnrollmentForm";

const paymentModes = ["Cash", "GCash", "Bank Transfer"] as const;

type FeeSettlementProps = {
  form: UseFormReturn<EnrollmentFormValues>;
  billingPeriods: {
    id: string;
    period_name: string;
  }[];
  isPending: boolean;
  isValid: boolean;
  onPrevious: () => void;
};

export default function FeeSettlement({
  form,
  billingPeriods,
  isPending,
  isValid,
  onPrevious,
}: FeeSettlementProps) {
  const students = form.watch("students");

  return (
    <div className="space-y-4">
      {/* Payment Details */}
      <div className="bg-card rounded-lg p-5">
        <FieldSet className="gap-4">
          <FieldTitle className="text-muted-foreground">
            Payment Details
          </FieldTitle>

          <FieldGroup className="flex-row gap-3">
            {/* Payment Date */}
            <Controller
              name="payment_date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Payment Date <Asterisk />
                  </FieldLabel>

                  <Input
                    type="date"
                    {...field}
                    id={field.name}
                    disabled={isPending}
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* OR Number */}
            <Controller
              name="or_number"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    OR Number <Asterisk />
                  </FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    disabled={isPending}
                    placeholder="Enter OR number"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Payment Mode */}
            <Controller
              name="payment_mode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Mode of Payment <Asterisk />
                  </FieldLabel>

                  <Select
                    name={field.name}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id={field.name}
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>

                    <SelectContent position="popper">
                      {paymentModes.map((mode) => (
                        <SelectItem key={mode} value={mode}>
                          {mode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>
      </div>

      {/* Student Fees */}
      {students.map((student, studentIndex) => (
        <StudentPaymentSection
          key={`${student.first_name}-${studentIndex}`}
          form={form}
          studentIndex={studentIndex}
          billingPeriods={billingPeriods}
          isPending={isPending}
        />
      ))}

      {/* Payment Summary */}
      <div className="bg-card rounded-lg p-5">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total Amount to Pay</span>

          <span className="text-2xl font-bold">
            ₱
            {students
              .reduce(
                (studentTotal, student) =>
                  studentTotal +
                  (student.payments ?? []).reduce(
                    (paymentTotal, payment) =>
                      paymentTotal + (Number(payment.amount) || 0),
                    0,
                  ),
                0,
              )
              .toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onPrevious}
        >
          Previous
        </Button>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Processing..." : "Process Enrollment"}
        </Button>
      </div>
    </div>
  );
}

function StudentPaymentSection({
  form,
  studentIndex,
  billingPeriods,
  isPending,
}: {
  form: UseFormReturn<EnrollmentFormValues>;
  studentIndex: number;
  billingPeriods: {
    id: string;
    period_name: string;
  }[];
  isPending: boolean;
}) {
  const student = form.watch(`students.${studentIndex}`);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `students.${studentIndex}.payments`,
  });

  return (
    <div className="bg-card rounded-lg border p-4 sm:p-5">
      <FieldSet className="gap-4">
        <FieldTitle className="text-muted-foreground">
          {student.first_name || `Student ${studentIndex + 1}`} — Payment
        </FieldTitle>

        {fields.map((field, paymentIndex) => (
          <FieldGroup
            key={field.id}
            className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_140px_auto] gap-3 items-end"
          >
            {/* Payment Specifics */}
            <Controller
              name={`students.${studentIndex}.payments.${paymentIndex}.billing_period`}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Payment Specifics <Asterisk />
                  </FieldLabel>

                  <Select
                    name={field.name}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id={field.name}
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select billing period" />
                    </SelectTrigger>

                    <SelectContent position="popper">
                      {billingPeriods.map((period) => (
                        <SelectItem key={period.id} value={period.id}>
                          {period.period_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Amount */}
            <Controller
              name={`students.${studentIndex}.payments.${paymentIndex}.amount`}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Amount <Asterisk />
                  </FieldLabel>

                  <Input
                    id={field.name}
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    disabled={isPending}
                    aria-invalid={fieldState.invalid}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Remove Payment */}
            <Button
              type="button"
              variant="destructive"
              disabled={fields.length === 1 || isPending}
              onClick={() => remove(paymentIndex)}
              className="w-full sm:w-auto"
            >
              Remove
            </Button>
          </FieldGroup>
        ))}

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() =>
              append({
                billing_period: "",
                amount: "",
              })
            }
          >
            Add Payment
          </Button>
        </div>
      </FieldSet>
    </div>
  );
}
