"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, BookOpen, CheckCircle2, AlertCircle, Filter, Search, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { getBooksFeeByGradeGrouped } from "@/app/(portal)/executive/financials/balances/actions";

interface GradeBooksBreakdownProps {
    activeSchoolYearId: string;
}

export default function GradeBooksBreakdown({ activeSchoolYearId }: GradeBooksBreakdownProps) {
    const [selectedGradeKey, setSelectedGradeKey] = useState<string>("Nursery");
    // 🔍 Search query tracking token state
    const [searchQuery, setSearchQuery] = useState<string>("");

    const { data: groupedData = {}, isLoading, error } = useQuery({
        queryKey: ["booksScreenLockedTable", activeSchoolYearId],
        queryFn: () => getBooksFeeByGradeGrouped(activeSchoolYearId),
        enabled: !!activeSchoolYearId
    });

    // Compute active matching datasets on user query input changes
    const activeGroup = useMemo(() => {
        return groupedData[selectedGradeKey] || {
            gradeLevel: selectedGradeKey.match(/^\d+$/) ? `Grade ${selectedGradeKey}` : selectedGradeKey,
            totalAssessed: 0,
            totalCollected: 0,
            totalOutstanding: 0,
            students: []
        };
    }, [groupedData, selectedGradeKey]);

    // 🎯 Live computation filtering row entries based on the search state query
    const filteredStudents = useMemo(() => {
        if (!searchQuery.trim()) return activeGroup.students;
        return activeGroup.students.filter(student =>
            student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [activeGroup.students, searchQuery]);

    if (isLoading) {
        return (
            <div className="w-full h-[500px] flex flex-col items-center justify-center gap-2 bg-white rounded-xl border border-slate-100">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                <span className="text-sm text-slate-500 font-medium">Reconciling master accounting viewpoints...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full text-sm font-semibold text-rose-600 bg-rose-50 p-4 rounded-xl border border-rose-100">
                Failed to process current ledger collection groupings.
            </div>
        );
    }

    const allGroups = Object.values(groupedData);
    const overallAssessed = allGroups.reduce((acc, g) => acc + g.totalAssessed, 0);
    const overallCollected = allGroups.reduce((acc, g) => acc + g.totalCollected, 0);

    const trackingTabs = ["Nursery", "Pre-Kindergarten", "Kindergarten", "1", "2", "3", "4", "5", "6"];

    return (
        /* 🔒 ENFORCES EXACT VIEWPORT FILL: Prevents total outer page scroll layout overflow */
        <div className="w-full h-[calc(100vh-140px)] flex flex-col gap-4 overflow-hidden pr-2 antialiased">
            
            {/* OVERALL GLOBAL REVENUE TOP CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full shrink-0">
                <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Global Book Fees Assessed</span>
                    <span className="text-xl font-black text-slate-800 mt-0.5 block">
                        ₱{overallAssessed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Global Book Payments Collected</span>
                    <span className="text-xl font-black text-emerald-800 mt-0.5 block">
                        ₱{overallCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            {/* CONTROL ROW MODULE: Nav Tabs + Live Query Search Bar Inputs */}
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-3 shrink-0">
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full sm:w-auto">
                    <div className="text-slate-400 p-1 shrink-0"><Filter className="w-3.5 h-3.5" /></div>
                    {trackingTabs.map((tabKey) => {
                        const tabCount = groupedData[tabKey]?.students.length || 0;
                        return (
                            <button
                                key={tabKey}
                                onClick={() => {
                                    setSelectedGradeKey(tabKey);
                                    setSearchQuery(""); // Clear lookup scopes when shifting segments
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                                    selectedGradeKey === tabKey
                                        ? "bg-indigo-600 text-white shadow-xs"
                                        : "text-slate-500 hover:bg-slate-100"
                                }`}
                            >
                                <span>{tabKey.match(/^\d+$/) ? `Grade ${tabKey}` : tabKey}</span>
                            </button>
                        );
                    })}
                </div>

                {/* 🔍 LIVE SEARCH INPUT SLOT CONTAINER */}
                <div className="relative w-full sm:w-64 shrink-0">
                    <Input
                        type="text"
                        placeholder="Search student profile name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 text-xs pl-8 bg-white border-slate-200 rounded-xl font-medium placeholder:text-slate-400 focus-visible:ring-indigo-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
            </div>

            {/* MAIN SYSTEM LEDGER INTERFACE CONTAINER */}
            <Card className="w-full flex-1 flex flex-col border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs min-h-0">
                
                {/* ACCOUNT CARD BLOCK HEADER MARGINS */}
                <CardHeader className="border-b bg-slate-50/40 p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shrink-0">
                    <div>
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-indigo-600" />
                            <CardTitle className="text-base font-black text-slate-900 flex items-center gap-2">
                                <span>{activeGroup.gradeLevel}</span>
                                {/* 🎯 TOTAL LIST VALUE COUNTER ACCORDING TO YOUR SPECIFICATION */}
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 border px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <Users className="w-3 h-3 text-slate-500" />
                                    {activeGroup.students.length} Total Registered
                                </span>
                            </CardTitle>
                        </div>
                        <CardDescription className="text-[11px] text-slate-400 mt-0.5">
                            Roster profile log matrix registry file entries.
                        </CardDescription>
                    </div>

                    {/* Financial Summary Breakdown Pill Node */}
                    <div className="grid grid-cols-3 divide-x divide-slate-100 bg-white border border-slate-200/60 rounded-xl p-2.5 text-center min-w-[320px] sm:min-w-[380px] shadow-3xs">
                        <div>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Assessed</span>
                            <span className="text-xs font-bold text-slate-800 font-mono block mt-0.5">
                                ₱{activeGroup.totalAssessed.toLocaleString()}
                            </span>
                        </div>
                        <div>
                            <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-wider block">Collected</span>
                            <span className="text-xs font-bold text-emerald-700 font-mono block mt-0.5">
                                ₱{activeGroup.totalCollected.toLocaleString()}
                            </span>
                        </div>
                        <div>
                            <span className="text-[8px] font-bold text-rose-600 uppercase tracking-wider block">Outstanding</span>
                            <span className="text-xs font-bold text-rose-700 font-mono block mt-0.5">
                                ₱{activeGroup.totalOutstanding.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </CardHeader>

                {/* THE CORE SCROLLABLE INNER TABLE GRID FRAMEWORK */}
                <CardContent className="p-0 flex-1 min-h-0 relative">
                    {/* 🔄 This element handles all internal scrolling paths fluidly */}
                    <div className="absolute inset-0 overflow-y-auto overflow-x-auto">
                        <table className="w-full border-collapse text-left table-auto">
                            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-xs z-10 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b select-none shadow-3xs">
                                <tr>
                                    <th className="py-3 px-6 bg-slate-50/90">Student Name</th>
                                    <th className="py-3 px-6 text-right bg-slate-50/90">Assessed Fee</th>
                                    <th className="py-3 px-6 text-right bg-slate-50/90">Amount Paid</th>
                                    <th className="py-3 px-6 text-right bg-slate-50/90">Remaining Balance</th>
                                    <th className="py-3 px-6 text-center bg-slate-50/90">Clearance Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-16 text-slate-400 italic bg-white">
                                            No tracking entries found matching current search queries.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => {
                                        const balance = student.booksFee - student.amountPaid;
                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50/30 transition-colors bg-white">
                                                <td className="py-3 px-6 font-bold text-slate-900">{student.fullName}</td>
                                                <td className="py-3 px-6 text-right font-mono text-slate-500">₱{student.booksFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                <td className="py-3 px-6 text-right font-mono text-emerald-700 font-semibold">₱{student.amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                <td className="py-3 px-6 text-right font-mono font-bold text-slate-800">
                                                    {balance > 0 ? `₱${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "—"}
                                                </td>
                                                <td className="py-3 px-6 text-center">
                                                    {student.isFullyPaid ? (
                                                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wide">
                                                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                                            <span>Settled</span>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/50 px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wide">
                                                            <AlertCircle className="w-2.5 h-2.5 text-amber-600" />
                                                            <span>Outstanding</span>
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}