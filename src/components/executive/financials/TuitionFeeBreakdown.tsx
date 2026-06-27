"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import { getTuitionFeeByGradeGrouped } from "@/app/(portal)/executive/financials/balances/tuition/actions";

interface TuitionFeeBreakdownProps {
    activeSchoolYearId: string;
}

export default function TuitionFeeBreakdown({ activeSchoolYearId }: TuitionFeeBreakdownProps) {
    const [selectedGradeKey, setSelectedGradeKey] = useState<string>("Nursery");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const { data: groupedData = {}, isLoading, error } = useQuery({
        queryKey: ["tuitionUltraModernTable", activeSchoolYearId],
        queryFn: () => getTuitionFeeByGradeGrouped(activeSchoolYearId),
        enabled: !!activeSchoolYearId
    });

    const activeGroup = useMemo(() => {
        return groupedData[selectedGradeKey] || {
            gradeLevel: selectedGradeKey.match(/^\d+$/) ? `Grade ${selectedGradeKey}` : selectedGradeKey,
            totalAssessed: 0,
            totalCollected: 0,
            totalOutstanding: 0,
            students: []
        };
    }, [groupedData, selectedGradeKey]);

    const filteredStudents = useMemo(() => {
        if (!searchQuery.trim()) return activeGroup.students;
        return activeGroup.students.filter(student =>
            student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [activeGroup.students, searchQuery]);

    if (isLoading) {
        return (
            <div className="w-full h-[400px] flex flex-col items-center justify-center gap-3 bg-white">
                <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
                <span className="text-xs text-slate-400 font-medium tracking-tight">Syncing tuition registry...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full text-xs font-semibold text-rose-600 bg-rose-50/50 p-4 rounded-xl border border-rose-100/80">
                Failed to process current ledger collection groupings.
            </div>
        );
    }

    const trackingTabs = ["Nursery", "Pre-Kindergarten", "Kindergarten", "1", "2", "3", "4", "5", "6"];

    return (
        <div className="w-full h-[calc(100vh-120px)] flex flex-col gap-6 overflow-hidden bg-white antialiased">
            
            {/* CONTROL ROW MODULE: Nav Navigation + Modern Search */}
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-2 shrink-0">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none w-full sm:w-auto">
                    {trackingTabs.map((tabKey) => (
                        <button
                            key={tabKey}
                            onClick={() => {
                                setSelectedGradeKey(tabKey);
                                setSearchQuery("");
                            }}
                            className={`px-3 py-2 text-xs font-semibold tracking-tight transition-all relative ${
                                selectedGradeKey === tabKey
                                    ? "text-slate-900 font-bold after:absolute after:bottom-[-9px] after:left-0 after:w-full after:h-[2px] after:bg-slate-900"
                                    : "text-slate-400 hover:text-slate-800"
                            }`}
                        >
                            {tabKey.match(/^\d+$/) ? `Grade ${tabKey}` : tabKey}
                        </button>
                    ))}
                </div>

                <div className="relative w-full sm:w-60 shrink-0">
                    <Input
                        type="text"
                        placeholder="Search student..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 text-xs pl-8 bg-slate-50/60 border-none rounded-lg font-medium placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-200"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
            </div>

            {/* DYNAMIC WORKSPACE COMPOSITION FRAME */}
            <div className="w-full flex-1 flex flex-col min-h-0">
                
                {/* MODERN HEADER ARCHITECTURE: TITLE + METRICS TICKER INLINE */}
                <div className="w-full flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 pb-4 shrink-0">
                    <div className="flex items-baseline gap-2.5">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{activeGroup.gradeLevel}</h2>
                        <span className="text-xs font-semibold text-slate-400">
                            {activeGroup.students.length} students
                        </span>
                    </div>

                    {/* HIGH-DENSITY DIGITAL FINANCIAL TICKER ROW */}
                    <div className="flex items-center gap-6 text-xs bg-slate-50/70 px-4 py-2.5 rounded-xl border border-slate-100 shrink-0 select-none">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-medium">Assessed</span>
                            <span className="font-mono font-bold text-slate-800">
                                ₱{activeGroup.totalAssessed.toLocaleString()}
                            </span>
                        </div>
                        <div className="w-[1px] h-3 bg-slate-200" />
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-medium">Collected</span>
                            <span className="font-mono font-bold text-emerald-600">
                                ₱{activeGroup.totalCollected.toLocaleString()}
                            </span>
                        </div>
                        <div className="w-[1px] h-3 bg-slate-200" />
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-medium">Outstanding</span>
                            <span className="font-mono font-bold text-slate-900">
                                ₱{activeGroup.totalOutstanding.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* THE FLUID INTERNAL DATA PORT LIST VIEW */}
                <div className="w-full flex-1 min-h-0 relative mt-2">
                    <div className="absolute inset-0 overflow-y-auto overflow-x-auto scrollbar-thin">
                        <table className="w-full border-collapse text-left table-auto">
                            <thead className="sticky top-0 bg-white/95 backdrop-blur-xs z-10 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b select-none">
                                <tr>
                                    <th className="pb-3 pr-6 font-semibold">Student Name</th>
                                    <th className="pb-3 px-6 text-right font-semibold">Assessed</th>
                                    <th className="pb-3 px-6 text-right font-semibold">Paid</th>
                                    <th className="pb-3 px-6 text-right font-semibold">Balance</th>
                                    <th className="pb-3 pl-6 text-center font-semibold">Status</th>
                                </tr>
                            </thead>
                            
                            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-600">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-16 text-slate-400 italic font-normal bg-white">
                                            No tracking indices match your search context criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => {
                                        const balance = student.tuitionFee - student.amountPaid;
                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50/40 transition-colors">
                                                <td className="py-4 pr-6 font-bold text-slate-900 text-base tracking-tight">
                                                    {student.fullName}
                                                </td>
                                                <td className="py-4 px-6 text-right font-mono text-slate-400">
                                                    ₱{student.tuitionFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="py-4 px-6 text-right font-mono text-emerald-600 font-semibold">
                                                    ₱{student.amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="py-4 px-6 text-right font-mono font-semibold text-slate-800">
                                                    {balance > 0 ? `₱${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "—"}
                                                </td>
                                                <td className="py-4 pl-6 text-center">
                                                    {student.isFullyPaid ? (
                                                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs tracking-tight">
                                                            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                                                            <span>Settled</span>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-slate-400 font-semibold text-xs tracking-tight">
                                                            <AlertCircle className="w-3.5 h-3.5 stroke-[2]" />
                                                            <span>Pending</span>
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
                </div>
            </div>
        </div>
    );
}