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

import { Pencil, Trash2, Tag } from 'lucide-react'
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";

import {
    getExpenseCategories,
    saveExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory,
    ExpenseCategoryRecord
} from "@/app/(portal)/admin/configuration/actions";

export default function RegistrarConfiguration() {
    const queryClient = useQueryClient();
    
    // Modals Control States
    const [categoriesModal, setCategoriesModal] = useState(false);
    const [activeEditingId, setActiveEditingId] = useState<string | null>(null); // 🎯 Tracks which specific row edit modal is open
    
    // Form Inputs States
    const [categoryName, setCategoryName] = useState("");
    const [categoryKeywords, setCategoryKeywords] = useState("");

    const { data: categories = [] } = useQuery<ExpenseCategoryRecord[]>({
        queryKey: ["expenseCategories"],
        queryFn: getExpenseCategories
    });

    const addCategoryMutation = useMutation({
        mutationFn: () => saveExpenseCategory(categoryName, categoryKeywords),
        onSuccess: () => {
            toast.success("Category Rule Successfully Configured!");
            setCategoriesModal(false);
            setCategoryName("");
            setCategoryKeywords("");
            queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
        },
        onError: (err: any) => toast.error(err.message)
    });

    const updateCategoryMutation = useMutation({
        mutationFn: ({ id, name, keywords }: { id: string; name: string; keywords: string }) => 
            updateExpenseCategory(id, name, keywords),
        onSuccess: () => {
            toast.success("Category Rules Updated!");
            setActiveEditingId(null); // 🎯 This forces the open edit modal to close automatically!
            setCategoryName("");
            setCategoryKeywords("");
            queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
        },
        onError: (err: any) => toast.error(err.message)
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: (id: string) => deleteExpenseCategory(id),
        onSuccess: () => {
            toast.success("Category Rule Removed.");
            queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
        }
    });

    return (
        <div className="w-full">
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Expense Categories & Smart Rules</CardTitle>
                    <Dialog open={categoriesModal} onOpenChange={setCategoriesModal}>
                        <DialogTrigger asChild>
                            <Button>+ Add New Category</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Add New Expense Rule Category</DialogTitle>
                            <FieldGroup className="flex flex-col gap-4 py-2">
                                <Field>
                                    <FieldLabel>Category Title Name</FieldLabel>
                                    <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="e.g., Catering & Refreshments" />
                                </Field>
                                <Field>
                                    <FieldLabel>Auto-Categorization Keywords</FieldLabel>
                                    <Input value={categoryKeywords} onChange={(e) => setCategoryKeywords(e.target.value)} placeholder="e.g., snacks, lunch, coffee, bread" />
                                </Field>
                            </FieldGroup>
                            <Button onClick={() => addCategoryMutation.mutate()}>Save Smart Category Rule</Button>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <Separator />
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-40">Category Name</TableHead>
                                <TableHead>Assigned Smart Keywords</TableHead>
                                <TableHead className="text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-6 italic text-slate-400 font-normal">
                                        No dynamic expense categories configured yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((cat, index) => (
                                    <TableRow key={cat.id || index}>
                                        <TableCell className="font-bold text-slate-900">{cat.name}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {cat.keywords ? cat.keywords.split(",").map((kw, i) => (
                                                    <span key={i} className="inline-flex items-center gap-1 bg-slate-50 border px-2 py-0.5 rounded-md text-[10px] font-semibold text-slate-500">
                                                        <Tag className="w-2.5 h-2.5" />
                                                        {kw.trim()}
                                                    </span>
                                                )) : <span className="text-slate-300 italic text-[11px]">No automatic triggers assigned</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="flex justify-end gap-2 pr-6">
                                            
                                            {/* 🎯 EDIT DIALOG MODAL BLOCK */}
                                            <Dialog 
                                                open={activeEditingId === cat.id} 
                                                onOpenChange={(isOpen) => {
                                                    if (isOpen) {
                                                        setActiveEditingId(cat.id);
                                                        setCategoryName(cat.name);
                                                        setCategoryKeywords(cat.keywords || "");
                                                    } else {
                                                        setActiveEditingId(null);
                                                    }
                                                }}
                                            >
                                                <DialogTrigger asChild>
                                                    <Button><Pencil /></Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogTitle>Edit Smart Category Rule</DialogTitle>
                                                    <FieldGroup className="flex flex-col gap-4 py-2">
                                                        <Field>
                                                            <FieldLabel>Category Name</FieldLabel>
                                                            <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                                                        </Field>
                                                        <Field>
                                                            <FieldLabel>Keywords</FieldLabel>
                                                            <Input value={categoryKeywords} onChange={(e) => setCategoryKeywords(e.target.value)} />
                                                        </Field>
                                                    </FieldGroup>
                                                    <Button onClick={() => updateCategoryMutation.mutate({ id: cat.id, name: categoryName, keywords: categoryKeywords })}>Update Settings</Button>
                                                </DialogContent>
                                            </Dialog>

                                            <Button onClick={() => deleteCategoryMutation.mutate(cat.id)}><Trash2 /></Button>
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