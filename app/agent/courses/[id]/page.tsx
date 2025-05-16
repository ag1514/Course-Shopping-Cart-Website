import { redirect } from "next/navigation"
import { requireAgentRole } from "@/lib/server-auth"
import { getCourseById } from "@/lib/courses"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import AgentDeleteCourseButton from "@/components/agent-delete-course-button"

export default async function AgentCourseDetailsPage({ params }: { params: { id: string } }) {
  const session = await requireAgentRole()

  // Access course directly to avoid circular API calls
  const course = await getCourseById(params.id)

  if (!course) {
    redirect("/agent/courses")
  }

  return (
    <div className="container py-8 mx-auto">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/agent/courses">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
              <div className="flex items-center mt-2 space-x-2">
                <Badge>{course.category}</Badge>
                <Badge variant={course.available ? "success" : "destructive"}>
                  {course.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-primary">${course.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Link href={`/agent/courses/${params.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <AgentDeleteCourseButton id={params.id} />
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="mb-4 text-xl font-semibold">Course Details</h2>
            <p className="whitespace-pre-wrap">{course.details}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
