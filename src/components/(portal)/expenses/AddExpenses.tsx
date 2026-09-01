"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createExpense,
  getExpenseCategories,
} from "@/app/(portal)/expenses/actions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

// 1. Define Zod Schema for validation
const expenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a valid number greater than 0",
    }),
  payment_method: z.string().min(1, "Payment method is required"),
  category_id: z.string().min(1, "Please select a category"),
  date_disbursed: z.string().min(1, "Disbursement date is required"),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export default function AddExpense() {
  const [open, setOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["expense-categories"],
    queryFn: () => getExpenseCategories(),
  });

  const todayString = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      amount: "",
      payment_method: "Cash",
      category_id: "",
      date_disbursed: todayString,
    },
  });

  const paymentMethod = watch("payment_method");
  const categoryId = watch("category_id");

  const mutation = useMutation({
    mutationFn: async (data: ExpenseFormValues) => {
      await createExpense({
        description: data.description,
        amount: Number(data.amount),
        payment_method: data.payment_method,
        category_id: data.category_id,
        date_disbursed: data.date_disbursed,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expenses-today"] });
      await queryClient.invalidateQueries({
        queryKey: ["expense-daily-summaries"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["all-itemized-expenses"],
      });
      reset();
      setOpen(false);
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      alert(errorMessage);
    },
  });

  const onSubmit: SubmitHandler<ExpenseFormValues> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      {/* Wider modal layout with relaxed inner padding */}
      <DialogContent className="sm:max-w-xl p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <DialogHeader className="space-y-1.5">
            <DialogTitle className="text-xl font-semibold">
              Record New Expense
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Enter the expense details and specify the disbursement date and
              category.
            </DialogDescription>
          </DialogHeader>

          {/* Form Fields Container with generous spacing */}
          <div className="space-y-5">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Input
                id="description"
                placeholder="e.g., Teachers lunch, Office internet"
                className="h-11"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-destructive mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Amount & Disbursement Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount (₱)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="h-11"
                  {...register("amount")}
                />
                {errors.amount && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_disbursed" className="text-sm font-medium">
                  Disbursement Date
                </Label>
                <Input
                  id="date_disbursed"
                  type="date"
                  className="h-11"
                  {...register("date_disbursed")}
                />
                {errors.date_disbursed && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.date_disbursed.message}
                  </p>
                )}
              </div>
            </div>

            {/* Category (Full Width) */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Select
                value={categoryId}
                onValueChange={(val: string) =>
                  setValue("category_id", val, { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-xs text-destructive mt-1">
                  {errors.category_id.message}
                </p>
              )}
            </div>

            {/* Payment Method (Full Width) */}
            <div className="space-y-2">
              <Label htmlFor="payment_method" className="text-sm font-medium">
                Payment Method
              </Label>
              <Select
                value={paymentMethod}
                onValueChange={(val: string) => setValue("payment_method", val)}
              >
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="GCash">GCash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              className="w-full sm:w-auto h-11 px-6"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Save Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
