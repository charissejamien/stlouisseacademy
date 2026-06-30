"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
    Plus,
    Search,
    Filter,
    Download,
    Banknote,
    ReceiptText,
    CalendarDays,
    Trash2,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

import { 
    getExpenses,
    saveExpense,
    deleteExpense,
    ExpenseListItem
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
    const { data: expensesList = [], isLoading, error } = useQuery({
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
        onError: (err: any) => {
            toast.error(err.message || "Failed to commit record entry.");
        }
    });

    // 🎯 MUTATION: DELETE VOUCHER ROW RECORD
    const deleteExpenseMutation = useMutation({
        mutationFn: (id: string) => deleteExpense(id),
        onSuccess: () => {
            toast.success("Expense record deleted.");
            queryClient.invalidateQueries({ queryKey: ["expensesRecordSheet"] });
        }
    });

    // 🎯 SMART AUTO-CATEGORIZATION HANDLER KEYWORD SCANNER
    const handleDescriptionChange = (textValue: string) => {
        setFormDescription(textValue);
        
        // Clean text string parameters and slice down into individual word indices
        const inputWords = textValue.toLowerCase().split(/\s+/);
        
        // Match user's text tokens against structural rules arrays from the DB cache
        const automaticallyMatchedCategory = dbCategories.find(category => {
            if (!category.keywords) return false;
            
            // Re-map column comma strings to normalized array items
            const ruleKeywords = category.keywords.split(",").map(kw => kw.trim().toLowerCase());
            
            return inputWords.some(word => ruleKeywords.includes(word));
        });

        // Auto-select dropdown match state row dynamically if matched target is hit
        if (automaticallyMatchedCategory) {
            setFormCategoryUUID(automaticallyMatchedCategory.id);
        }
    };

    // 🎯 REFACTORED COMPLEX FILTER CHAIN (CATEGORIES + CALENDAR DAYS ENGINE)
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
                                {/* 🎯 ATTACHED REAL-TIME SMART TRIGGER HANDLER CONTAINER */}
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

            {/* LIVE DATA SEGMENT AND DATE FILTER ROWS */}
            <div className="w-full flex flex-col gap-3 border-b border-slate-100 pb-3 shrink-0">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    
                    {/* Category List Row Filter Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => setSelectedCategoryId("all")}
                            className={`px-3 py-1 text-xs font-bold transition-all rounded-lg border ${
                                selectedCategoryId === "all" ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-slate-50 border-slate-200/60 text-slate-500"
                            }`}
                        >
                            All Categories
                        </button>
                        {dbCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategoryId(cat.id)}
                                className={`px-3 py-1 text-xs font-bold transition-all rounded-lg border ${
                                    selectedCategoryId === cat.id ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-slate-50 border-slate-200/60 text-slate-500"
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Timeline Filter Select Dropdown Node */}
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wide">
                        <span>Timeline:</span>
                        {["All Time", "Today", "This Week", "This Month"].map((timeKey) => (
                            <button
                                key={timeKey}
                                onClick={() => setDateFilter(timeKey as DateFilterType)}
                                className={`px-2.5 py-1 text-[11px] font-bold transition-all rounded-md border ${
                                    dateFilter === timeKey ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-600"
                                }`}
                            >
                                {timeKey}
                            </button>
                        ))}
                    </div>

                </div>

                {/* Sub-search logic wrapper bar */}
                <div className="flex items-center justify-end w-full">
                    <div className="relative w-full sm:w-64">
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
                                                <Button onClick={() => deleteExpenseMutation.mutate(item.id)} variant="ghost" size="icon" className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50" title="Delete Voucher">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
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