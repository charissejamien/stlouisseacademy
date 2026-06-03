"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { assignStudentRFID } from "@/app/(portal)/admin/students/actions";

interface LinkRFIDDialogProps {
    isOpen: boolean;
    onClose: () => void;
    student: {
        id: string;
        full_name: string;
        student_id: string;
    } | null;
}

export default function LinkRFIDDialog({ isOpen, onClose, student }: LinkRFIDDialogProps) {
    const queryClient = useQueryClient();
    const [scannedCode, setScannedCode] = useState("");
    const bufferRef = useRef("");

    const handleClose = () => {
        setScannedCode("");
        bufferRef.current = "";
        onClose();
    };

    // ⌨️ USB Hardware Emulation Keydown Event Listener
    useEffect(() => {
        if (!isOpen || !student) return;

        const handleGlobalKeyDown = (event: KeyboardEvent) => {
            if (document.activeElement?.tagName === "INPUT" && document.activeElement !== document.getElementById("rfid-display")) {
                return;
            }

            if (event.key === "Enter") {
                if (bufferRef.current.trim().length > 0) {
                    setScannedCode(bufferRef.current.trim());
                    bufferRef.current = ""; 
                    toast.success("RFID Card captured successfully!");
                }
                event.preventDefault();
                return;
            }

            if (event.key.length === 1) {
                bufferRef.current += event.key;
            }
        };

        window.addEventListener("keydown", handleGlobalKeyDown);
        return () => window.removeEventListener("keydown", handleGlobalKeyDown);
    }, [isOpen, student]);

    const { mutate: executeLink, isPending } = useMutation({
        mutationFn: assignStudentRFID,
        onSuccess: () => {
            toast.success("Hardware RFID credentials mapped safely!");
            queryClient.invalidateQueries({ queryKey: ["studentRegistryAlphabetical"] });
            handleClose();
        },
        // 🔄 FIXED: Typed as Error to clean up the "Unexpected any" linter exception completely
        onError: (err: Error) => {
            toast.error(err.message || "An error occurred during registration mapping.");
        }
    });

    const handleConfirmAssignment = () => {
        if (!student) return;
        if (!scannedCode.trim()) return toast.error("Please tap a card on your reader device first.");

        executeLink({
            studentId: student.id,
            rfidTagId: scannedCode.trim()
        });
    };

    if (!student) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-md p-6 bg-white rounded-xl shadow-xl">
                <DialogHeader className="flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full ${scannedCode ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-sla-blue border border-blue-100'}`}>
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-slate-900 mt-3">
                        Link Student Hardware RFID
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground max-w-xs mt-1">
                        Assigning permanent physical tap logs tracking access for <span className="font-bold text-slate-800">{student.full_name}</span> ({student.student_id}).
                    </DialogDescription>
                </DialogHeader>

                <div className="my-6 flex flex-col gap-4 bg-slate-50/50 p-4 rounded-xl border border-dashed">
                    {scannedCode ? (
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detected Hardware Card UID Number</Label>
                            <div className="flex gap-2 items-center">
                                <Input 
                                    id="rfid-display"
                                    readOnly 
                                    value={scannedCode} 
                                    className="font-mono text-center font-bold text-lg bg-white tracking-widest text-emerald-700 border-emerald-300"
                                />
                                <Button variant="outline" size="sm" onClick={() => { setScannedCode(""); bufferRef.current = ""; }} className="text-xs text-muted-foreground h-10">
                                    Clear
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="py-6 flex flex-col items-center justify-center text-center gap-2 text-muted-foreground">
                            <Loader2 className="w-5 h-5 animate-spin text-sla-blue" />
                            <p className="text-sm font-semibold text-slate-700">Ready for Hardware Scan...</p>
                            <p className="text-xs text-slate-400 max-w-[240px]">
                                Tap the student&apos;s RFID card on your USB terminal device reader window now.
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex gap-2 w-full mt-2">
                    <Button variant="outline" onClick={handleClose} disabled={isPending} className="flex-1 text-slate-600">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmAssignment} 
                        disabled={!scannedCode || isPending}
                        className="flex-1 bg-sla-blue text-white font-bold flex items-center justify-center gap-2"
                    >
                        {isPending ? "Mapping Credentials..." : "Confirm Assignment"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}