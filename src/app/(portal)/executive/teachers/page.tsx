"use client";

import React, { useState } from "react";
import { 
    Search, 
    UserPlus, 
    BookOpen, 
    Clock, 
    GraduationCap, 
    MoreVertical, 
    Mail, 
    Phone,
    Download,
    Filter,
    Award
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock Data representing an institutional teacher schema
const mockTeachers = [
    { 
        id: "TCH-2026-001", 
        name: "Maria Theresa Santos", 
        email: "m.santos@stlouisse.edu.ph", 
        phone: "09174441122",
        role: "Grade 4 Advisor", 
        department: "Elementary",
        loadHours: 22,
        subjects: ["Mathematics 4", "Science 4", "Character Education"],
        status: "Active"
    },
    { 
        id: "TCH-2026-002", 
        name: "Juan Dela Cruz", 
        email: "j.delacruz@stlouisse.edu.ph", 
        phone: "09185553344",
        role: "Overall Program Coordinator", 
        department: "Administration",
        loadHours: 6,
        subjects: ["Institutional Seminar Series"],
        status: "Active"
    },
    { 
        id: "TCH-2026-003", 
        name: "Charity Macasero", 
        email: "c.macasero@stlouisse.edu.ph", 
        phone: "09226667788",
        role: "Grade 1 Advisor", 
        department: "Elementary",
        loadHours: 24,
        subjects: ["Reading 1", "Language 1", "Araling Panlipunan 1"],
        status: "Active"
    },
    { 
        id: "TCH-2026-004", 
        name: "Robert Joaquin", 
        email: "r.joaquin@stlouisse.edu.ph", 
        phone: "09158889900",
        role: "Subject Teacher", 
        department: "Junior High",
        loadHours: 18,
        subjects: ["English 7", "English 8", "Creative Writing"],
        status: "On Leave"
    },
];

const departments = ["All Departments", "Administration", "Elementary", "Junior High", "Senior High"];

export default function TeacherDirectoryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState("All Departments");

    const filteredTeachers = mockTeachers.filter((teacher) => {
        const matchesSearch = 
            teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.id.includes(searchTerm) ||
            teacher.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
            
        const matchesDept = selectedDept === "All Departments" || teacher.department === selectedDept;

        return matchesSearch && matchesDept;
    });

    return (
        <div className="w-[95%] max-w-(screen-2xl) mx-auto my-10 flex flex-col gap-8 antialiased">
            
            {/* Header Block */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase bg-indigo-50 px-2.5 py-1 rounded-md">
                        Faculty Operations
                    </span>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
                        Faculty & Teacher Directory
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Track academic assignments, organizational roles, active load hours, and core subject routing structures.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="text-xs font-semibold flex items-center gap-2 h-10 border-slate-200">
                        <Download className="w-4 h-4 text-slate-500" />
                        <span>Export Faculty List</span>
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 h-10 shadow-xs">
                        <UserPlus className="w-4 h-4" />
                        <span>Onboard New Faculty</span>
                    </Button>
                </div>
            </div>

            {/* Quick Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Faculty Count</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-0.5">38 Educators</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Teaching Load</p>
                            <h3 className="text-2xl font-black text-emerald-700 mt-0.5">18.5 Hrs / Week</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Subjects Routed</p>
                            <h3 className="text-2xl font-black text-purple-700 mt-0.5">54 Sections</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters Toolbar */}
            <Card className="shadow-xs border-slate-200 bg-slate-50/50 p-4 rounded-xl border">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-80">
                        {/* Fixed icon alignment helper class attached */}
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 -mt-0.5" />
                        <Input 
                            placeholder="Search Teacher, ID, Role, or Subject..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10 text-xs bg-white border-slate-200 shadow-xs w-full"
                        />
                    </div>

                    <Select value={selectedDept} onValueChange={setSelectedDept}>
                        <SelectTrigger className="bg-white border-slate-200 h-10 text-xs text-slate-700 shadow-xs w-full sm:w-56">
                            <div className="flex items-center gap-2">
                                <Filter className="w-3.5 h-3.5 text-slate-400" />
                                <SelectValue placeholder="Department" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {departments.map((dept) => (
                                <SelectItem key={dept} value={dept} className="text-xs">{dept}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            {/* Teacher Directory Core Grid Table */}
            <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none">
                                <th className="py-3.5 px-6">Teacher ID</th>
                                <th className="py-3.5 px-6">Faculty Name</th>
                                <th className="py-3.5 px-6">Institutional Role Assignment</th>
                                <th className="py-3.5 px-6">Department</th>
                                <th className="py-3.5 px-6">Subjects Handled</th>
                                <th className="py-3.5 px-6 text-center">Weekly Load</th>
                                <th className="py-3.5 px-6 text-center">Operational Status</th>
                                <th className="py-3.5 px-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs divide-y text-slate-700">
                            {filteredTeachers.length > 0 ? (
                                filteredTeachers.map((teacher) => (
                                    <tr key={teacher.id} className="hover:bg-slate-50/40 transition-colors cursor-pointer">
                                        <td className="py-4 px-6 font-mono font-bold text-indigo-600">{teacher.id}</td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">{teacher.name}</h4>
                                                <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <Mail className="w-3 h-3 text-slate-400" /> {teacher.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1.5">
                                                <Award className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                                <span className="font-semibold text-slate-800">{teacher.role}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-[10px]">
                                                {teacher.department}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 max-w-xs">
                                            {/* Beautifully wrapped pill badges showing what classes they run */}
                                            <div className="flex flex-wrap gap-1">
                                                {teacher.subjects.map((subject, idx) => (
                                                    <span 
                                                        key={idx} 
                                                        className="bg-indigo-50/60 text-indigo-700 border border-indigo-100/80 font-medium px-2 py-0.5 rounded text-[10px] whitespace-nowrap"
                                                    >
                                                        {subject}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-800">
                                            <div className="flex flex-col items-center">
                                                <span>{teacher.loadHours} hrs</span>
                                                <span className="text-[9px] text-muted-foreground font-normal">allotted</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                                teacher.status === "Active" 
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                            }`}>
                                                {teacher.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 mx-auto">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground italic font-medium">
                                        No faculty members found matching the specified search parameters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer Navigation Controls */}
                <div className="p-4 border-t flex justify-between items-center text-xs text-muted-foreground font-medium select-none bg-slate-50/20">
                    <span>Showing {filteredTeachers.length} of {mockTeachers.length} total staff logs</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled className="h-8 text-xs font-semibold border-slate-200">Previous</Button>
                        <Button variant="outline" size="sm" className="h-8 text-xs font-semibold border-slate-200">Next Page</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}