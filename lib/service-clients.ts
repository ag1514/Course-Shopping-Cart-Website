import type { Course } from "@/types/course"
import {
  getAllCourses as getCoursesFromDB,
  getCourseById as getCourseByIdFromDB,
  createCourse as createCourseInDB,
  updateCourse as updateCourseInDB,
  deleteCourse as deleteCourseInDB,
} from "@/lib/courses"
import {
  addToCart as addToCartInDB,
  removeFromCart as removeFromCartInDB,
  updateCartItemQuantity as updateCartItemQuantityInDB,
  clearCart as clearCartInDB,
  getCartItems as getCartItemsFromDB,
  getCartCount as getCartCountFromDB,
} from "@/lib/cart"

// Agent Service Client
export const AgentServiceClient = {
  // Course CRUD operations
  async getAllCourses(): Promise<Course[]> {
    // In a monolithic app, access the data directly
    return getCoursesFromDB()
  },

  async getCourseById(id: string): Promise<Course | null> {
    // In a monolithic app, access the data directly
    const course = await getCourseByIdFromDB(id)
    return course || null
  },

  async createCourse(courseData: Omit<Course, "id">): Promise<Course> {
    // In a monolithic app, access the data directly
    return createCourseInDB(courseData)
  },

  async updateCourse(courseData: Course): Promise<Course> {
    // In a monolithic app, access the data directly
    return updateCourseInDB(courseData)
  },

  async deleteCourse(id: string): Promise<void> {
    // In a monolithic app, access the data directly
    return deleteCourseInDB(id)
  },
}

// User Service Client
export const UserServiceClient = {
  // Course viewing operations
  async getAllCourses(): Promise<Course[]> {
    // In a monolithic app, access the data directly
    return getCoursesFromDB()
  },

  async getCourseById(id: string): Promise<Course | null> {
    // In a monolithic app, access the data directly
    const course = await getCourseByIdFromDB(id)
    return course || null
  },

  // Cart operations
  async addToCart(courseId: string, sessionId: string): Promise<boolean> {
    // In a monolithic app, access the data directly
    return addToCartInDB(courseId)
  },

  async getCartItems(sessionId: string): Promise<any[]> {
    // In a monolithic app, access the data directly
    return getCartItemsFromDB()
  },

  async removeFromCart(courseId: string, sessionId: string): Promise<boolean> {
    // In a monolithic app, access the data directly
    return removeFromCartInDB(courseId)
  },

  async updateCartItemQuantity(courseId: string, quantity: number, sessionId: string): Promise<boolean> {
    // In a monolithic app, access the data directly
    return updateCartItemQuantityInDB(courseId, quantity)
  },

  async clearCart(sessionId: string): Promise<boolean> {
    // In a monolithic app, access the data directly
    return clearCartInDB()
  },

  async getCartCount(sessionId: string): Promise<number> {
    // In a monolithic app, access the data directly
    return getCartCountFromDB()
  },
}
