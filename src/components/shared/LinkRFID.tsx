"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RFIDActionResponse {
  success: boolean;
  message?: string;
}

interface LinkRFIDDialogProps {
    isOpen: boolean;
    onClose: () => void;
    entity: {
        id: string;
        full_name: string;
        display_id: string;
    } | null;
    assignAction: (data: { id: string; rfidTagId: string }) => Promise<RFIDActionResponse>;
    queryKeyToInvalidate: string;
}

export default function LinkRFIDDialog({ isOpen, onClose, entity, assignAction, queryKeyToInvalidate }: LinkRFIDDialogProps) {
    const queryClient = useQueryClient();
    const [scannedCode, setScannedCode] = useState("");
    const bufferRef = useRef("");

    const handleClose = () => {
        setScannedCode("");
        bufferRef.current = "";
        onClose();
    };

    useEffect(() => {
        if (!isOpen || !entity) return;

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
    }, [isOpen, entity]);

    const { mutate: executeLink, isPending } = useMutation({
        mutationFn: assignAction,
        onSuccess: () => {
            toast.success("Hardware RFID credentials mapped safely!");
            queryClient.invalidateQueries({ queryKey: [queryKeyToInvalidate] });
            handleClose();
        },
        onError: (err: Error) => {
            toast.error(err.message || "An error occurred during registration mapping.");
        }
    });

    const handleConfirmAssignment = () => {
        if (!entity) return;
        if (!scannedCode.trim()) return toast.error("Please tap a card on your reader device first.");

        executeLink({
            id: entity.id,
            rfidTagId: scannedCode.trim()
        });
    };

    if (!entity) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-md p-6 bg-white rounded-xl shadow-xl">
                <DialogHeader className="flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full ${scannedCode ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-slate-900 mt-3">
                        Link Hardware RFID Card
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground max-w-xs mt-1">
                        Assigning permanent physical tap logs tracking access for <span className="font-bold text-slate-800">{entity.full_name}</span> ({entity.display_id}).
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
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                            <p className="text-sm font-semibold text-slate-700">Ready for Hardware Scan...</p>
                            <p className="text-xs text-slate-400 max-w-[240px]">
                                Tap the personnel hardware RFID card on your USB terminal device reader window now.
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
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-2"
                    >
                        {isPending ? "Mapping Credentials..." : "Confirm Assignment"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}