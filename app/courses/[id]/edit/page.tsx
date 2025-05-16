import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/server-auth"
import { getCourseById } from "@/lib/courses"
import CourseForm from "@/components/course-form"

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const session = await requireAuth()

  const course = await getCourseById(params.id)

  if (!course) {
    redirect("/courses")
  }

  return (
    <div className="container py-8 mx-auto">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Edit Course</h1>
        <CourseForm course={course} />
      </div>
    </div>
  )
}
