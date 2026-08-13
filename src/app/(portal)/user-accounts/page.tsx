"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react"
import toast from "react-hot-toast";
import { inviteUserByEmail } from "./actions";

export default function UserAccounts() {

    const [email, setEmail] = useState("");

    const inviteUser = useMutation({
        mutationFn: (email: string) => inviteUserByEmail(email),
        onSuccess: () => {
            toast.success("User successfully invited by email!")
        },
        onError: (res) => {
            toast.error(res.message)
        }
    })

    return(
        
        <div className="w-[80%] lg:w-[60%] mx-auto mt-20">
            <h2>Manage User Accounts</h2>

            <Dialog>
                <DialogTrigger asChild><Button>Invite User</Button></DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Invite a User</DialogTitle>
                        <DialogDescription>
                            Enter user details and invite them by email
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label>Name</Label>
                            <Input />
                        </Field>
                        <Field>
                            <Label >Email</Label>
                            <Input value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </Field>
                    </FieldGroup>
                    <DialogFooter className="flex gap-4">
                        <DialogClose>Cancel</DialogClose>
                        <Button onClick={() => inviteUser.mutate(email)}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             <Table className="mt-5">
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[100px]">Full Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    
                </TableBody>
                <TableFooter>
                    <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}