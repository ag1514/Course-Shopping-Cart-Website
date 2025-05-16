// Update the cart functions to use fetch instead of axios for server compatibility
// API base URL - this should point to your API Gateway
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Get cart items
export async function getCartItems(): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}/api/cart`, {
      credentials: "include",
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch cart items: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching cart items:", error)
    return []
  }
}

// Add to cart
export async function addToCart(courseId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseId }),
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to add to cart: ${response.status}`)
    }

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("Error adding to cart:", error)
    return false
  }
}

// Remove from cart
export async function removeFromCart(courseId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/cart/${courseId}`, {
      method: "DELETE",
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to remove from cart: ${response.status}`)
    }

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("Error removing from cart:", error)
    return false
  }
}

// Update cart item quantity
export async function updateCartItemQuantity(courseId: string, quantity: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/cart/${courseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to update cart item quantity: ${response.status}`)
    }

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("Error updating cart item quantity:", error)
    return false
  }
}

// Clear cart
export async function clearCart(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/cart/clear`, {
      method: "POST",
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to clear cart: ${response.status}`)
    }

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("Error clearing cart:", error)
    return false
  }
}

// Get cart count
export async function getCartCount(): Promise<number> {
  try {
    const response = await fetch(`${API_URL}/api/cart/count`, {
      credentials: "include",
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch cart count: ${response.status}`)
    }

    const data = await response.json()
    return data.count
  } catch (error) {
    console.error("Error fetching cart count:", error)
    return 0
  }
}
