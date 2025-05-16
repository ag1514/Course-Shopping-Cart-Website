import express from "express"
import {
  getCartItems,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  getCartCount,
} from "../services/cart-service"
import { verifyAuth } from "../middleware/auth-middleware"
import axios from "axios"

const router = express.Router()

// Get cart items with course details
router.get("/", verifyAuth(), async (req, res) => {
  try {
    const userId = req.user.id
    const cartItems = await getCartItems(userId)

    // Get course details for each cart item
    const courseServiceUrl = process.env.COURSE_SERVICE_URL || "http://localhost:3002"
    const cartItemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {
        try {
          const courseResponse = await axios.get(`${courseServiceUrl}/api/courses/${item.courseId}`)
          return {
            courseId: item.courseId,
            quantity: item.quantity,
            course: courseResponse.data,
          }
        } catch (error) {
          console.error(`Error fetching course ${item.courseId}:`, error)
          return {
            courseId: item.courseId,
            quantity: item.quantity,
            course: null,
          }
        }
      }),
    )

    // Filter out items where course couldn't be found
    const validCartItems = cartItemsWithDetails.filter((item) => item.course !== null)

    return res.json(validCartItems)
  } catch (error) {
    console.error("Error fetching cart items:", error)
    return res.status(500).json({ error: "Failed to fetch cart items" })
  }
})

// Add item to cart
router.post("/", verifyAuth(), async (req, res) => {
  try {
    const userId = req.user.id
    const { courseId } = req.body

    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required" })
    }

    // Verify that the course exists
    const courseServiceUrl = process.env.COURSE_SERVICE_URL || "http://localhost:3002"
    try {
      await axios.get(`${courseServiceUrl}/api/courses/${courseId}`)
    } catch (error) {
      return res.status(404).json({ error: "Course not found" })
    }

    const success = await addToCart(userId, courseId)

    if (success) {
      return res.json({ success: true })
    } else {
      return res.status(500).json({ error: "Failed to add to cart" })
    }
  } catch (error) {
    console.error("Error adding to cart:", error)
    return res.status(500).json({ error: "Failed to add to cart" })
  }
})

// Remove item from cart
router.delete("/:courseId", verifyAuth(), async (req, res) => {
  try {
    const userId = req.user.id
    const courseId = req.params.courseId

    const success = await removeFromCart(userId, courseId)

    if (success) {
      return res.json({ success: true })
    } else {
      return res.status(500).json({ error: "Failed to remove from cart" })
    }
  } catch (error) {
    console.error("Error removing from cart:", error)
    return res.status(500).json({ error: "Failed to remove from cart" })
  }
})

// Update item quantity
router.put("/:courseId", verifyAuth(), async (req, res) => {
  try {
    const userId = req.user.id
    const courseId = req.params.courseId
    const { quantity } = req.body

    if (quantity === undefined) {
      return res.status(400).json({ error: "Quantity is required" })
    }

    const success = await updateCartItemQuantity(userId, courseId, quantity)

    if (success) {
      return res.json({ success: true })
    } else {
      return res.status(500).json({ error: "Failed to update cart" })
    }
  } catch (error) {
    console.error("Error updating cart:", error)
    return res.status(500).json({ error: "Failed to update cart" })
  }
})

// Clear cart
router.post("/clear", verifyAuth(), async (req, res) => {
  try {
    const userId = req.user.id

    const success = await clearCart(userId)

    if (success) {
      return res.json({ success: true })
    } else {
      return res.status(500).json({ error: "Failed to clear cart" })
    }
  } catch (error) {
    console.error("Error clearing cart:", error)
    return res.status(500).json({ error: "Failed to clear cart" })
  }
})

// Get cart count
router.get("/count", verifyAuth(), async (req, res) => {
  try {
    const userId = req.user.id

    const count = await getCartCount(userId)
    return res.json({ count })
  } catch (error) {
    console.error("Error fetching cart count:", error)
    return res.status(500).json({ error: "Failed to fetch cart count" })
  }
})

export default router
