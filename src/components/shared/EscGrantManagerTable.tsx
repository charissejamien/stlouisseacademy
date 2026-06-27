"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search, GraduationCap, CheckCircle, ChevronDown, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
// 🎯 REVISED: Swapped out sonner to use react-hot-toast standard handles
import { toast } from "react-hot-toast";

import { toggleStudentEscStatus, EscStudentItem } from "@/app/(portal)/executive/students/esc/actions";
import { getJhsEscGroupedRoster } from "@/app/(portal)/executive/students/esc/actions";

interface EscGrantManagerTableProps {
    activeSchoolYearId: string;
}

export default function EscGrantManagerTable({ activeSchoolYearId }: EscGrantManagerTableProps) {
    const queryClient = useQueryClient();
    const [selectedGradeKey, setSelectedGradeKey] = useState<string>("7");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const { data: groupedData = {}, isLoading, error } = useQuery({
        queryKey: ["jhsEscRosterGrouped", activeSchoolYearId],
        queryFn: () => getJhsEscGroupedRoster(activeSchoolYearId),
        enabled: !!activeSchoolYearId
    });

    const activeGroup = useMemo(() => {
        return groupedData[selectedGradeKey] || {
            gradeLevel: `Grade ${selectedGradeKey}`,
            totalStudents: 0,
            totalGrantees: 0,
            totalProjectedSubsidy: 0,
            students: []
        };
    }, [groupedData, selectedGradeKey]);

    const filteredStudents = useMemo(() => {
        if (!searchQuery.trim()) return activeGroup.students;
        return activeGroup.students.filter((student: EscStudentItem) =>
            student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [activeGroup.students, searchQuery]);

    const globalMetrics = useMemo(() => {
        const structuralChunks = Object.values(groupedData);
        return {
            totalGrantees: structuralChunks.reduce((acc, g) => acc + g.totalGrantees, 0),
            totalDeductions: structuralChunks.reduce((acc, g) => acc + g.totalProjectedSubsidy, 0)
        };
    }, [groupedData]);

    const { mutateAsync: executeEscToggle } = useMutation({
        mutationFn: async ({ enrollmentId, nextState }: { enrollmentId: string; nextState: boolean }) => {
            await toggleStudentEscStatus(enrollmentId, nextState);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["jhsEscRosterGrouped"] });
            queryClient.invalidateQueries({ queryKey: ["dashboardFinancialOverview"] }); 
            
            // 🎯 REVISED: Updated syntax signature to fit standard react-hot-toast parameters
            toast.success(
                `Grant profile updated to ${variables.nextState ? "Active (Eligible)" : "Inactive (Excluded)"}.`,
                {
                    style: {
                        fontSize: "12px",
                        fontWeight: "600",
                        borderRadius: "12px",
                        background: "#0f172a",
                        color: "#ffffff",
                    },
                }
            );
        },
        onError: (err) => {
            toast.error(err.message || "Failed to update database record state.");
        }
    });

    if (isLoading) {
        return (
            <div className="w-full h-[400px] flex flex-col items-center justify-center gap-2 bg-white">
                <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
                <span className="text-xs text-slate-400 font-medium tracking-tight">Syncing JHS database profiles...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-4 text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl">
                Failed to process current JHS enrollment matrices layers.
            </div>
        );
    }

    const jhsLevels = ["7", "8", "9", "10"];

    return (
        <div className="w-full h-[calc(100vh-140px)] flex flex-col gap-4 overflow-hidden pr-1 antialiased bg-white">
            
            {/* GLOBAL JHS CONSOLIDATED SUBSIDY HIGHLIGHT TILES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full shrink-0">
                <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Global Program Grantees (JHS)</span>
                    <span className="text-xl font-black text-slate-800 mt-0.5 block">
                        {globalMetrics.totalGrantees} Active Grants Allocations
                    </span>
                </div>
                <div className="bg-indigo-50/40 border border-indigo-100 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Global Projected Subsidy Deductions</span>
                    <span className="text-xl font-black text-indigo-900 mt-0.5 block">
                        ₱{globalMetrics.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            {/* CONTROL ROW MODULE */}
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-3 shrink-0">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <label htmlFor="jhs-grade-select" className="text-xs font-bold text-slate-400 uppercase tracking-wide shrink-0">
                        Filter Level:
                    </label>
                    <div className="relative w-full sm:w-56">
                        <select
                            id="jhs-grade-select"
                            value={selectedGradeKey}
                            onChange={(e) => {
                                setSelectedGradeKey(e.target.value);
                                setSearchQuery(""); 
                            }}
                            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-800 appearance-none outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer pr-8"
                        >
                            {jhsLevels.map((key) => {
                                const count = groupedData[key]?.totalStudents || 0;
                                return (
                                    <option key={key} value={key}>
                                        Grade {key} ({count})
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
                        placeholder="Search student..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 text-xs pl-8 bg-white border-slate-200 rounded-xl font-medium focus-visible:ring-indigo-500 placeholder:text-slate-400 text-slate-800"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
            </div>

            {/* MASTER SYSTEM LEDGER CARD WORKSPACE */}
            <Card className="w-full flex-1 flex flex-col border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs min-h-0">
                <CardHeader className="border-b bg-slate-50/40 p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shrink-0">
                    <div>
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-indigo-600" />
                            <CardTitle className="text-base font-black text-slate-900 flex items-center gap-2">
                                <span>{activeGroup.gradeLevel}</span>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 border px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <Users className="w-3 h-3 text-slate-500" />
                                    {activeGroup.totalStudents} Registered Students
                                </span>
                            </CardTitle>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 divide-x divide-slate-100 bg-white border border-slate-200/60 rounded-xl p-2.5 text-center min-w-[240px] sm:min-w-[300px] shadow-3xs">
                        <div>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Grantees Enrolled</span>
                            <span className="text-xs font-bold text-slate-800 font-mono block mt-0.5">{activeGroup.totalGrantees}</span>
                        </div>
                        <div>
                            <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-wider block">Grade Subsidy Total</span>
                            <span className="text-xs font-bold text-indigo-700 font-mono block mt-0.5">₱{activeGroup.totalProjectedSubsidy.toLocaleString()}</span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0 flex-1 min-h-0 relative">
                    <div className="absolute inset-0 overflow-y-auto overflow-x-auto scrollbar-thin">
                        <table className="w-full border-collapse text-left table-auto">
                            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-xs z-10 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b select-none">
                                <tr>
                                    <th className="py-3 px-6">Student Name</th>
                                    <th className="py-3 px-6">Enrollment Status</th>
                                    <th className="py-3 px-6">Date Verified</th>
                                    <th className="py-3 px-6 text-center">ESC Grant Status Toggle</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-600">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-16 text-slate-400 italic bg-white font-normal">
                                            No tracking indices match your current query parameters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student: EscStudentItem) => {
                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50/30 transition-colors bg-white">
                                                <td className="py-4 px-6 font-bold text-slate-900 text-base tracking-tight">
                                                    {student.fullName}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`text-xs font-semibold ${
                                                        student.enrollmentStatus.toLowerCase() === "officially enrolled" ? "text-emerald-600" : "text-slate-400"
                                                    }`}>
                                                        {student.enrollmentStatus}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 font-mono text-xs text-slate-400">
                                                    {student.dateEnrolled}
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <Switch
                                                            checked={student.isEsc}
                                                            onCheckedChange={(checked) => {
                                                                executeEscToggle({
                                                                    enrollmentId: student.id,
                                                                    nextState: checked
                                                                });
                                                            }}
                                                            className="data-[state=checked]:bg-indigo-600"
                                                        />
                                                        {student.isEsc && (
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 select-none animate-fade-in">
                                                                <CheckCircle className="w-3 h-3" />
                                                                -₱9,000
                                                            </span>
                                                        )}
                                                    </div>
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