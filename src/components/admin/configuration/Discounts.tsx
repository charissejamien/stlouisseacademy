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

import { saveDiscount, getDiscounts, updateDiscount, deleteDiscount } from "@/app/(portal)/admin/configuration/actions";

export default function DiscountsConfiguration() {

    const queryClient = useQueryClient()

    const [discountsModal, setDiscountsModal] = useState(false)

    const { data: discounts} = useQuery({queryKey: ["discounts"], queryFn: getDiscounts})

    const [discountName, setDiscountName] = useState("")
    const [discCategory, setDiscCategory] = useState("")
    const [discAmount, setDiscAmount] = useState(0)

    const discountsMutation = useMutation ({
        mutationFn: ({
            discountName,
            discCategory,
            discAmount
        } : {
            discountName: string,
            discCategory: string,
            discAmount: number
        }) => saveDiscount(discountName, discCategory, discAmount),
        onSuccess: (res) => {
            toast.success("Discount Successfully Added!")
            setDiscountsModal(false)
            setDiscountName("")
            setDiscCategory("")
            setDiscAmount(0)
            queryClient.invalidateQueries({queryKey: ['discounts']})
        },
        onError: (res) => {
            toast.error(res.message)
        },
    })

    const updateDiscountMutation = useMutation({
        mutationFn: ({
            id,
            amount
        } : {
            id: string,
            amount: number
        }) => updateDiscount(id, amount),
        onSuccess: (res) => {
            toast.success("Discount Successfully Added!")
            setDiscountsModal(false)
            setDiscAmount(0)
            queryClient.invalidateQueries({queryKey: ['discounts']})
        },
    })

    const deleteDiscountMutation = useMutation({
        mutationFn: (id: string) => deleteDiscount(id), 
        onSuccess: (res) => {
            toast.success("Discount Successfully Deleted!")
            queryClient.invalidateQueries({queryKey: ['discounts']})
        }
    })

    return(
        <Card>
            <CardHeader className="flex items-center justify-between">
                <CardTitle>Discounts Management</CardTitle>
                <Dialog open={discountsModal} onOpenChange={setDiscountsModal}>
                    <DialogTrigger>
                        <Button>+ Add New Discount</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Add New Discount</DialogTitle>
                        <FieldGroup  className="flex flex-row gap-5">
                            <Field>
                                <FieldLabel>Discount Specification</FieldLabel>
                                <FieldLabel className="text-[12px] text-sla-gray leading-none">(First, Varsity)</FieldLabel>
                                <Input value={discountName} onChange={(e) => setDiscountName(e.target.value)}/>
                            </Field>
                            <Field>
                                <FieldLabel>Category</FieldLabel>
                                <FieldLabel className="text-[12px] text-sla-gray leading-none">(Academic, Payment, Sibling)</FieldLabel>
                                <Input value={discCategory} onChange={(e) => setDiscCategory(e.target.value)}/>
                            </Field>
                        </FieldGroup>
                            <Field>
                                <FieldLabel>Amount in Percentage</FieldLabel>
                                <Input value={discAmount} onChange={(e) => setDiscAmount(Number(e.target.value))}/>
                            </Field>
                        <Button onClick={() => discountsMutation.mutate({discountName, discCategory, discAmount})}>Add Discount</Button>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <Separator/>
            <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-50">Discount</TableHead>
                            <TableHead className="w-35">Category</TableHead>
                            <TableHead className="w-35">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {discounts?.map((d , index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium w-50">{d.name}</TableCell>
                                <TableCell className="w-35">{d.category}</TableCell>
                                <TableCell className="w-35">{d.amount}%</TableCell>
                                <TableCell className="flex gap-2">
                                    <Dialog>
                                        <DialogTrigger>
                                            <Button><Pencil/></Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle>Edit {d.name} Amount</DialogTitle>
                                            <Field>
                                                <FieldLabel>Amount in Percentage</FieldLabel>
                                                <Input value={discAmount} onChange={(e) => setDiscAmount(Number(e.target.value))}/>
                                            </Field>
                                            <Button onClick={() => updateDiscountMutation.mutate({id: d.id, amount: discAmount})}>Update Amount</Button>
                                        </DialogContent>
                                    </Dialog>
                                    <Button onClick={() => deleteDiscountMutation.mutate(d.id)}><Trash2/></Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
            </CardContent>
        </Card>
    );
}