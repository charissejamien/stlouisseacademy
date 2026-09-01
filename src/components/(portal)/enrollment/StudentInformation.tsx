"use client";

import {
  Controller,
  UseFormReturn,
  useFieldArray,
  ControllerRenderProps,
  ControllerFieldState,
} from "react-hook-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";

import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Asterisk from "@/components/shared/Asterisk";
import { EnrollmentFormValues } from "./EnrollmentForm";

const suffixes = ["Jr.", "II", "III", "IV", "V"] as const;

type StudentFieldName =
  | "school_year"
  | "grade_level"
  | "student_type"
  | "lrn"
  | "first_name"
  | "middle_name"
  | "last_name"
  | "suffix"
  | "address"
  | "date_of_birth"
  | "gender";

type StudentInformationProps = {
  form: UseFormReturn<EnrollmentFormValues>;
  schoolYears: {
    start_year: string;
    end_year: string;
  }[];
  gradeLevels: {
    grade_level: string;
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
  isPending: boolean;
  isValid: boolean;
  onContinue: () => void;
};

type SelectFieldProps = {
  field: ControllerRenderProps<
    EnrollmentFormValues,
    `students.${number}.${StudentFieldName}`
  >;
  fieldState: ControllerFieldState;
  label: string;
  options: readonly string[];
  isPending: boolean;
  required?: boolean;
};

export default function StudentInformation({
  form,
  schoolYears,
  gradeLevels,
  tuitionFees,
  books,
  isPending,
  isValid,
  onContinue,
}: StudentInformationProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "students",
  });

  return (
    <div className="space-y-6">
      {fields.map((field, index) => {
        const gradeLevel = form.watch(`students.${index}.grade_level`);

        const tuitionFee = tuitionFees?.find(
          (fee) => fee.grade_level === gradeLevel,
        );

        const totalBooksFee = books
          .filter((book) => book.grade_level === gradeLevel)
          .reduce((sum, book) => sum + (Number(book.amount) || 0), 0);

        return (
          <div
            key={field.id}
            className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)] gap-5 items-start"
          >
            <div className="bg-card rounded-lg border p-4 sm:p-5">
              <FieldSet className="gap-4">
                <FieldTitle className="text-muted-foreground">
                  Student {index + 1} — Academic Information
                </FieldTitle>

                <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <Controller
                    name={`students.${index}.school_year`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <SelectField
                        field={field}
                        fieldState={fieldState}
                        label="School Year"
                        options={schoolYears.map(
                          (year) => `${year.start_year} - ${year.end_year}`,
                        )}
                        isPending={isPending}
                      />
                    )}
                  />

                  <Controller
                    name={`students.${index}.grade_level`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <SelectField
                        field={field}
                        fieldState={fieldState}
                        label="Grade Level"
                        options={gradeLevels.map((grade) => grade.grade_level)}
                        isPending={isPending}
                      />
                    )}
                  />

                  <Controller
                    name={`students.${index}.student_type`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <SelectField
                        field={field}
                        fieldState={fieldState}
                        label="Student Type"
                        options={["New", "Returning"]}
                        isPending={isPending}
                      />
                    )}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Controller
                    name={`students.${index}.lrn`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Learner Reference Number (LRN)
                        </FieldLabel>

                        <Input
                          {...field}
                          id={field.name}
                          disabled={isPending}
                          placeholder="Enter your 12-digit LRN"
                          minLength={12}
                          maxLength={12}
                          aria-invalid={fieldState.invalid}
                        />

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <div className="border-t" />

                <FieldTitle className="text-muted-foreground">
                  Personal Information
                </FieldTitle>

                <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_90px] gap-3">
                  <Controller
                    name={`students.${index}.first_name`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          First Name <Asterisk />
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          disabled={isPending}
                          aria-invalid={fieldState.invalid}
                          placeholder="John"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name={`students.${index}.middle_name`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Middle Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          disabled={isPending}
                          aria-invalid={fieldState.invalid}
                          placeholder="Joseph"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name={`students.${index}.last_name`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Last Name <Asterisk />
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          disabled={isPending}
                          aria-invalid={fieldState.invalid}
                          placeholder="Doe"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name={`students.${index}.suffix`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <SelectField
                        field={field}
                        fieldState={fieldState}
                        label="Suffix"
                        options={suffixes}
                        isPending={isPending}
                        required={false}
                      />
                    )}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Controller
                    name={`students.${index}.address`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Home Address <Asterisk />
                        </FieldLabel>

                        <Input
                          {...field}
                          id={field.name}
                          disabled={isPending}
                          aria-invalid={fieldState.invalid}
                          placeholder="123 Rizal Street, Barangay Poblacion, Daanbantayan, Cebu"
                        />

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Controller
                    name={`students.${index}.date_of_birth`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Date of Birth
                        </FieldLabel>

                        <Input
                          type="date"
                          {...field}
                          id={field.name}
                          disabled={isPending}
                          aria-invalid={fieldState.invalid}
                          max={new Date().toISOString().split("T")[0]}
                        />

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name={`students.${index}.gender`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <SelectField
                        field={field}
                        fieldState={fieldState}
                        label="Gender"
                        options={["Male", "Female"]}
                        isPending={isPending}
                      />
                    )}
                  />
                </FieldGroup>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={fields.length === 1 || isPending}
                    onClick={() => remove(index)}
                  >
                    Remove Student
                  </Button>
                </div>
              </FieldSet>
            </div>

            {/* ================================================== */}
            {/* ACADEMIC FEES — SEPARATE CARD */}
            {/* ================================================== */}

            <div className="bg-card rounded-lg border p-4 sm:p-5">
              <div className="space-y-1 mb-5">
                <h2 className="font-semibold">Academic Fees</h2>
                <p className="text-sm text-muted-foreground">
                  Based on the selected grade level.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Base Tuition</label>
                  <Input
                    value={
                      tuitionFee
                        ? `₱${tuitionFee.base_tuition.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : ""
                    }
                    placeholder="Select grade level"
                    readOnly
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Miscellaneous</label>
                  <Input
                    value={
                      tuitionFee
                        ? `₱${tuitionFee.miscellaneous.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : ""
                    }
                    placeholder="Select grade level"
                    readOnly
                    disabled={isPending}
                  />
                </div>

                {/* Restored Total Tuition Row */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Total Tuition</label>
                  <Input
                    value={
                      tuitionFee
                        ? `₱${tuitionFee.total_tuition.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : ""
                    }
                    placeholder="Select grade level"
                    readOnly
                    disabled={isPending}
                  />
                </div>

                {/* Books Fee Input (Separate) */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Books Fee</label>
                  <Input
                    value={
                      totalBooksFee > 0
                        ? `₱${totalBooksFee.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : "₱0.00"
                    }
                    readOnly
                    disabled={isPending}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() =>
            append({
              school_year: "",
              grade_level: "",
              student_type: "",
              lrn: "",
              first_name: "",
              middle_name: "",
              last_name: "",
              suffix: undefined,
              address: "",
              date_of_birth: "",
              gender: "Male",
              payments: [
                {
                  billing_period: "",
                  amount: "",
                },
              ],
              discounts: [],
            })
          }
          className="w-full sm:w-auto"
        >
          Add Student
        </Button>

        <Button
          type="button"
          disabled={isPending || !isValid}
          onClick={onContinue}
          className="w-full sm:w-auto"
        >
          Continue to Parent Information
        </Button>
      </div>
    </div>
  );
}

function SelectField({
  field,
  fieldState,
  label,
  options,
  isPending,
  required = true,
}: SelectFieldProps) {
  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>
        {label} {required && <Asterisk />}
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
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>

        <SelectContent position="popper">
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
