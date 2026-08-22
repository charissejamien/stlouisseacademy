import Image from 'next/image';

export default function Academics() {

    return(
        <div className="bg-slate-50/50 min-h-screen pb-24">
            
            {/* Hero Section */}
            <section className="relative overflow-hidden text-white bg-slate-900 min-h-[75vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center justify-center">
                <Image 
                    src="/academics-bg.svg" 
                    alt="Academics Background" 
                    fill
                    priority
                    className="object-cover z-0 opacity-40 lg:opacity-100"
                />
                {/* Backdrop Overlay for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-slate-950/40 z-10" />
                
                <div className="relative z-20 flex flex-col justify-center items-center text-center max-w-7xl mx-auto px-6 py-16">
                    <h2 className='text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-tight mb-2 md:mb-4'>
                        A Legacy of 
                        <span className='text-sla-gold italic'> Excellence.</span>
                    </h2>
                    <h2 className='text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-tight mb-6 md:mb-8'>
                        A Future of  
                        <span className='text-sla-gold italic'> Infinite Possibilities.</span>
                    </h2>
                    <p className='text-sm sm:text-base md:text-lg lg:text-xl font-light text-slate-200 max-w-6xl leading-relaxed'>
                        To provide a transformative education that balances academic rigor with character formation. We are dedicated 
                        to nurturing well-rounded individuals who are prepared to lead with integrity, serve the community of Daanbantayan with compassion, and excel in a globalized world.
                    </p>
                </div>
            </section>

            {/* Academic Programs Section */}
            <section className='max-w-6xl w-[90%] md:w-[85%] mx-auto px-4'>
                <h2 className='text-3xl md:text-4xl font-semibold text-center my-12 md:my-20 text-slate-800'>
                    Academic Programs
                </h2>

                <div className="flex flex-col gap-16 md:gap-24 lg:gap-32">
                    
                    {/* Program 1: Pre-Elementary */}
                    <div className='flex flex-col lg:flex-row items-center gap-8 lg:gap-16'>
                        <div className='w-full lg:w-[60%] order-2 lg:order-1 text-center lg:text-left'>
                            <span className='text-sm uppercase tracking-wider font-semibold text-slate-400'>Pre-Elementary</span>
                            <h4 className='text-2xl sm:text-3xl lg:text-4xl text-sla-blue font-medium mt-1 mb-4'>Where Curiosity Begins.</h4>
                            <p className='text-sm sm:text-base text-slate-600 font-light leading-relaxed'>
                              An environment focused on developing social skills, motor coordination, and a foundational love for learning. Our Pre-Elementary program focuses on the holistic development 
                              of our youngest learners (Ages 4–5). We believe that a child’s first experience with school should be filled with joy and discovery.  
                            </p>
                        </div>
                        <div className='w-full sm:w-[70%] md:w-[50%] lg:w-[40%] flex justify-center order-1 lg:order-2'>
                            <div className="relative aspect-[4/3] w-full max-w-[400px]">
                                <Image src="/pre-elementary.svg" alt='Pre-Elementary students' fill className='rounded-2xl object-cover shadow-md'/>
                            </div>
                        </div>
                    </div>

                    {/* Program 2: Elementary */}
                    <div className='flex flex-col lg:flex-row items-center gap-8 lg:gap-16'>
                        <div className='w-full sm:w-[70%] md:w-[50%] lg:w-[40%] flex justify-center'>
                            <div className="relative aspect-[4/3] w-full max-w-[400px]">
                                <Image src="/elementary.svg" alt='Elementary students' fill className='rounded-2xl object-cover shadow-md'/>
                            </div>
                        </div>                   
                        <div className='w-full lg:w-[60%] text-center lg:text-left'>
                            <span className='text-sm uppercase tracking-wider font-semibold text-slate-400'>Elementary</span>
                            <h4 className='text-2xl sm:text-3xl lg:text-4xl text-sla-blue font-medium mt-1 mb-4'>Building a Strong Foundation.</h4>
                            <p className='text-sm sm:text-base text-slate-600 font-light leading-relaxed'>
                              Focused on core literacy, numeracy, and character building. We prepare students for academic challenges while nurturing their unique talents. The Elementary years are where 
                              we instill the discipline of study and the core values of the Academy. We provide a balanced curriculum that emphasizes both intellectual growth and character formation.
                            </p>
                        </div>
                    </div>

                    {/* Program 3: Junior High School */}
                    <div className='flex flex-col lg:flex-row items-center gap-8 lg:gap-16'>
                        <div className='w-full lg:w-[60%] order-2 lg:order-1 text-center lg:text-left'>
                            <span className='text-sm uppercase tracking-wider font-semibold text-slate-400'>Junior High School</span>
                            <h4 className='text-2xl sm:text-3xl lg:text-4xl text-sla-blue font-medium mt-1 mb-4'>Preparing for the Future.</h4>
                            <p className='text-sm sm:text-base text-slate-600 font-light leading-relaxed'>
                              A robust curriculum designed for critical thinking and community involvement. Our Junior High program challenges students to think critically and prepare for the 
                              complexities of Senior High School and beyond.
                            </p>
                        </div>
                        <div className='w-full sm:w-[70%] md:w-[50%] lg:w-[40%] flex justify-center order-1 lg:order-2'>
                            <div className="relative aspect-[4/3] w-full max-w-[400px]">
                                <Image src="/junior-high.svg" alt='Junior High students' fill className='rounded-2xl object-cover shadow-md'/>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
}