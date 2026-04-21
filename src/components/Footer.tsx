export default function Footer() {
    return(
        <div className="bg-sla-blue px-5 py-20 flex flex-col text-white md:flex mt-10 text-center gap-10">
            
            <div className="flex flex-col gap-5">
                <img src="/logo.svg" alt="" className="w-40 h-40 w-full mx-auto"/>
                <div className="flex flex-col gap-2">
                    <h1 className="text-[24px] font-medium">St. Louisse Academy Inc.</h1>
                    <p>P. Burgos St., Poblacion, Daanbantayan, Cebu 6013, Philippines</p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <p className="font-medium">Contact Info</p>
                <p>sladaanbantayan@gmail.com</p>
                <p>+63 935 286 2126</p>
                <p>Mon - Fri | 7:30 AM - 4 PM</p>
                <p>Follow Us</p>
            </div>

            <div className="flex flex-col gap-2">
                <p className="font-medium">Quick Links</p>
                <div className="text-sla-gold flex flex-col gap-2">
                    <p>Academics</p>
                    <p>Admissions</p>
                    <p>Careers</p>
                    <p>About</p>
                </div>
            </div>

            <div className="bg-white h-[1px]"></div>

            <div>
                <p>Copyright 2026-2027</p>
            </div>
        </div>
    );
}