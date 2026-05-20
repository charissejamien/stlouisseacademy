"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

import { saveTuitionFee, getTuitionFees, updateTuitionFee } from "@/app/(portal)/admin/configuration/actions";
import { saveBookFee, getBookFee, deleteBookFee } from "@/app/(portal)/admin/configuration/actions";
import { saveMerchandise, getMerchandise, deleteMerchandise } from "@/app/(portal)/admin/configuration/actions";
import { getGradeLevels } from "@/app/(portal)/admin/configuration/actions";

export default function SchoolFeesConfiguration() {

    const queryClient = useQueryClient()

    {/* Modals */}
    const [tuitionsModal, setTuitionsModal] = useState(false)
    const [booksModal, setBooksModal] = useState(false)
    const [merchandiseModal, setMerchandiseModal] = useState(false)

    {/* Tuition Fees */}
    const [baseTuition, setBaseTuition] = useState(0)
    const [miscellaneous, setMiscellaneous] = useState(0)

    {/* Books */}
    const [gradeLevel, setGradeLevel] = useState("")
    const [amount, setAmount] = useState(0)
    const [open, setOpen] = useState(false)

    {/* Merchandise */}
    const [merchandiseName, setMerchandiseName] = useState("")
    const [unit, setUnit] = useState("")
    const [price, setPrice] = useState(0)
    const [hasSizes, setHasSizes] = useState(false)

    const { data : books} = useQuery({queryKey: ["books"], queryFn: getBookFee})
    const { data : tuitionFees} = useQuery({queryKey: ["tuitionFees"], queryFn: getTuitionFees})
    const { data : merchandise} = useQuery({queryKey: ["merchandise"], queryFn: getMerchandise})
    const { data : levels} = useQuery({queryKey: ["levels"], queryFn: getGradeLevels})

    const saveBookMutation = useMutation({
        mutationFn: ({
            gradeLevel,
            amount,
        } : {
            gradeLevel: string
            amount: number
        }) => saveBookFee(gradeLevel, amount),
        onSuccess: () => {
            toast.success("Successfully Added Book Fee")
            setBooksModal(false)
            setGradeLevel("")
            setAmount(0)
            queryClient.invalidateQueries({queryKey: ["books"]})
        },
        onError: (res) => {
            toast.error(res.message)
        },
    })

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
            toast.success('Successfuly Updated!')
        },
        onError: (res) => {
            toast.error(res.message)
        },
    })

    const saveMerchandiseMutation = useMutation({
        mutationFn: ({
            merchandiseName,
            unit,
            price,
            hasSizes
        } : {
            merchandiseName: string
            unit: string
            price: number
            hasSizes: boolean
        }) => saveMerchandise(merchandiseName, unit, price, hasSizes),
        onSuccess: () => {
            toast.success('Successfuly Added!')
            setOpen(false)
            setMerchandiseName("")
            setUnit("")
            setPrice(0)
            queryClient.invalidateQueries({queryKey: ["merchandise"]})
        },
    })

    const deleteMerchandiseMutation = useMutation({
        mutationFn: (id:string) => deleteMerchandise(id),
        onSuccess: () => {
            toast.success('Successfuly Deleted')
            queryClient.invalidateQueries({queryKey: ["merchandise"]})
        },
        onError: (res) => {
            toast.error(res.message)
        },
    })

    const sizes = ["6", "8", "10", "12", "14", "16", "18", "20", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL" ]
    const totalTuition = baseTuition + miscellaneous;

    return(
        <div className="flex flex-col gap-10">
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Tuition Fees</CardTitle>
                    <Dialog>
                        <DialogTrigger>
                            <Button>+ Add New Tuition Fee</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Add New Tuition Fee</DialogTitle>
                            <FieldGroup className="flex flex-row gap-5">
                                <Field>
                                    <FieldLabel>Grade Level</FieldLabel>
                                    <Select>
                                        <SelectTrigger className="w-full max-w-48">
                                            <SelectValue placeholder="Select a Grade Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            <SelectLabel>Grade Levels</SelectLabel>
                                            {levels?.map((d , index) => (
                                                <SelectItem key={index} value={index.toString()}>{d.grade_level}</SelectItem>
                                            ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field>
                                    <FieldLabel>Base Tuition</FieldLabel>
                                    <Input name="baseTuition" onChange={(e) => setBaseTuition(Number(e.target.value))}/>
                                </Field>
                            </FieldGroup>
                            <FieldGroup className="flex flex-row gap-5">
                                <Field>
                                    <FieldLabel>Miscellaneous</FieldLabel>
                                    <Input name="miscellaneous" onChange={(e) => setMiscellaneous(Number(e.target.value))}/>
                                </Field>
                                <Field>
                                    <FieldLabel>Total Tuition</FieldLabel>
                                    <Input value={totalTuition.toLocaleString()}/>
                                </Field>
                            </FieldGroup>
                            <DialogClose><Button>Save</Button></DialogClose>
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
                                <TableHead className="w-35">Total Tuition</TableHead>
                                <TableHead className="w-35">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tuitionFees?.map((t , index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium w-50">{t.grade_level}</TableCell>
                                    <TableCell className="w-35">{t.base_tuition.toLocaleString()}</TableCell>
                                    <TableCell className="w-35">{t.miscellaneous.toLocaleString()}</TableCell>
                                    <TableCell className="w-35">P{t.total_tuition.toLocaleString()}</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Dialog>
                                            <DialogTrigger>
                                                <Button><Pencil/></Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogTitle>Edit Tuition Fee for {t.grade_level}</DialogTitle>
                                                <FieldGroup className="flex flex-row gap-5">
                                                    <Field>
                                                        <FieldLabel>Base Tuition</FieldLabel>
                                                        <Input name="baseTuition" onChange={(e) => setBaseTuition(Number(e.target.value))}/>
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel>Miscellaneous</FieldLabel>
                                                        <Input name="miscellaneous" onChange={(e) => setMiscellaneous(Number(e.target.value))}/>
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel>Total Tuition</FieldLabel>
                                                        <Input value={totalTuition.toLocaleString()}/>
                                                    </Field>
                                                </FieldGroup>
                                                <Button onClick={() => updateTuitionMutation.mutate({id:t.id, baseTuition, miscellaneous, totalTuition})}>Update Tuition Fee</Button>
                                            </DialogContent>
                                        </Dialog>
                                        <Button><Trash2/></Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>


            {/* Books */}
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Book Fees</CardTitle>
                    <Dialog open={booksModal} onOpenChange={setBooksModal}>
                        <DialogTrigger>
                            <Button>+ Add Book Fee</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Add Book Fee</DialogTitle>
                            <FieldGroup className="flex flex-row gap-5">
                                <Field>
                                    <FieldLabel>Grade Level</FieldLabel>
                                    <Select value={gradeLevel} onValueChange={setGradeLevel}>
                                        <SelectTrigger className="w-full max-w-48">
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
                                    <Input value={amount} onChange={(e) => setAmount(Number(e.target.value))}/>
                                </Field>
                            </FieldGroup>
                            <Button onClick={() => saveBookMutation.mutate({gradeLevel , amount})}>Save</Button>
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
                                    <TableCell className="w-35">P{b.amount.toLocaleString()}.00</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Dialog>
                                            <DialogTrigger>
                                                <Button><Pencil/></Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogTitle>Edit {b.grade_level} Books</DialogTitle>
                                                <Field>
                                                    <FieldLabel>Amount</FieldLabel>
                                                    <Input name="baseTuition" onChange={(e) => setBaseTuition(Number(e.target.value))}/>
                                                </Field>
                                            </DialogContent>
                                        </Dialog>
                                        <Button ><Trash2/></Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Other Fees</CardTitle>
                    <Dialog>
                        <DialogTrigger>
                            <Button>+ Add New Fee</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Add New Fee</DialogTitle>
                            <form action="">
                            <FieldGroup>
                                <div className="flex gap-5">
                                    <Field>
                                        <FieldLabel className="leading-none">Fee Category</FieldLabel>
                                        <FieldLabel className="text-[12px] text-sla-gray leading-none">(Membership, Event)</FieldLabel>
                                        <Input></Input>
                                    </Field>
                                    <Field>
                                        <FieldLabel className="leading-none">Fee Name</FieldLabel>
                                        <FieldLabel className="text-[12px] text-sla-gray leading-none">(Graduation Fee, Promenade)</FieldLabel>
                                        <Input></Input>
                                    </Field>
                                </div>
                                <Field>
                                    <FieldLabel>Amount</FieldLabel>
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
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Merchandise</CardTitle>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger>
                            <Button>+ Add New Merchandise</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Add New Merchandise</DialogTitle>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel className="leading-none">Merchandise Name</FieldLabel>
                                    <FieldLabel className="text-[12px] text-sla-gray leading-none">(Logo, Upper Cloth, Lower Cloth)</FieldLabel>
                                    <Input value={merchandiseName} onChange={(e) => setMerchandiseName(e.target.value)}/>
                                </Field>
                                <div className="flex gap-5">
                                    <Field>
                                        <FieldLabel>Unit<span className="text-[12px] text-sla-gray">(yards, piece)</span></FieldLabel>
                                        <Input value={unit} onChange={(e) => setUnit(e.target.value)}/>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Price per Unit</FieldLabel>
                                        <Input value={price} onChange={(e) => setPrice(Number(e.target.value))}/>
                                    </Field>
                                </div>
                                <Field orientation={"horizontal"}>
                                    <Checkbox className="size-5" checked={hasSizes} onCheckedChange={(hasSizes) => setHasSizes(hasSizes === true)}/>
                                    <FieldLabel>Size Chart</FieldLabel>
                                </Field>
                            </FieldGroup>

                            {hasSizes && (
                                <Field className="mt-5">
                                    <FieldLabel className="leading-none">Sizes Offered</FieldLabel>
                                    <div className="grid grid-cols-2">
                                        {sizes.map((s , index) => (
                                            <div key={index} className="flex gap-2 mb-2 mr-5 items-center">
                                                <Checkbox />
                                                <FieldLabel className="w-10">{s}</FieldLabel>
                                                <Input className="w-50" placeholder="amount"/>
                                            </div>
                                        ))}
                                    </div>
                                    <Button> + Custom Sized</Button>
                                </Field>
                            )}
                            <Button onClick={() => saveMerchandiseMutation.mutate({merchandiseName, unit, price, hasSizes})}>Save</Button>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <Separator/>
                <CardContent>
                    <div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead className="w-50">Merchandise</TableHead>
                                <TableHead className="w-35">Unit</TableHead>
                                <TableHead className="w-35">Price</TableHead>
                                <TableHead className="w-35">Stock</TableHead>
                                <TableHead className="w-35">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {merchandise?.map((m , index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium w-50">{m.name}</TableCell>
                                    <TableCell className="w-35">{m.unit}</TableCell>
                                    <TableCell className="w-35">P{m.price}.00</TableCell>
                                    <TableCell className="w-35">{m.stock}</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Dialog>
                                            <DialogTrigger>
                                                <Button><Pencil/></Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogTitle>Edit {m.name} Details</DialogTitle>
                                                <FieldGroup className="flex flex-row gap-5">
                                                    <Field>
                                                        <FieldLabel>Base Tuition</FieldLabel>
                                                        <Input name="baseTuition" onChange={(e) => setBaseTuition(Number(e.target.value))}/>
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel>Miscellaneous</FieldLabel>
                                                        <Input name="miscellaneous" onChange={(e) => setMiscellaneous(Number(e.target.value))}/>
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel>Total Tuition</FieldLabel>
                                                        <Input value={totalTuition.toLocaleString()}/>
                                                    </Field>
                                                </FieldGroup>
                                            </DialogContent>
                                        </Dialog>
                                        <Button onClick={() => deleteMerchandiseMutation.mutate(m.id)}><Trash2/></Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}