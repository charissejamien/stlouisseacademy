"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { registerParent, getParents } from "@/app/(portal)/registrar/enrollment/actions";

type Parent = {
    id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email?: string;
    contact_number?: string;
};

type ParentCreationProps = {
    onSuccess: (parent: Parent) => void;
};

type ParentInput = {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    contactNumber: string;
};

export default function ParentCreation({ onSuccess } : ParentCreationProps) {
    const { data: parents = [] } = useQuery({ queryKey: ["parents"], queryFn: getParents });

    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");

    const [search, setSearch] = useState("");
    const [selectedParent, setSelectedParent] = useState<Parent | null>(null);

    const mutation = useMutation<Parent, Error, ParentInput>({
        mutationFn: (data) =>
            registerParent(
                data.firstName,
                data.middleName,
                data.lastName,
                data.email,
                data.contactNumber
            ),
        onSuccess: (data) => {
            toast.success("Parent Saved");
            onSuccess(data);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    return (
        <div className="flex flex-col gap-5">
            <div>
                <Command className="rounded-md border">
                    <CommandInput 
                        placeholder="Search for a parent..." 
                        value={search} 
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        {search.length > 0 && !selectedParent && (
                            <>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup>
                                    {parents.map((p) => (
                                        <CommandItem 
                                            key={p.id}
                                            value={`${p.first_name} ${p.last_name}`}
                                            onSelect={() => {
                                                setSelectedParent(p);
                                                setSearch("");
                                                setFirstName(p.first_name);
                                                setMiddleName(p.middle_name || "");
                                                setLastName(p.last_name);
                                                setEmail(p.email || "");
                                                setContactNumber(p.contact_number || "");
                                            }}
                                        >
                                            {p.first_name} {p.last_name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>

                {selectedParent && (
                    <div className="mt-2 flex items-center justify-between bg-muted p-2 rounded text-sm">
                        <span>Linked to existing record: <strong>{selectedParent.first_name} {selectedParent.last_name}</strong></span>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-auto p-1 text-destructive"
                            onClick={() => {
                                setSelectedParent(null);
                                setFirstName("");
                                setMiddleName("");
                                setLastName("");
                                setEmail("");
                                setContactNumber("");
                            }}
                        >
                            Clear Selection
                        </Button>
                    </div>
                )}
            </div>

            <Card className="w-[900px]">
                <CardTitle className="px-5 pt-5">Parent Information</CardTitle>
                <CardContent className="flex flex-col gap-10">
                    <FieldGroup className="flex flex-row gap-5">
                        <Field>
                            <FieldLabel>First Name</FieldLabel>
                            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        </Field>
                        <Field>
                            <FieldLabel>Middle Name</FieldLabel>
                            <Input value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                        </Field>
                        <Field>
                            <FieldLabel>Last Name</FieldLabel>
                            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </Field>
                    </FieldGroup>
                    <FieldGroup className="flex flex-row gap-5">
                        <Field>
                            <FieldLabel>Email</FieldLabel>
                            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Field>
                        <Field>
                            <FieldLabel>Contact Number</FieldLabel>
                            <Input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
                        </Field>
                    </FieldGroup>
                    <Button 
                        className="w-fit px-10 ml-auto" 
                        onClick={() => {
                            if (selectedParent) {
                                onSuccess(selectedParent);
                            } else {
                                mutation.mutate({ firstName, middleName, lastName, email, contactNumber });
                            }
                        }}
                    >
                        Proceed to Enrollment
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}