"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
    Plus,
    Search,
    Banknote,
    ReceiptText,
    CalendarDays,
    Trash2,
    Loader2,
    ChevronDown
} from "lucide-react";
import { Card, CardContent} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Field, FieldLabel } from "@/components/ui/field";

import { 
    getExpenses,
    saveExpense,
    deleteExpense,
} from "./actions";

import { getExpenseCategories } from "../../admin/configuration/actions";

type DateFilterType = "All Time" | "Today" | "This Week" | "This Month";

export default function RegistrarExpensesPage() {
    const queryClient = useQueryClient();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("all");
    const [dateFilter, setDateFilter] = useState<DateFilterType>("All Time");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form Field States
    const [formDescription, setFormDescription] = useState("");
    const [formCategoryUUID, setFormCategoryUUID] = useState("");
    const [formAmount, setFormAmount] = useState("");
    const [formMethod, setFormMethod] = useState("Cash");
    
    const getTodayDateString = () => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    };
    const [formDate, setFormDate] = useState(getTodayDateString());

    // 🎯 QUERY A: FETCH LIVE DATABASE EXPENSE CATEGORIES
    const { data: dbCategories = [] } = useQuery({
        queryKey: ["expenseCategories"],
        queryFn: getExpenseCategories
    });

    // 🎯 QUERY B: FETCH LIVE EXPENSES ENTRIES
    const { data: expensesList = [], isLoading} = useQuery({
        queryKey: ["expensesRecordSheet"],
        queryFn: getExpenses
    });

    // 🎯 MUTATION: SUBMIT NEW DISBURSEMENT RECORD
    const addExpenseMutation = useMutation({
        mutationFn: () => saveExpense({
            description: formDescription,
            categoryId: formCategoryUUID,
            amount: formAmount,
            paymentMethod: formMethod,
            date: formDate
        }),
        onSuccess: () => {
            toast.success("Expense voucher recorded successfully!");
            setIsAddModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["expensesRecordSheet"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to commit record entry.");
        }
    });

    // 🎯 MUTATION: DELETE VOUCHER ROW RECORD
    const deleteExpenseMutation = useMutation({
        mutationFn: (id: string) => deleteExpense(id),
        onSuccess: () => {
            toast.success("Expense record deleted.");
            queryClient.invalidateQueries({ queryKey: ["expensesRecordSheet"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete resource entry.");
        }
    });

    // 🎯 SMART AUTO-CATEGORIZATION HANDLER KEYWORD SCANNER
    const handleDescriptionChange = (textValue: string) => {
        setFormDescription(textValue);
        
        const inputWords = textValue.toLowerCase().split(/\s+/);
        
        const automaticallyMatchedCategory = dbCategories.find(category => {
            if (!category.keywords) return false;
            const ruleKeywords = category.keywords.split(",").map(kw => kw.trim().toLowerCase());
            return inputWords.some(word => ruleKeywords.includes(word));
        });

        if (automaticallyMatchedCategory) {
            setFormCategoryUUID(automaticallyMatchedCategory.id);
        }
    };

    // 🎯 FILTER CHAIN (CATEGORIES DROPDOWN + CALENDAR DAYS DROPDOWN)
    const filteredExpenses = useMemo(() => {
        return expensesList.filter(item => {
            const matchesSearch = item.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategoryId === "all" || item.category_id === selectedCategoryId;
            
            if (!item.date) return matchesSearch && matchesCategory;
            const entryDate = new Date(item.date);
            const today = new Date();
            
            let matchesDateRange = true;
            if (dateFilter === "Today") {
                matchesDateRange = entryDate.toDateString() === today.toDateString();
            } else if (dateFilter === "This Week") {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(today.getDate() - 7);
                matchesDateRange = entryDate >= oneWeekAgo && entryDate <= today;
            } else if (dateFilter === "This Month") {
                matchesDateRange = entryDate.getMonth() === today.getMonth() && entryDate.getFullYear() === today.getFullYear();
            }

            return matchesSearch && matchesCategory && matchesDateRange;
        });
    }, [expensesList, searchQuery, selectedCategoryId, dateFilter]);

    const totalDisbursed = useMemo(() => filteredExpenses.reduce((sum, item) => sum + item.amount, 0), [filteredExpenses]);

    const handleModalToggle = (open: boolean) => {
        setIsAddModalOpen(open);
        if (open) {
            setFormDescription("");
            setFormCategoryUUID(dbCategories[0]?.id || "");
            setFormAmount("");
            setFormMethod("Cash");
            setFormDate(getTodayDateString());
        }
    };

    if (isLoading) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center gap-2 bg-white">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                <span className="text-sm text-slate-500 font-medium">Loading ledger records archive data...</span>
            </div>
        );
    }

    return (
        <div className="w-full h-screen p-6 flex flex-col gap-4 overflow-hidden bg-white antialiased">
            
            {/* HEADLINE HEADER LAYOUT */}
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Disbursement & Expenses Registry</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Track, audit, and log school operational expenses and supply costs.</p>
                </div>

                <Dialog open={isAddModalOpen} onOpenChange={handleModalToggle}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 px-4 rounded-xl flex items-center gap-1.5 shadow-3xs">
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                            <span>Record New Expense</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-white rounded-xl border p-6 shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-base font-black tracking-tight text-slate-900">Record Operational Expense</DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                Input detailed disbursement records. Values compile cleanly into school audit parameters.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-3.5 py-3 text-xs">
                            <Field className="flex flex-col gap-1">
                                <FieldLabel className="font-bold text-slate-700">Expense Particulars / Description</FieldLabel>
                                <Input value={formDescription} onChange={(e) => handleDescriptionChange(e.target.value)} placeholder="e.g., Chalk, Bond Paper, Marker packs" className="h-9 text-xs bg-white border-slate-200 rounded-lg font-medium" />
                            </Field>

                            <div className="grid grid-cols-2 gap-4">
                                <Field className="flex flex-col gap-1">
                                    <FieldLabel className="font-bold text-slate-700">Category Grouping</FieldLabel>
                                    <select value={formCategoryUUID} onChange={(e) => setFormCategoryUUID(e.target.value)} className="w-full h-9 bg-white border border-slate-200 rounded-lg px-2 text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
                                        {dbCategories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field className="flex flex-col gap-1">
                                    <FieldLabel className="font-bold text-slate-700">Amount Paid (₱)</FieldLabel>
                                    <Input type="number" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} placeholder="0.00" className="h-9 text-xs bg-white border-slate-200 rounded-lg font-medium" />
                                </Field>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Field className="flex flex-col gap-1">
                                    <FieldLabel className="font-bold text-slate-700">Payment Method</FieldLabel>
                                    <select value={formMethod} onChange={(e) => setFormMethod(e.target.value)} className="w-full h-9 bg-white border border-slate-200 rounded-lg px-2 text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
                                        <option value="Cash">Cash</option>
                                        <option value="G-Cash">G-Cash</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Check">Check</option>
                                    </select>
                                </Field>
                                <Field className="flex flex-col gap-1">
                                    <FieldLabel className="font-bold text-slate-700">Date Disbursed</FieldLabel>
                                    <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="h-9 text-xs bg-white border-slate-200 rounded-lg font-medium cursor-pointer" />
                                </Field>
                            </div>
                        </div>

                        <DialogFooter className="border-t pt-4 flex gap-2 w-full mt-2">
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="text-xs h-9 font-bold border-slate-200 text-slate-700 flex-1 rounded-lg">
                                Cancel
                            </Button>
                            <Button onClick={() => addExpenseMutation.mutate()} className="text-xs h-9 font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex-1 shadow-xs rounded-lg" disabled={addExpenseMutation.isPending}>
                                {addExpenseMutation.isPending ? "Saving..." : "Commit Record Entries"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* METRICS BANNER CLUSTER */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full shrink-0">
                <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-50 border border-indigo-100/60 rounded-lg flex items-center justify-center text-indigo-600"><Banknote className="w-4 h-4" /></div>
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Filtered Outflow Total</span>
                        <span className="text-lg font-black text-slate-800 tracking-tight block mt-0.5">₱{totalDisbursed.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
                <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 bg-amber-50 border border-amber-100/60 rounded-lg flex items-center justify-center text-amber-600"><ReceiptText className="w-4 h-4" /></div>
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Visible Transactions</span>
                        <span className="text-lg font-black text-slate-800 tracking-tight block mt-0.5">{filteredExpenses.length} Vouchers Listed</span>
                    </div>
                </div>
                <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-50 border border-emerald-100/60 rounded-lg flex items-center justify-center text-emerald-600"><CalendarDays className="w-4 h-4" /></div>
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Date Scope Filter</span>
                        <span className="text-xs font-black text-emerald-700 block mt-1 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 border border-emerald-200/40 rounded-md w-fit">
                            {dateFilter}
                        </span>
                    </div>
                </div>
            </div>

            {/* CONTROL BAR: DROPDOWNS INTEGRATION */}
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-3 shrink-0">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    
                    {/* Category Dropdown Menu */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="category-select" className="text-xs font-bold text-slate-400 uppercase tracking-wide shrink-0">
                            Category:
                        </label>
                        <div className="relative w-full sm:w-48">
                            <select
                                id="category-select"
                                value={selectedCategoryId}
                                onChange={(e) => setSelectedCategoryId(e.target.value)}
                                className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-800 appearance-none outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer pr-8"
                            >
                                <option value="all">All Categories</option>
                                {dbCategories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Timeline Dropdown Menu */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="timeline-select" className="text-xs font-bold text-slate-400 uppercase tracking-wide shrink-0">
                            Timeline:
                        </label>
                        <div className="relative w-full sm:w-40">
                            <select
                                id="timeline-select"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value as DateFilterType)}
                                className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-800 appearance-none outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer pr-8"
                            >
                                {["All Time", "Today", "This Week", "This Month"].map((timeKey) => (
                                    <option key={timeKey} value={timeKey}>{timeKey}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                </div>

                {/* Sub-search input wrapper */}
                <div className="relative w-full sm:w-64 shrink-0">
                    <Input
                        type="text"
                        placeholder="Search particulars description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 text-xs pl-8 bg-white border-slate-200 rounded-xl font-medium placeholder:text-slate-400 focus-visible:ring-indigo-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
            </div>

            {/* MASTER SYSTEM DATA LEDGER TABLE */}
            <Card className="w-full flex-1 flex flex-col border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs min-h-0">
                <CardContent className="p-0 flex-1 min-h-0 relative">
                    <div className="absolute inset-0 overflow-y-auto overflow-x-auto">
                        <table className="w-full border-collapse text-left table-auto">
                            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-xs z-10 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b select-none shadow-3xs">
                                <tr>
                                    <th className="py-3 px-6 bg-slate-50/90">Voucher ID</th>
                                    <th className="py-3 px-6 bg-slate-50/90">Expense Item / Particulars</th>
                                    <th className="py-3 px-6 bg-slate-50/90">Category</th>
                                    <th className="py-3 px-6 bg-slate-50/90">MOP</th>
                                    <th className="py-3 px-6 text-right bg-slate-50/90">Amount Disbursed</th>
                                    <th className="py-3 px-6 bg-slate-50/90">Date Disbursed</th>
                                    <th className="py-3 px-6 text-center bg-slate-50/90">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                                {filteredExpenses.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-20 text-slate-400 italic bg-white">
                                            No database expense records found matching these active parameters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredExpenses.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/30 transition-colors bg-white">
                                            <td className="py-3.5 px-6 font-mono font-bold text-indigo-600 text-[11px]">{item.expense_number}</td>
                                            <td className="py-3.5 px-6 font-bold text-slate-900 max-w-[220px] truncate" title={item.description}>
                                                {item.description}
                                            </td>
                                            <td className="py-3.5 px-6">
                                                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-slate-100 border text-slate-600 rounded-md">
                                                    {item.category_name}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-6 text-slate-500 text-[11px] font-bold">{item.payment_method}</td>
                                            <td className="py-3.5 px-6 text-right font-mono font-black text-slate-900 text-sm">
                                                ₱{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="py-3.5 px-6 text-slate-400 font-medium">
                                                {new Date(item.date).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric"
                                               })}
                                            </td>
                                            <td className="py-3.5 px-6 text-center">
                                                {/* 🎯 INTEGRATED INTERCEPTING INTERFACE INTERACTIVE OVERLAY MODAL */}
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50" title="Delete Voucher">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="bg-white rounded-xl border max-w-sm">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-sm font-black text-slate-900 tracking-tight">Void Expense Voucher?</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed">
                                                                Are you sure you want to remove <span className="font-bold text-slate-800">{item.expense_number}</span>? This will permanently wipe the entry from financial books.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter className="text-xs">
                                                            <AlertDialogCancel className="h-8 font-semibold text-xs border-slate-200 rounded-lg">Cancel</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                onClick={() => deleteExpenseMutation.mutate(item.id)}
                                                                className="h-8 font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
                                                            >
                                                                Void Record
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}