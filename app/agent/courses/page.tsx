import { requireAgentRole } from "@/lib/server-auth"
import { getAllCourses } from "@/lib/courses"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import AgentCourseList from "@/components/agent-course-list"

export default async function AgentCoursesPage() {
  const session = await requireAgentRole()

  // Access courses directly to avoid circular API calls
  const courses = await getAllCourses()

  return (
    <div className="container py-8 mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
            <p className="text-muted-foreground">Manage your course catalog (Agent View)</p>
          </div>
          <Link href="/agent/courses/new">
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </Link>
        </div>

        <AgentCourseList courses={courses} />
      </div>
    </div>
  )
}
