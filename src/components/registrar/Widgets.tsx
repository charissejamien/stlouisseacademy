import Link from "next/link";

export default function Widgets() {

    const links = [
        {label:"Enroll a Student", link: "/registrar/enrollment"},
        {label:"Create Payment", link: "/registrar/enrollment"},
        {label:"Create DCPR", link: "/registrar/enrollment"},
        {label:"Create Payroll", link: "/registrar/enrollment"},
    ]

    return(
        <div className="flex gap-5">
            {links.map((l , index) =>(
                <Link key={index} href={l.link} className="bg-sla-blue px-5 py-3 rounded-md text-white">
                    <p>{l.label}</p>
                </Link>
            ))}
        </div>
    );
}