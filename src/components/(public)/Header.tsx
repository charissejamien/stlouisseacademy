"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const nav = [
    { nav: "Home", link: "/" },
    { nav: "Academics", link: "/academics" },
    { nav: "Admissions", link: "/admissions" },
    { nav: "About", link: "/about" },
  ];

  return (
    <header className="absolute top-0 left-0 w-full z-50 uppercase bg-transparent text-white tracking-wider py-4 px-6 md:px-10 flex justify-between items-center text-sm md:text-base font-light">
      
      {/* Brand Logo & Name */}
      <div className="flex gap-3 items-center z-50">
        <Image src="/logo.svg" alt="Logo" width={24} height={24} />
        <div className="text-xs md:text-sm">
          <p className="font-medium">St. Louisse Academy</p>
          <p className="text-sla-gold leading-none font-light">Daanbantayan</p>
        </div>
      </div>

      {/* Desktop Navigation Link Menu (Hidden on Mobile) */}
      <nav className="hidden lg:flex gap-10">
        {nav.map((n) => (
          <Link 
            key={n.nav} 
            href={n.link}
            className="hover:text-sla-gold transition-colors duration-200"
          >
            {n.nav}
          </Link>
        ))}
      </nav>

      {/* School Motto Slogan (Hidden on Mobile/Tablet to save breathing room) */}
      <div className="hidden xl:block text-right text-xs leading-tight">
        <p><span className="text-sla-gold">Once</span> a Louissian</p>
        <p className="leading-none">Always a <span className="text-sla-gold">Louissian</span></p>
      </div>

      {/* Mobile Hamburger Toggle Button (Hidden on Desktop) */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="lg:hidden p-2 z-50 focus:outline-none"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Fullscreen Mobile Drawer Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col justify-center items-center gap-8 transition-all duration-300 ease-in-out lg:hidden z-40 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-6 text-center text-xl tracking-widest">
          {nav.map((n) => (
            <Link 
              key={n.nav} 
              href={n.link} 
              onClick={() => setIsOpen(false)}
              className="hover:text-sla-gold active:text-sla-gold transition-colors py-2"
            >
              {n.nav}
            </Link>
          ))}
        </nav>

        {/* Small motto copy placement inside mobile layout */}
        <div className="text-center text-[10px] tracking-widest opacity-60 mt-8 normal-case">
          <p>Once a Louissian, Always a Louissian</p>
        </div>
      </div>

    </header>
  );
}