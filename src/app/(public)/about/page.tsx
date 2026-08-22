import Image from "next/image";

export default function About() {

    const history = [
        {year: "1995", title: "The Beginning", heading:"Daanbantayan Learning Center", text: "St. Louisse Academy, Inc., originally established as Daanbantayan Learning Center in 1995, was the first private school in Daanbantayan, Cebu, offering Kindergarten through Third Grade. Located on P. Burgos Street, Poblacion, Daanbantayan, 136 kilometers from Cebu City, the school has been a cornerstone of education in the community."},
        {year: "1996", title: "Growing Foundation", heading:"From Two Classrooms to Elementary Education", text: "By 1996, the institution was thriving under its original owners, expanding its facilities to serve preelementary and elementary pupils. Initially starting with two classrooms, the school grew steadily, eventually offering a full elementary curriculum from Kindergarten to Sixth Grade. Responding to parental demand and a growing student population, the administration introduced secondary education, allowing students to continue receiving quality instruction in the same institution. At its peak, the school served nearly 500 students across all grade levels"},
        {year: "2008", title: "A Difficult Chapter", heading:"Facing Challenges", text: "However, challenges emerged in 2008, leading to a significant decline in enrollment. By 2012, a series of operational difficulties forced the original owners to sell the institution."},
        {year: "2013", title: "A New Beginning", heading:"A Vision for Renewal", text: "In September 2013, the school was acquired by the principal of St. Louisse Academy in Compostela, Cebu. Despite negative perceptions, the new owner accepted the challenge with passion and a vision for revitalization. She applied for a name change to St. Louisse Academy, Inc. and sought government recognition under the new identity. On October 27, 2014, the institution received its official recognition."},
        {year: "Today", title: "Growing Community", heading:"Growing with the Community", text: "The school now serves learners aged 4 to 16 years from across Daanbantayan and parts of Medellin, establishing itself as a true community institution."},

    ]

    const objectives = [
        {title: "21st Century Learners", text: "To guide the learners in the attainment of 21st century learning skills and knowledge"},
        {title: "Patriotic", text: "To support the learners to become God-loving, globally competitive and patriotic who can contribute to the building of a progressive, just and humane society"},
        {title: "Quality Education", text: "To develop 21st century learners through the delivery of quality instruction that is designed, facilitated, and assessed by the teachers based on the 21st century learning skills"},
        {title: "Critical Thinker", text: "To produce an individual who is a constructor of knowledge, problem solver and criticalthinker"},
        {title: "Active Learning", text: "To transform an individual from being a passive recipient of information to an active constructor of knowledge, problem solver and critical thinker"},
    ]

    return(
        <div>

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

            <div className="w-[80%] mx-auto mt-20 space-y-20">
                <section className="space-y-10">
                    <div className="space-y-3">
                        <p className="text-sm uppercase">Our Journey</p>
                        <h2 className="text-4xl leading-12 font-serif">A History of Growth, <br /> <span className="text-sla-blue">Reslience & Purpose</span> </h2>
                        <p className="w-[700px] leading-7">From a small learning center in 1995 to a growing community instituition, our story is one of perseverance, transformation, and a continued commitment to education.</p>
                    </div>
                    <div className="space-y-10">
                        {history.map((h,index) => (
                            <div key={index} className="flex gap-15">
                                <h3 className="text-lg font-bold">{h.year}</h3>
                                <div className="border border-sla-blue rounded-md p-7 space-y-2">
                                    <h4 className="text-sm uppercase">{h.title}</h4>
                                    <h2 className="text-lg">{h.heading}</h2>
                                    <p className="leading-7">
                                        {h.text}
                                    </p>
                                </div>
                            </div>
                        ))}

                    </div>
                </section>

                <section className="text-center">
                    <div className="flex flex-col justify-center align-center">
                        <p className="text-sm uppercase">Our Continuing Story</p>
                        <h2 className="text-4xl font-serif">Educating Minds.</h2>
                        <h2 className="text-4xl text-sla-blue font-serif">Touching hearts. Transforming lives.</h2>
                    </div>
                    <div className="mt-8 space-y-5 leading-8 sm:leading-9">
                        <p>
                            St. Louisse Academy, Inc. remains dedicated to its
                            philosophy as a learning environment that believes an
                            institution can produce learners with virtues, knowledge,
                            and skills aligned with K-12 standards and competencies.
                            Teachers serve as designers, facilitators, and assessors
                            of instruction, guiding learners toward becoming 21st
                            century learners.
                        </p>

                        <p>
                            Our institution remains unwavering in its dedication to
                            serving the community, driven by its enduring vision,
                            mission, goals, and objectives. We are committed to
                            delivering quality education and shaping future leaders of
                            the nation with integrity, character, and excellence.
                        </p>

                        <p>
                            This commitment is strengthened by the devoted support of
                            the PTA and the dynamic leadership of the SSG governing
                            body.
                        </p>
                    </div>
                    <div className="font-serif mt-10 text-3xl italic text-sla-blue font-medium flex justify-center">
                        <p className="border-t border-sla-blue/30 w-fit pt-7 px-5">Educating minds, touching hearts, and transforming lives to build a better tomorrow.</p>
                    </div>
                </section>

                <section className="space-y-7">
                    <div>
                        <p className="text-sm uppercase">Looking Ahead</p>
                        <h2 className="text-4xl font-serif">Our Vision</h2>
                    </div>
                    <div>
                        <p className="border-l-2 border-sla-blue/80 pl-5">
                            St. Louisse Academy, Inc. envisions itself as an agent for the production of learners
                            with multidisciplinary knowledge and skills that are aligned with the K-12 Curriculum to
                            make them 21st century learners.
                        </p>
                    </div>
                </section>

                <section className="space-y-5">
                    <div>
                        <p className="text-sm uppercase">What Guides Us</p>
                        <h2 className="text-4xl font-serif">Our Mission</h2>
                    </div>
                    <div className="flex justify-between gap-10">
                        <div className="border rounded-md border-sla-blue p-7">
                            <p>
                                Produce 21st century learners, patriotic and God-loving citizens
                            </p>
                        </div>
                        <div className="border rounded-md border-sla-blue p-7">
                            <p>
                                Create learners who are equipped with multidisciplinary knowledge and skills that are
                                aligned with K-12 Curriculum, virtues and strong sense of nationalism
                            </p>
                        </div>
                        <div className="border rounded-md border-sla-blue p-7">
                            <p>
                                develop the learners holistically with the knowledge and skills to prepare themfor the real world of work
                            </p>
                        </div>
                    </div>
                </section>

                <section className="space-y-7">
                    <div>
                        <p className="text-sm uppercase">Our Direction</p>
                        <h2 className="text-4xl font-serif">Our Goal</h2>
                    </div>
                    <div>
                        <p className="border-l-2 border-sla-blue/80 pl-5">
                            St. Louisse Academy, Inc. hopes to produce and to develop learners holistically who
                            are equipped with 21st century skills and knowledge through the teachers as designers,
                            facilitators and assessors to guide the learners to become God-loving, globally
                            competitive, patriotic and lifelong learners.
                        </p>
                    </div>
                </section>

                <section className="space-y-5">
                    <div>
                        <p className="text-sm uppercase">What We Develop</p>
                        <h2 className="text-4xl font-serif">Our Objectives</h2>
                    </div>
                    <div className="flex justify-between gap-10">
                        {objectives.map((o,index) => (
                            <div key={index} className="bg-sla-blue text-white p-10 rounded-md">
                                {o.title}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-7">
                    <div>
                        <p className="text-sm uppercase">Looking Forward</p>
                        <h2 className="text-4xl font-serif">Building the Future Together</h2>
                    </div>
                    <div className="space-y-6 text-base leading-8 border-l-2 border-sla-blue/80 pl-5">
                        <p>
                            At St. Louise Academy, Inc., our vision for the
                            future is rooted in growth, innovation, and a
                            continued commitment to quality and inclusive
                            education. As we look ahead, we remain dedicated
                            to welcoming more students into our community
                            and providing every Louissian with opportunities
                            to learn, grow, dream, and achieve.
                        </p>

                        <p>
                            We strive to build upon our legacy as a
                            community of learning by continuously improving
                            the educational experiences we offer. Through
                            innovation, collaboration, and a strong
                            commitment to excellence, we aim to create an
                            environment where students are empowered to
                            reach their full potential and become
                            responsible, confident, and compassionate
                            individuals.
                        </p>

                        <p>
                            Our journey toward a brighter future is made
                            possible through the continued support and
                            partnership of our parents, students, faculty,
                            staff, and the entire St. Louise Academy
                            community. Together, we look forward to
                            strengthening our institution and ensuring that
                            it remains a place where every Louissian can
                            thrive.
                        </p>

                    </div>
                        <p className="font-serif leading-8 text-sla-blue text-center text-3xl py-20">
                            Together, we continue to inspire, innovate, and
                            empower; shaping a brighter future for every
                            Louissian.
                        </p>
                </section>

            </div>

            
        </div>
    );
}