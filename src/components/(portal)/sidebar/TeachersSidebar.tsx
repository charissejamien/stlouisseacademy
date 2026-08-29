import Link from "next/link";
import {
    Users,
    BookOpen,
    Layers3,
    Settings,
    LogOut,
} from "lucide-react";

import { logout } from "@/app/(authentication)/login/actions";

export default function TeacherSidebar() {
    const teaching = [
        { icon: Users, title: "Students", link: "/students" },
        { icon: BookOpen, title: "Classes", link: "/classes" },
        { icon: Layers3, title: "Sections", link: "/sections" },
    ];

    const account = [
        { icon: Settings, title: "Settings", link: "/settings" },
    ];

    return (
        <aside className="flex h-full flex-col rounded-xl bg-[#2f6ed6] p-5 text-white/80">

            {/* School */}
            <header className="mb-8">
                <h1 className="text-white">
                    ST. LOUISSE ACADEMY
                </h1>

                <p className="text-sm text-white/50">
                    Daanbantayan
                </p>
            </header>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col gap-7">

                {/* Teaching */}
                <div>
                    <p className="mb-2.5 px-2 text-xs uppercase tracking-wide text-white/50">
                        Teaching
                    </p>

                    <div className="space-y-1">
                        {teaching.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.title}
                                    href={item.link}
                                    className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-white/10 hover:text-white"
                                >
                                    <Icon size={18} strokeWidth={1.8} />
                                    <span>{item.title}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Account */}
                <div className="mt-auto">
                    <p className="mb-2.5 px-2 text-xs uppercase tracking-wide text-white/50">
                        Account
                    </p>

                    <div className="space-y-1">

                        {/* Settings */}
                        {account.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.title}
                                    href={item.link}
                                    className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-white/10 hover:text-white"
                                >
                                    <Icon size={18} strokeWidth={1.8} />
                                    <span>{item.title}</span>
                                </Link>
                            );
                        })}

                        {/* Logout */}
                        <form action={logout}>
                            <button
                                type="submit"
                                className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <LogOut size={18} strokeWidth={1.8} />
                                <span>Log out</span>
                            </button>
                        </form>

                    </div>
                </div>

            </nav>
        </aside>
    );
}
