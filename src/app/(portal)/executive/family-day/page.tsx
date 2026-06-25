"use client";

import React, { useState } from "react";
import { 
    Flag, 
    UsersRound,
    CheckCircle2,
    Settings2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock Faculty Database for Advisership distribution
const mockFaculty = [
    { id: "TCH-01", name: "Maria Theresa Santos" },
    { id: "TCH-02", name: "Juan Dela Cruz" },
    { id: "TCH-03", name: "Charity Macasero" },
    { id: "TCH-04", name: "Robert Joaquin" },
];

// Mock Family Units Database Groupings (Parent name + linked dependents mapping)
const mockFamilies = [
    { id: "FAM-001", parent: "Naiah Macasero", membersCount: 2, students: ["Charity Janine"], teamAssigned: "Unassigned" },
    { id: "FAM-002", parent: "Michael Santos", membersCount: 3, students: ["Naiah", "Lucas"], teamAssigned: "Unassigned" },
    { id: "FAM-003", parent: "Sarah Joaquin", membersCount: 2, students: ["Liam"], teamAssigned: "Unassigned" },
    { id: "FAM-004", parent: "Maria Gonzales", membersCount: 4, students: ["Juan", "Elena", "Pedro"], teamAssigned: "Unassigned" },
    { id: "FAM-005", parent: "Robert Chen", membersCount: 2, students: ["Chloe"], teamAssigned: "Unassigned" },
];

const teamColorOptions = [
    { color: "Red Team", bg: "bg-rose-50 border-rose-200 text-rose-700", dot: "bg-rose-500" },
    { color: "Blue Team", bg: "bg-blue-50 border-blue-200 text-blue-700", dot: "bg-blue-500" },
    { color: "Green Team", bg: "bg-emerald-50 border-emerald-200 text-emerald-700", dot: "bg-emerald-500" },
    { color: "Yellow Team", bg: "bg-amber-50 border-amber-200 text-amber-700", dot: "bg-amber-500" },
];

export default function FamilyDayTeamSorter() {
    // 1. Team Count Matrix Setup
    const [teamCount, setTeamCount] = useState("4");
    
    // 2. Advisor State Array Mapping
    const [teamAdvisors, setTeamAdvisors] = useState<Record<string, string>>({
        "Red Team": "Maria Theresa Santos",
        "Blue Team": "Juan Dela Cruz",
        "Green Team": "Charity Macasero",
        "Yellow Team": "Robert Joaquin",
    });

    // 3. Families State Array mapping
    const [familiesPool, setFamiliesPool] = useState(mockFamilies);

    // Handler to dispatch an entire family household at once
    const handleFamilyTeamAllocation = (familyId: string, teamName: string) => {
        setFamiliesPool((prev) => 
            prev.map((fam) => fam.id === familyId ? { ...fam, teamAssigned: teamName } : fam)
        );
    };

    // Live statistics dashboard calculation tallies
    const totalTeamsActive = Number(teamCount) || 4;
    const activeTeamsSlice = teamColorOptions.slice(0, totalTeamsActive);

    const getTeamHeadcount = (teamName: string) => {
        return familiesPool
            .filter((f) => f.teamAssigned === teamName)
            .reduce((sum, f) => sum + f.membersCount, 0);
    };

    const getTeamFamiliesCount = (teamName: string) => {
        return familiesPool.filter((f) => f.teamAssigned === teamName).length;
    };

    const unassignedFamiliesCount = familiesPool.filter(f => f.teamAssigned === "Unassigned").length;

    return (
        <div className="w-[95%] max-w-(screen-2xl) mx-auto my-10 flex flex-col gap-8 antialiased">
            
            {/* Top Header Banner Segment */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase bg-indigo-50 px-2.5 py-1 rounded-md">
                        Intramurals & Events Desk
                    </span>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
                        Family Day Team Constructor
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Configure institutional event brackets, designate faculty commanders, and link households dynamically into matching structural clusters.
                    </p>
                </div>
            </div>

            {/* Config & Adviser Selection Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* CONFIGURATION STEP PANEL */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card className="shadow-xs border-slate-200 bg-white">
                        <CardHeader className="bg-slate-50/50 border-b pb-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Settings2 className="w-4 h-4 text-slate-400" />
                                <span>Step 1: Setup Team Quota</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold uppercase text-slate-400">Total Color Teams Needed</label>
                                <Select value={teamCount} onValueChange={setTeamCount}>
                                    <SelectTrigger className="h-10 text-xs font-semibold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2" className="text-xs">2 Teams (Red vs Blue)</SelectItem>
                                        <SelectItem value="3" className="text-xs">3 Teams (Red, Blue, Green)</SelectItem>
                                        <SelectItem value="4" className="text-xs">4 Teams (Red, Blue, Green, Yellow)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-xs border-slate-200 bg-white">
                        <CardHeader className="bg-slate-50/50 border-b pb-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Flag className="w-4 h-4 text-slate-400" />
                                <span>Step 2: Assign Advisers</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5 flex flex-col gap-4">
                            {activeTeamsSlice.map((team) => (
                                <div key={team.color} className="flex flex-col gap-1.5 border-b pb-3 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${team.dot}`} />
                                        <span className="text-xs font-bold text-slate-700">{team.color} Leader</span>
                                    </div>
                                    <Select 
                                        value={teamAdvisors[team.color] || ""} 
                                        onValueChange={(val) => setTeamAdvisors(prev => ({ ...prev, [team.color]: val }))}
                                    >
                                        <SelectTrigger className="h-9 text-xs font-medium">
                                            <SelectValue placeholder="Assign Head Faculty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockFaculty.map((f) => (
                                                <SelectItem key={f.id} value={f.name} className="text-xs">{f.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* THE CORE HOUSEHOLD MATRIX WORKSPACE */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                    <Card className="shadow-sm border-slate-200 bg-white">
                        <CardHeader className="border-b bg-slate-50/20 pb-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800">Step 3: Route Families</CardTitle>
                                    <CardDescription className="text-xs">Dispatch complete household units with a single toggle.</CardDescription>
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                    unassignedFamiliesCount > 0 ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                }`}>
                                    {unassignedFamiliesCount} Families Unassigned
                                </span>
                            </div>
                        </CardHeader>
                        
                        <div className="p-4 flex flex-col gap-3 max-h-[520px] overflow-y-auto bg-slate-50/30">
                            {familiesPool.map((fam) => (
                                <div key={fam.id} className="p-4 border border-slate-100 rounded-xl bg-white shadow-2xs flex items-center justify-between gap-4 hover:border-indigo-100 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-slate-900 text-sm">{fam.parent} Household</h4>
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-500">
                                                Size: {fam.membersCount}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                                            Dependents: <span className="text-slate-600 font-semibold">{fam.students.join(", ")}</span>
                                        </p>
                                    </div>

                                    {/* Unified Team Dispatch Controller Selection box */}
                                    <Select 
                                        value={fam.teamAssigned} 
                                        onValueChange={(val) => handleFamilyTeamAllocation(fam.id, val)}
                                    >
                                        <SelectTrigger className="w-36 h-9 text-xs font-semibold shadow-3xs border-slate-200 text-slate-700 bg-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Unassigned" className="text-xs text-slate-400 italic">Unassigned</SelectItem>
                                            {activeTeamsSlice.map((t) => (
                                                <SelectItem key={t.color} value={t.color} className="text-xs font-medium">{t.color}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </div>
                        
                        <div className="p-4 border-t bg-slate-50/50 flex justify-between items-center">
                            <span className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Changes apply to siblings simultaneously
                            </span>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 font-bold text-xs h-9 text-white px-5 shadow-xs">
                                Lock Team Registry
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* THE REAL-TIME BALANCING AUDIT MONITOR */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1 px-1">
                        <UsersRound className="w-4 h-4 text-slate-400" />
                        <span>Live Team Balances</span>
                    </h3>
                    
                    {activeTeamsSlice.map((team) => {
                        const headcount = getTeamHeadcount(team.color);
                        const familiesCount = getTeamFamiliesCount(team.color);
                        
                        return (
                            <Card key={team.color} className={`shadow-2xs border transition-all ${team.bg}`}>
                                <CardContent className="p-4 flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-black text-sm tracking-tight">{team.color}</span>
                                        <span className="text-[10px] font-bold bg-white/60 px-2 py-0.5 rounded border border-current/10">
                                            {familiesCount} {familiesCount === 1 ? "Family" : "Families"}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-baseline gap-1">
                                        <span className="text-2xl font-black tracking-tight">{headcount}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Total Pax</span>
                                    </div>
                                    <p className="text-[10px] opacity-80 mt-1 truncate border-t pt-2 border-current/10 font-medium">
                                        Advisor: <span className="font-bold">{teamAdvisors[team.color] || "None"}</span>
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}