import { requireAuth } from "@/lib/server-auth"
import CourseForm from "@/components/course-form"

export default async function NewCoursePage() {
  const session = await requireAuth()

  return (
    <div className="container py-8 mx-auto">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Add New Course</h1>
        <CourseForm />
      </div>
    </div>
  )
}
