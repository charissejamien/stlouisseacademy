// components/(public)/Header.jsx
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const nav = [
    { nav: "Home", link: "/" },
    { nav: "Academics", link: "/academics" },
    { nav: "Admissions", link: "/admissions" },
    { nav: "About", link: "/about" },
  ];

  return (
    <div className="absolute top-0 left-0 w-full z-50 flex justify-between uppercase bg-transparent text-white tracking-wider py-3 px-10 items-center text-[16px] font-light">
        
        <div className="flex gap-3">
            <Image src={"/logo.svg"} alt="Logo" width={20} height={20}></Image>
            <div>
                <p>St. Louisse Academy</p>
                <p className="text-sla-gold leading-none">Daanbantayan</p>
            </div>
        </div>
        
        <div className="flex gap-10">
            {nav.map((n) => (
                <Link key={n.nav} href={n.link}>{n.nav}</Link>
            ))}
        </div>

        <div>
            <p><span className="text-sla-gold">Once</span> a Louissian</p>
            <p className="leading-none">Always a <span className="text-sla-gold">Louissian</span></p>
        </div>

    </div>
  );
}