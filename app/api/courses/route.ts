import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/server-auth"

export async function GET(request: NextRequest) {
  const session = await getServerSession()

  // Check if user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const API_URL = process.env.API_URL || "http://localhost:3000"
    const response = await fetch(`${API_URL}/api/courses`, {
      headers: {
        Cookie: `sessionId=${session.token}`,
        Authorization: `Bearer ${session.token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`)
    }

    const courses = await response.json()
    return NextResponse.json(courses)
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession()

  // Check if user is authenticated and has agent role
  if (!session?.user || session.user.role !== "agent") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const courseData = await request.json()

    const API_URL = process.env.API_URL || "http://localhost:3000"
    const response = await fetch(`${API_URL}/api/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `sessionId=${session.token}`,
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify(courseData),
    })

    if (!response.ok) {
      throw new Error(`Failed to create course: ${response.status}`)
    }

    const newCourse = await response.json()
    return NextResponse.json(newCourse, { status: 201 })
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
  }
}
