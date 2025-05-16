import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getCourseById, updateCourse, deleteCourse } from "@/lib/courses"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()

  // Check if user is authenticated and has agent role
  if (!session?.user || session.user.role !== "agent") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const course = await getCourseById(params.id)

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()

  // Check if user is authenticated and has agent role
  if (!session?.user || session.user.role !== "agent") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const courseData = await request.json()
    courseData.id = params.id

    const course = await getCourseById(params.id)

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const updatedCourse = await updateCourse(courseData)
    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.error("Error updating course:", error)
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()

  // Check if user is authenticated and has agent role
  if (!session?.user || session.user.role !== "agent") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const course = await getCourseById(params.id)

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    await deleteCourse(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting course:", error)
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}
