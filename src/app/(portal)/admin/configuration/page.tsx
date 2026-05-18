import SystemConfiguration from "@/components/admin/SystemConfiguration";



export default async function Fees() {
    return(
        <div className="mt-20 px-20">
            <h2 className="text-[28px] font-semibold">System Configuration</h2>
            <p>Manage global settings, tuition fee structures, and active discount.</p>
            <SystemConfiguration/>

        </div>
    );
}