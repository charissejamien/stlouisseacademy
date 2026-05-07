import ClassList from "@/components/students/classList";

export default function StudentList() {
    
    return(
        <div className="w-[80%] mx-auto mt-20">
            <h2 className="text-[24px] font-semibold">Master Class List</h2>
            <ClassList/>
        </div>
    );
}