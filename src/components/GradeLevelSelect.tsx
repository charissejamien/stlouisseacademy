"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  gradeLevels: { grade_level: string }[];
  onChange: (value: string) => void;
};

export default function GradeLevelSelect({ gradeLevels, onChange }: Props) {

    
  return (
    <div>
      <Select onValueChange={onChange} name="gradeLevel">
        <SelectTrigger className="w-full rounded-md w-50">
          <SelectValue placeholder="Select a grade level" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Grade Levels</SelectLabel>
            {gradeLevels.map((g) => (
              <SelectItem key={g.grade_level} value={g.grade_level}>
                {g.grade_level}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}