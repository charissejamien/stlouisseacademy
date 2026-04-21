import {Menu} from 'lucide-react';


export default function Header() {
    return(
        <div className="bg-sla-blue px-3 py-5 text-white flex justify-between items-center">
            
            <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="" className="w-15 h-15"/>
                <div>
                    <h1 className='tracking-[2px] text-[18px]'>ST. LOUISSE ACADEMY</h1>
                    <h1 className="text-sla-gold tracking-[5px] text-[14px]">DAANBANTAYAN</h1>
                </div>
            </div>

            <div className='mr-1'>
                <Menu size={35}/>
            </div>
        </div>
    );
}