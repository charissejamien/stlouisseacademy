"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Users,
    GraduationCap,
    CreditCard,
    BookOpen,
    Settings,
    LogOut,
} from "lucide-react";

import { logout } from "@/app/(authentication)/login/actions";

type NavItemProps = {
    icon: React.ElementType;
    title: string;
    link: string;
    active: boolean;
};

function NavItem({ icon: Icon, title, link, active }: NavItemProps) {
    return (
        <Link
            href={link}
            className={[
                "flex items-center gap-3 rounded-lg px-3 py-2.5",
                "text-sm transition-all duration-150",
                active
                    ? "bg-white text-[#2f6ed6] shadow-sm"
                    : "text-white/75 hover:bg-white/10 hover:text-white",
            ].join(" ")}
        >
            <Icon
                size={18}
                strokeWidth={active ? 2 : 1.8}
                className="shrink-0"
            />

            <span>{title}</span>
        </Link>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-white/45">
            {children}
        </p>
    );
}

export default function ParentSidebar() {
    const pathname = usePathname();

    const children = [
        {
            icon: Users,
            title: "Students",
            link: "/students",
        },
        {
            icon: GraduationCap,
            title: "Grades",
            link: "/grades",
        },
    ];

    const school = [
        {
            icon: CreditCard,
            title: "Payments",
            link: "/payments",
        },
        {
            icon: BookOpen,
            title: "Handbook",
            link: "/handbook",
        },
    ];

    const account = [
        {
            icon: Settings,
            title: "Settings",
            link: "/account-settings",
        },
    ];

    const isActive = (link: string) =>
        pathname === link || pathname.startsWith(`${link}/`);

    return (
        <aside className="flex h-full w-full flex-col rounded-xl bg-[#2f6ed6] p-5 text-white">
            {/* School Header */}
            <header className="mb-8">
                <div className="flex items-center gap-3">
                    {/* School Mark */}
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/15 text-sm font-semibold text-white">
                        SL
                    </div>

                    <div className="min-w-0">
                        <h1 className="truncate text-sm font-semibold tracking-wide text-white">
                            ST. LOUISSE ACADEMY
                        </h1>

                        <p className="mt-0.5 text-xs text-white/50">
                            Daanbantayan
                        </p>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="flex min-h-0 flex-1 flex-col">
                {/* Children */}
                <div>
                    <SectionLabel>Children</SectionLabel>

                    <div className="space-y-1">
                        {children.map((item) => (
                            <NavItem
                                key={item.title}
                                icon={item.icon}
                                title={item.title}
                                link={item.link}
                                active={isActive(item.link)}
                            />
                        ))}
                    </div>
                </div>

                {/* School */}
                <div className="mt-7">
                    <SectionLabel>School</SectionLabel>

                    <div className="space-y-1">
                        {school.map((item) => (
                            <NavItem
                                key={item.title}
                                icon={item.icon}
                                title={item.title}
                                link={item.link}
                                active={isActive(item.link)}
                            />
                        ))}
                    </div>
                </div>

                {/* Account */}
                <div className="mt-auto pt-7">
                    <SectionLabel>Account</SectionLabel>

                    <div className="space-y-1">
                        {account.map((item) => (
                            <NavItem
                                key={item.title}
                                icon={item.icon}
                                title={item.title}
                                link={item.link}
                                active={isActive(item.link)}
                            />
                        ))}

                        {/* Logout */}
                        <div className="my-2 border-t border-white/10" />

                        <form action={logout}>
                            <button
                                type="submit"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/65 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <LogOut
                                    size={18}
                                    strokeWidth={1.8}
                                    className="shrink-0"
                                />

                                <span>Log out</span>
                            </button>
                        </form>
                    </div>
                </div>
            </nav>
        </aside>
    );
}
