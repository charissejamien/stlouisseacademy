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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

import { Pencil , Trash2 } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";

import { saveTuitionFee, getTuitionFees, updateTuitionFee, getOtherFees } from "@/app/(portal)/admin/configuration/actions";
import { saveBookFee, getBookFee, updateBookFee, deleteBookFee } from "@/app/(portal)/admin/configuration/actions";
import { saveOtherFee } from "@/app/(portal)/admin/configuration/actions";
import { saveMerchandise, getMerchandise, deleteMerchandise, deleteVariant } from "@/app/(portal)/admin/configuration/actions";
import { getGradeLevels } from "@/app/(portal)/admin/configuration/actions";

export default function SchoolFeesConfiguration() {
    const queryClient = useQueryClient()

    {/* Modals Controlling States */}
    const [tuitionsModal, setTuitionsModal] = useState(false)
    const [booksModal, setBooksModal] = useState(false)
    const [otherFeesModal, setOtherFeesModal] = useState(false)
    const [merchandiseModal, setMerchandiseModal] = useState(false)

    {/* Tuition Fees Local Inputs States */}
    const [selectedGradeLevel, setSelectedGradeLevel] = useState("") // ✅ Added string layout binding tracking state
    const [baseTuition, setBaseTuition] = useState(0)
    const [miscellaneous, setMiscellaneous] = useState(0)
    const [entranceFee, setEntranceFee] = useState(0)

    {/* Books */}
    const [gradeLevel, setGradeLevel] = useState("")
    const [amount, setAmount] = useState("")

    {/* Other Fees */}
    const [category, setFeeCategory] = useState("")
    const [feeName, setFeeName] = useState("")
    const [feeAmount, setFeeAmount] = useState("")

    {/* Merchandise */}
    const [merchandiseName, setMerchandiseName] = useState("")
    const [unit, setUnit] = useState("")
    const [price, setPrice] = useState(0)
    const [hasSizes, setHasSizes] = useState(false)
    const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

    // Dynamic Server State Cached Hooks via TanStack Query
    const { data : books} = useQuery({queryKey: ["books"], queryFn: getBookFee})
    const { data : tuitionFees} = useQuery({queryKey: ["tuitionFees"], queryFn: getTuitionFees})
    const { data : otherFees} = useQuery({queryKey: ["otherFees"], queryFn: getOtherFees})
    const { data : merchandise} = useQuery({queryKey: ["merchandise"], queryFn: getMerchandise})
    const { data : levels} = useQuery({queryKey: ["levels"], queryFn: getGradeLevels})

    // 🔥 1. NEW MUTATION HANDLER: Commits structural tuition pricing records into database tables
    const saveTuitionFeeMutation = useMutation({
        mutationFn: ({
            gradeLevel,
            baseTuition,
            miscellaneous,
            totalTuition,
            entranceFee
        } : {
            gradeLevel: string
            baseTuition: number
            miscellaneous: number
            totalTuition: number
            entranceFee: number
        }) => saveTuitionFee(gradeLevel, baseTuition, miscellaneous, totalTuition, entranceFee),
        onSuccess: () => {
            toast.success("Successfully Added New Tuition Rate Configuration!");
            setTuitionsModal(false); // Shut form overlay cleanly
            
            // Re-initialize state parameters to prevent input cross-contamination leakages
            setSelectedGradeLevel("");
            setBaseTuition(0);
            setMiscellaneous(0);
            setEntranceFee(0);
            
            queryClient.invalidateQueries({ queryKey: ["tuitionFees"] }); // Purge cache tags instantly
        },
        onError: (err: any) => {
            toast.error(`Database Error: ${err.message}`);
        }
    });

    const updateTuitionMutation = useMutation({
        mutationFn: ({
            id,
            baseTuition,
            miscellaneous,
            totalTuition
        } : {
            id: number
            baseTuition : number
            miscellaneous : number
            totalTuition : number
        }) => updateTuitionFee(id, baseTuition, miscellaneous, totalTuition),
        onSuccess: () => {
            toast.success('Successfully Updated!')
            queryClient.invalidateQueries({ queryKey: ["tuitionFees"] });
        },
        onError: (res) => {
            toast.error(res.message)
        },
    })

    const saveBookMutation = useMutation({
        mutationFn: ({
            gradeLevel,
            amount,
        } : {
            gradeLevel: string
            amount: string
        }) => saveBookFee(gradeLevel, amount),
        onSuccess: () => {
            toast.success("Successfully Added Book Fee")
            setBooksModal(false)
            setGradeLevel("")
            setAmount("")
            queryClient.invalidateQueries({queryKey: ["books"]})
        },
        onError: (res) => {
            toast.error(res.message)
        },
    })

    const updateBookMutation = useMutation({
        mutationFn: ({
            id,
            amount
        } : {
            id: string,
            amount: string
        }) => updateBookFee(id, amount),
        onSuccess: () => {
            toast.success("Successfully Updated Book Fee")
            setBooksModal(false)
            setAmount("0")
            queryClient.invalidateQueries({queryKey: ["books"]})
        },
        onError: (res) => {
            toast.error(res.message)
        },
    })

    const saveOtherFeeMutation = useMutation({
        mutationFn: ({
            category,
            feeName,
            feeAmount
        } : {
            category: string
            feeName: string
            feeAmount: string
        }) => saveOtherFee(category, feeName, feeAmount),
        onSuccess: () => {
            toast.success("Successfully Added Other Fee")
            setOtherFeesModal(false)
            setFeeCategory("")
            setFeeName("")
            setFeeAmount("")
            queryClient.invalidateQueries({queryKey: ["otherFees"]})
        },
        onError: (res) => {
            toast.error(res.message)
        },
    });

    const saveMerchandiseMutation = useMutation({
        mutationFn: ({
            merchandiseName,
            unit,
            hasSizes,
            sizes
        }: {
            merchandiseName: string
            unit: string
            hasSizes: boolean
            sizes: {
            size: string
            price: string
            }[]
        }) => saveMerchandise(merchandiseName, unit, hasSizes, sizes),
        onSuccess: () => {
            toast.success("Successfully Added!");
            setMerchandiseModal(false);
            setMerchandiseName("");
            setUnit("");
            setSelectedSizes({});
            queryClient.invalidateQueries({ queryKey: ["merchandise"] });
        },
    });

    const deleteMerchandiseMutation = useMutation({
        mutationFn: (id:string) => deleteMerchandise(id),
        onSuccess: () => {
            toast.success('Successfully Deleted')
            queryClient.invalidateQueries({queryKey: ["merchandise"]})
        },
        onError: (res) => {
            toast.error(res.message)
        },
    })

    const deleteVariantMutation = useMutation({
        mutationFn: (id: string) => deleteVariant(id),
        onSuccess: () => {
            toast.success("Variant deleted");
            queryClient.invalidateQueries({ queryKey: ["merchandise"] });
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    const sizes = ["6", "8", "10", "12", "14", "16", "18", "20", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL" ]
    const sizeOrder = ["6", "8", "10", "12", "14", "16", "18", "20", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL" ]
    
    // Derived state calculating aggregated total metrics live
    const totalTuition = baseTuition + miscellaneous;

    const executeSaveTuitionForm = () => {
        if (!selectedGradeLevel) return toast.error("Please assign a target placement grade level.");
        if (baseTuition <= 0) return toast.error("Please supply a valid base tuition price parameter.");

        saveTuitionFeeMutation.mutate({
            gradeLevel: selectedGradeLevel,
            baseTuition,
            miscellaneous,
            totalTuition,
            entranceFee
        });
    };

    return(
        <div className="flex flex-col gap-10">
            
            {/* CARD PANEL 1: TUITION SCHEDULE LEDGER */}
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Tuition Fees</CardTitle>
                    <Dialog open={tuitionsModal} onOpenChange={setTuitionsModal}>
                        <DialogTrigger asChild>
                            <Button>+ Add New Tuition Fee</Button>
                        </DialogTrigger>
                        <DialogContent className="w-[600px]">
                            <DialogTitle>Add New Tuition Fee</DialogTitle>
                            
                            <FieldGroup className="flex flex-row gap-5">
                                <Field>
                                    <FieldLabel>Grade Level</FieldLabel>
                                    {/* 🔄 FIXED: Controlled properties attached securely to selectedGradeLevel */}
                                    <Select value={selectedGradeLevel} onValueChange={setSelectedGradeLevel}>
                                        <SelectTrigger className="w-full max-w-48 mt-1">
                                            <SelectValue placeholder="Select a Grade Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Grade Levels</SelectLabel>
                                                {/* 🔄 FIXED: Value captures d.grade_level to prevent student matching crashes downstream */}
                                                {levels?.map((d , index) => (
                                                    <SelectItem key={index} value={d.grade_level}>{d.grade_level}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field>
                                    <FieldLabel>Entrance Fee (₱)</FieldLabel>
                                    <Input type="number" placeholder="0" value={entranceFee || ""} onChange={(e) => setEntranceFee(Number(e.target.value))} className="mt-1"/>
                                </Field>
                            </FieldGroup>

                            <FieldGroup className="flex flex-row gap-5">
                                <Field>
                                    <FieldLabel>Base Tuition (₱)</FieldLabel>
                                    <Input type="number" placeholder="0" value={baseTuition || ""} onChange={(e) => setBaseTuition(Number(e.target.value))} className="mt-1"/>
                                </Field>
                                <Field>
                                    <FieldLabel>Miscellaneous (₱)</FieldLabel>
                                    <Input type="number" placeholder="0" value={miscellaneous || ""} onChange={(e) => setMiscellaneous(Number(e.target.value))} className="mt-1"/>
                                </Field>
                                <Field>
                                    <FieldLabel>Total Tuition (₱)</FieldLabel>
                                    <Input readOnly value={totalTuition.toLocaleString(undefined, { minimumFractionDigits: 2 })} className="mt-1 font-bold text-sla-blue bg-slate-50"/>
                                </Field>
                            </FieldGroup>

                            {/* 🔄 FIXED: Triggers the execution method bundle upon operational select click */}
                            <Button 
                                onClick={executeSaveTuitionForm} 
                                disabled={saveTuitionFeeMutation.isPending}
                                className="w-full mt-4 bg-sla-blue text-white font-bold"
                            >
                                {saveTuitionFeeMutation.isPending ? "Committing Entry..." : "Add Tuition Fee"}
                            </Button>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <Separator/>
                <CardContent>
                    <div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-50">Grade Level</TableHead>
                                    <TableHead className="w-35">Base Tuition</TableHead>
                                    <TableHead className="w-35">Miscellaneous</TableHead>
                                    <TableHead className="w-35">Entrance Fee</TableHead>
                                    <TableHead className="w-35">Total Tuition</TableHead>
                                    <TableHead className="w-35">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tuitionFees?.map((t , index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium w-50 text-slate-900">{t.grade_level}</TableCell>
                                    <TableCell className="w-35">₱{t.base_tuition.toLocaleString()}</TableCell>
                                    <TableCell className="w-35">₱{t.miscellaneous.toLocaleString()}</TableCell>
                                    <TableCell className="w-35">₱{t.entrance_fee.toLocaleString()}</TableCell>
                                    <TableCell className="w-35 font-bold text-sla-blue">₱{t.total_tuition.toLocaleString()}</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="icon" className="h-8 w-8"><Pencil className="w-4 h-4"/></Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogTitle>Edit Tuition Fee for {t.grade_level}</DialogTitle>
                                                <FieldGroup className="flex flex-row gap-5">
                                                    <Field>
                                                        <FieldLabel>Base Tuition</FieldLabel>
                                                        <Input type="number" placeholder={t.base_tuition} onChange={(e) => setBaseTuition(Number(e.target.value))}/>
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel>Miscellaneous</FieldLabel>
                                                        <Input type="number" placeholder={t.miscellaneous} onChange={(e) => setMiscellaneous(Number(e.target.value))}/>
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel>Total Tuition</FieldLabel>
                                                        <Input readOnly value={totalTuition.toLocaleString()}/>
                                                    </Field>
                                                </FieldGroup>
                                                <Button onClick={() => updateTuitionMutation.mutate({id:t.id, baseTuition, miscellaneous, totalTuition})}>Update Tuition Fee</Button>
                                            </DialogContent>
                                        </Dialog>
                                        <Button variant="outline" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-4 h-4"/></Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* CARD PANEL 2: BOOK MODULE FEES */}
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Book Fees</CardTitle>
                    <Dialog open={booksModal} onOpenChange={setBooksModal}>
                        <DialogTrigger asChild>
                            <Button>+ Add Book Fee</Button>
                        </DialogTrigger>
                        <DialogContent className="w-120">
                            <DialogTitle>Add Book Fee</DialogTitle>
                            <FieldGroup className="flex flex-row gap-5">
                                <Field>
                                    <FieldLabel>Grade Level</FieldLabel>
                                    <Select value={gradeLevel} onValueChange={setGradeLevel}>
                                        <SelectTrigger className="w-full max-w-48 mt-1">
                                            <SelectValue placeholder="Select a Grade Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Grade Levels</SelectLabel>
                                                {levels?.map((d , index) => (
                                                    <SelectItem key={index} value={d.grade_level}>{d.grade_level}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field>
                                    <FieldLabel>Amount</FieldLabel>
                                    <Input value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1"/>
                                </Field>
                            </FieldGroup>
                            <Button onClick={() => saveBookMutation.mutate({gradeLevel , amount})} className="mt-2 bg-sla-blue text-white">Save</Button>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <div className="mx-5">
                    <Separator/>
                </div>
                <CardContent>
                    <div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-50">Grade Level</TableHead>
                                    <TableHead className="w-35">Amount</TableHead>
                                    <TableHead className="w-35">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {books?.map((b, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium w-50">{b.grade_level}</TableCell>
                                    <TableCell className="w-35">₱{b.amount}.00</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="icon" className="h-8 w-8"><Pencil className="w-4 h-4"/></Button>
                                            </DialogTrigger>
                                            <DialogContent className="w-100">
                                                <DialogTitle>Edit {b.grade_level} Books</DialogTitle>
                                                <Field>
                                                    <FieldLabel>Amount</FieldLabel>
                                                    <Input value={amount} onChange={(e) => setAmount(e.target.value)}/>
                                                </Field>
                                                <Button onClick={()=> updateBookMutation.mutate({id: b.id, amount: amount})}>Update {b.grade_level} Book Fee</Button>
                                            </DialogContent>
                                        </Dialog>
                                        <Button variant="outline" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-4 h-4"/></Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* CARD PANEL 3: MISC OPERATIONAL INCIDENTALS FEES */}
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Other Fees</CardTitle>
                    <Dialog open={otherFeesModal} onOpenChange={setOtherFeesModal}>
                        <DialogTrigger asChild>
                            <Button>+ Add New Fee</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Add New Fee</DialogTitle>
                            <FieldGroup>
                                <div className="flex gap-5">
                                    <Field>
                                        <FieldLabel className="leading-none">Fee Category</FieldLabel>
                                        <FieldLabel className="text-[12px] text-sla-gray leading-none">(Membership, Event)</FieldLabel>
                                        <Input value={category} onChange={(e) => setFeeCategory(e.target.value)} className="mt-1"/>
                                    </Field>
                                    <Field>
                                        <FieldLabel className="leading-none">Fee Name</FieldLabel>
                                        <FieldLabel className="text-[12px] text-sla-gray leading-none">(Graduation Fee, Promenade)</FieldLabel>
                                        <Input value={feeName} onChange={(e) => setFeeName(e.target.value)} className="mt-1"/>
                                    </Field>
                                </div>
                                <Field className="mt-3">
                                    <FieldLabel>Amount</FieldLabel>
                                    <Input value={feeAmount} onChange={(e) => setFeeAmount(e.target.value)} className="mt-1"/>
                                </Field>
                            </FieldGroup>
                            <Button onClick={() => saveOtherFeeMutation.mutate({category, feeName, feeAmount})} className="mt-4 bg-sla-blue text-white">Add New Fee</Button>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <Separator/>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-50">Fee Specification</TableHead>
                                <TableHead className="w-35">Fee Name</TableHead>
                                <TableHead className="w-35">Amount</TableHead>
                                <TableHead className="w-35">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {otherFees?.map((o, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium w-50">{o.name}</TableCell>
                                <TableCell className="font-medium w-50">{o.category}</TableCell>
                                <TableCell className="w-35">₱{o.amount}.00</TableCell>
                                <TableCell className="flex gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="icon" className="h-8 w-8"><Pencil className="w-4 h-4"/></Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle>Edit {o.name} Fee</DialogTitle>
                                            <Field>
                                                <FieldLabel>Amount</FieldLabel>
                                                <Input type="number" onChange={(e) => setBaseTuition(Number(e.target.value))}/>
                                            </Field>
                                            <Button>Update {o.name} Fee</Button>
                                        </DialogContent>
                                    </Dialog>
                                    <Button variant="outline" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-4 h-4"/></Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* CARD PANEL 4: MERCHANDISE STOCK APPAREL VAULT */}
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Merchandise</CardTitle>
                    <Dialog open={merchandiseModal} onOpenChange={setMerchandiseModal}>
                        <DialogTrigger asChild>
                            <Button>+ Add New Merchandise</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Add New Merchandise</DialogTitle>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel className="leading-none">Merchandise Name</FieldLabel>
                                    <FieldLabel className="text-[12px] text-sla-gray leading-none">(Logo, Upper Cloth, Lower Cloth)</FieldLabel>
                                    <Input value={merchandiseName} onChange={(e) => setMerchandiseName(e.target.value)} className="mt-1"/>
                                </Field>
                                <Field className="mt-2">
                                    <FieldLabel>Unit</FieldLabel>
                                    <Input value={unit} onChange={(e) => setUnit(e.target.value)} className="mt-1"/>
                                </Field>
                                <Field orientation="horizontal" className="flex items-center gap-2 mt-4">
                                    <Checkbox className="size-5" checked={hasSizes} onCheckedChange={(v) => setHasSizes(v === true) }/>
                                    <FieldLabel>Size Chart Integration</FieldLabel>
                                </Field>
                            </FieldGroup>

                            {hasSizes && (
                            <Field className="mt-5 max-h-60 overflow-y-auto border p-3 rounded">
                                <FieldLabel className="font-bold">Sizes Offered</FieldLabel>
                                <div className="grid grid-cols-1 gap-2 mt-2">
                                {sizes.map((s) => (
                                    <div key={s} className="flex gap-4 items-center justify-between border-b pb-2 last:border-0">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={selectedSizes[s] !== undefined}
                                                onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedSizes((prev) => ({ ...prev, [s]: ""}));
                                                } else {
                                                    const copy = { ...selectedSizes };
                                                    delete copy[s];
                                                    setSelectedSizes(copy);
                                                }
                                                }}
                                            />
                                            <span className="text-sm font-semibold w-8">{s}</span>
                                        </div>
                                        <Input type="number" placeholder="Price (₱)" value={selectedSizes[s] ?? ""} onChange={(e) =>
                                            setSelectedSizes((prev) => ({
                                                ...prev,
                                                [s]: e.target.value
                                            }))
                                        } className="w-32 h-8"/>
                                    </div>
                                ))}
                                </div>
                            </Field>
                            )}

                            <Button onClick={() =>
                                saveMerchandiseMutation.mutate({
                                merchandiseName,
                                unit,
                                hasSizes,
                                sizes: Object.entries(selectedSizes).map(
                                    ([size, price]) => ({
                                        size,
                                        price,
                                    })),
                                })}
                                className="w-full mt-4 bg-sla-blue text-white font-bold"
                            > 
                                Save Merchandise Product
                            </Button>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <Separator />
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Merchandise</TableHead>
                                <TableHead>Variant</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {merchandise?.flatMap((m) =>
                                m.merchandise_sizes?.length
                                ? [...(m.merchandise_sizes ?? [])]
                                .sort((a, b) => {
                                    const indexA = sizeOrder.indexOf(a.size);
                                    const indexB = sizeOrder.indexOf(b.size);
                                    return indexA - indexB;
                                })
                                .map((s) => ({
                                    id: `${m.id}-${s.id}`,
                                    productId: m.id,
                                    name: m.name,
                                    variantId: s.id,
                                    variant: s.size,
                                    price: s.price,
                                    stock: s.stock,
                                }))
                                : [
                                    {
                                        id: m.id,
                                        productId: m.id,
                                        name: m.name,
                                        variantId: null,
                                        variant: m.unit,
                                        price: m.price,
                                        stock: m.stock,
                                    },
                                ]
                            )
                            .map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="font-medium text-slate-900">{row.name}</TableCell>
                                    <TableCell>{row.variant}</TableCell>
                                    <TableCell>₱{Number(row.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell>{row.stock}</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button variant="outline" size="icon" className="h-8 w-8"><Pencil className="w-4 h-4"/></Button>
                                        <Button variant="outline" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteVariantMutation.mutate(row.variantId ?? row.productId)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}