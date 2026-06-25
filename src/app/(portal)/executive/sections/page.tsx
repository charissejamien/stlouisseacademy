"use client";

import React, { useState } from "react";
import { 
    GraduationCap, 
    ArrowRightLeft, 
    UserPlus, 
    UserMinus, 
    Search, 
    Users, 
    Layers, 
    User, 
    Filter,
    ShieldAlert,
    CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock Database State representing unassigned students (The Pool)
const mockUnassignedPool = [
    { id: "20260012", name: "Naiah Santos", gender: "Female", studentType: "Regular" },
    { id: "20260015", name: "Liam Joaquin", gender: "Male", studentType: "Regular" },
    { id: "20260022", name: "Alex Tecson", gender: "Male", studentType: "Scholar" },
    { id: "20260029", name: "Chloe Chen", gender: "Female", studentType: "Scholar" },
    { id: "20260031", name: "Marcus Villafuerte", gender: "Male", studentType: "Regular" },
];

// Mock Database State representing a chosen Section's active roster
const mockSectionRoster = [
    { id: "20260001", name: "Charity Janine Macasero", gender: "Female", studentType: "Regular" },
    { id: "20260005", name: "Juan Gonzales", gender: "Male", studentType: "Regular" },
    { id: "20260009", name: "Mateo Alcantara", gender: "Male", studentType: "Regular" },
];

const availableGrades = ["Grade 1", "Grade 2", "Grade 3", "Grade 4"];
const sectionsByGrade: Record<string, string[]> = {
    "Grade 1": ["Section A - St. Agnes", "Section B - St. Blaise"],
    "Grade 2": ["Section A - St. Clare", "Section B - St. Denis"],
    "Grade 3": ["Section A - St. Elmo"],
    "Grade 4": ["Section A - St. Jude"],
};

export default function SectionAssignmentWorkspace() {
    const [currentGrade, setCurrentGrade] = useState("Grade 1");
    const [currentSection, setCurrentSection] = useState("Section A - St. Agnes");
    
    const [poolSearch, setPoolSearch] = useState("");
    const [genderFilter, setGenderFilter] = useState("All Genders");

    // Local lists simulating dynamic allocation movements
    const [unassignedPool, setUnassignedPool] = useState(mockUnassignedPool);
    const [sectionRoster, setSectionRoster] = useState(mockSectionRoster);

    // Filtered Unassigned Pool calculation logic
    const filteredPool = unassignedPool.filter((student) => {
        const matchesSearch = student.name.toLowerCase().includes(poolSearch.toLowerCase()) || student.id.includes(poolSearch);
        const matchesGender = genderFilter === "All Genders" || student.gender === genderFilter;
        return matchesSearch && matchesGender;
    });

    // Action: Allocate student into class section
    const handleAssign = (student: any) => {
        setUnassignedPool((prev) => prev.filter((s) => s.id !== student.id));
        setSectionRoster((prev) => [...prev, student]);
    };

    // Action: Evict student out of section back to pool
    const handleRemove = (student: any) => {
        setSectionRoster((prev) => prev.filter((s) => s.id !== student.id));
        setUnassignedPool((prev) => [...prev, student]);
    };

    // Live distribution demographics tally counts
    const totalInClass = sectionRoster.length;
    const boysInClass = sectionRoster.filter(s => s.gender === "Male").length;
    const girlsInClass = sectionRoster.filter(s => s.gender === "Female").length;

    return (
        <div className="w-[95%] max-w-(screen-2xl) mx-auto my-10 flex flex-col gap-8 antialiased">
            
            {/* Top Operational Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase bg-indigo-50 px-2.5 py-1 rounded-md">
                        Sectioning & Room Routing
                    </span>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
                        Section Sorter Workspace
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Rapidly dispatch unassigned students into their designated classrooms while monitoring optimal room capacity parameters.
                    </p>
                </div>
            </div>

            {/* Master Grade Level Selection Bar Control */}
            <Card className="shadow-xs border-slate-200 bg-slate-50/50 p-4 rounded-xl border">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 tracking-wider">
                        <Layers className="w-4 h-4 text-slate-400" />
                        <span>Active Tier Selection:</span>
                    </div>
                    
                    <Select value={currentGrade} onValueChange={(val) => {
                        setCurrentGrade(val);
                        setCurrentSection(sectionsByGrade[val]?.[0] || "");
                    }}>
                        <SelectTrigger className="bg-white border-slate-200 h-10 text-xs font-semibold text-slate-700 shadow-2xs w-full sm:w-48">
                            <SelectValue placeholder="Select Grade Level" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableGrades.map((grade) => (
                                <SelectItem key={grade} value={grade} className="text-xs">{grade}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            {/* Dual Pane Layout Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                
                {/* LEFT PANE: Dynamic Unassigned Pool (Occupies 2 Cols) */}
                <Card className="lg:col-span-2 shadow-sm border-slate-200 bg-white h-[650px] flex flex-col">
                    <CardHeader className="border-b pb-4 bg-slate-50/40">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800">Unassigned Pool</CardTitle>
                                <CardDescription className="text-xs">Students awaiting section logs for {currentGrade}.</CardDescription>
                            </div>
                            <span className="bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                                {unassignedPool.length} Left
                            </span>
                        </div>
                        
                        {/* Inline Pool Search and Filtering Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
                            <div className="relative sm:col-span-2">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 -mt-0.5" />
                                <Input 
                                    placeholder="Filter pool name..." 
                                    value={poolSearch}
                                    onChange={(e) => setPoolSearch(e.target.value)}
                                    className="pl-8 h-8 text-[11px] bg-white border-slate-200"
                                />
                            </div>
                            <Select value={genderFilter} onValueChange={setGenderFilter}>
                                <SelectTrigger className="bg-white border-slate-200 h-8 text-[11px] text-slate-600">
                                    <SelectValue placeholder="Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All Genders" className="text-[11px]">All Genders</SelectItem>
                                    <SelectItem value="Male" className="text-[11px]">Boys Only</SelectItem>
                                    <SelectItem value="Female" className="text-[11px]">Girls Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>

                    {/* Scrollable unassigned pool items container box */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 bg-slate-50/20">
                        {filteredPool.length > 0 ? (
                            filteredPool.map((student) => (
                                <div key={student.id} className="p-3 border rounded-xl bg-white shadow-2xs flex justify-between items-center group hover:border-indigo-200 transition-colors">
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-xs">{student.name}</h4>
                                        <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-slate-400">
                                            <span className="font-mono">{student.id}</span>
                                            <span>•</span>
                                            <span className={student.gender === "Male" ? "text-blue-500" : "text-pink-500"}>{student.gender}</span>
                                            <span>•</span>
                                            <span className="text-slate-500">{student.studentType}</span>
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={() => handleAssign(student)}
                                        size="icon" 
                                        variant="outline" 
                                        className="h-7 w-7 rounded-lg border-indigo-100 hover:bg-indigo-600 text-indigo-600 hover:text-white transition-all shrink-0"
                                    >
                                        <UserPlus className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col justify-center items-center text-center text-xs text-muted-foreground italic p-6">
                                No unassigned student profiles matched the criteria.
                            </div>
                        )}
                    </div>
                </Card>

                {/* TRANSFER DIRECTION MIDDLE GRAPHIC OVERLAY ICON */}
                <div className="hidden lg:flex flex-col items-center justify-center self-center text-slate-300">
                    <ArrowRightLeft className="w-6 h-6" />
                </div>

                {/* RIGHT PANE: Classroom Section Allocation Grid View (Occupies 2 Cols) */}
                <Card className="lg:col-span-2 shadow-sm border-slate-200 bg-white h-[650px] flex flex-col">
                    <CardHeader className="border-b pb-4 bg-slate-50/40">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                            <div>
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800">Classroom Distribution</CardTitle>
                                <CardDescription className="text-xs">Currently allocated roster list parameters.</CardDescription>
                            </div>
                            
                            {/* Classroom section selector drop dropdown control */}
                            <Select value={currentSection} onValueChange={setCurrentSection}>
                                <SelectTrigger className="bg-white border-slate-200 h-9 text-xs font-bold text-indigo-700 shadow-2xs w-full sm:w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {(sectionsByGrade[currentGrade] || []).map((sec) => (
                                        <SelectItem key={sec} value={sec} className="text-xs">{sec}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Live Classroom Demographics Optimization Counter Dashboard Bar */}
                        <div className="mt-4 px-3 py-2 bg-indigo-50/60 border border-indigo-100/50 rounded-lg flex justify-between items-center text-[11px] text-indigo-900 font-medium select-none">
                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-indigo-500" /> Roster Count: <b>{totalInClass}</b></span>
                            <div className="flex gap-2 text-slate-400 font-normal">
                                <span>Boys: <b className="text-blue-600 font-bold">{boysInClass}</b></span>
                                <span>|</span>
                                <span>Girls: <b className="text-pink-600 font-bold">{girlsInClass}</b></span>
                            </div>
                            <span className="text-slate-400 font-normal">Max: <b>35</b></span>
                        </div>
                    </CardHeader>

                    {/* Scrollable assigned section items container box */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 bg-slate-50/20">
                        {sectionRoster.length > 0 ? (
                            sectionRoster.map((student) => (
                                <div key={student.id} className="p-3 border border-slate-100 rounded-xl bg-white shadow-2xs flex justify-between items-center group hover:border-rose-200 transition-colors">
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-xs">{student.name}</h4>
                                        <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-slate-400">
                                            <span className="font-mono text-indigo-500">{student.id}</span>
                                            <span>•</span>
                                            <span className={student.gender === "Male" ? "text-blue-500" : "text-pink-500"}>{student.gender}</span>
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={() => handleRemove(student)}
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-7 w-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all shrink-0"
                                    >
                                        <UserMinus className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col justify-center items-center text-center text-xs text-muted-foreground/50 italic p-6">
                                Classroom empty. Tap onto pool elements to add students into this section.
                            </div>
                        )}
                    </div>

                    {/* Active Production Commit Submit Button Tier */}
                    <div className="p-4 border-t bg-slate-50/60 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium italic">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>Changes are held in structural draft context.</span>
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 px-4 shadow-sm">
                            Save Section Allocations
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}