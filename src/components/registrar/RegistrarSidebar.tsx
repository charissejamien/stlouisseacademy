// "use client";

// import {
//     LayoutDashboard,
//     NotebookText,
//     Wallet,
//     WalletCards,
//     FileText,
//     LogOut,
//     Users,
//     GraduationCap,
// } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";

// export default function RegistrarSidebar() {
//     const pathname = usePathname();

//     const links = [
//         {
//             label: "Dashboard",
//             link: "/registrar/dashboard",
//             icon: LayoutDashboard,
//         },
//         {
//             label: "Enrollment",
//             link: "/registrar/enrollment",
//             icon: NotebookText,
//         },
//         {
//             label: "Payments",
//             link: "/registrar/payments",
//             icon: Wallet,
//         },
//         {
//             label: "DCPR",
//             link: "/registrar/dcpr",
//             icon: WalletCards,
//         },
//         {
//             label: "Payroll",
//             link: "/admin/dashboard",
//             icon: FileText,
//         },
//         {
//             label: "Students",
//             link: "/registrar/students",
//             icon: Users,
//         },
//         {
//             label: "Teachers",
//             link: "/admin/dashboard",
//             icon: GraduationCap,
//         },
//     ];

//     return (
//         <aside className="ml-5 my-10 flex min-h-[calc(100vh-5rem)] w-[245px] flex-col rounded-md bg-gradient-to-t from-[#3153DE] to-[#4580FF] px-4 py-5">

//             {/* Logo */}
//             <div className="flex justify-center pb-8">
//                 <Image
//                     src="/logo.svg"
//                     alt="logo"
//                     width={100}
//                     height={100}
//                     priority
//                 />
//             </div>

//             {/* Navigation */}
//             <nav className="flex flex-col gap-1">
//                 {links.map((item) => {
//                     const Icon = item.icon;
//                     const isActive = pathname === item.link;

//                     return (
//                         <Link
//                             key={item.label}
//                             href={item.link}
//                             className={`
//                                 flex items-center gap-3 rounded-md px-4 py-3
//                                 transition-colors duration-150
//                                 ${
//                                     isActive
//                                         ? "bg-white/15 text-white"
//                                         : "text-[#A9C7FF] hover:bg-white/10 hover:text-white"
//                                 }
//                             `}
//                         >
//                             <Icon size={20} strokeWidth={1.8} />
//                             <span>{item.label}</span>
//                         </Link>
//                     );
//                 })}
//             </nav>

//             {/* Logout */}
//             <button
//                 type="button"
//                 className="mt-auto flex items-center gap-3 rounded-md px-4 py-3 text-[#A9C7FF] transition-colors duration-150 hover:bg-white/10 hover:text-white"
//             >
//                 <LogOut size={20} strokeWidth={1.8} />
//                 <span>Logout</span>
//             </button>
//         </aside>
//     );
// }