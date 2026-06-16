"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link2, CheckSquare, Square, Loader2, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { getParents } from "@/app/(portal)/registrar/enrollment/actions";
import { linkStudentsToParent, getStagedStudents } from "../actions";


interface Parent {
    id: string;
    first_name: string;
    last_name: string;
}

export default function ParentReconciliationPage() {
    const queryClient = useQueryClient();
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
    const [parentSearch, setParentSearch] = useState("");

    // Fetch parents for lookahead search matching parameters
    const { data: parents = [] } = useQuery({ queryKey: ["parents"], queryFn: getParents });

    // Fetch students where parent is a true database NULL value
    const { data: stagedStudents = [], isLoading } = useQuery({
    queryKey: ["stagedStudents"],
    // ✅ BYPASS CLIENT MISCONFIGURATIONS: Call the secure server logic directly
    queryFn: () => getStagedStudents() 
});

    const { mutate: executeLink, isPending } = useMutation({
        mutationFn: () => linkStudentsToParent(selectedStudentIds, selectedParent!.id),
        onSuccess: () => {
            toast.success("Students linked to parent successfully!");
            setSelectedStudentIds([]);
            setSelectedParent(null);
            queryClient.invalidateQueries({ queryKey: ["stagedStudents"] });
        },
        onError: (err: Error) => {
            toast.error(err.message || "An issue occurred during reconciliation.");
        }
    });

    const toggleStudentSelection = (id: string) => {
        setSelectedStudentIds((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    return (
        <div className="w-[90%] mx-auto mt-10 flex flex-col gap-6">
            <div>
                <span className="text-xs font-bold text-sla-blue tracking-widest uppercase bg-blue-50 px-2.5 py-1 rounded-md">
                    Data Cleanup Utility
                </span>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
                    Parent-Student Reconciliation Desk
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                    Select siblings entered during the rapid staging process and map them cleanly to their verified permanent parent account profile.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                
                <Card className="xl:col-span-2 shadow-sm">
                    <CardTitle className="p-5 text-base border-b">Staged Student Queue</CardTitle>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-slate-400" /></div>
                        ) : stagedStudents.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12 text-center">Select</TableHead>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead>Grade Level</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
    {stagedStudents.map((student) => {
        const isChecked = selectedStudentIds.includes(student.id);
        
        // ⚡ Create a safe name fallback layout string
        const displayName = student.last_name 
            ? `${student.last_name}, ${student.first_name}` 
            : student.first_name || "Unnamed Staged Student";

        return (
            <TableRow 
                key={student.id} 
                className="cursor-pointer"
                onClick={() => toggleStudentSelection(student.id)}
            >
                <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <button type="button" onClick={() => toggleStudentSelection(student.id)}>
                        {isChecked ? <CheckSquare className="w-4 h-4 text-sla-blue" /> : <Square className="w-4 h-4 text-slate-300" />}
                    </button>
                </TableCell>
                {/* ✅ FIXED: Use the safe displayName fallback variable instead of raw concatenation */}
                <TableCell className="font-bold text-slate-800">
                    {displayName}
                </TableCell>

            </TableRow>
        );
    })}
</TableBody>
                            </Table>
                        ) : (
                            <div className="p-10 text-center text-xs italic text-muted-foreground">
                                No unlinked staging entries found! Your student directory is fully reconciled.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-4">
                    <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase">Target Parent Assignment</h2>
                    
                    <Command className="rounded-md border bg-white shadow-xs">
                        <CommandInput 
                            placeholder="Search real parent records..." 
                            value={parentSearch}
                            onValueChange={setParentSearch}
                        />
                        <CommandList>
                            {parentSearch.length > 0 && !selectedParent && (
                                <>
                                    <CommandEmpty>No registered records match.</CommandEmpty>
                                    <CommandGroup>
                                        {parents.map((p) => (
                                            <CommandItem
                                                key={p.id}
                                                value={`${p.first_name} ${p.last_name}`}
                                                onSelect={() => {
                                                    setSelectedParent(p);
                                                    setParentSearch("");
                                                }}
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{p.first_name} {p.last_name}</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </>
                            )}
                        </CommandList>
                    </Command>

                    {selectedParent && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-4 flex flex-col gap-3 shadow-2xs">
                            <div className="text-xs">
                                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">Target Selected</span>
                                <h4 className="text-base font-black tracking-tight mt-1">{selectedParent.first_name} {selectedParent.last_name}</h4>
                            </div>

                            <Button
                                type="button"
                                disabled={selectedStudentIds.length === 0 || isPending}
                                onClick={() => executeLink()}
                                className="w-full bg-emerald-700 hover:bg-emerald-800 font-bold text-white shadow-xs text-xs flex items-center justify-center gap-2"
                            >
                                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Link2 className="w-3.5 h-3.5" />}
                                <span>Link {selectedStudentIds.length} Selected Sibling(s)</span>
                            </Button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}