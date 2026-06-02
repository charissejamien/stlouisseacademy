"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import { Pencil , Trash2 } from 'lucide-react'

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { format } from "date-fns"
import toast from "react-hot-toast";

import { saveSchoolYear, getSchoolYears, deleteSchoolYear } from "@/app/(portal)/admin/configuration/actions"
import { getGradeLevels, handleSchoolYearChange } from "@/app/(portal)/admin/configuration/actions"
import { getBillingPeriods, saveBillingPeriod, deleteBillingPeriod } from "@/app/(portal)/registrar/enrollment/actions";
interface BillingPeriodRecord {
    id: string; 
    period_name: string;
}

export default function AcademicsConfiguration() {

    const queryClient = useQueryClient()

    const [schoolYearsModal, setSchoolYearsModal] = useState(false)
    const [gradeLevelsModal, setGradeLevelsModal] = useState(false)
    const [billingPeriodsModal, setBillingPeriodsModal] = useState(false) 

    {/* School Year */}
    const [startYear, setStartYear] = useState("")
    const [endYear, setEndYear] = useState("")
    const [startDate, setStartDate] = useState<Date | undefined>()
    const [endDate, setEndDate] = useState<Date | undefined>()

    {/* Billing Allocation Local State Tracking Hooks */}
    const [periodName, setPeriodName] = useState("");

    const { data : schoolYears} = useQuery({queryKey: ["schoolYears"], queryFn: getSchoolYears})
    const { data : levels} = useQuery({queryKey: ["levels"], queryFn: getGradeLevels})
    const { data : billingPeriods } = useQuery<BillingPeriodRecord[]>({ queryKey: ["billingPeriods"], queryFn: getBillingPeriods })

    const schoolYearMutation = useMutation({
        mutationFn: ({
            startYear,
            endYear,
        } : {
            startYear: string
            endYear: string
        }) => saveSchoolYear(startYear, endYear),
        onSuccess: () => {
            toast.success("Successfully Added!")
            setSchoolYearsModal(false)
            setStartYear("")
            setEndYear("")
            queryClient.invalidateQueries({queryKey: ["schoolYears"]})
        },
        onError: (res) => {
            toast.error(res.message)
        },
    })

    const deleteSchoolyearMutation = useMutation({
        mutationFn: (id: string) => deleteSchoolYear(id),
        onSuccess: () => {
            toast.success("School Year Successfully Deleted!")
            queryClient.invalidateQueries({queryKey: ["schoolYears"]})
        },
        onError: (res) => {
            toast.error(res.message)
        }
    })

    {/* Mutation to Write Allocation Period Items to Database */}
    const billingPeriodMutation = useMutation({
        mutationFn: () => {
            if (!periodName.trim()) throw new Error("Please enter an installment period label.");
            return saveBillingPeriod(periodName);
        },
        onSuccess: () => {
            toast.success("Allocation indicator saved successfully!");
            setBillingPeriodsModal(false);
            setPeriodName("");
            queryClient.invalidateQueries({ queryKey: ["billingPeriods"] });
        },
        onError: (err: Error) => {
            toast.error(err.message);
        }
    });

    {/* Mutation to Scrub Out Dead Allocation Periods */}
    const deleteBillingPeriodMutation = useMutation({
        mutationFn: (id: string) => deleteBillingPeriod(id),
        onSuccess: () => {
            toast.success("Allocation indicator removed safely.");
            queryClient.invalidateQueries({ queryKey: ["billingPeriods"] });
        },
        onError: (err: Error) => {
            toast.error(err.message);
        }
    });

    return(
        <div className="flex flex-col gap-10">
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>School Year Management</CardTitle>
                    <Dialog open={schoolYearsModal} onOpenChange={setSchoolYearsModal}>
                        <DialogTrigger asChild>
                            <Button>+ Add New School Year</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Add New School year</DialogTitle>
                            <FieldGroup  className="flex flex-row gap-5">
                                <Field>
                                    <FieldLabel>Start Year</FieldLabel>
                                    <Input value={startYear} onChange={(e) => setStartYear(e.target.value)}/>
                                </Field>
                                <Field>
                                    <FieldLabel>End Year</FieldLabel>
                                    <Input value={endYear} onChange={(e) => setEndYear(e.target.value)}/>
                                </Field>
                            </FieldGroup>
                            <Button onClick={() => schoolYearMutation.mutate({startYear, endYear})}>Add</Button>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <Separator/>
                <CardContent>
                    <div className="border rounded-sm p-3">
                        {schoolYears?.map((s , index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                                <p>SY {s.start_year} - {s.end_year}</p>
                                <div className="flex gap-2 items-center">
                                    <Label>Set Active</Label>
                                    <Switch
                                        checked={s.is_active}
                                        onCheckedChange={async (checked) => {
                                            await handleSchoolYearChange(s.id, checked)
                                            queryClient.invalidateQueries({
                                                queryKey: ["schoolYears"],
                                            })
                                        }}
                                    />
                                </div>
                                <div className="flex gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="icon" variant="outline"><Pencil className="w-4 h-4"/></Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogTitle>Edit Dates for School Year</DialogTitle>
                                        <FieldGroup  className="flex flex-row gap-5">
                                            <Field>
                                                <FieldLabel>Start Date</FieldLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        id="date-picker-simple"
                                                        className="justify-start font-normal"
                                                    >
                                                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={startDate}
                                                        onSelect={setStartDate}
                                                        defaultMonth={startDate}
                                                    />
                                                    </PopoverContent>
                                                </Popover>
                                            </Field>
                                            <Field>
                                                <FieldLabel>End Date</FieldLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        id="date-picker-simple"
                                                        className="justify-start font-normal"
                                                    >
                                                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={endDate}
                                                        onSelect={setEndDate}
                                                        defaultMonth={endDate}
                                                    />
                                                    </PopoverContent>
                                                </Popover>
                                            </Field>
                                        </FieldGroup>
                                        <Button onClick={() => schoolYearMutation.mutate({startYear, endYear})}>Add School Year</Button>
                                    </DialogContent>
                                </Dialog>
                                <Button variant="destructive" size="icon" onClick={() => deleteSchoolyearMutation.mutate(s.id)}><Trash2 className="w-4 h-4"/></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Grade Level Management</CardTitle>
                    <Dialog open={gradeLevelsModal} onOpenChange={setGradeLevelsModal}>
                        <DialogTrigger asChild>
                            <Button>+ Add New Grade Level</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Add New Grade Level</DialogTitle>
                            <form onSubmit={(e) => e.preventDefault()}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel className="leading-none">Grade Category</FieldLabel>
                                    <FieldLabel className="text-[12px] text-sla-gray leading-none">(Pre-Elementary, Elementary, Junior High School)</FieldLabel>
                                    <Input></Input>
                                </Field>
                                <Field>
                                    <FieldLabel>Grade Level</FieldLabel>
                                    <Input></Input>
                                </Field>
                            </FieldGroup>
                            </form>
                            <Button className="mt-4">Add Grade Level</Button>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <Separator/>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-50">Grade Level</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {levels?.map((l , index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium w-50">{l.grade_level}</TableCell>
                                <TableCell className="flex gap-2 justify-end">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="icon" variant="outline"><Pencil className="w-4 h-4"/></Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle>Edit {l.grade_level}</DialogTitle>
                                            <FieldGroup>
                                                <Field>
                                                    <FieldLabel>Amount in Percentage</FieldLabel>
                                                    <Input />
                                                </Field>
                                                <Field>
                                                    <FieldLabel>Amount in Percentage</FieldLabel>
                                                    <Input />
                                                </Field>
                                            </FieldGroup>
                                            <Button className="mt-4">Update Amount</Button>
                                        </DialogContent>
                                    </Dialog>
                                    <Button variant="destructive" size="icon"><Trash2 className="w-4 h-4"/></Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </div>
                </CardContent>
            </Card>

            {/* 🗓️ UPDATED SECTION: TEXT-ONLY PAYMENT INDICATOR CONFIGURATION */}
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <div>
                        <CardTitle>Fee Allocation & Indicator Management</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">Configure allocation indicators for staggered tracking loops (e.g., Downpayment, July Installment, August Installment).</p>
                    </div>
                    <Dialog open={billingPeriodsModal} onOpenChange={setBillingPeriodsModal}>
                        <DialogTrigger asChild>
                            <Button className="bg-sla-blue text-white">+ Add Fee Indicator</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Create Fee Allocation Indicator</DialogTitle>
                            <FieldGroup className="flex flex-col gap-4">
                                <Field>
                                    <FieldLabel>Allocation Label / Milestone Indicator</FieldLabel>
                                    <Input 
                                        value={periodName} 
                                        onChange={(e) => setPeriodName(e.target.value)}
                                        placeholder="e.g., August Installment, Downpayment, Miscellaneous" 
                                    />
                                </Field>
                            </FieldGroup>
                            <Button 
                                className="mt-4 bg-sla-blue text-white" 
                                onClick={() => billingPeriodMutation.mutate()}
                                disabled={billingPeriodMutation.isPending}
                            >
                                {billingPeriodMutation.isPending ? "Saving..." : "Save Indicator"}
                            </Button>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <Separator/>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Active Allocation Indicator Name</TableHead>
                                <TableHead className="text-right">Action Controls</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {billingPeriods && billingPeriods.length > 0 ? (
                                billingPeriods.map((period) => (
                                    <TableRow key={period.id}>
                                        <TableCell className="font-semibold text-slate-800">{period.period_name}</TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="text-destructive hover:bg-destructive/10"
                                                onClick={() => deleteBillingPeriodMutation.mutate(period.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center text-xs italic text-muted-foreground py-6">
                                        No specific installment metrics are configured yet. Click above to populate fields.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}