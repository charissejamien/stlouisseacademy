"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, GraduationCap, CheckCircle2, AlertCircle, Search, Users, ChevronDown, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getTuitionFeeByGradeGrouped, StudentListItem } from "../actions";

interface ExtendedStudentListItem extends StudentListItem {
    originGradeLevel: string;
}

export default function ExecutiveTuitionBalancesPage() {
    const ACTIVE_SCHOOL_YEAR_UUID = "8ca2cef9-7a33-41e4-aea5-5af8cc40625f"; 
    const [selectedGradeKey, setSelectedGradeKey] = useState<string>("Nursery");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const { data: groupedData = {}, isLoading, error } = useQuery({
        queryKey: ["tuitionScreenLockedTable", ACTIVE_SCHOOL_YEAR_UUID],
        queryFn: () => getTuitionFeeByGradeGrouped(ACTIVE_SCHOOL_YEAR_UUID),
        enabled: !!ACTIVE_SCHOOL_YEAR_UUID
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

    // 🎯 GLOBAL SEARCH FILTER MATRIX
    const filteredStudents = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        
        // Mode A: Search box is empty -> Return selected grade level group
        if (!query) {
            return (activeGroup.students || []).map(s => ({ 
                ...s, 
                originGradeLevel: activeGroup.gradeLevel 
            }));
        }

        // Mode B: Search has text -> Extract and scan ALL students across all levels
        const globalAccumulatedRoster: ExtendedStudentListItem[] = [];
        
        Object.entries(groupedData).forEach(([tabKey, group]) => {
            const formattedLabel = tabKey.match(/^\d+$/) ? `Grade ${tabKey}` : tabKey;
            const studentsList = group?.students || [];
            
            studentsList.forEach((student: StudentListItem) => {
                if (student.fullName && student.fullName.toLowerCase().includes(query)) {
                    globalAccumulatedRoster.push({
                        ...student,
                        originGradeLevel: formattedLabel
                    });
                }
            });
        });

        // Alphabetize globally by full name
        return globalAccumulatedRoster.sort((a, b) => a.fullName.localeCompare(b.fullName));
    }, [groupedData, activeGroup, searchQuery]);

    if (isLoading) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center gap-2 bg-white">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                <span className="text-sm text-slate-500 font-medium">Reconciling master accounting viewpoints...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-6 text-sm font-semibold text-rose-600 bg-rose-50 rounded-xl">
                Failed to process current ledger collection groupings.
            </div>
        );
    }

    const allGroups = Object.values(groupedData);
    const overallAssessed = allGroups.reduce((acc, g) => acc + (g.totalAssessed || 0), 0);
    const overallCollected = allGroups.reduce((acc, g) => acc + (g.totalCollected || 0), 0);
    const overallOutstanding = allGroups.reduce((acc, g) => acc + (g.totalOutstanding || 0), 0);

    const trackingTabs = ["Nursery", "Pre-Kindergarten", "Kindergarten", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const isSearchingGlobally = searchQuery.trim().length > 0;

    return (
        <div className="w-full h-screen p-6 flex flex-col gap-4 overflow-hidden bg-white antialiased">
            <div className="shrink-0">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Tuition Fee Clearance Registry</h1>
                <p className="text-xs text-slate-400 mt-0.5">Real-time tuition balance and collection monitor ledger.</p>
            </div>
            
            {/* GLOBAL TILES SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full shrink-0">
                <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Global Tuition Assessed</span>
                    <span className="text-xl font-black text-slate-800 mt-0.5 block">
                        ₱{overallAssessed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Global Payments Collected</span>
                    <span className="text-xl font-black text-emerald-800 mt-0.5 block">
                        ₱{overallCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="bg-rose-50/40 border border-rose-100 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Global Total to be Collected</span>
                    <span className="text-xl font-black text-rose-800 mt-0.5 block">
                        ₱{overallOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            {/* CONTROLS BAR BAR */}
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-3 shrink-0">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <label htmlFor="grade-select" className="text-xs font-bold text-slate-400 uppercase tracking-wide shrink-0">
                        Filter Level:
                    </label>
                    <div className="relative w-full sm:w-56">
                        <select
                            id="grade-select"
                            value={selectedGradeKey}
                            onChange={(e) => {
                                setSelectedGradeKey(e.target.value);
                                setSearchQuery(""); 
                            }}
                            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-800 appearance-none outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer pr-8"
                        >
                            {trackingTabs.map((tabKey) => {
                                const tabCount = groupedData[tabKey]?.students?.length || 0;
                                const labelText = tabKey.match(/^\d+$/) ? `Grade ${tabKey}` : tabKey;
                                return (
                                    <option key={tabKey} value={tabKey}>
                                        {labelText} ({tabCount})
                                    </option>
                                );
                            })}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                <div className="relative w-full sm:w-64 shrink-0">
                    <Input
                        type="text"
                        placeholder="Search student globally across all grades..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 text-xs pl-8 bg-white border-slate-200 rounded-xl font-medium placeholder:text-slate-400 focus-visible:ring-indigo-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
            </div>

            {/* MAIN ROSTER TABLE CARD */}
            <Card className="w-full flex-1 flex flex-col border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs min-h-0">
                <CardHeader className="border-b bg-slate-50/40 p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shrink-0">
                    <div>
                        <div className="flex items-center gap-2">
                            {isSearchingGlobally ? (
                                <Globe className="w-4 h-4 text-amber-600" />
                            ) : (
                                <GraduationCap className="w-4 h-4 text-indigo-600" />
                            )}
                            <CardTitle className="text-base font-black text-slate-900 flex items-center gap-2">
                                <span>{isSearchingGlobally ? "Global Search Results" : activeGroup.gradeLevel}</span>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 border px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <Users className="w-3 h-3 text-slate-500" />
                                    {filteredStudents.length} {isSearchingGlobally ? "Matches Found" : "Total Registered"}
                                </span>
                            </CardTitle>
                        </div>
                    </div>

                    {!isSearchingGlobally && (
                        <div className="grid grid-cols-3 divide-x divide-slate-100 bg-white border border-slate-200/60 rounded-xl p-2.5 text-center min-w-[320px] sm:min-w-[380px] shadow-3xs">
                            <div>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Assessed</span>
                                <span className="text-xs font-bold text-slate-800 font-mono block mt-0.5">₱{(activeGroup.totalAssessed || 0).toLocaleString()}</span>
                            </div>
                            <div>
                                <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-wider block">Collected</span>
                                <span className="text-xs font-bold text-emerald-700 font-mono block mt-0.5">₱{(activeGroup.totalCollected || 0).toLocaleString()}</span>
                            </div>
                            <div>
                                <span className="text-[8px] font-bold text-rose-600 uppercase tracking-wider block">Outstanding</span>
                                <span className="text-xs font-bold text-rose-700 font-mono block mt-0.5">₱{(activeGroup.totalOutstanding || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </CardHeader>

                <CardContent className="p-0 flex-1 min-h-0 relative">
                    <div className="absolute inset-0 overflow-y-auto overflow-x-auto">
                        <table className="w-full border-collapse text-left table-auto">
                            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-xs z-10 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b select-none shadow-3xs">
                                <tr>
                                    <th className="py-3 px-6 bg-slate-50/90">Student Name</th>
                                    {isSearchingGlobally && <th className="py-3 px-6 bg-slate-50/90">Grade Level</th>}
                                    <th className="py-3 px-6 text-right bg-slate-50/90">Assessed Fee</th>
                                    <th className="py-3 px-6 text-right bg-slate-50/90">Amount Paid</th>
                                    <th className="py-3 px-6 text-right bg-slate-50/90">Remaining Balance</th>
                                    <th className="py-3 px-6 text-center bg-slate-50/90">Clearance Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={isSearchingGlobally ? 6 : 5} className="text-center py-16 text-slate-400 italic bg-white">
                                            No student records match.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => {
                                        const balance = (student.feeAmount || 0) - (student.amountPaid || 0);
                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50/30 transition-colors bg-white">
                                                <td className="py-3 px-6 font-bold text-slate-900">{student.fullName}</td>
                                                {isSearchingGlobally && (
                                                    <td className="py-3 px-6 font-bold text-indigo-600 font-mono text-[11px]">
                                                        {student.originGradeLevel}
                                                    </td>
                                                )}
                                                <td className="py-3 px-6 text-right font-mono text-slate-500">
                                                    ₱{(student.feeAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="py-3 px-6 text-right font-mono text-emerald-700 font-semibold">
                                                    ₱{(student.amountPaid || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
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