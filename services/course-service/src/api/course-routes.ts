import express from "express"
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByCategory,
  getAllCategories,
} from "../services/course-service"
import { verifyAuth } from "../middleware/auth-middleware"

const router = express.Router()

// Get all courses
router.get("/", async (req, res) => {
  try {
    const category = req.query.category as string

    if (category) {
      const courses = await getCoursesByCategory(category)
      return res.json(courses)
    } else {
      const courses = await getAllCourses()
      return res.json(courses)
    }
  } catch (error) {
    console.error("Error fetching courses:", error)
    return res.status(500).json({ error: "Failed to fetch courses" })
  }
})

// Get course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await getCourseById(req.params.id)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    return res.json(course)
  } catch (error) {
    console.error("Error fetching course:", error)
    return res.status(500).json({ error: "Failed to fetch course" })
  }
})

// Create a new course (agent only)
router.post("/", verifyAuth(["agent"]), async (req, res) => {
  try {
    const { title, details, category, available, price } = req.body

    if (!title || !details || !category || price === undefined) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const courseData = {
      title,
      details,
      category,
      available: available !== undefined ? available : true,
      price: Number(price),
    }

    const newCourse = await createCourse(courseData)

    if (!newCourse) {
      return res.status(500).json({ error: "Failed to create course" })
    }

    return res.status(201).json(newCourse)
  } catch (error) {
    console.error("Error creating course:", error)
    return res.status(500).json({ error: "Failed to create course" })
  }
})

// Update a course (agent only)
router.put("/:id", verifyAuth(["agent"]), async (req, res) => {
  try {
    const { title, details, category, available, price } = req.body

    if (!title || !details || !category || price === undefined) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const courseData = {
      id: req.params.id,
      title,
      details,
      category,
      available: available !== undefined ? available : true,
      price: Number(price),
    }

    const updatedCourse = await updateCourse(courseData)

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" })
    }

    return res.json(updatedCourse)
  } catch (error) {
    console.error("Error updating course:", error)
    return res.status(500).json({ error: "Failed to update course" })
  }
})

// Delete a course (agent only)
router.delete("/:id", verifyAuth(["agent"]), async (req, res) => {
  try {
    const success = await deleteCourse(req.params.id)

    if (!success) {
      return res.status(404).json({ error: "Course not found" })
    }

    return res.json({ success: true })
  } catch (error) {
    console.error("Error deleting course:", error)
    return res.status(500).json({ error: "Failed to delete course" })
  }
})

// Get all categories
router.get("/categories/all", async (req, res) => {
  try {
    const categories = await getAllCategories()
    return res.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return res.status(500).json({ error: "Failed to fetch categories" })
  }
})

export default router
