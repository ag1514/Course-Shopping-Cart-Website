import { redirect } from "next/navigation"
import { requireAgentRole } from "@/lib/server-auth"
import { getCourseById } from "@/lib/courses"
import AgentCourseForm from "@/components/agent-course-form"

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const session = await requireAgentRole()

  // Access course directly to avoid circular API calls
  const course = await getCourseById(params.id)

  if (!course) {
    redirect("/agent/courses")
  }

  return (
    <div className="container py-8 mx-auto">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Edit Course</h1>
        <AgentCourseForm course={course} />
      </div>
    </div>
  )
}
