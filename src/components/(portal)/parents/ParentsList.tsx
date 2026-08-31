"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, UserRoundX } from "lucide-react";

import {
    getParents,
    getStudentsWithoutParents,
    linkStudentToParent,
} from "@/app/(portal)/parents/actions";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

type Student = {
    id: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
};

type Parent = {
    id: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    email: string;
    contact_number: string | null;
};

export default function ParentsList() {
    const queryClient = useQueryClient();

    const [showUnlinkedStudents, setShowUnlinkedStudents] =
        useState(false);

    const [selectedStudent, setSelectedStudent] =
        useState<Student | null>(null);

    const [parentSearch, setParentSearch] = useState("");

    const {
        data: parents,
        isLoading: parentsLoading,
        isError: parentsError,
    } = useQuery<Parent[]>({
        queryKey: ["parents"],
        queryFn: getParents,
    });

    const {
        data: unlinkedStudents,
        isLoading: unlinkedStudentsLoading,
        isError: unlinkedStudentsError,
    } = useQuery<Student[]>({
        queryKey: ["students", "without-parent"],
        queryFn: getStudentsWithoutParents,
    });

    const linkParentMutation = useMutation({
        mutationFn: ({
            studentId,
            parentId,
        }: {
            studentId: string;
            parentId: string;
        }) => linkStudentToParent(studentId, parentId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["students", "without-parent"],
            });

            setSelectedStudent(null);
            setParentSearch("");
        },
    });

    const filteredParents = useMemo(() => {
        if (!parents) return [];

        const search = parentSearch.toLowerCase().trim();

        if (!search) return parents;

        return parents.filter((parent) => {
            const fullName = [
                parent.first_name,
                parent.middle_name,
                parent.last_name,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return (
                fullName.includes(search) ||
                parent.email.toLowerCase().includes(search) ||
                parent.contact_number?.includes(search)
            );
        });
    }, [parents, parentSearch]);

    const handleOpenLinkDialog = (student: Student) => {
        setSelectedStudent(student);
        setParentSearch("");
    };

    const handleLinkParent = (parentId: string) => {
        if (!selectedStudent) return;

        linkParentMutation.mutate({
            studentId: selectedStudent.id,
            parentId,
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">
                        Parents
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Manage parents registered in the school portal.
                    </p>
                </div>

                <Button
                    variant={
                        showUnlinkedStudents
                            ? "default"
                            : "outline"
                    }
                    onClick={() =>
                        setShowUnlinkedStudents((prev) => !prev)
                    }
                >
                    <UserRoundX className="mr-2 h-4 w-4" />

                    Students without parents

                    {unlinkedStudents && (
                        <span className="ml-2 rounded-full bg-background px-2 py-0.5 text-xs text-foreground">
                            {unlinkedStudents.length}
                        </span>
                    )}
                </Button>
            </div>

            {/* Parents table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>First Name</TableHead>
                            <TableHead>Middle Name</TableHead>
                            <TableHead>Last Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Contact Number</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {parentsLoading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-40" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-28" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : parentsError ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-24 text-center text-destructive"
                                >
                                    Failed to load parents.
                                </TableCell>
                            </TableRow>
                        ) : parents?.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-24 text-center"
                                >
                                    No parents found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            parents?.map((parent) => (
                                <TableRow key={parent.id}>
                                    <TableCell>
                                        {parent.first_name}
                                    </TableCell>

                                    <TableCell>
                                        {parent.middle_name || "—"}
                                    </TableCell>

                                    <TableCell>
                                        {parent.last_name}
                                    </TableCell>

                                    <TableCell>
                                        {parent.email}
                                    </TableCell>

                                    <TableCell>
                                        {parent.contact_number || "—"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Students without parents */}
            {showUnlinkedStudents && (
                <div className="space-y-3">
                    <div>
                        <h3 className="text-lg font-semibold">
                            Students without parents
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            Students that currently don&lsquo;t have a
                            parent linked.
                        </p>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>First Name</TableHead>
                                    <TableHead>Middle Name</TableHead>
                                    <TableHead>Last Name</TableHead>
                                    <TableHead className="w-[140px]">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {unlinkedStudentsLoading ? (
                                    Array.from({ length: 3 }).map(
                                        (_, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Skeleton className="h-4 w-24" />
                                                </TableCell>

                                                <TableCell>
                                                    <Skeleton className="h-4 w-24" />
                                                </TableCell>

                                                <TableCell>
                                                    <Skeleton className="h-4 w-24" />
                                                </TableCell>

                                                <TableCell>
                                                    <Skeleton className="h-9 w-28" />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )
                                ) : unlinkedStudentsError ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-24 text-center text-destructive"
                                        >
                                            Failed to load students.
                                        </TableCell>
                                    </TableRow>
                                ) : unlinkedStudents?.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            All students have a parent
                                            linked.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    unlinkedStudents?.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell>
                                                {student.first_name}
                                            </TableCell>

                                            <TableCell>
                                                {student.middle_name || "—"}
                                            </TableCell>

                                            <TableCell>
                                                {student.last_name}
                                            </TableCell>

                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleOpenLinkDialog(
                                                            student
                                                        )
                                                    }
                                                >
                                                    Link to parent
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {/* Link parent dialog */}
            <Dialog
                open={!!selectedStudent}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedStudent(null);
                        setParentSearch("");
                    }
                }}
            >
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            Link student to parent
                        </DialogTitle>

                        <DialogDescription>
                            Select a parent for{" "}
                            <span className="font-medium text-foreground">
                                {selectedStudent?.first_name}{" "}
                                {selectedStudent?.last_name}
                            </span>
                            .
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                placeholder="Search parents..."
                                value={parentSearch}
                                onChange={(e) =>
                                    setParentSearch(e.target.value)
                                }
                                className="pl-9"
                            />
                        </div>

                        {/* Parent list */}
                        <div className="max-h-[300px] overflow-y-auto rounded-md border">
                            {parentsLoading ? (
                                <div className="space-y-3 p-4">
                                    {Array.from({ length: 4 }).map(
                                        (_, index) => (
                                            <div
                                                key={index}
                                                className="space-y-2"
                                            >
                                                <Skeleton className="h-4 w-40" />
                                                <Skeleton className="h-3 w-56" />
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : filteredParents.length === 0 ? (
                                <div className="p-6 text-center text-sm text-muted-foreground">
                                    No parents found.
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {filteredParents.map((parent) => (
                                        <button
                                            key={parent.id}
                                            type="button"
                                            className="w-full p-3 text-left transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                                            disabled={
                                                linkParentMutation.isPending
                                            }
                                            onClick={() =>
                                                handleLinkParent(
                                                    parent.id
                                                )
                                            }
                                        >
                                            <div className="font-medium">
                                                {parent.first_name}{" "}
                                                {parent.middle_name
                                                    ? `${parent.middle_name} `
                                                    : ""}
                                                {parent.last_name}
                                            </div>

                                            <div className="text-sm text-muted-foreground">
                                                {parent.email}
                                            </div>

                                            {parent.contact_number && (
                                                <div className="text-xs text-muted-foreground">
                                                    {
                                                        parent.contact_number
                                                    }
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {linkParentMutation.isError && (
                            <p className="text-sm text-destructive">
                                {linkParentMutation.error.message}
                            </p>
                        )}

                        {linkParentMutation.isPending && (
                            <p className="text-sm text-muted-foreground">
                                Linking parent...
                            </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
