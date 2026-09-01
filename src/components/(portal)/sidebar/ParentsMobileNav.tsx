"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  GraduationCap,
  CreditCard,
  Settings,
} from "lucide-react";

type NavItem = {
  icon: React.ElementType;
  title: string;
  link: string;
};

const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    link: "/dashboard",
  },
  {
    icon: GraduationCap,
    title: "Grades",
    link: "/grades",
  },
  {
    icon: CreditCard,
    title: "Payments",
    link: "/payments",
  },
  {
    icon: Settings,
    title: "Settings",
    link: "/settings",
  },
];

function isActivePath(pathname: string, link: string) {
  if (link === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === link || pathname.startsWith(`${link}/`);
}

export default function ParentsMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white md:hidden">
      <div className="mx-auto flex h-16 w-full max-w-lg items-stretch">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.link);

          return (
            <Link
              key={item.link}
              href={item.link}
              className={[
                "flex min-w-0 flex-1",
                "touch-manipulation",
                "flex-col items-center justify-center",
                "gap-1",
                "text-[10px] font-medium",
                "transition-colors",
                active ? "text-[#2f6ed6]" : "text-slate-400",
              ].join(" ")}
            >
              <Icon size={21} strokeWidth={active ? 2.2 : 1.8} />

              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
