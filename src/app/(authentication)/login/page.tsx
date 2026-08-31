"use client";

import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPassword } from "./actions";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (loading) return;

        const cleanEmail = email.trim();

        if (!cleanEmail) {
            toast.error("Please enter your email.");
            return;
        }

        if (!password) {
            toast.error("Please enter your password.");
            return;
        }

        try {
            setLoading(true);

            console.log("Starting login...");

            await signInWithPassword(
                cleanEmail,
                password
            );

            console.log("Login successful.");

            toast.success("Successfully logged in!");

            /*
             * Refresh the Next.js router so the newly-created
             * Supabase session/cookie is picked up.
             */
            router.refresh();

            /*
             * Small delay isn't required for Supabase itself,
             * but allows the cookie/session update to propagate
             * before navigating.
             */
            await new Promise((resolve) =>
                setTimeout(resolve, 100)
            );

            console.log("Navigating to dashboard...");

            router.push("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);

            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Unable to log in.");
            }

            setLoading(false);
        }
    };

    return (
        <main className="flex w-full flex-col items-center px-4 pt-10 font-sans antialiased text-slate-700 md:mt-30 md:gap-10 md:pt-0">

            {/* School Header */}
            <div className="mb-6 flex flex-col items-center justify-center gap-3 text-center md:mb-0 md:flex-row md:gap-4 md:text-left">

                <img
                    src="/logo.svg"
                    alt="St. Louisse Academy Logo"
                    className="h-16 w-16 object-contain md:h-20 md:w-20"
                />

                <div>
                    <h1 className="text-2xl font-extrabold leading-tight tracking-[3px] text-sla-blue md:text-[32px] md:tracking-[4px]">
                        ST LOUISSE ACADEMY
                    </h1>

                    <h2 className="mt-0.5 text-base font-medium uppercase tracking-[5px] text-sla-gold md:text-[20px] md:tracking-[10px]">
                        DAANBANTAYAN
                    </h2>
                </div>
            </div>

            {/* Login Card */}
            <div className="flex w-full max-w-[450px] flex-col gap-6 rounded-md border border-slate-100 bg-white p-5 shadow-sm md:max-w-[850px] md:flex-row md:gap-10 md:p-10 md:pr-0">

                {/* Login Image - desktop only */}
                <div
                    className="relative hidden min-h-[380px] w-full rounded-md bg-cover bg-center md:flex md:w-[50%]"
                    style={{
                        backgroundImage:
                            "url('/login-bg.svg')",
                    }}
                />

                {/* Form */}
                <div className="flex w-full flex-col justify-center bg-white md:w-[40%] md:px-5">

                    <form
                        onSubmit={handleSubmit}
                        className="flex w-full flex-col gap-5"
                    >

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email
                            </Label>

                            <Input
                                id="email"
                                name="email"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password
                            </Label>

                            <div className="relative w-full">

                                <Input
                                    id="password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    disabled={loading}
                                    className="w-full pr-12"
                                />

                                <button
                                    type="button"
                                    tabIndex={-1}
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    onPointerDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        setShowPassword(
                                            (previous) =>
                                                !previous
                                        );
                                    }}
                                    className="absolute right-1 top-1/2 z-50 flex h-9 w-9 -translate-y-1/2 touch-manipulation items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                                >
                                    {showPassword ? (
                                        <EyeOff
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <Eye
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Login */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="relative z-50 mt-1 h-11 w-full touch-manipulation bg-sla-blue hover:bg-sla-blue/85"
                        >
                            {loading
                                ? "Logging in..."
                                : "Log In"}
                        </Button>

                    </form>
                </div>
            </div>
        </main>
    );
}
