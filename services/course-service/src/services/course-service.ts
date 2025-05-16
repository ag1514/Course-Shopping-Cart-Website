import { MongoClient, ObjectId } from "mongodb"
import type { Course } from "../models/course"

export async function getAllCourses(): Promise<Course[]> {
  const mongoClient = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb+srv://22bcs107:mWocnmqhJQtCAzk2@cluster0.rdjhjyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  )

  try {
    await mongoClient.connect()
    const courses = await mongoClient.db("Courses").collection("CourseInfo").find().toArray()

    return courses.map((course) => ({
      id: course._id.toString(),
      title: course.title,
      details: course.details,
      category: course.category,
      available: course.available,
      price: course.price,
    }))
  } catch (error) {
    console.error("Error fetching courses:", error)
    return []
  } finally {
    await mongoClient.close()
  }
}

export async function getCourseById(id: string): Promise<Course | null> {
  const mongoClient = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb+srv://22bcs107:mWocnmqhJQtCAzk2@cluster0.rdjhjyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  )

  try {
    await mongoClient.connect()
    let objectId

    try {
      objectId = new ObjectId(id)
    } catch (error) {
      return null // Invalid ObjectId format
    }

    const course = await mongoClient.db("Courses").collection("CourseInfo").findOne({ _id: objectId })

    if (!course) {
      return null
    }

    return {
      id: course._id.toString(),
      title: course.title,
      details: course.details,
      category: course.category,
      available: course.available,
      price: course.price,
    }
  } catch (error) {
    console.error("Error fetching course:", error)
    return null
  } finally {
    await mongoClient.close()
  }
}

export async function createCourse(courseData: Omit<Course, "id">): Promise<Course | null> {
  const mongoClient = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb+srv://22bcs107:mWocnmqhJQtCAzk2@cluster0.rdjhjyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  )

  try {
    await mongoClient.connect()
    const result = await mongoClient.db("Courses").collection("CourseInfo").insertOne({
      title: courseData.title,
      details: courseData.details,
      category: courseData.category,
      available: courseData.available,
      price: courseData.price,
    })

    if (!result.insertedId) {
      return null
    }

    return {
      id: result.insertedId.toString(),
      ...courseData,
    }
  } catch (error) {
    console.error("Error creating course:", error)
    return null
  } finally {
    await mongoClient.close()
  }
}

export async function updateCourse(courseData: Course): Promise<Course | null> {
  const mongoClient = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb+srv://22bcs107:mWocnmqhJQtCAzk2@cluster0.rdjhjyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  )

  try {
    await mongoClient.connect()
    let objectId

    try {
      objectId = new ObjectId(courseData.id)
    } catch (error) {
      return null // Invalid ObjectId format
    }

    const { id, ...updateData } = courseData

    const result = await mongoClient
      .db("Courses")
      .collection("CourseInfo")
      .updateOne({ _id: objectId }, { $set: updateData })

    if (result.matchedCount === 0) {
      return null
    }

    return courseData
  } catch (error) {
    console.error("Error updating course:", error)
    return null
  } finally {
    await mongoClient.close()
  }
}

export async function deleteCourse(id: string): Promise<boolean> {
  const mongoClient = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb+srv://22bcs107:mWocnmqhJQtCAzk2@cluster0.rdjhjyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  )

  try {
    await mongoClient.connect()
    let objectId

    try {
      objectId = new ObjectId(id)
    } catch (error) {
      return false // Invalid ObjectId format
    }

    const result = await mongoClient.db("Courses").collection("CourseInfo").deleteOne({ _id: objectId })

    return result.deletedCount > 0
  } catch (error) {
    console.error("Error deleting course:", error)
    return false
  } finally {
    await mongoClient.close()
  }
}

export async function getCoursesByCategory(category: string): Promise<Course[]> {
  const mongoClient = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb+srv://22bcs107:mWocnmqhJQtCAzk2@cluster0.rdjhjyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  )

  try {
    await mongoClient.connect()
    const courses = await mongoClient.db("Courses").collection("CourseInfo").find({ category }).toArray()

    return courses.map((course) => ({
      id: course._id.toString(),
      title: course.title,
      details: course.details,
      category: course.category,
      available: course.available,
      price: course.price,
    }))
  } catch (error) {
    console.error("Error fetching courses by category:", error)
    return []
  } finally {
    await mongoClient.close()
  }
}

export async function getAllCategories(): Promise<string[]> {
  const mongoClient = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb+srv://22bcs107:mWocnmqhJQtCAzk2@cluster0.rdjhjyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  )

  try {
    await mongoClient.connect()
    const categories = await mongoClient.db("Courses").collection("CourseInfo").distinct("category")
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  } finally {
    await mongoClient.close()
  }
}
