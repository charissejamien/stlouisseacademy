import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function GradesInput() {
  return (
    <div>
      <h1 className="text-center">CLASS SUMMARY </h1>

      <section className="uppercase">
        <div className="flex justify-between">
          <div className="flex">
            <Label>Region</Label>
            <Input />
          </div>
          <div className="flex">
            <Label>Division</Label>
            <Input />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex">
            <Label>School Name</Label>
            <Input />
          </div>
          <div className="flex">
            <Label>School ID</Label>
            <Input />
          </div>
          <div className="flex">
            <Label>School Year</Label>
            <Input />
          </div>
        </div>
      </section>
    </div>
  );
}
