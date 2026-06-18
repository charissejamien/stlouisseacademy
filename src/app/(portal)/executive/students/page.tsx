"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
    Search, 
    GraduationCap, 
    Users, 
    Download, 
    Plus, 
    MoreVertical, 
    Loader2
} from "lucide-react";
import { Card, CardContent,} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


import { getMasterStudentList } from "./actions";

const availableGradeLevels = ["All Grades", "Nursery", "Pre-Kindergarten", "Kindergarten", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export default function StudentMasterListPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("All Grades");

    const { data: students = [], isLoading } = useQuery({
        queryKey: ["masterStudentList"],
        queryFn: () => getMasterStudentList()
    });
    // ⚡ Reactive Live Filtration Engine
    const filteredStudents = students.filter((student) => {
        const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
        const matchesSearch = 
            fullName.includes(searchTerm.toLowerCase()) || 
            student.student_id.includes(searchTerm) || 
            student.parent_name.toLowerCase().includes(searchTerm.toLowerCase());
            
        const matchesGrade = selectedGrade === "All Grades" || student.grade_level === selectedGrade;

        return matchesSearch && matchesGrade
    });

    const totalCount = students.length;

    return (
        <div className="w-[95%] max-w-(screen-2xl) mx-auto my-10 flex flex-col gap-8 antialiased">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
                        Student Master List
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Central directory management for profile authentication, classroom assignments, and enrollment timeline tracking.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="text-xs font-semibold flex items-center gap-2 h-10 border-slate-200">
                        <Download className="w-4 h-4 text-slate-500" />
                        <span>Export Directory</span>
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 h-10 shadow-xs">
                        <Plus className="w-4 h-4" />
                        <span>Rapid Enrollment Portal</span>
                    </Button>
                </div>
            </div>

            {/* Quick Summary Cards (Fed by live mapped values) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card className="shadow-xs border-slate-100 bg-white h-fit">
                    <CardContent className="pt-2 flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registered Profiles</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                                {isLoading ? "---" : `${totalCount} Students`}
                            </h3>
                        </div>
                    </CardContent>
                </Card>

                 {/* Search Field Control */}
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 -mt-4" />
                        <Input 
                            placeholder="Search Name, ID, or Parent..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10 text-xs bg-white border-slate-200 shadow-xs"
                        />
                    </div>

                    {/* Grade Level Filter Dropdown */}
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                        <SelectTrigger className="bg-white border-slate-200 h-10 text-xs text-slate-700 shadow-xs">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <SelectValue placeholder="Filter by Grade" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {availableGradeLevels.map((grade) => (
                                <SelectItem key={grade} value={grade} className="text-xs">{grade}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
            </div>

            {/* Main Students Directory Table */}
            <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
                <div className="pl-5 pb-5 border-b flex justify-between items-center">
                    <div>
                        <h3 className="text-base font-bold text-slate-800">Master Roster Records</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Showing {filteredStudents.length} student matches from directory.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none">
                                <th className="py-3 px-6">System ID</th>
                                <th className="py-3 px-6">Full Legal Name</th>
                                <th className="py-3 px-6">Grade Allocation</th>
                                <th className="py-3 px-6">Classification</th>
                                <th className="py-3 px-6">Responsible Parent Profile</th>
                                <th className="py-3 px-6">Gender</th>
                                <th className="py-3 px-6">Enrollment Date</th>
                                <th className="py-3 px-6 text-center">Status</th>
                                <th className="py-3 px-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs divide-y text-slate-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={9} className="py-12 text-center text-sm text-muted-foreground">
                                        <div className="flex flex-row gap-2 justify-center items-center">
                                            <Loader2 className="animate-spin text-indigo-600 w-4 h-4" />
                                            <span className="font-semibold tracking-wide">Syncing master ledger profiles...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/40 transition-colors cursor-pointer">
                                        <td className="py-3.5 px-6 font-mono font-bold text-indigo-600">{student.student_id}</td>
                                        <td className="py-3.5 px-6 font-bold text-slate-900">
                                            {student.last_name}, {student.first_name} {student.middle_name || ""}
                                        </td>
                                        <td className="py-3.5 px-6">
                                            <span className="font-semibold bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px]">
                                                {student.grade_level}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-6 font-medium text-slate-600">
                                            <span className={`px-2 py-0.5 rounded text-[10px] ${
                                                student.student_type === "Scholar" ? "bg-purple-50 text-purple-700 border border-purple-200" : "bg-blue-50 text-blue-700 border border-blue-200"
                                            }`}>
                                                {student.student_type}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-6 font-semibold text-slate-700">{student.parent_name}</td>
                                        <td className="py-3.5 px-6 font-medium text-slate-500">{student.gender}</td>
                                        <td className="py-3.5 px-6 text-muted-foreground">{student.date_added}</td>
                                        <td className="py-3.5 px-6 text-center">
                                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                                student.status === "Enrolled" 
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                            }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="py-12 text-center text-sm text-muted-foreground italic font-medium">
                                        No student listings matched your criteria or search filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer Navigation Controls */}
                <div className="p-4 border-t flex justify-between items-center text-xs text-muted-foreground font-medium select-none bg-slate-50/20">
                    <span>Showing {filteredStudents.length} of {totalCount} total system profiles</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled className="h-8 text-xs font-semibold border-slate-200">Previous</Button>
                        <Button variant="outline" size="sm" className="h-8 text-xs font-semibold border-slate-200">Next Page</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}