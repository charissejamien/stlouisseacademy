"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
    History, 
    User, 
    CreditCard, 
    Search, 
    Calendar, 
    ArrowUpDown, 
    Activity, 
    Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

// 📚 Import the actions to fetch your audit logs from the backend
import { getStudentAuditLogs, getPaymentAuditLogs, StudentAuditLogRecord, PaymentAuditLogRecord } from "./actions";

export default function ExecutiveAuditDashboardPage() {
    const [activeTab, setActiveTab] = useState("students");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSchoolYear, setSelectedSchoolYear] = useState("all");

    // ✅ Secure query tracking hook for the audit_students list records
    const { data: studentLogs = [], isLoading: isLoadingStudents } = useQuery<StudentAuditLogRecord[]>({
        queryKey: ["auditLogs", "students"],
        queryFn: getStudentAuditLogs,
        enabled: activeTab === "students"
    });

    // ✅ Secure query tracking hook for the audit_payments list records
    const { data: paymentLogs = [], isLoading: isLoadingPayments } = useQuery<PaymentAuditLogRecord[]>({
        queryKey: ["auditLogs", "payments"],
        queryFn: getPaymentAuditLogs,
        enabled: activeTab === "payments"
    });

    // Extract dynamic unique school year options for your layout filter bar dropdown dropdowns
    const uniqueSchoolYears = Array.from(
        new Set([
            ...studentLogs.map((l) => l.school_year_id),
            ...paymentLogs.map((l) => l.school_year_id),
        ])
    ).filter(Boolean);

    // Filter student log trail items based on selection metrics
    const filteredStudentLogs = studentLogs.filter((log) => {
        const matchesSearch = 
            log.field_changed?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.edited_by?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.student_id?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesYear = selectedSchoolYear === "all" || log.school_year_id === selectedSchoolYear;
        
        return matchesSearch && matchesYear;
    });

    // Filter payment log trail items based on selection metrics
    const filteredPaymentLogs = paymentLogs.filter((log) => {
        const matchesSearch = 
            log.action_taken?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.edited_by?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.or_number?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesYear = selectedSchoolYear === "all" || log.school_year_id === selectedSchoolYear;
        
        return matchesSearch && matchesYear;
    });

    return (
        <div className="w-[95%] max-w-(screen-2xl) mx-auto my-10 flex flex-col gap-6 antialiased">
            
            {/* 📋 MASTER HEADER TRACK */}
            <div className="flex justify-between items-start border-b pb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <History className="w-8 h-8 text-indigo-600" />
                        <span>System Institutional Audits</span>
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Review immutable historical records. All system modifications track alphabetically inside centralized layout structures.
                    </p>
                </div>
                
                {/* METRIC BADGE CLUSTER */}
                <div className="flex gap-4">
                    <div className="bg-slate-50 border px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-3xs">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><Activity className="w-4 h-4" /></div>
                        <div className="flex flex-col text-xs">
                            <span className="text-slate-400 font-medium uppercase tracking-wider text-[9px]">Student Audits</span>
                            <span className="font-black text-slate-900 mt-0.5">{studentLogs.length} Tracks</span>
                        </div>
                    </div>
                    <div className="bg-slate-50 border px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-3xs">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600"><Clock className="w-4 h-4" /></div>
                        <div className="flex flex-col text-xs">
                            <span className="text-slate-400 font-medium uppercase tracking-wider text-[9px]">Payment Audits</span>
                            <span className="font-black text-slate-900 mt-0.5">{paymentLogs.length} Tracks</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🛠️ FILTER UTILITY STRIP AREA */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 border p-4 rounded-xl shadow-3xs">
                <div className="relative w-full sm:w-96">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 -mt-0.5" />
                    <Input
                        placeholder="Search logs by keyword, operator, or record tokens..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-10 text-xs bg-white border-slate-200 shadow-3xs"
                    />
                </div>

                <div className="w-full sm:w-56">
                    <Select value={selectedSchoolYear} onValueChange={setSelectedSchoolYear}>
                        <SelectTrigger className="h-10 text-xs font-medium border-slate-200 bg-white shadow-3xs">
                            <SelectValue placeholder="Filter by Academic Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all" className="text-xs">All School Years</SelectItem>
                                {uniqueSchoolYears.map((year) => (
                                    <SelectItem key={year} value={year} className="text-xs">{year}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* 🗂️ CENTRAL ALPHABETICAL TABS MATRIX DISPLAY */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-slate-100 p-1 rounded-xl h-12 border gap-1">
                    <TabsTrigger value="students" className="h-9 font-bold text-xs px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-2xs transition-all flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>audit_students</span>
                    </TabsTrigger>
                    <TabsTrigger value="payments" className="h-9 font-bold text-xs px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-2xs transition-all flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>audit_payments</span>
                    </TabsTrigger>
                </TabsList>

                {/* 📊 AUDIT_STUDENTS DATA TABLE MODULE PANEL */}
                <TabsContent value="students" className="mt-4 animate-in fade-in duration-200 focus-visible:outline-hidden">
                    <Card className="shadow-xs border-slate-200 bg-white overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50/70 border-b select-none">
                                <TableRow>
                                    <TableHead className="w-[15%] text-[10px] font-black uppercase tracking-wider text-slate-400">Timestamp</TableHead>
                                    <TableHead className="w-[20%] text-[10px] font-black uppercase tracking-wider text-slate-400">Student ID Reference</TableHead>
                                    <TableHead className="w-[10%] text-[10px] font-black uppercase tracking-wider text-slate-400">School Year</TableHead>
                                    <TableHead className="w-[15%] text-[10px] font-black uppercase tracking-wider text-slate-400">Target Field</TableHead>
                                    <TableHead className="w-[15%] text-[10px] font-black uppercase tracking-wider text-slate-400">Historical Value</TableHead>
                                    <TableHead className="w-[15%] text-[10px] font-black uppercase tracking-wider text-slate-400">Updated Value</TableHead>
                                    <TableHead className="w-[10%] text-[10px] font-black uppercase tracking-wider text-slate-400">Operator</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="text-xs text-slate-600">
                                {isLoadingStudents ? (
                                    <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground italic font-medium"><Loader2 className="w-5 h-5 animate-spin mx-auto text-indigo-600" /></TableCell></TableRow>
                                ) : filteredStudentLogs.length > 0 ? (
                                    filteredStudentLogs.map((log) => (
                                        <TableRow key={log.id} className="hover:bg-slate-50/20 transition-colors">
                                            <td className="py-3.5 px-4 font-medium text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(log.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{log.student_id}</td>
                                            <td className="py-3.5 px-4 font-semibold text-indigo-600"><span className="bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{log.school_year_id}</span></td>
                                            <td className="py-3.5 px-4 font-bold text-slate-700"><span className="bg-slate-100 px-2 py-0.5 rounded border text-[11px]">{log.field_changed}</span></td>
                                            <td className="py-3.5 px-4 line-through text-rose-600 max-w-[120px] truncate">{log.old_value || "NULL"}</td>
                                            <td className="py-3.5 px-4 font-black text-emerald-600 max-w-[120px] truncate">{log.new_value}</td>
                                            <td className="py-3.5 px-4 font-bold text-slate-900">{log.edited_by}</td>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground italic font-medium">No record log traces match current directory queries.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* 📊 AUDIT_PAYMENTS DATA TABLE MODULE PANEL */}
                <TabsContent value="payments" className="mt-4 animate-in fade-in duration-200 focus-visible:outline-hidden">
                    <Card className="shadow-xs border-slate-200 bg-white overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50/70 border-b select-none">
                                <TableRow>
                                    <TableHead className="w-[15%] text-[10px] font-black uppercase tracking-wider text-slate-400">Timestamp</TableHead>
                                    <TableHead className="w-[15%] text-[10px] font-black uppercase tracking-wider text-slate-400">OR Number</TableHead>
                                    <TableHead className="w-[10%] text-[10px] font-black uppercase tracking-wider text-slate-400">School Year</TableHead>
                                    <TableHead className="w-[10%] text-[10px] font-black uppercase tracking-wider text-slate-400">Action Matrix</TableHead>
                                    <TableHead className="w-[15%] text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Gross Before</TableHead>
                                    <TableHead className="w-[15%] text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Gross After</TableHead>
                                    <TableHead className="w-[10%] text-[10px] font-black uppercase tracking-wider text-slate-400">Operator</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="text-xs text-slate-600">
                                {isLoadingPayments ? (
                                    <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground italic font-medium"><Loader2 className="w-5 h-5 animate-spin mx-auto text-emerald-600" /></TableCell></TableRow>
                                ) : filteredPaymentLogs.length > 0 ? (
                                    filteredPaymentLogs.map((log) => (
                                        <TableRow key={log.id} className="hover:bg-slate-50/20 transition-colors">
                                            <td className="py-3.5 px-4 font-medium text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(log.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{log.or_number}</td>
                                            <td className="py-3.5 px-4 font-semibold text-emerald-600"><span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{log.school_year_id}</span></td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2 py-0.5 rounded font-black border text-[10px] ${
                                                    log.action_taken === "DELETE" ? "bg-rose-50 border-rose-100 text-rose-700" :
                                                    log.action_taken === "UPDATE" ? "bg-amber-50 border-amber-100 text-amber-700" :
                                                    "bg-emerald-50 border-emerald-100 text-emerald-700"
                                                }`}>
                                                    {log.action_taken}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right line-through text-slate-400 font-medium">₱{Number(log.amount_before || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            <td className="py-3.5 px-4 text-right font-black text-indigo-600">₱{Number(log.amount_after || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            <td className="py-3.5 px-4 font-bold text-slate-900">{log.edited_by}</td>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground italic font-medium">No financial tracking entries match parameters.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>
            </Tabs>

        </div>
    );
}

// Inline fallback loader icon component implementation variant
function Loader2({ className }: { className?: string }) {
    return <Activity className={`${className} animate-pulse`} />;
}