"use client";

// 1. Import your custom responsive navigation layout wrapper
import ParentNavigation from "@/components/parents/ParentsSidebar";
// 2. Import your widget and dynamic student profile components
import AnnouncementsWidget from "@/components/parents/AnnouncementsWidget";
import StudentSummary from "@/components/parents/StudentSummary";
export default function ParentDashboardPage() {
    return (
        <ParentNavigation>
            {/* Everything inside here automatically injects as the {children} prop */}
            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Welcome Back!
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Stay updated with St. Louisse Academy announcements and check your children's live details.
                    </p>
                </div>

                {/* 📢 Your closeable school announcements banner widget */}
                <AnnouncementsWidget />

                {/* 👤 Your dynamic sibling profile summary cards pulling from UUID */}
                <div className="mt-4">
                    <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider text-xs">
                        Registered Student Profiles
                    </h3>
                    <StudentSummary />
                </div>
            </div>
        </ParentNavigation>
    );
}