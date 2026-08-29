"use client"

import { useState } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { AddEmployeeContract } from "@/app/(portal)/employees/[id]/actions"

type AddEmployeeContractProps = {
  employeeId: string
}

type ContractForm = {
  type: "academic" | "support" | ""
  department:
    | "pre-elementary"
    | "elementary"
    | "junior-high-school"
    | "senior-high-school"
    | "maintenance"
    | ""
  assignment: string
  status: "active" | "expired" | "terminated" | ""
  startDate: string
  endDate: string
  effectiveDate: string
  contractFile: string
}

const initialForm: ContractForm = {
  type: "",
  department: "",
  assignment: "",
  status: "",
  startDate: "",
  endDate: "",
  effectiveDate: "",
  contractFile: "",
}

const employmentTypes = [
  {
    value: "academic",
    label: "Academic",
  },
  {
    value: "support",
    label: "Support",
  },
]

const departments = [
  {
    value: "pre-elementary",
    label: "Pre-Elementary",
  },
  {
    value: "elementary",
    label: "Elementary",
  },
  {
    value: "junior-high-school",
    label: "Junior High School",
  },
  {
    value: "senior-high-school",
    label: "Senior High School",
  },
  {
    value: "maintenance",
    label: "Maintenance",
  },
]

const statuses = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "expired",
    label: "Expired",
  },
  {
    value: "terminated",
    label: "Terminated",
  },
]

export default function AddEmployeeContractPage({
  employeeId,
}: AddEmployeeContractProps) {
  const [open, setOpen] = useState(false)

  const [form, setForm] =
    useState<ContractForm>(initialForm)

  const queryClient = useQueryClient()

  const addContract = useMutation({
    mutationFn: async () => {
      if (
        !form.type ||
        !form.department ||
        !form.assignment ||
        !form.status ||
        !form.startDate ||
        !form.effectiveDate
      ) {
        throw new Error(
          "Please complete all required fields."
        )
      }

      return AddEmployeeContract({
        employeeId,
        type: form.type,
        department: form.department,
        assignment: form.assignment,
        status: form.status,
        startDate: form.startDate,
        endDate: form.endDate,
        effectiveDate: form.effectiveDate,
        contractFile: form.contractFile,
      })
    },

    onSuccess: () => {
      toast.success(
        "Employee contract added successfully."
      )

      setForm(initialForm)
      setOpen(false)

      queryClient.invalidateQueries({
        queryKey: [
          "employee",
          employeeId,
        ],
      })
    },

    onError: (error) => {
      toast.error(error.message)
    },
  })

  const updateField = (
    field: keyof ContractForm,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    addContract.mutate()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          Add Contract
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          w-[calc(100%-2rem)]
          max-w-3xl
          max-h-[90vh]
          overflow-y-auto
          p-4
          sm:p-6
        "
      >
        <DialogHeader>
          <DialogTitle>
            Add Employee Contract
          </DialogTitle>

          <DialogDescription>
            Enter the employee&apos;s contract and
            employment assignment details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2 sm:py-4">

          {/* Employment */}
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">
                Employment
              </h3>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Define the employee&apos;s contract
                type, department, and assignment.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="contract-type">
                  Type
                  <span className="ml-1 text-destructive">
                    *
                  </span>
                </Label>

                <Select
                  value={form.type}
                  onValueChange={(value) =>
                    updateField(
                      "type",
                      value
                    )
                  }
                >
                  <SelectTrigger
                    id="contract-type"
                    className="w-full"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>

                  <SelectContent>
                    {employmentTypes.map(
                      (type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                        >
                          {type.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="contract-department">
                  Department
                  <span className="ml-1 text-destructive">
                    *
                  </span>
                </Label>

                <Select
                  value={form.department}
                  onValueChange={(value) =>
                    updateField(
                      "department",
                      value
                    )
                  }
                >
                  <SelectTrigger
                    id="contract-department"
                    className="w-full"
                  >
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>

                  <SelectContent>
                    {departments.map(
                      (department) => (
                        <SelectItem
                          key={department.value}
                          value={department.value}
                        >
                          {department.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="contract-status">
                  Status
                  <span className="ml-1 text-destructive">
                    *
                  </span>
                </Label>

                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    updateField(
                      "status",
                      value
                    )
                  }
                >
                  <SelectTrigger
                    id="contract-status"
                    className="w-full"
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent>
                    {statuses.map(
                      (status) => (
                        <SelectItem
                          key={status.value}
                          value={status.value}
                        >
                          {status.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Assignment */}
              <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                <Label htmlFor="contract-assignment">
                  Assignment
                  <span className="ml-1 text-destructive">
                    *
                  </span>
                </Label>

                <Input
                  id="contract-assignment"
                  placeholder="e.g. Grade 1 Adviser"
                  value={form.assignment}
                  onChange={(e) =>
                    updateField(
                      "assignment",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          </section>

          {/* Contract Dates */}
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">
                Contract Dates
              </h3>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Specify the dates covered by this
                contract.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="contract-start-date">
                  Start Date
                  <span className="ml-1 text-destructive">
                    *
                  </span>
                </Label>

                <Input
                  id="contract-start-date"
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    updateField(
                      "startDate",
                      e.target.value
                    )
                  }
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="contract-end-date">
                  End Date
                </Label>

                <Input
                  id="contract-end-date"
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    updateField(
                      "endDate",
                      e.target.value
                    )
                  }
                />
              </div>

              {/* Effective Date */}
              <div className="space-y-2">
                <Label htmlFor="effective-date">
                  Effective Date
                  <span className="ml-1 text-destructive">
                    *
                  </span>
                </Label>

                <Input
                  id="effective-date"
                  type="date"
                  value={form.effectiveDate}
                  onChange={(e) =>
                    updateField(
                      "effectiveDate",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          </section>

          {/* Contract File */}
          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">
                Contract File
              </h3>

              <p className="text-xs text-muted-foreground sm:text-sm">
                The scanned contract can be attached
                later.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contract-file">
                Contract File
              </Label>

              <Input
                id="contract-file"
                type="text"
                placeholder="Contract file URL"
                value={form.contractFile}
                onChange={(e) =>
                  updateField(
                    "contractFile",
                    e.target.value
                  )
                }
              />
            </div>
          </section>
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            disabled={addContract.isPending}
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={addContract.isPending}
            onClick={handleSubmit}
            className="w-full sm:w-auto"
          >
            {addContract.isPending
              ? "Adding..."
              : "Add Contract"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
