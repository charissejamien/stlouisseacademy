import Link from "next/link";

export default function Footer() {
    return(
        <div className="bg-sla-blue px-5 py-20 flex flex-col text-white mt-10 text-center gap-10 xl:px-90">
            
            <div className="lg:flex lg:justify-between lg:px-15">
                <div className="flex flex-col gap-5 lg:gap-0">
                    <img src="/logo.svg" alt="" className="w-40 h-40 w-full mx-auto lg:w-25 lg:h-25 lg:mx-0 lg:gap-1"/>
                    <div className="flex flex-col gap-2 lg:text-left lg:gap-1">
                        <h1 className="text-[24px] font-medium lg:text-[18px]">St. Louisse Academy Inc.</h1>
                        <p className="lg:text-[14px] lg:w-80">P. Burgos St., Poblacion, Daanbantayan, Cebu 6013, Philippines</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 lg:text-left">
                    <p className="font-medium">Contact Info</p>
                    <div className="lg:text-[14px] flex flex-col gap-2">
                        <p>sladaanbantayan@gmail.com</p>
                        <p>+63 935 286 2126</p>
                        <p>Mon - Fri | 7:30 AM - 4 PM</p>
                        <p>Follow Us</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="font-medium">Quick Links</p>
                    <div className="text-sla-gold flex flex-col gap-2 lg:text-[14px] lg:text-right">
                        <Link href='/academics'>Academics</Link>
                        <Link href='/admissions'>Admissions</Link>
                        <Link href='/careers'>Careers</Link>
                        <Link href='/about'>About</Link>
                    </div>
                </div>
            </div>

            <div className="bg-white h-[1px] lg:mx-10"></div>

            <div>
                <p className="lg:text-[12px]">Copyright 2026-2027</p>
            </div>
        </div>
    );
}