import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/server-auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession()

  // Check if user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const API_URL = process.env.API_URL || "http://localhost:3000"
    const response = await fetch(`${API_URL}/api/courses/${params.id}`, {
      headers: {
        Cookie: `sessionId=${session.token}`,
        Authorization: `Bearer ${session.token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 })
      }
      throw new Error(`Failed to fetch course: ${response.status}`)
    }

    const course = await response.json()
    return NextResponse.json(course)
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession()

  // Check if user is authenticated and has agent role
  if (!session?.user || session.user.role !== "agent") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const courseData = await request.json()

    const API_URL = process.env.API_URL || "http://localhost:3000"
    const response = await fetch(`${API_URL}/api/courses/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `sessionId=${session.token}`,
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify(courseData),
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 })
      }
      throw new Error(`Failed to update course: ${response.status}`)
    }

    const updatedCourse = await response.json()
    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.error("Error updating course:", error)
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession()

  // Check if user is authenticated and has agent role
  if (!session?.user || session.user.role !== "agent") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const API_URL = process.env.API_URL || "http://localhost:3000"
    const response = await fetch(`${API_URL}/api/courses/${params.id}`, {
      method: "DELETE",
      headers: {
        Cookie: `sessionId=${session.token}`,
        Authorization: `Bearer ${session.token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 })
      }
      throw new Error(`Failed to delete course: ${response.status}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting course:", error)
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}
