
import Image from 'next/image';

export default function Academics() {

    return(
        <div className="bg-slate-50/50 min-h-screen pb-24">
            
            {/* Hero Section */}
            <section className="relative overflow-hidden text-white bg-slate-900">
                <Image src={"/academics-bg.svg"} alt="" width={30} height={30} className="object-cover h-[85vh] w-full lg:h-[90vh]"/>
                <div className="absolute inset-0 z-20 flex flex-col justify-center items-center">
                    <h2 className='text-[72px] font-semibold'>
                        A Legacy of 
                        <span className='text-sla-gold italic'> Excellence.</span>
                    </h2>
                    <h2 className='text-[72px] font-semibold'>
                        A Future of  
                        <span className='text-sla-gold italic'> Infinite Possibilities.</span>
                    </h2>
                    <p className='w-[75%] text-[20px] font-light'>
                        To provide a transformative education that balances academic rigor with character formation. We are dedicated 
                        to nurturing well-rounded individuals who are prepared to lead with integrity, serve the community of Daanbantayan with compassion, and excel in a globalized world.
                    </p>

                </div>
            </section>

            

        </div>
    );
}