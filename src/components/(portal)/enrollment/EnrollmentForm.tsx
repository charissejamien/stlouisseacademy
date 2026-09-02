"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

import StudentInformation from "./StudentInformation";
import ParentInformation from "./ParentInformation";
import FeeAssessment from "./FeeAssessment";
import FeeSettlement from "./FeeSettlement";
import { processEnrollment } from "@/app/(portal)/enrollment/actions";
import { EnrollmentClientContainerProps } from "./EnrollmentClientContainer";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const suffixes = ["Jr.", "II", "III", "IV", "V"] as const;
const genders = ["Male", "Female"] as const;
const paymentModes = ["Cash", "GCash", "Bank Transfer"] as const;

const studentSchema = z.object({
  students: z.array(
    z.object({
      school_year: z.string().min(1, "School year is required"),
      grade_level: z.string().min(1, "Grade level is required"),
      student_type: z.string().min(1, "Student type is required"),
      lrn: z
        .string()
        .regex(/^\d{12}$/, "LRN must be exactly 12 digits")
        .optional()
        .or(z.literal("")),
      first_name: z.string().min(2, "First name is required"),
      middle_name: z.string().optional().or(z.literal("")),
      last_name: z.string().min(2, "Last name is required"),
      suffix: z.enum(suffixes).optional(),
      address: z.string().min(10, "Home address is required"),
      date_of_birth: z.string().optional().or(z.literal("")),
      gender: z.enum(genders),
      payments: z.array(
        z.object({
          billing_period: z.string().min(1, "Billing period is required"),
          amount: z
            .string()
            .min(1, "Amount is required")
            .refine(
              (value) => Number(value) > 0,
              "Amount must be greater than 0",
            ),
        }),
      ),
      discounts: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          amount: z.number(),
        }),
      ),
      is_esc: z.boolean().optional(),

      adjusted_base_tuition: z.number().optional(),
      adjusted_miscellaneous: z.number().optional(),
      adjusted_total_tuition_fee: z.number().optional(),
    }),
  ),
});

const parentSchema = z.object({
  parent_id: z.string().optional().or(z.literal("")),
  parent_first_name: z.string().optional().or(z.literal("")),
  parent_middle_name: z.string().optional().or(z.literal("")),
  parent_last_name: z.string().optional().or(z.literal("")),
  parent_suffix: z.enum(suffixes).optional(),
  parent_contact_number: z.string().optional().or(z.literal("")),
  parent_email: z.string().optional().or(z.literal("")),
  parent_address: z.string().optional().or(z.literal("")),
  parent_gender: z.enum(genders).optional(),
});

const paymentSchema = z.object({
  payment_date: z.string().min(1, "Payment date is required"),
  or_number: z.string().min(1, "OR number is required"),
  payment_mode: z.enum(paymentModes),
});

const enrollmentFormSchema = z.object({
  ...studentSchema.shape,
  ...parentSchema.shape,
  ...paymentSchema.shape,
});

export type EnrollmentFormValues = z.infer<typeof enrollmentFormSchema>;

type EnrollmentStep =
  | "Student Information"
  | "Parent Information"
  | "Fee Assessment"
  | "Fee Settlement";

const enrollmentSteps: EnrollmentStep[] = [
  "Student Information",
  "Parent Information",
  "Fee Assessment",
  "Fee Settlement",
];

type EnrollmentFormProps = EnrollmentClientContainerProps;

