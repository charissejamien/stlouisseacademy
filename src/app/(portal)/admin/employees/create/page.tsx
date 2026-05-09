



export default function Management() {

    const basicInfoInputs = [
        {label: "First Name", value:"firstName"},
        {label: "Middle Name", value:"middleName"},
        {label: "Last Name", value:"lastName"},
        {label: "Email", value:"email"},
        {label: "Contact Number", value:"contactNumber"},
        {label: "Gender", value:"gender"},
        {label: "Date of Birth", value:"dob"},
        {label: "Residence", value:"residence"},
    ]

    const governmentInputs = [
        {label: "SSS Number", value:"sssNum"},
        {label: "Tin Number", value:"tinNum"},
        {label: "Pag-IBIG ID Number", value:"pagIbigNum"},
        {label: "PhilHealth Number", value:"philHealthNum"},
    ]

    return(
        <div className="w-[80%] mx-auto mt-20">
            <div className="bg-white p-5 rounded-md">

                <h2>Add Employee</h2>

                <form action="">
                    <div className="mt-5 ml-5 flex flex-col gap-2">
                        <h3>Basic Information</h3>
                        <div className="grid grid-cols-3 gap-y-4">
                            {basicInfoInputs.map((i) => (
                                <div key={i.value}>
                                    <p>{i.label}</p>
                                    <input type="text" name={i.value} className="border rounded-sm py-1"/>
                                </div>
                            ))}

                        </div>

                    </div>

                    <div className="mt-10 ml-5 flex flex-col gap-2">
                        <h3>Government Information</h3>
                        <div className="grid grid-cols-3 gap-y-4">
                            {governmentInputs.map((i) => (
                                <div key={i.value}>
                                    <p>{i.label}</p>
                                    <input type="text" name={i.value} className="border rounded-sm py-1"/>
                                </div>
                            ))}

                        </div>
                    </div>


                    <div className="mt-10 ml-5">
                        <h3>Job Assignment</h3>
                        <div>
                            <select name="" id="">
                                <option value="">Teaching</option>
                                <option value="">Non-Teaching</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-10 ml-5 flex justify-end">
                        <button className="bg-sla-blue text-white px-4 py-2 rounded-sm">Add Employee</button>
                    </div>
                </form>
            </div>
        </div>
    );
}