import ClassesList from "@/components/(portal)/classes/ClassesList"
import AddSection from "@/components/(portal)/classes/AddClass"

export default function ClassesPage() {
  return (
    <div className="w-[95%] mx-auto space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Classes
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage grade levels, sections, and class advisers.
          </p>
        </div>

        <AddSection />
      </div>

      <ClassesList />

    </div>
  )
}
