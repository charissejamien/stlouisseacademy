import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  UserRoundCog,
  BookOpen,
  Layers3,
  WalletCards,
  Settings,
  LogOut,
  UserCheck,
  UserPlus,
  Receipt,
  ReceiptText,
} from "lucide-react";

import { logout } from "@/app/(authentication)/login/actions";

export default function ExecutiveSidebar() {
  const overview = [
    {
      icon: LayoutDashboard,
      title: "Dashboard",
      link: "/dashboard",
    },
  ];

  const management = [
    {
      icon: Users,
      title: "Students",
      link: "/students",
    },
    {
      icon: UserCheck,
      title: "Parents",
      link: "/parents",
    },
    {
      icon: UserRoundCog,
      title: "Employees",
      link: "/employees",
    },
    {
      icon: UserPlus,
      title: "Enrollment",
      link: "/enrollment",
    },
    {
      icon: BookOpen,
      title: "Classes",
      link: "/classes",
    },
    {
      icon: Layers3,
      title: "Sections",
      link: "/sections",
    },
  ];

  const reports = [
    {
      icon: WalletCards,
      title: "Financial Reports",
      link: "/reports/financial",
    },
    {
      icon: Receipt,
      title: "Payments",
      link: "/payments",
    },
    {
      icon: ReceiptText,
      title: "Expenses",
      link: "/expenses",
    },
  ];

  const account = [
    {
      icon: Settings,
      title: "Settings",
      link: "/settings",
    },
  ];

  return (
    <aside className="flex h-full flex-col rounded-xl bg-gradient-to-t from-[#3153DE] to-[#4580FF] p-5 text-white/80">
      {/* School */}
      <header className="mb-8">
        <h1 className="text-white font-bold tracking-wider">
          ST. LOUISSE ACADEMY
        </h1>

        <p className="text-sm text-white/60">Daanbantayan</p>
      </header>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-7">
        {/* Overview */}
        <div>
          <p className="mb-2.5 px-2 text-xs uppercase tracking-wide text-white/60 font-semibold">
            Overview
          </p>

          <div className="space-y-1">
            {overview.map((item) => {
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

        {/* Management */}
        <div>
          <p className="mb-2.5 px-2 text-xs uppercase tracking-wide text-white/60 font-semibold">
            Management
          </p>

          <div className="space-y-1">
            {management.map((item) => {
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

        {/* Reports & Finance */}
        <div>
          <p className="mb-2.5 px-2 text-xs uppercase tracking-wide text-white/60 font-semibold">
            Reports & Finance
          </p>

          <div className="space-y-1">
            {reports.map((item) => {
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
          <p className="mb-2.5 px-2 text-xs uppercase tracking-wide text-white/60 font-semibold">
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
