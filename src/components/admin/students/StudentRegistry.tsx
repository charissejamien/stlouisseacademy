"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, User, CreditCard, ShieldAlert, ShieldCheck, Loader2, RefreshCw } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { getAllStudentsAlphabetical, StudentRegistryItem } from "@/app/(portal)/admin/students/actions";
import LinkRFIDDialog from "@/components/admin/students/LinkRFIDDialog"; 

interface StudentRegistryWithRFID extends StudentRegistryItem {
    rfid_tag_id?: string | null;
}

export default function StudentRegistryTable() {
    const [searchQuery, setSearchQuery] = useState("");
    
    // ⚡ FIXED: Added explicit interface binding type instead of implicit unexpected `any`
    const [selectedStudentForRFID, setSelectedStudentForRFID] = useState<StudentRegistryWithRFID | null>(null);

    const { data: students = [], isLoading, isError, refetch, isRefetching } = useQuery<StudentRegistryWithRFID[]>({
        queryKey: ["studentRegistryAlphabetical"],
        queryFn: getAllStudentsAlphabetical,
    });

    const filteredStudents = students.filter((student) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;

        return (
            student.full_name?.toLowerCase().includes(query) ||
            student.student_id?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-sla-blue">Student Directory</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage active student profiles and cross-reference hardware RFID credential assignment statuses.
                    </p>
                </div>
                
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => refetch()} 
                    disabled={isLoading || isRefetching}
                    className="flex items-center gap-2 h-9"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin text-sla-blue" : ""}`} />
                    Refresh Directory
                </Button>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="pb-3 flex flex-row items-center justify-between border-b bg-slate-50/50">
                    <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                        <User className="w-4 h-4 text-sla-blue" />
                        Active Student Enrollment Directory
                    </CardTitle>
                    <span className="text-xs font-bold text-muted-foreground bg-input px-2.5 py-1 rounded-full font-mono">
                        Total Count: {filteredStudents.length} Records
                    </span>
                </CardHeader>
                
                <CardContent className="pt-6 flex flex-col gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by last name, first name, id, or grade level..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-white"
                        />
                    </div>

                    <div className="rounded-md border overflow-hidden bg-white">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="w-[15%]">Student ID</TableHead>
                                    <TableHead className="w-[35%]">Full Student Name (Last, First, Middle)</TableHead>
                                    <TableHead className="w-[20%]">Grade Level</TableHead>
                                    <TableHead className="w-[20%]">Hardware RFID Status</TableHead>
                                    <TableHead className="w-[10%] text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-sm text-muted-foreground italic">
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin text-sla-blue" />
                                                Streaming alphabetized directory registers...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : isError ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-sm text-destructive font-medium">
                                            Failed to compile dynamic student logs. Please check connection configurations.
                                        </TableCell>
                                    </TableRow>
                                ) : filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => {
                                        const hasRfid = !!student.rfid_tag_id;

                                        return (
                                            <TableRow key={student.id} className="hover:bg-slate-50/60 transition-colors">
                                                <TableCell className="font-mono font-bold text-slate-700 tracking-wider">
                                                    {student.student_id}
                                                </TableCell>
                                                <TableCell className="font-bold text-slate-900 text-sm">
                                                    {student.full_name}
                                                </TableCell>
                                                <TableCell>

                                                </TableCell>
                                                <TableCell>
                                                    {hasRfid ? (
                                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                                            <span>Assigned Tag</span>
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                                                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                                                            <span>Missing Token</span>
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button 
                                                        onClick={() => setSelectedStudentForRFID(student)}
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="text-sla-blue hover:bg-sla-blue/10 h-8 font-medium text-xs gap-1"
                                                    >
                                                        <CreditCard className="w-3.5 h-3.5" />
                                                        {hasRfid ? "Reassign" : "Link RFID"}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-sm text-muted-foreground italic">
                                            No student records found matching the specified parameters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* 🏷️ The hardware assignment modal overlay link wrapper */}
            <LinkRFIDDialog 
                isOpen={selectedStudentForRFID !== null}
                onClose={() => setSelectedStudentForRFID(null)}
                student={selectedStudentForRFID}
            />
        </div>
    );
}