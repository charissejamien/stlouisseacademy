"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
    Clock, 
    RefreshCw, 
    Loader2,
    Calendar,
    Search,
    Filter,
    Info,
    LogIn,
    LogOut,
    ArrowRightLeft,
    UserCheck,
    UserX
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMasterAttendanceList, MasterListRow } from "./actions";

export default function AttendanceTrackerDashboard() {
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        return new Date().toISOString().split("T")[0];
    });
    const [searchQuery, setSearchQuery] = useState("");
    
    // Defaulting the initial dropdown selection state directly to Nursery
    const [selectedGrade, setSelectedGrade] = useState("Nursery");
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const { data, isLoading, isRefetching, refetch } = useQuery({
        queryKey: ["masterAttendanceLogs", selectedDate],
        queryFn: () => getMasterAttendanceList(selectedDate),
        refetchInterval: 3000
    });

    const students = data?.students ?? [];
    const gradeLevels = data?.gradeLevels ?? [];

    // Filter students by search string and current Grade selection
    const filteredStudents = students.filter((s) => {
        const matchesGrade = selectedGrade === "ALL" || s.grade_level === selectedGrade;
        const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
        const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || s.student_id.includes(searchQuery);
        return matchesGrade && matchesSearch;
    });

    // Segment data arrays for the two side-by-side panel blocks
    const maleStudents = filteredStudents.filter((s) => s.gender === "Male");
    const femaleStudents = filteredStudents.filter((s) => s.gender === "Female");

    // Compute live counters strictly mapping to the currently filtered segment rows
    const totalScansCount = filteredStudents.reduce((acc, s) => acc + s.all_logs_today.length, 0);
    const totalCheckIns = filteredStudents.filter((s) => s.status === "IN").length;
    const totalCheckOuts = filteredStudents.filter((s) => s.status === "OUT").length;

    const toggleRow = (uuid: string) => {
        setExpandedRow(expandedRow === uuid ? null : uuid);
    };

    return (
        <div className="w-[95%] max-w-(screen-2xl) mx-auto my-10 flex flex-col gap-8 antialiased">
            
            {/* Header Module Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
                        Live RFID Entry Tracker
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Real-time monitoring panel displaying campus gate check-ins and check-outs.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 border border-slate-200 bg-white px-3 h-10 rounded-lg shadow-3xs text-sm font-medium">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="outline-none border-none bg-transparent cursor-pointer font-bold text-slate-900 text-xs"
                        />
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => refetch()} 
                        disabled={isLoading || isRefetching}
                        className="text-xs font-bold border-slate-200 h-10 flex items-center gap-2 px-4 rounded-lg bg-white shadow-3xs"
                    >
                        {isRefetching || isLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                        ) : (
                            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                        )}
                        <span>Sync Ledger Feed</span>
                    </Button>
                </div>
            </div>

            {/* Attendance Analytics Matrix Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <ArrowRightLeft className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Active Scans</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                                {isLoading ? "---" : `${totalScansCount} Taps Today`}
                            </h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students Inside Campus</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                                {isLoading ? "---" : `${totalCheckIns} Active IN`}
                            </h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <UserX className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students Left Campus</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                                {isLoading ? "---" : `${totalCheckOuts} Departed OUT`}
                            </h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Toolbar Section */}
            <div className="flex flex-col md:flex-row items-center gap-3 bg-slate-50/60 p-3 rounded-xl border border-slate-200/60">
                <div className="relative w-full md:flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search student name or ID number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200 pl-9 pr-4 h-10 rounded-lg text-xs font-medium placeholder-slate-400 outline-none focus:border-indigo-500 shadow-3xs"
                    />
                </div>
                
                <div className="relative w-full md:w-64 flex items-center bg-white border border-slate-200 px-3 h-10 rounded-lg shadow-3xs">
                    <Filter className="w-4 h-4 text-slate-400 mr-2" />
                    <select
                        value={selectedGrade}
                        onChange={(e) => setSelectedGrade(e.target.value)}
                        className="w-full text-xs font-bold text-slate-700 outline-none bg-transparent cursor-pointer"
                    >
                        <option value="ALL">All Grade Levels</option>
                        {gradeLevels.map((lvl) => (
                            <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Side-by-Side Gender Distribution Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* MALE STUDENTS COLUMN COMPONENT */}
                <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
                    <div className="p-5 border-b flex justify-between items-center bg-slate-50/20">
                        <div>
                            <h3 className="text-base font-bold text-slate-800">Male Students</h3>
                        </div>
                        <span className="text-xs font-extrabold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100">
                            Total: {maleStudents.length}
                        </span>
                    </div>
                    <StudentGridTable students={maleStudents} isLoading={isLoading} expandedRow={expandedRow} onToggleRow={toggleRow} />
                </Card>

                {/* FEMALE STUDENTS COLUMN COMPONENT */}
                <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
                    <div className="p-5 border-b flex justify-between items-center bg-slate-50/20">
                        <div>
                            <h3 className="text-base font-bold text-slate-800">Female Students</h3>
                        </div>
                        <span className="text-xs font-extrabold bg-pink-50 text-pink-700 px-2.5 py-1 rounded-md border border-pink-100">
                            Total: {femaleStudents.length}
                        </span>
                    </div>
                    <StudentGridTable students={femaleStudents} isLoading={isLoading} expandedRow={expandedRow} onToggleRow={toggleRow} />
                </Card>

            </div>
        </div>
    );
}

interface TableProps {
    students: MasterListRow[];
    isLoading: boolean;
    expandedRow: string | null;
    onToggleRow: (uuid: string) => void;
}

function StudentGridTable({ students, isLoading, expandedRow, onToggleRow }: TableProps) {
    return (
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-xs border-b">
                    <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none">
                        <th className="py-3 px-4 w-12 text-center">Info</th>
                        <th className="py-3 px-4">System ID</th>
                        <th className="py-3 px-4">Full Legal Name</th>
                        <th className="py-3 px-4 text-center">Direction Status</th>
                        <th className="py-3 px-4 text-right">Time of Tap</th>
                    </tr>
                </thead>
                <tbody className="text-xs divide-y text-slate-700">
                    {isLoading ? (
                        <tr>
                            <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                                <div className="flex flex-row gap-2 justify-center items-center">
                                    <Loader2 className="animate-spin text-indigo-600 w-4 h-4" />
                                    <span>Syncing active gateway data...</span>
                                </div>
                            </td>
                        </tr>
                    ) : students.length > 0 ? (
                        students.map((student) => {
                            const isExpanded = expandedRow === student.student_uuid;
                            const inCount = student.all_logs_today.filter(l => l.log_type === "IN").length;
                            const outCount = student.all_logs_today.filter(l => l.log_type === "OUT").length;

                            const getOccurrenceLabel = () => {
                                if (student.status === "IN" && inCount > 1) return ` (${inCount}nd IN)`;
                                if (student.status === "OUT" && outCount > 1) return ` (${outCount}nd OUT)`;
                                return "";
                            };

                            return (
                                <>
                                    <tr className={`hover:bg-slate-50/20 transition-colors ${isExpanded ? 'bg-slate-50/50' : ''}`}>
                                        <td className="py-3.5 px-4 text-center">
                                            <button 
                                                onClick={() => onToggleRow(student.student_uuid)}
                                                disabled={student.all_logs_today.length === 0}
                                                className={`p-1.5 rounded-md border transition-all ${
                                                    student.all_logs_today.length === 0 
                                                        ? 'text-slate-300 border-slate-100 cursor-not-allowed bg-slate-50/30' 
                                                        : 'text-slate-500 bg-white border-slate-200 hover:text-indigo-600 hover:border-indigo-300 shadow-3xs'
                                                }`}
                                            >
                                                <Info className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                                            {student.student_id}
                                        </td>
                                        <td className="py-3.5 px-4 font-bold text-slate-900">
                                            {student.last_name}, {student.first_name}
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <span className={`px-3 py-1 rounded-md font-extrabold text-[10px] tracking-wider uppercase border ${
                                                student.status === "IN"
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                    : student.status === "OUT"
                                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                                    : "bg-slate-50 text-slate-400 border-slate-200"
                                            }`}>
                                                {student.status === "IN" ? "Checked IN 📥" : student.status === "OUT" ? "Checked OUT 📤" : "No Log"}
                                                {getOccurrenceLabel()}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-slate-400 stroke-[2]" />
                                                <span>{student.formatted_time}</span>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expandable Daily Logs Grid Row Block */}
                                    {isExpanded && student.all_logs_today.length > 0 && (
                                        <tr className="bg-slate-50/50">
                                            <td colSpan={5} className="py-3 px-6 border-l-2 border-indigo-500 bg-slate-50/30">
                                                <div className="flex flex-col gap-2">
                                                    <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                                                        Timeline Logs Tracking Matrix ({student.all_logs_today.length} items)
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {student.all_logs_today.map((log, index) => (
                                                            <div 
                                                                key={log.id} 
                                                                className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-lg shadow-4xs text-slate-700 font-mono text-[11px]"
                                                            >
                                                                <div className={`p-1 rounded ${
                                                                    log.log_type === "IN" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                                                }`}>
                                                                    {log.log_type === "IN" ? <LogIn className="w-3 h-3" /> : <LogOut className="w-3 h-3" />}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[8px] text-slate-400 font-bold uppercase">
                                                                        Tap #{index + 1} ({log.log_type})
                                                                    </span>
                                                                    <span className="font-bold text-slate-800">{log.formatted_time}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={5} className="py-16 text-center text-sm text-slate-400 italic font-medium bg-slate-50/10">
                                No entry scans matching this filter recorded for today.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}