import { requireAuth } from "@/lib/server-auth"
import { getAllCourses } from "@/lib/courses"
import { CategoryFilter } from "@/components/category-filter"
import UserCourseList from "@/components/user-course-list"

export default async function CoursesPage() {
  const session = await requireAuth()

  // Access courses directly to avoid circular API calls
  const courses = await getAllCourses()
  const categories = [...new Set(courses.map((course) => course.category))]

  return (
    <div className="container py-8 mx-auto">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse Courses</h1>
          <p className="text-muted-foreground">Find and add courses to your cart</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[250px_1fr]">
          <div className="p-4 border rounded-lg">
            <h2 className="mb-4 text-lg font-semibold">Filters</h2>
            <CategoryFilter categories={categories} />
          </div>

          <div>
            <UserCourseList courses={courses} />
          </div>
        </div>
      </div>
    </div>
  )
}
