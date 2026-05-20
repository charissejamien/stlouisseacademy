"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Checkbox } from "@/components/ui/checkbox"

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { format } from "date-fns"
import toast from "react-hot-toast";

import { saveSchoolYear } from "@/app/(portal)/admin/configuration/actions"
import { getSchoolYears } from "@/app/(portal)/admin/configuration/actions"

import { getGradeLevels } from "@/app/(portal)/admin/configuration/actions"

export default function AcademicsConfiguration() {

    const queryClient = useQueryClient()

    const [schoolYearsModal, setSchoolYearsModal] = useState(false)
    const [gradeLevelsModal, setGradeLevelsModal] = useState(false)

    {/* School Year */}
    const [startYear, setStartYear] = useState("")
    const [endYear, setEndYear] = useState("")
    const [startDate, setStartDate] = useState<Date | undefined>()
    const [endDate, setEndDate] = useState<Date | undefined>()

    const { data : schoolYears} = useQuery({queryKey: ["schoolYears"], queryFn: getSchoolYears})
    const { data : levels} = useQuery({queryKey: ["levels"], queryFn: getGradeLevels})

    const schoolYearMutation = useMutation({
        mutationFn: ({
            startYear,
            endYear,
        } : {
            startYear: string
            endYear: string
        }) => saveSchoolYear(startYear, endYear),
        onSuccess: () => {
            toast.success("Successfuly Added!")
            setSchoolYearsModal(false)
            setStartYear("")
            setEndYear("")
        },
        onError: (res) => {
            toast.error(res.message)
        },
    })

    return(
        <div>
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>School Year Management</CardTitle>
                    <Dialog open={schoolYearsModal} onOpenChange={setSchoolYearsModal}>
                        <DialogTrigger>
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
                            <div key={index} className="flex justify-between items-center">
                                <p>SY {s.start_year} - {s.end_year}</p>
                                <div className="flex gap-2">
                                    <Label>Set Active</Label>
                                    <Switch id="activeYear" />
                                </div>
                                <Dialog>
                                    <DialogTrigger>
                                        <Button><Pencil/></Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogTitle>Add New School year</DialogTitle>
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
                                        <Button onClick={() => schoolYearMutation.mutate({startYear, endYear})}>Add</Button>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Grade Level Management</CardTitle>
                    <Dialog open={gradeLevelsModal} onOpenChange={setGradeLevelsModal}>
                        <DialogTrigger>
                            <Button>+ Add New Grade Level</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Add New Grade Level</DialogTitle>
                            <form action="">
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
                            <DialogClose><Button>Save</Button></DialogClose>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <Separator/>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        {levels?.map((d, index) => (
                            <div key={index} className="border rounded-sm p-3 flex justify-between">
                                <p>{d.grade_level}</p>
                                <Dialog >
                                    <DialogTrigger>
                                        <Button><Pencil/></Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogTitle>Edit Grade Level</DialogTitle>
                                        <FieldGroup  className="flex flex-row gap-5">
                                            <Field>
                                                <FieldLabel>Class Size</FieldLabel>
                                                <Input></Input>
                                            </Field>
                                            <Field>
                                                <FieldLabel>No. of Teacher per Class</FieldLabel>
                                                <Input></Input>
                                            </Field>
                                        </FieldGroup>
                                        <DialogClose><Button>Save</Button></DialogClose>
                                        
                                    </DialogContent>
                                </Dialog>
                            </div>
                        ))}
                    </div>
                    
                </CardContent>
            </Card>
        </div>
    );
}