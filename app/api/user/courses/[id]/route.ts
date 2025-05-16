import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getCourseById } from "@/lib/courses"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()

  // Check if user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Access course directly from the data source
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
