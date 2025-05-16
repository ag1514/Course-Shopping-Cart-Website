import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getAllCourses, createCourse } from "@/lib/courses"

export async function GET(request: NextRequest) {
  const session = await getSession()

  // Check if user is authenticated and has agent role
  if (!session?.user || session.user.role !== "agent") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Access courses directly from the data source
    const courses = await getAllCourses()
    return NextResponse.json(courses)
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession()

  // Check if user is authenticated and has agent role
  if (!session?.user || session.user.role !== "agent") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const courseData = await request.json()
    const newCourse = await createCourse(courseData)
    return NextResponse.json(newCourse, { status: 201 })
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
  }
}
