import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { Student } from "@/app/(portal)/enrollment/types";

type StudentInformationProps = {
    students: Student[];
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
};

export default function FeeSettlement({students, setStudents} : StudentInformationProps) {
    return(
        <div className="flex gap-10">
            <div className="w-[70%] flex flex-col gap-5">
                {students.map((s, i) => (
                    <Card className="w-full min-w-lg" key={i}>
                        <CardHeader>
                            <CardTitle>{s.firstName}</CardTitle>
                            <CardDescription>
                                {s.gradeLevel}
                            </CardDescription>
                            <CardAction>
                            </CardAction>
                        </CardHeader>
                        <CardContent className="flex">
                            <Label>Entrance Fee</Label>
                            <Input />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="w-[30%]">
                    <p>awd</p>
            </div>
        </div>
    );
}