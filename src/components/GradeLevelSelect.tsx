import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getGradeLevels } from "@/app/actions";

export default async function GradeLevelSelect() {

    const gradeLevels = await getGradeLevels();

    return(

        <div>
            <Select>
                <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel >Grade Levels</SelectLabel>
                    {gradeLevels.map((g) => (
                        <SelectItem key={g.grade_level} value={g.grade_level}>{g.grade_level}</SelectItem>
                    ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}