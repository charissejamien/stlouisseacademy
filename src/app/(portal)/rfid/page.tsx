"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Libre_Baskerville } from "next/font/google";
import Image from "next/image";
import { lookupStudentByRFID, type RFIDLookupResult } from "@/app/(portal)/rfid/actions";

const libreBaskerville = Libre_Baskerville({
    subsets: ["latin"],
    weight: ["400", "700"],
});

export default function RFIDGatePage() {
    const [scanResult, setScanResult] = useState<RFIDLookupResult | null>(null);
    const [currentTime, setCurrentTime] = useState("");
    
    const bufferRef = useRef("");
    const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                })
            );
        };
        
        updateClock();
        const intervalId = setInterval(updateClock, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const { mutate: handleScan, isPending } = useMutation({
        mutationFn: lookupStudentByRFID,
        onSuccess: (data) => {
            setScanResult(data);
            if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
            resetTimerRef.current = setTimeout(() => {
                setScanResult(null);
            }, 5000);
        },
        onError: () => {
            setScanResult(null);
        }
    });

    useEffect(() => {
        const handleGlobalKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                if (bufferRef.current.trim().length > 0) {
                    handleScan(bufferRef.current.trim());
                    bufferRef.current = ""; 
                }
                event.preventDefault();
                return;
            }

            if (event.key.length === 1) {
                bufferRef.current += event.key;
            }
        };

        window.addEventListener("keydown", handleGlobalKeyDown);
        return () => {
            window.removeEventListener("keydown", handleGlobalKeyDown);
            if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        };
    }, [handleScan]);

    return (
        <div className="relative w-screen h-screen overflow-hidden select-none">
            
            <Image 
                src="/rfid-scanner-bg.png" 
                fill
                alt="Gate Monitor Background" 
                className="absolute inset-0 object-cover z-10"
            />

            <div className="absolute inset-0 z-20 flex flex-col justify-between p-12 text-white font-sans">
                
                <div className="w-full flex justify-end items-start">
                    <span className="text-2xl font-bold tracking-wide uppercase text-white/90">
                        {currentTime || "6:54 AM PST"}
                    </span>
                </div>

                <div className="w-full max-w-6xl mx-auto flex items-center gap-12 px-6 mb-16">
                    
                    <div className="w-64 h-64 border-2 border-white bg-transparent shrink-0 flex items-center justify-center relative overflow-hidden">
                        {isPending ? (
                            <span className="text-xs font-mono uppercase text-white/40 tracking-wider">Loading...</span>
                        ) : scanResult?.profileUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                                src={scanResult.profileUrl} 
                                alt="Profile Avatar" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-xs font-mono uppercase text-white/20 tracking-wider"></span>
                        )}
                    </div>

                    <div className="flex flex-col justify-center flex-1 min-h-[16rem]">
                        {isPending ? (
                            <h2 className="text-3xl font-bold tracking-wide text-white/30 uppercase">
                                Reading Card ID...
                            </h2>
                        ) : scanResult ? (
                            <h2 className="text-[4.5rem] font-bold leading-[1.1] tracking-wide text-white uppercase break-words max-w-4xl">
                                {scanResult.formattedName}
                            </h2>
                        ) : (
                            <h2 className="text-[3.5rem] font-bold leading-tight tracking-wide text-white/40 uppercase">
                                Please Tap ID
                            </h2>
                        )}
                    </div>

                </div>

                <div className="w-full flex justify-end items-center gap-2">
                    <div>
                        <Image
                            src="logo.svg"
                            alt="logo"
                            width={75}
                            height={75}
                        />               
                    </div>
                    <div className={`${libreBaskerville.className} flex flex-col items-center text-right`}>
                        <h3 className="text-3xl font-bold tracking-widest text-white uppercase">
                            ST. LOUISSE
                        </h3>
                        <p className="text-xs font-bold tracking-[0.4em] uppercase">
                            ACADEMY
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}