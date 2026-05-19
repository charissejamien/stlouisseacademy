import { Users, Wallet, Settings, ChevronDown } from 'lucide-react'
import Link from 'next/link';

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminSidebar() {

  const links = [
    {label: "Students", link: "/admin/students", icon: Users},
    {label: "Finances", link: "/admin/students", icon: Wallet},
    {label: "Configuration", link: "/admin/configuration", icon: Settings},
  ]


  return(
    <div className="bg-gradient-to-t from-[#3153DE] to-[#4580FF] p-10 m-5 rounded-md text-white flex flex-col gap-5">
        {links.map((l , index) => (
          <Link key={index} href={l.link} className='flex flex-row gap-2 items-center'>
            <l.icon/>
            {l.label}
          </Link>
        ))}


    </div>
  );
}