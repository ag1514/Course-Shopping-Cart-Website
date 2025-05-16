import { type NextRequest, NextResponse } from "next/server"
import { getAllCourses } from "@/lib/courses"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const courses = await getAllCourses()
  return NextResponse.json(courses)
}
