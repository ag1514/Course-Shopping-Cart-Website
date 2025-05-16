import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getAllCourses } from "@/lib/courses"

export async function GET(request: NextRequest) {
  const session = await getSession()

  // Check if user is authenticated
  if (!session?.user) {
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