export default function EnrollmentForm({
  schoolYears,
  gradeLevels,
  billingPeriods,
  discounts,
  tuitionFees,
  books,
  subsidies,
}: EnrollmentFormProps) {
  const [enrollmentStep, setEnrollmentStep] = useState<EnrollmentStep>(
    "Student Information",
  );

  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentFormSchema),

    defaultValues: {
      students: [
        {
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
          gender: undefined,
          payments: [
            {
              billing_period: "",
              amount: "",
            },
          ],
          discounts: [],
          is_esc: false,
          adjusted_base_tuition: 0,
          adjusted_miscellaneous: 0,
          adjusted_total_tuition_fee: 0,
        },
      ],

      parent_first_name: "",
      parent_middle_name: "",
      parent_last_name: "",
      parent_suffix: undefined,
      parent_contact_number: "",
      parent_email: "",
      parent_address: "",
      parent_gender: undefined,

      payment_date: new Date().toISOString().split("T")[0],
      or_number: "",
      payment_mode: undefined,
    },

    mode: "onChange",
  });

  const values = useWatch({
    control: form.control,
  });

  const studentInformationSchema = z.object({
    students: z.array(
      z.object({
        school_year: z.string().min(1, "School year is required"),
        grade_level: z.string().min(1, "Grade level is required"),
        student_type: z.string().min(1, "Student type is required"),
        lrn: z
          .string()
          .regex(/^\d{12}$/, "LRN must be exactly 12 digits")
          .optional()
          .or(z.literal("")),
        first_name: z.string().min(2, "First name is required"),
        middle_name: z.string().optional().or(z.literal("")),
        last_name: z.string().min(2, "Last name is required"),
        suffix: z.enum(suffixes).optional(),
        address: z.string().min(10, "Home address is required"),
        date_of_birth: z.string().optional().or(z.literal("")),
        gender: z.enum(genders),
      }),
    ),
  });

  const isStudentStepValid = studentInformationSchema.safeParse(values).success;
  const isParentStepValid = true;

  const isFeeAssessmentStepValid =
    values.students?.every((student) =>
      tuitionFees.some((fee) => fee.grade_level === student.grade_level),
    ) ?? false;

  const processEnrollmentMutation = useMutation({
    mutationFn: processEnrollment,

    onSuccess: () => {
      toast.success("Enrollment processed successfully!");
      form.reset();
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to process enrollment.",
      );
    },
  });

  function onSubmit(data: EnrollmentFormValues) {
    const payload = {
      ...data,
      students: data.students.map((student) => {
        const foundYear = schoolYears.find(
          (sy) => `${sy.start_year} - ${sy.end_year}` === student.school_year,
        );

        return {
          ...student,
          school_year_id: foundYear ? foundYear.id : null,
          payments: student.payments.map((payment) => {
            // Find matching billing period name using the selected ID
            const foundPeriod = billingPeriods.find(
              (bp) => bp.id === payment.billing_period,
            );

            return {
              ...payment,
              // Replace the ID with the period name (e.g. "June Installment")
              billing_period: foundPeriod
                ? foundPeriod.period_name
                : payment.billing_period,
            };
          }),
        };
      }),
    };

    processEnrollmentMutation.mutate(payload);
  }

  const isPending = processEnrollmentMutation.isPending;

  return (
    <Tabs
      value={enrollmentStep}
      onValueChange={(value) => setEnrollmentStep(value as EnrollmentStep)}
    >
      <TabsList className="bg-card h-10!">
        {enrollmentSteps.map((step, index) => (
          <TabsTrigger
            key={step}
            value={step}
            disabled={
              (step === "Parent Information" && !isStudentStepValid) ||
              (step === "Fee Assessment" &&
                (!isStudentStepValid || !isParentStepValid)) ||
              (step === "Fee Settlement" &&
                (!isStudentStepValid ||
                  !isParentStepValid ||
                  !isFeeAssessmentStepValid))
            }
            className="data-active:bg-accent px-2"
          >
            <Badge className="size-5">{index + 1}</Badge>
            {step}
          </TabsTrigger>
        ))}
      </TabsList>

      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("Validation errors:", errors);
        })}
      >
        {enrollmentStep === "Student Information" && (
          <StudentInformation
            form={form}
            schoolYears={schoolYears}
            gradeLevels={gradeLevels}
            tuitionFees={tuitionFees}
            books={books}
            isPending={isPending}
            isValid={isStudentStepValid}
            onContinue={() => setEnrollmentStep("Parent Information")}
          />
        )}

        {enrollmentStep === "Parent Information" && (
          <ParentInformation
            form={form}
            isPending={isPending}
            onPrevious={() => setEnrollmentStep("Student Information")}
            onContinue={() => setEnrollmentStep("Fee Assessment")}
          />
        )}

        {enrollmentStep === "Fee Assessment" && (
          <FeeAssessment
            form={form}
            discounts={discounts}
            tuitionFees={tuitionFees}
            books={books}
            subsidies={subsidies}
            isPending={isPending}
            isValid={isFeeAssessmentStepValid}
            onPrevious={() => setEnrollmentStep("Parent Information")}
            onContinue={() => setEnrollmentStep("Fee Settlement")}
          />
        )}

        {enrollmentStep === "Fee Settlement" && (
          <FeeSettlement
            form={form}
            billingPeriods={billingPeriods}
            isPending={isPending}
            isValid={true}
            onPrevious={() => setEnrollmentStep("Fee Assessment")}
          />
        )}
      </form>
    </Tabs>
  );
}
