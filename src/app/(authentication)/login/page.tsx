"use client";

import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signInWithPassword } from "./actions";

export default function Login() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const login = useMutation({
        mutationFn: ({
            email,
            password
        } : {
            email: string,
            password: string
        }) => signInWithPassword(email, password),
        onSuccess: () => {
            toast.success("Successfully logged in!");
            router.replace("/dashboard");
        },
        onError: (res) => {
            toast.error(res.message);
        }
    })

    return (
        <div className="w-full flex flex-col items-center mt-10 md:mt-30 gap-6 md:gap-10 px-4 font-sans antialiased text-slate-700">
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
                <img src="/logo.svg" alt="St. Louis Academy Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                <div>
                    <h1 className="text-sla-blue font-extrabold text-2xl md:text-[32px] tracking-[4px] leading-tight">ST LOUISSE ACADEMY</h1>
                    <h2 className="text-sla-gold font-medium text-base md:text-[20px] tracking-[6px] md:tracking-[10px] uppercase mt-0.5">DAANBANTAYAN</h2>
                </div>
            </div>

            <div className="bg-white p-6 md:p-10 md:pr-0 rounded-md flex flex-col md:flex-row gap-6 md:gap-10 w-full max-w-[450px] md:max-w-[850px] shadow-sm border border-slate-100">
            
                <div
                    className="w-full md:w-[50%] py-10 px-5 rounded-md flex flex-col justify-between min-h-[200px] md:min-h-[380px] gap-20 md:gap-50 bg-cover bg-center text-white relative"
                    style={{ backgroundImage: `url('/login-bg.svg')` }}
                >
                </div>

                <div className="w-full md:w-[40%] md:px-5 flex flex-col gap-5 justify-center bg-white" >
                    <div className="space-y-3">
                        <Label>Email</Label>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="space-y-3">
                        <Label>Password</Label>
                        <div className="relative">
                            <Input 
                                type={showPassword ? "text" : "password"} 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                className="pr-10"
                            />
                            <button 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {showPassword ? (
                                    <Eye className="h-4 w-4"/>
                                ) : (
                                    <EyeOff className="h-4 w-4"/>
                                )}
                            </button>
                        </div>
                        
                    </div>
                    <div>
                        <Button 
                            className="w-full bg-sla-blue hover:bg-sla-blue/85"
                            onClick={() => login.mutate({email, password})}
                        >
                            Log In
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}