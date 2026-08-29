import { z } from "zod"

export const paymentItemSchema = z.object({
  studentId: z
    .string()
    .uuid("Invalid student."),

  paymentSpecific: z
    .string()
    .trim()
    .min(1, "Payment specific is required."),

  amount: z
    .number()
    .positive("Amount must be greater than 0.")
    .finite("Amount must be a valid number."),
})

export const addPaymentSchema = z.object({
  orNumber: z
    .string()
    .trim()
    .min(1, "OR number is required.")
    .max(50, "OR number is too long."),

  paymentDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Invalid payment date."
    ),

  modeOfPayment: z
    .string()
    .trim()
    .min(1, "Mode of payment is required."),

  payments: z
    .array(paymentItemSchema)
    .min(
      1,
      "At least one student payment is required."
    ),
})

export type AddPaymentInput =
  z.infer<typeof addPaymentSchema>
