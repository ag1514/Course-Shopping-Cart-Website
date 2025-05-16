import { type NextRequest, NextResponse } from "next/server"
import { getCourseById, createCourse, updateCourse, deleteCourse } from "@/lib/courses"
import { getSession } from "@/lib/session"
import type { Course } from "@/types/course"

export async function GET(request: NextRequest) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = request.nextUrl.searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
  }

  const course = await getCourseById(id)

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 })
  }

  return NextResponse.json(course)
}

export async function POST(request: NextRequest) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const courseData = (await request.json()) as Omit<Course, "id">

    if (!courseData.title || !courseData.details || !courseData.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newCourse = await createCourse(courseData)
    return NextResponse.json(newCourse, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const courseData = (await request.json()) as Course

    if (!courseData.id || !courseData.title || !courseData.details || !courseData.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const course = await getCourseById(courseData.id)

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const updatedCourse = await updateCourse(courseData)
    return NextResponse.json(updatedCourse)
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = request.nextUrl.searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
  }

  const course = await getCourseById(id)

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 })
  }

  await deleteCourse(id)
  return NextResponse.json({ success: true })
}
