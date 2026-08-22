"use client"

import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { MapPin, Mail, Phone, Map } from "lucide-react";

export default function Footer() {

    const router = useRouter();

    const contactUs = [
        {icon: Phone, text: "+63 935-268-2126"},
        {icon: Mail, text: "sladaanbantayan@gmail.com"},
        {icon: MapPin, text: "P. Burgost St., Poblacion, Daanbantayan, Cebu Philippines"}
    ]

     const explore = [
        {page: "Academics", link: "/" },
        {page: "Admissions", link: "/" },
        {page: "About", link: "/" },
        {page: "Careers", link: "/" }
    ]

    const documents = [
        {doc: "Privacy", link: "/" },
        {doc: "Terms", link: "/" },
        {doc: "Cookies", link: "/" }
    ]

    return(
        <div className="bg-sla-blue pt-20 pb-5 flex flex-col text-gray-100/85 mt-10 gap-10">
            
            <div className="flex justify-between px-5 xl:px-80">
                <div>
                    <h1 className="text-lg text-white font-semibold tracking-wide">ST. LOUISSE ACADEMY, INC.</h1>
                    <p className="text-sm font-thin">Teaching Minds, Touching Hearts, and Transforming Lives.</p>
                </div>

                <div>
                    <h3 className="uppercase font-semibold text-white">Explore</h3>
                    {explore.map((e,index) => (
                        <p 
                            key={index} 
                            onClick={() => router.push(e.link)} 
                            className="font-thin cursor-pointer hover:underline hover:text-white hover:scale-101"
                        >
                            {e.page}
                        </p>
                    ))}
                </div>
                
                <div className="flex flex-col text-left space-y-1">
                    <h3 className="uppercase font-semibold text-white">Contact Us</h3>
                    {contactUs.map((c , i) => (
                        <div key={i} className="flex items-start gap-3 text-sm">
                            <div className="pt-1"><c.icon size={16}/></div>
                            <p className="w-90">{c.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Separator className="w-"/>

            <div className="flex justify-between px-5 xl:px-60 text-sm">
                <p>2026 St. Louisse Academy, Inc. All rights reserved.</p>
                <div className="flex gap-5">
                    {documents.map((d , i) => (
                        <p key={i}
                            className="cursor-pointer hover:underline hover:text-white hover:scale-101"
                            onClick={() => router.push(d.link)}
                        >
                        {d.doc}
                        </p>
                    ))}
                </div>
            </div>

        </div>
    );
}