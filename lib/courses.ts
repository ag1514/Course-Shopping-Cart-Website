import type { Course } from "@/types/course"

// API base URL - this should point to your API Gateway
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Get all courses
export async function getAllCourses(): Promise<Course[]> {
  try {
    // Use the API_URL environment variable instead of hardcoded URL
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const response = await fetch(`${API_URL}/api/courses`, {
      credentials: "include",
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching courses:", error)
    return []
  }
}

// Get course by ID
export async function getCourseById(id: string): Promise<Course | null> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const response = await fetch(`${API_URL}/api/courses/${id}`, {
      credentials: "include",
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch course: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching course:", error)
    return null
  }
}

// Create a new course (agent only)
export async function createCourse(courseData: Omit<Course, "id">): Promise<Course | null> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const response = await fetch(`${API_URL}/api/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to create course: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating course:", error)
    return null
  }
}

// Update a course (agent only)
export async function updateCourse(courseData: Course): Promise<Course | null> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const response = await fetch(`${API_URL}/api/courses/${courseData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to update course: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating course:", error)
    return null
  }
}

// Delete a course (agent only)
export async function deleteCourse(id: string): Promise<boolean> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const response = await fetch(`${API_URL}/api/courses/${id}`, {
      method: "DELETE",
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to delete course: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error("Error deleting course:", error)
    return false
  }
}

// Get courses by category
export async function getCoursesByCategory(category: string): Promise<Course[]> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const response = await fetch(`${API_URL}/api/courses?category=${category}`, {
      credentials: "include",
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch courses by category: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching courses by category:", error)
    return []
  }
}

// Get all categories
export async function getAllCategories(): Promise<string[]> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const response = await fetch(`${API_URL}/api/courses/categories/all`, {
      credentials: "include",
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}
