"use client"

import { useState } from "react"
import { z } from "zod"
import toast from "react-hot-toast"
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  addSection,
  getSectionFormData,
} from "@/app/(portal)/classes/actions"

// ------------------------------------------
// Validation Schema
// ------------------------------------------

const addSectionSchema = z.object({
  gradeLevelId: z
    .string()
    .min(1, "Grade level is required"),

  // Section name is optional
  sectionName: z
    .string()
    .trim()
    .optional(),

  sectionCode: z
    .string()
    .trim()
    .optional(),

  adviserId: z
    .string()
    .optional(),

  classSize: z
    .string()
    .optional(),
})

type AddSectionForm = z.infer<
  typeof addSectionSchema
>

// ------------------------------------------
// Initial Form
// ------------------------------------------

const initialForm: AddSectionForm = {
  gradeLevelId: "",
  sectionName: "",
  sectionCode: "",
  adviserId: "",
  classSize: "",
}

// ------------------------------------------
// Component
// ------------------------------------------

export default function AddSection() {
  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)

  const [form, setForm] =
    useState<AddSectionForm>(initialForm)

  const [errors, setErrors] = useState<
    Partial<
      Record<keyof AddSectionForm, string>
    >
  >({})

  // ------------------------------------------
  // Load Grade Levels + Advisers
  // ------------------------------------------

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["section-form-data"],
    queryFn: getSectionFormData,
    enabled: open,
  })

  // ------------------------------------------
  // Add Section Mutation
  // ------------------------------------------

  const addSectionMutation = useMutation({
    mutationFn: () => {
      const classSize = form.classSize
        ? Number(form.classSize)
        : undefined

      return addSection({
        gradeLevelId:
          form.gradeLevelId,

        // Send undefined when empty
        sectionName:
          form.sectionName?.trim() || undefined,

        sectionCode:
          form.sectionCode?.trim() || undefined,

        adviserId:
          form.adviserId || undefined,

        classSize,
      })
    },

    onSuccess: () => {
      toast.success(
        "Section successfully added."
      )

      queryClient.invalidateQueries({
        queryKey: ["classes"],
      })

      queryClient.invalidateQueries({
        queryKey: ["sections"],
      })

      setForm(initialForm)
      setErrors({})
      setOpen(false)
    },

    onError: (error) => {
      toast.error(error.message)
    },
  })

  // ------------------------------------------
  // Update Field
  // ------------------------------------------

  const updateField = (
    field: keyof AddSectionForm,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }))
  }

  // ------------------------------------------
  // Submit
  // ------------------------------------------

  const handleSubmit = () => {
    const result =
      addSectionSchema.safeParse(form)

    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof AddSectionForm, string>
      > = {}

      result.error.issues.forEach((issue) => {
        const field =
          issue.path[0] as keyof AddSectionForm

        if (!fieldErrors[field]) {
          fieldErrors[field] =
            issue.message
        }
      })

      setErrors(fieldErrors)
      return
    }

    // ----------------------------------------
    // Validate Class Size
    // ----------------------------------------

    if (
      result.data.classSize &&
      (
        isNaN(
          Number(result.data.classSize)
        ) ||
        Number(result.data.classSize) < 1
      )
    ) {
      setErrors({
        classSize:
          "Class size must be a valid number.",
      })

      return
    }

    setErrors({})

    addSectionMutation.mutate()
  }

  // ------------------------------------------
  // Render
  // ------------------------------------------

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          Add Section
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">

        <DialogHeader>
          <DialogTitle>
            Add Section
          </DialogTitle>

          <DialogDescription>
            Create a new section for the
            active school year.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">

          {/* -------------------------------- */}
          {/* Grade Level */}
          {/* -------------------------------- */}

          <div className="space-y-2">
            <Label>
              Grade Level
              <span className="ml-1 text-destructive">
                *
              </span>
            </Label>

            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={form.gradeLevelId}
                onValueChange={(value) =>
                  updateField(
                    "gradeLevelId",
                    value
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>

                <SelectContent>
                  {data?.gradeLevels.map(
                    (grade) => (
                      <SelectItem
                        key={grade.id}
                        value={grade.id}
                      >
                        {grade.grade_level}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}

            {errors.gradeLevelId && (
              <p className="text-xs text-destructive">
                {errors.gradeLevelId}
              </p>
            )}
          </div>

          {/* -------------------------------- */}
          {/* Section Name */}
          {/* -------------------------------- */}

          <div className="space-y-2">
            <Label htmlFor="section-name">
              Section Name
            </Label>

            <Input
              id="section-name"
              placeholder="e.g. St. Matthew"
              value={form.sectionName}
              onChange={(e) =>
                updateField(
                  "sectionName",
                  e.target.value
                )
              }
            />

            <p className="text-xs text-muted-foreground">
              Optional. Leave blank if this
              grade level does not use named
              sections.
            </p>

            {errors.sectionName && (
              <p className="text-xs text-destructive">
                {errors.sectionName}
              </p>
            )}
          </div>

          {/* -------------------------------- */}
          {/* Section Code */}
          {/* -------------------------------- */}

          <div className="space-y-2">
            <Label htmlFor="section-code">
              Section Code
            </Label>

            <Input
              id="section-code"
              placeholder="e.g. G1-SM"
              value={form.sectionCode}
              onChange={(e) =>
                updateField(
                  "sectionCode",
                  e.target.value
                )
              }
            />
          </div>

          {/* -------------------------------- */}
          {/* Adviser */}
          {/* -------------------------------- */}

          <div className="space-y-2">
            <Label>
              Section Adviser
            </Label>

            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={form.adviserId}
                onValueChange={(value) =>
                  updateField(
                    "adviserId",
                    value
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select adviser" />
                </SelectTrigger>

                <SelectContent>
                  {data?.advisers.length ===
                  0 ? (
                    <SelectItem
                      value="none"
                      disabled
                    >
                      No active academic
                      employees found
                    </SelectItem>
                  ) : (
                    data?.advisers.map(
                      (adviser) => (
                        <SelectItem
                          key={adviser.id}
                          value={adviser.id}
                        >
                          {adviser.name}
                          {" — "}
                          {adviser.employee_id}
                        </SelectItem>
                      )
                    )
                  )}
                </SelectContent>
              </Select>
            )}

            <p className="text-xs text-muted-foreground">
              You can assign an adviser later.
            </p>

            {errors.adviserId && (
              <p className="text-xs text-destructive">
                {errors.adviserId}
              </p>
            )}
          </div>

          {/* -------------------------------- */}
          {/* Class Size */}
          {/* -------------------------------- */}

          <div className="space-y-2">
            <Label htmlFor="class-size">
              Class Size
            </Label>

            <Input
              id="class-size"
              type="number"
              min={1}
              placeholder="e.g. 30"
              value={form.classSize}
              onChange={(e) =>
                updateField(
                  "classSize",
                  e.target.value
                )
              }
            />

            {errors.classSize && (
              <p className="text-xs text-destructive">
                {errors.classSize}
              </p>
            )}
          </div>

          {/* -------------------------------- */}
          {/* Loading Error */}
          {/* -------------------------------- */}

          {isError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              Failed to load section
              options:{" "}
              {error.message}
            </div>
          )}

        </div>

        {/* -------------------------------- */}
        {/* Footer */}
        {/* -------------------------------- */}

        <DialogFooter>

          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={
                addSectionMutation.isPending
              }
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              isError ||
              addSectionMutation.isPending
            }
          >
            {addSectionMutation.isPending
              ? "Adding..."
              : "Add Section"}
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}
