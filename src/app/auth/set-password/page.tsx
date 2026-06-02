"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import toast from "react-hot-toast";
import { Loader2, Lock } from "lucide-react";

export default function SetPasswordPage() {
    const router = useRouter();
    const supabase = createClient();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePasswordSetup = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password.length < 8) {
            return toast.error("Password must be at least 8 characters long for security compliance.");
        }
        if (password !== confirmPassword) {
            return toast.error("Password confirmation values do not match.");
        }

        setIsSubmitting(true);
        const loader = toast.loading("Initializing secure portal access credentials...");

        try {
            // 🔐 Updates the user's account password using the active session verified via the email link
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            toast.success("Account password established! Redirecting to dashboard portal...");
            
            // Route them straight into their structural interface view route
            router.push("/parent/dashboard");
        } catch (err: any) {
            toast.error(`Configuration Failed: ${err.message}`);
        } finally {
            toast.dismiss(loader);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-xl border-slate-200">
                <CardHeader className="text-center flex flex-col items-center gap-2 border-b pb-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-full">
                        <Lock className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">Setup Parent Portal Account</CardTitle>
                    <p className="text-xs text-muted-foreground">Establish a secure account password to access student ledger balances.</p>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handlePasswordSetup} className="flex flex-col gap-4">
                        <Field>
                            <FieldLabel>Choose New Password</FieldLabel>
                            <Input 
                                type="password"
                                required
                                disabled={isSubmitting}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1"
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Confirm Password Placement</FieldLabel>
                            <Input 
                                type="password"
                                required
                                disabled={isSubmitting}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1"
                            />
                        </Field>

                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full mt-2 font-bold py-5 bg-sla-blue text-white flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Finalizing Credentials...
                                </>
                            ) : (
                                "Claim Portal Account"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}