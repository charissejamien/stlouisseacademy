"use client";

import { useState } from "react";
import { X, CalendarDays } from "lucide-react"; // Clean icons for the banner metrics

export default function AnnouncementsWidget() {
    const [isOpen, setIsOpen] = useState(true);

    // If the user dismissed the notification box, do not draw it on screen
    if (!isOpen) return null;

    return (
        <div className="relative bg-amber-50 border border-amber-200 p-5 rounded-md  mt-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Action close handle element top-right layout */}
            <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-amber-600 hover:text-amber-900 hover:bg-amber-100 p-1 rounded-full transition-colors duration-200"
                aria-label="Close Announcement"
            >
                <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 pr-6">
                <div className="bg-amber-100 p-2 rounded-md text-amber-700 mt-0.5">
                    <CalendarDays className="w-5 h-5" />
                </div>
                
                <div>
                    <p className="text-amber-800 text-[11px] font-bold uppercase tracking-wider">
                        Upcoming School Event
                    </p>
                    <div className="mt-1">
                        <p className="text-slate-900 text-[16px] font-semibold">
                            Buwan ng Wika Culmination Activity
                        </p>
                        <p className="text-slate-600 text-[13px] mt-0.5 leading-relaxed">
                            Dear Parents, please look forward to our students' cultural assembly programs and traditional presentations this coming Friday. Assembly instructions will be issued shortly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}