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
import { Label } from "@/components/ui/label"

import { Pencil , Trash2 } from 'lucide-react'

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import toast from "react-hot-toast";

import { 
  saveDiscount, 
  getDiscounts, 
  updateDiscount, 
  deleteDiscount,
  getSubsidies,
  saveSubsidy
} from "@/app/(portal)/admin/configuration/actions";

// Enforce standard shape matching your table columns
interface DiscountRecord {
    id: string;
    name: string;
    category: string;
    amount: number;
}

export default function DiscountsConfiguration() {

    const queryClient = useQueryClient()

    const [discountsModal, setDiscountsModal] = useState(false)

    const { data: discounts } = useQuery<DiscountRecord[]>({queryKey: ["discounts"], queryFn: getDiscounts})

    const [discountName, setDiscountName] = useState("")
    const [discCategory, setDiscCategory] = useState("")
    const [discAmount, setDiscAmount] = useState("")

    // 🎯 Subsidies Dynamic UI Control States
    const [subsidiesModal, setSubsidiesModal] = useState(false)
    const [subsidyName, setSubsidyName] = useState("")
    const [subsidyAmount, setSubsidyAmount] = useState("")

    // Fetch subsidies data rows targeting the 'Subsidy' category explicitly
    const { data: subsidies = [] } = useQuery<DiscountRecord[]>({
        queryKey: ["subsidies"], 
        queryFn: getSubsidies
    })

    const discountsMutation = useMutation ({
        mutationFn: ({
            discountName,
            discCategory,
            discAmount
        } : {
            discountName: string,
            discCategory: string,
            discAmount: string
        }) => saveDiscount(discountName, discCategory, discAmount),
        onSuccess: (res) => {
            toast.success("Discount Successfully Added!")
            setDiscountsModal(false)
            setDiscountName("")
            setDiscCategory("")
            setDiscAmount("")
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
            amount: string
        }) => updateDiscount(id, amount),
        onSuccess: (res) => {
            toast.success("Amount Successfully Updated!")
            setDiscountsModal(false)
            setSubsidiesModal(false)
            setDiscAmount("")
            setSubsidyAmount("")
            queryClient.invalidateQueries({queryKey: ['discounts']})
            queryClient.invalidateQueries({queryKey: ['subsidies']})
        },
    })

    const deleteDiscountMutation = useMutation({
        mutationFn: (id: string) => deleteDiscount(id), 
        onSuccess: (res) => {
            toast.success("Record Successfully Deleted!")
            queryClient.invalidateQueries({queryKey: ['discounts']})
            queryClient.invalidateQueries({queryKey: ['subsidies']})
        }
    })

    // 🎯 Subsidies Creation Lifecycle Hook
    const subsidiesMutation = useMutation({
        mutationFn: ({
            subsidyName,
            subsidyAmount
        }: {
            subsidyName: string,
            subsidyAmount: string
        }) => saveSubsidy(subsidyName, subsidyAmount),
        onSuccess: () => {
            toast.success("Subsidy Program Successfully Added!")
            setSubsidiesModal(false)
            setSubsidyName("")
            setSubsidyAmount("")
            queryClient.invalidateQueries({ queryKey: ["subsidies"] })
        },
        onError: (err) => {
            toast.error(err.message || "Failed to add subsidy profile.")
        }
    })

    return(
        <div className="flex flex-col gap-6 w-full">
            {/* ORIGINAL DISCOUNTS INTERFACE CARD */}
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Discounts Management</CardTitle>
                    <Dialog open={discountsModal} onOpenChange={setDiscountsModal}>
                        <DialogTrigger asChild>
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
                                    <Input value={discAmount} onChange={(e) => setDiscAmount(e.target.value)} step={"0.01"}/>
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
                                            <DialogTrigger asChild>
                                                <Button><Pencil/></Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogTitle>Edit {d.name} Amount</DialogTitle>
                                                <Field>
                                                    <FieldLabel>Amount</FieldLabel>
                                                    <Input value={discAmount} onChange={(e) => setDiscAmount(e.target.value)} step={"0.01"}/>
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

            {/* SUBSIDIES & GRANTS MANAGEMENT CARD BLOCK */}
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Subsidies & Grants Management</CardTitle>
                    <Dialog open={subsidiesModal} onOpenChange={setSubsidiesModal}>
                        <DialogTrigger asChild>
                            <Button>+ Add New Subsidy</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Add New Subsidy Grant</DialogTitle>
                            <FieldGroup className="flex flex-row gap-5">
                                <Field>
                                    <FieldLabel>Subsidy Description Name</FieldLabel>
                                    <Input value={subsidyName} onChange={(e) => setSubsidyName(e.target.value)}/>
                                </Field>
                                <Field>
                                    <FieldLabel>Amount (₱)</FieldLabel>
                                    <Input type="number" value={subsidyAmount} onChange={(e) => setSubsidyAmount(e.target.value)}/>
                                </Field>
                            </FieldGroup>
                            <Button onClick={() => subsidiesMutation.mutate({ subsidyName, subsidyAmount })}>Add Subsidy</Button>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <Separator />
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-50">Subsidy Program</TableHead>
                                <TableHead className="w-35">Amount</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subsidies.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-6 italic text-slate-400 font-normal">
                                        No dynamic system subsidies found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                subsidies.map((s: DiscountRecord, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium w-50">{s.name}</TableCell>
                                        <TableCell className="w-35">₱{s.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                        <TableCell className="flex justify-end gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button onClick={() => setSubsidyAmount(s.amount.toString())}><Pencil /></Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogTitle>Edit {s.name} Allowance</DialogTitle>
                                                    <Field>
                                                        <FieldLabel>Flat Rate Amount (₱)</FieldLabel>
                                                        <Input type="number" value={subsidyAmount} onChange={(e) => setSubsidyAmount(e.target.value)} />
                                                    </Field>
                                                    <Button onClick={() => updateDiscountMutation.mutate({id: s.id, amount: subsidyAmount})}>Update Amount</Button>
                                                </DialogContent>
                                            </Dialog>
                                            <Button onClick={() => deleteDiscountMutation.mutate(s.id)}><Trash2 /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}