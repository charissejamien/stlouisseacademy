export default function Login() {
    return(
        <div className="w-full flex flex-col items-center mt-30 gap-10">

            <div className="flex items-center justify-center gap-4">
                <div>
                    <img src="/logo.svg" alt="" className="w-20 h-20"/>
                </div>
                <div className="text-center">
                    <h1 className="text-sla-blue font-extrabold text-[32px] tracking-[4px]">ST LOUISSE ACADEMY</h1>
                    <h2 className="text-sla-gold font-medium text-[20px] tracking-[10px]">DAANBANTAYAN</h2>
                </div>
            </div>

            <div className="bg-white p-10 pr-0 rounded-md flex gap-10 h-full">
                <div className="w-[50%] py-10 px-5 rounded-md flex flex-col gap-50" style={{ backgroundImage: `url('/login-bg.svg')`}}>
                    <p className="text-white text-[32px] font-semibold">Welcome.</p>
                    <p className="text-white text-[14px]">Stay connected with your child's academic journey and school updates</p>
                </div>

                <div className="w-[40%] px-5 flex flex-col justify-center">
                    <div className="justify-center">
                        <form action="">
                        <div>
                            <label htmlFor="email" className="text-gray-muted block font-light">Email</label>
                            <input type="text" className="border border-[#D9D9D9] bg-white rounded-sm outline-none p-2 w-full"/>
                        </div>
                        <div>
                            <label htmlFor="password" className="text-gray-muted block mt-6 font-light">Password</label>
                            <input type="password" className="border border-[#D9D9D9] bg-white rounded-sm outline-none p-2 w-full"/>
                        </div>
                        <p className="text-[#3153DE] text-[12px] mt-2 mb-6 text-right">Forgot Password</p>
                        <button className="bg-gradient-to-r from-[#5474F5] to-[#304BB8] text-white w-full p-2 rounded-sm font-semibold tracking-wider">Login</button>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    );
}