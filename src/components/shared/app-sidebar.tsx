"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User2,
  LayoutDashboard,
  Wallet,
  BriefcaseBusiness,
  GraduationCap,
  Settings,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { logout } from "@/app/(authentication)/login/actions";

export type UserRole =
  | "parent"
  | "teacher"
  | "admin"
  | "registrar"
  | "executive"
  | "superadmin"
  | "staff";

export type UserProfile = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: UserRole;
};

type AppSidebarProps = {
  role: UserRole;
  userProfile: UserProfile;
};

type SidebarItem = {
  link: string;
  name: string;
  roles: UserRole[];
};

type SidebarGroupType = {
  icon: typeof LayoutDashboard;
  group: string;
  link?: string;
  roles: UserRole[];
  subgroup: SidebarItem[];
};

const groups: SidebarGroupType[] = [
  {
    icon: LayoutDashboard,
    group: "Dashboard",
    link: "/dashboard",
    roles: [
      "parent",
      "teacher",
      "admin",
      "registrar",
      "executive",
      "superadmin",
      "staff",
    ],
    subgroup: [],
  },
  {
    icon: BriefcaseBusiness,
    group: "Management",
    roles: ["admin", "registrar", "executive", "superadmin"],
    subgroup: [
      {
        link: "/students",
        name: "Students",
        roles: ["teacher", "admin", "registrar", "executive", "superadmin"],
      },
      {
        link: "/employees",
        name: "Employees",
        roles: ["admin", "registrar", "executive", "superadmin"],
      },
      {
        link: "/parents",
        name: "Parents",
        roles: ["teacher", "admin", "registrar", "executive", "superadmin"],
      },
    ],
  },
  {
    icon: Wallet,
    group: "Finance",
    roles: ["admin", "registrar", "executive", "superadmin"],
    subgroup: [
      {
        link: "/financials/students",
        name: "Summary",
        roles: ["admin", "registrar", "executive", "superadmin"],
      },
      {
        link: "/payments",
        name: "Payments",
        roles: ["admin", "registrar", "executive", "superadmin"],
      },
      {
        link: "/dcpr",
        name: "Daily Cash",
        roles: ["registrar", "executive", "superadmin"],
      },
      {
        link: "/expenses",
        name: "Expenses",
        roles: ["registrar", "executive", "superadmin"],
      },
      {
        link: "/payroll",
        name: "Payroll",
        roles: ["registrar", "executive", "superadmin"],
      },
    ],
  },
  {
    icon: GraduationCap,
    group: "Academics",
    roles: ["admin", "registrar", "executive", "superadmin"],
    subgroup: [
      {
        link: "/enrollment",
        name: "Enrollment",
        roles: ["admin", "registrar", "executive", "superadmin"],
      },
      {
        link: "/classes",
        name: "Classes",
        roles: ["admin", "registrar", "executive", "superadmin"],
      },
      {
        link: "/grades",
        name: "Grades",
        roles: ["admin", "registrar", "executive", "superadmin"],
      },
    ],
  },
];

function getDisplayName(profile?: UserProfile | null) {
  if (!profile) return "User";
  const parts = [profile.first_name, profile.last_name].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "User";
}

function formatRole(role: UserRole) {
  if (!role) return "User";
  return role
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());
}

export function AppSidebar({ role, userProfile }: AppSidebarProps) {
  const pathname = usePathname();

  const displayName = getDisplayName(userProfile);
  const displayRole = formatRole(role);

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b px-4 py-4 group-data-[collapsible=icon]:px-2 items-center text-center">
        <div className="flex items-center gap-3">
          <div className="min-w-0 group-data-[collapsible=icon]:hidden text-center">
            <h1 className="truncate font-semibold tracking-tight">
              St. Louisse Academy
            </h1>
            <p className="text-xs text-muted-foreground">Daanbantayan</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {groups.map((group) => {
              if (!group.roles.includes(role)) {
                return null;
              }

              const Icon = group.icon;
              const visibleItems = group.subgroup.filter((item) =>
                item.roles.includes(role),
              );

              if (group.subgroup.length === 0 && group.link) {
                const isActive = pathname === group.link;

                return (
                  <SidebarMenuItem key={group.group}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={group.group}
                      className="h-10 px-3 font-medium"
                    >
                      <Link href={group.link}>
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {group.group}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              if (visibleItems.length === 0) {
                return null;
              }

              return (
                <SidebarMenuItem key={group.group}>
                  <SidebarMenuButton
                    tooltip={group.group}
                    className="h-10 px-3 font-medium text-muted-foreground hover:bg-transparent hover:text-foreground"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {group.group}
                    </span>
                  </SidebarMenuButton>

                  <div className="ml-5 mt-1 border-l border-border pl-3 group-data-[collapsible=icon]:hidden">
                    <SidebarMenu className="gap-1">
                      {visibleItems.map((item) => {
                        const isActive = pathname === item.link;

                        return (
                          <SidebarMenuItem key={item.link}>
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              className="h-9 px-3 text-sm font-normal"
                            >
                              <Link href={item.link}>{item.name}</Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </div>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3 group-data-[collapsible=icon]:px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton tooltip="Account" className="h-11 px-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User2 className="h-4 w-4" />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col text-left group-data-[collapsible=icon]:hidden">
                    <span className="truncate text-sm font-medium">
                      {displayName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {displayRole}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="start"
                sideOffset={8}
                className="w-56"
              >
                <div className="px-2 py-2">
                  <p className="truncate text-sm font-medium">{displayName}</p>
                  {userProfile.email && (
                    <p className="truncate text-xs text-muted-foreground">
                      {userProfile.email}
                    </p>
                  )}
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={() => {
                    logout();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
