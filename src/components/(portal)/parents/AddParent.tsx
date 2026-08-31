"use client"

import { useState } from "react"
import { z } from "zod"
import toast from "react-hot-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"

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

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { inviteUserByEmail } from "@/app/(portal)/user-accounts/actions"

const addParentSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required"),

  middleName: z
    .string()
    .trim()
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required"),

  suffix: z
    .string()
    .trim()
    .optional(),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  contactNumber: z
    .string()
    .trim()
    .min(1, "Contact number is required"),
})

type AddParentForm = z.infer<typeof addParentSchema>

const suffixes = [
  "Sr.",
  "Jr.",
  "II",
  "III",
  "IV",
  "V",
]

export default function AddParent() {
  const [open, setOpen] = useState(false)

  const queryClient = useQueryClient()

  const [form, setForm] = useState<AddParentForm>({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    email: "",
    contactNumber: "",
  })

  const [errors, setErrors] = useState<
    Partial<Record<keyof AddParentForm, string>>
  >({})

  const addParent = useMutation({
    mutationFn: (data: AddParentForm) =>
      inviteUserByEmail({
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        suffix: data.suffix,
        email: data.email,
        role: "parent",
        contactNumber: data.contactNumber,
      }),

    onSuccess: () => {
      toast.success(
        "Parent successfully invited by email!"
      )

      queryClient.invalidateQueries({
        queryKey: ["parents"],
      })

      setForm({
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        email: "",
        contactNumber: "",
      })

      setErrors({})
      setOpen(false)
    },

    onError: (error) => {
      toast.error(error.message)
    },
  })

  const updateField = (
    field: keyof AddParentForm,
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

  const handleSubmit = () => {
    const result =
      addParentSchema.safeParse(form)

    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof AddParentForm, string>
      > = {}

      result.error.issues.forEach((issue) => {
        const field =
          issue.path[0] as keyof AddParentForm

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      })

      setErrors(fieldErrors)
      return
    }

    setErrors({})
    addParent.mutate(result.data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Add Parent
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Add Parent
          </DialogTitle>

          <DialogDescription>
            Enter the parent&apos;s information.
            An invitation will be sent to their email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* First Name + Middle Name */}
          <div className="grid grid-cols-[3fr_2fr] gap-4">
            <div className="space-y-2">
              <Label htmlFor="parent-first-name">
                First Name
              </Label>

              <Input
                id="parent-first-name"
                placeholder="First name"
                value={form.firstName}
                onChange={(e) =>
                  updateField(
                    "firstName",
                    e.target.value
                  )
                }
              />

              {errors.firstName && (
                <p className="text-sm text-destructive">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent-middle-name">
                Middle Name
                <span className="ml-1 text-muted-foreground">
                  (optional)
                </span>
              </Label>

              <Input
                id="parent-middle-name"
                placeholder="Middle name"
                value={form.middleName}
                onChange={(e) =>
                  updateField(
                    "middleName",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          {/* Last Name + Suffix */}
          <div className="grid grid-cols-[3fr_2fr] gap-4">
            <div className="space-y-2">
              <Label htmlFor="parent-last-name">
                Last Name
              </Label>

              <Input
                id="parent-last-name"
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) =>
                  updateField(
                    "lastName",
                    e.target.value
                  )
                }
              />

              {errors.lastName && (
                <p className="text-sm text-destructive">
                  {errors.lastName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent-suffix">
                Suffix
                <span className="ml-1 text-muted-foreground">
                  (optional)
                </span>
              </Label>

              <select
                id="parent-suffix"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.suffix}
                onChange={(e) =>
                  updateField(
                    "suffix",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select
                </option>

                {suffixes.map((suffix) => (
                  <option
                    key={suffix}
                    value={suffix}
                  >
                    {suffix}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="parent-email">
              Email
            </Label>

            <Input
              id="parent-email"
              type="email"
              placeholder="parent@example.com"
              value={form.email}
              onChange={(e) =>
                updateField(
                  "email",
                  e.target.value
                )
              }
            />

            <p className="text-xs text-muted-foreground">
              This email will be used for their Google
              login and invitation.
            </p>

            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <Label htmlFor="parent-contact-number">
              Contact Number
            </Label>

            <Input
              id="parent-contact-number"
              type="tel"
              placeholder="09XXXXXXXXX"
              value={form.contactNumber}
              onChange={(e) =>
                updateField(
                  "contactNumber",
                  e.target.value
                )
              }
            />

            {errors.contactNumber && (
              <p className="text-sm text-destructive">
                {errors.contactNumber}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={addParent.isPending}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={handleSubmit}
            disabled={addParent.isPending}
          >
            {addParent.isPending
              ? "Sending..."
              : "Send Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}