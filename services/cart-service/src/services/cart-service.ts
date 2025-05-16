import { MongoClient } from "mongodb"
import type { Cart, CartItem } from "../models/cart"

export async function getCart(userId: string): Promise<Cart | null> {
  const mongoClient = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb+srv://22bcs107:mWocnmqhJQtCAzk2@cluster0.rdjhjyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  )

  try {
    await mongoClient.connect()
    const cart = await mongoClient.db("Carts").collection("CartInfo").findOne({ userId }) as unknown as Cart 

    if (!cart) {
      // Create a new cart if it doesn't exist
      const newCart: Cart = {
        userId,
        items: [],
      }

      await mongoClient.db("Carts").collection("CartInfo").insertOne(newCart)
      return newCart
    }

    console.log(cart)

    return cart as Cart
  } catch (error) {
    console.error("Error fetching cart:", error)
    return null
  } finally {
    await mongoClient.close()
  }
}

export async function addToCart(userId: string, courseId: string): Promise<boolean> {
  const mongoClient = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb+srv://22bcs107:mWocnmqhJQtCAzk2@cluster0.rdjhjyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  )

  try {
    await mongoClient.connect()

    // Get the cart or create if it doesn't exist
    let cart = await getCart(userId)

    if (!cart) {
      cart = {
        userId,
        items: [],
      }
    }

    // Check if the course is already in the cart
    const existingItemIndex = cart.items.findIndex((item) => item.courseId === courseId)

    if (existingItemIndex >= 0) {
      // Increment quantity if already in cart
      cart.items[existingItemIndex].quantity += 1
    } else {
      // Add new item to cart
      cart.items.push({
        courseId,
        quantity: 1,
      })
    }

    // Update the cart in the database
    const result = await mongoClient
      .db("Carts")
      .collection("CartInfo")
      .updateOne({ userId }, { $set: { items: cart.items } }, { upsert: true })

    return result.acknowledged
  } catch (error) {
    console.error("Error adding to cart:", error)
    return false
  } finally {
    await mongoClient.close()
  }
}

export async function removeFromCart(userId: string, courseId: string): Promise<boolean> {
  const mongoClient = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb+srv://22bcs107:mWocnmqhJQtCAzk2@cluster0.rdjhjyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  )

  try {
    await mongoClient.connect()

    // Get the cart
    const cart = await getCart(userId)

    if (!cart) {
      return false
    }

    // Filter out the course from the cart
    const updatedItems = cart.items.filter((item) => item.courseId !== courseId)

    // Update the cart in the database
    const result = await mongoClient
      .db("Carts")
      .collection("CartInfo")
      .updateOne({ userId }, { $set: { items: updatedItems } })

    return result.acknowledged
  } catch (error) {
    console.error("Error removing from cart:", error)
    return false
  } finally {
    await mongoClient.close()
  }
}

export async function updateCartItemQuantity(userId: string, courseId: string, quantity: number): Promise<boolean> {
  const mongoClient = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb+srv://22bcs107:mWocnmqhJQtCAzk2@cluster0.rdjhjyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  )

  try {
    await mongoClient.connect()

    // Get the cart
    const cart = await getCart(userId)

    if (!cart) {
      return false
    }

    // Find the cart item
    const itemIndex = cart.items.findIndex((item) => item.courseId === courseId)

    if (itemIndex === -1) {
      return false
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      return removeFromCart(userId, courseId)
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity

    // Update the cart in the database
    const result = await mongoClient
      .db("Carts")
      .collection("CartInfo")
      .updateOne({ userId }, { $set: { items: cart.items } })

    return result.acknowledged
  } catch (error) {
    console.error("Error updating cart item quantity:", error)
    return false
  } finally {
    await mongoClient.close()
  }
}

export async function clearCart(userId: string): Promise<boolean> {
  const mongoClient = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb+srv://22bcs107:mWocnmqhJQtCAzk2@cluster0.rdjhjyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  )

  try {
    await mongoClient.connect()

    // Update the cart in the database
    const result = await mongoClient
      .db("Carts")
      .collection("CartInfo")
      .updateOne({ userId }, { $set: { items: [] } })

    return result.acknowledged
  } catch (error) {
    console.error("Error clearing cart:", error)
    return false
  } finally {
    await mongoClient.close()
  }
}

export async function getCartCount(userId: string): Promise<number> {
  const mongoClient = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb+srv://22bcs107:mWocnmqhJQtCAzk2@cluster0.rdjhjyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  )

  try {
    await mongoClient.connect()

    // Get the cart
    const cart = await getCart(userId)

    if (!cart) {
      return 0
    }

    // Calculate total items
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  } catch (error) {
    console.error("Error getting cart count:", error)
    return 0
  } finally {
    await mongoClient.close()
  }
}

export async function getCartItems(userId: string): Promise<CartItem[]> {
  const mongoClient = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb+srv://22bcs107:mWocnmqhJQtCAzk2@cluster0.rdjhjyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  )

  try {
    await mongoClient.connect()

    // Get the cart
    const cart = await getCart(userId)

    if (!cart) {
      return []
    }

    return cart.items
  } catch (error) {
    console.error("Error getting cart items:", error)
    return []
  } finally {
    await mongoClient.close()
  }
}
