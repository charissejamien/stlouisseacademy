"use client";
import { createClient } from "@/lib/supabase/client";

export default function Test() {
    const supabase = createClient();

    const handleSave = async (formData: FormData) => {
        // One line to get all data: entries() converts the form into an object
        const rawData = Object.fromEntries(formData.entries());

        const { error } = await supabase
            .from('studentInfo')
            .insert([{ 
                firstName: rawData.firstName, 
                middleName: rawData.middleName, 
                lastName: rawData.lastName 
            }]);

        if (error) alert(error.message);
        else alert("Student saved!");
    };

    return (
        <form action={handleSave} className="flex flex-col gap-4 p-10">
            {/* Make sure the 'name' attribute matches your database columns or keys */}
            <input name="firstName" placeholder="First Name" className="border" />
            <input name="middleName" placeholder="Middle Name" className="border" />
            <input name="lastName" placeholder="Last Name" className="border" />
            
            <button type="submit" className="bg-blue-500 text-white">Save</button>
        </form>
    );
}