"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Loader2, Calendar, Search, Filter, Info, GraduationCap, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMasterAttendanceList, MasterListRow } from "./actions";

export default function AttendanceTrackerDashboard() {
    const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilterGroup, setSelectedFilterGroup] = useState("ALL");
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const { data, isLoading, isRefetching, refetch } = useQuery({
        queryKey: ["masterAttendanceLogs", selectedDate],
        queryFn: () => getMasterAttendanceList(selectedDate),
        refetchInterval: 3000
    });

    const studentRows = data?.students ?? [];
    const employeeRows = data?.employees ?? [];
    const gradeLevels = data?.gradeLevels ?? [];
    const departments = data?.departments ?? [];
    const metrics = data?.metrics ?? { presentStudents: 0, totalStudents: 0, presentEmployees: 0, totalEmployees: 0 };

    const handleFilterAndSearch = (rows: MasterListRow[]) => {
        return rows.filter((r) => {
            const matchesGroup = selectedFilterGroup === "ALL" || r.group_label === selectedFilterGroup;
            const fullName = `${r.first_name} ${r.last_name}`.toLowerCase();
            const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || r.display_id.includes(searchQuery);
            return matchesGroup && matchesSearch;
        });
    };

    const displayStudents = handleFilterAndSearch(studentRows);
    const displayEmployees = handleFilterAndSearch(employeeRows);

    return (
        <div className="w-[95%] max-w-(screen-2xl) mx-auto my-10 flex flex-col gap-8 antialiased text-slate-900 font-sans">
            
            {/* Header Module Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mt-2">Live Attendance Monitor</h1>
                    <p className="text-sm text-muted-foreground mt-1">Real-time tracker displaying daily campus entries and status rosters.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 border border-slate-200 bg-white px-3 h-10 rounded-lg shadow-3xs text-sm font-medium">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => { setSelectedDate(e.target.value); setExpandedRow(null); }}
                            className="outline-none border-none bg-transparent cursor-pointer font-bold text-xs"
                        />
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => refetch()} 
                        disabled={isLoading || isRefetching}
                        className="text-xs font-bold border-slate-200 h-10 flex items-center gap-2 px-4 rounded-lg bg-white shadow-3xs"
                    >
                        {isRefetching || isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" /> : <RefreshCw className="w-3.5 h-3.5 text-slate-500" />}
                        <span>Sync Ledger Feed</span>
                    </Button>
                </div>
            </div>

            {/* Attendance Analytics Metrics Container Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Card className="shadow-xs border-slate-200 bg-white">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><GraduationCap className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Daily Attendance</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                                {isLoading ? "---" : `${metrics.presentStudents} / ${metrics.totalStudents} Students`}
                            </h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xs border-slate-200 bg-white">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Briefcase className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employee Daily Attendance</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                                {isLoading ? "---" : `${metrics.presentEmployees} / ${metrics.totalEmployees} Employees`}
                            </h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Core Segment Switcher tabs */}
            <Tabs defaultValue="students" className="w-full space-y-6" onValueChange={() => { setSelectedFilterGroup("ALL"); setExpandedRow(null); }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/60 p-3 rounded-xl border border-slate-200/60">
                    
                    <TabsList className="bg-slate-200/60 p-1 rounded-lg h-10">
                        <TabsTrigger value="students" className="text-xs font-bold px-4 py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-2xs">
                            Students List
                        </TabsTrigger>
                        <TabsTrigger value="employees" className="text-xs font-bold px-4 py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-2xs">
                            Employees List
                        </TabsTrigger>
                    </TabsList>

                    {/* Integrated Shared Toolbar Fields */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1 justify-end">
                        <div className="relative w-full sm:max-w-md flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search name or registry code ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-slate-200 pl-9 pr-4 h-10 rounded-lg text-xs font-medium outline-none focus:border-indigo-500 shadow-3xs"
                            />
                        </div>
                        
                        <TabsContent value="students" className="m-0 w-full sm:w-auto">
                            <div className="relative w-full sm:w-56 flex items-center bg-white border border-slate-200 px-3 h-10 rounded-lg shadow-3xs">
                                <Filter className="w-4 h-4 text-slate-400 mr-2" />
                                <select value={selectedFilterGroup} onChange={(e) => setSelectedFilterGroup(e.target.value)} className="w-full text-xs font-bold text-slate-700 outline-none bg-transparent cursor-pointer">
                                    <option value="ALL">All Grade Levels</option>
                                    {gradeLevels.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
                                </select>
                            </div>
                        </TabsContent>

                        <TabsContent value="employees" className="m-0 w-full sm:w-auto">
                            <div className="relative w-full sm:w-56 flex items-center bg-white border border-slate-200 px-3 h-10 rounded-lg shadow-3xs">
                                <Filter className="w-4 h-4 text-slate-400 mr-2" />
                                <select value={selectedFilterGroup} onChange={(e) => setSelectedFilterGroup(e.target.value)} className="w-full text-xs font-bold text-slate-700 outline-none bg-transparent cursor-pointer">
                                    <option value="ALL">All Departments</option>
                                    {departments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                                </select>
                            </div>
                        </TabsContent>
                    </div>
                </div>

                <TabsContent value="students" className="m-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
                            <div className="p-4 border-b bg-slate-50/40 flex justify-between items-center">
                                <h3 className="text-sm font-bold text-slate-800">Male Students</h3>
                                <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 rounded">Total: {displayStudents.filter(s => s.gender === "Male").length}</span>
                            </div>
                            <DirectorySubGrid rows={displayStudents.filter(s => s.gender === "Male")} isLoading={isLoading} expandedRow={expandedRow} setExpandedRow={setExpandedRow} />
                        </Card>
                        <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
                            <div className="p-4 border-b bg-slate-50/40 flex justify-between items-center">
                                <h3 className="text-sm font-bold text-slate-800">Female Students</h3>
                                <span className="text-xs font-bold bg-pink-50 text-pink-700 border border-pink-100 px-2 rounded">Total: {displayStudents.filter(s => s.gender === "Female").length}</span>
                            </div>
                            <DirectorySubGrid rows={displayStudents.filter(s => s.gender === "Female")} isLoading={isLoading} expandedRow={expandedRow} setExpandedRow={setExpandedRow} />
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="employees" className="m-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
                            <div className="p-4 border-b bg-slate-50/40 flex justify-between items-center">
                                <h3 className="text-sm font-bold text-slate-800">Male Personnel</h3>
                                <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 rounded">Total: {displayEmployees.filter(e => e.gender === "Male").length}</span>
                            </div>
                            <DirectorySubGrid rows={displayEmployees.filter(e => e.gender === "Male")} isLoading={isLoading} expandedRow={expandedRow} setExpandedRow={setExpandedRow} />
                        </Card>
                        <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
                            <div className="p-4 border-b bg-slate-50/40 flex justify-between items-center">
                                <h3 className="text-sm font-bold text-slate-800">Female Personnel</h3>
                                <span className="text-xs font-bold bg-pink-50 text-pink-700 border border-pink-100 px-2 rounded">Total: {displayEmployees.filter(e => e.gender === "Female").length}</span>
                            </div>
                            <DirectorySubGrid rows={displayEmployees.filter(e => e.gender === "Female")} isLoading={isLoading} expandedRow={expandedRow} setExpandedRow={setExpandedRow} />
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function DirectorySubGrid({ rows, isLoading, expandedRow, setExpandedRow }: { rows: MasterListRow[]; isLoading: boolean; expandedRow: string | null; setExpandedRow: (id: string | null) => void }) {
    return (
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-xs border-b">
                    <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="py-3 px-4 w-12 text-center">Info</th>
                        <th className="py-3 px-4">Registry ID</th>
                        <th className="py-3 px-4">Full Legal Name</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Time</th>
                    </tr>
                </thead>
                <tbody className="text-xs divide-y text-slate-700">
                    {isLoading ? (
                        <tr>
                            <td colSpan={5} className="py-12 text-center"><Loader2 className="animate-spin text-indigo-600 w-4 h-4 mx-auto" /></td>
                        </tr>
                    ) : rows.length > 0 ? (
                        rows.map((row) => {
                            const isExpanded = expandedRow === row.uuid;
                            return (
                                <tr key={row.uuid} className="hover:bg-slate-50/40">
                                    <td className="py-3.5 px-4 text-center">
                                        <button onClick={() => setExpandedRow(isExpanded ? null : row.uuid)} disabled={row.all_logs_today.length === 0} className={`p-1 rounded border ${row.all_logs_today.length === 0 ? 'text-slate-300 border-slate-100' : 'text-slate-500 hover:text-indigo-600 bg-white'}`}><Info className="w-3.5 h-3.5" /></button>
                                    </td>
                                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">{row.display_id}</td>
                                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.last_name}, {row.first_name}</td>
                                    <td className="py-3.5 px-4 text-center">
                                        <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] uppercase border ${row.status === "IN" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : row.status === "OUT" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-50 text-slate-400"}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">{row.formatted_time}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr><td colSpan={5} className="py-12 text-center text-slate-400 italic">No logs recorded under this section today.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}