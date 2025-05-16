import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/server-auth"

export async function GET(request: NextRequest) {
  const session = await getServerSession()

  // Check if user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const API_URL = process.env.API_URL || "http://localhost:3000"
    const response = await fetch(`${API_URL}/api/cart`, {
      headers: {
        Cookie: `sessionId=${session.token}`,
        Authorization: `Bearer ${session.token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch cart items: ${response.status}`)
    }

    const cartItems = await response.json()
    return NextResponse.json(cartItems)
  } catch (error) {
    console.error("Error fetching cart items:", error)
    return NextResponse.json({ error: "Failed to fetch cart items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession()

  // Check if user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    const API_URL = process.env.API_URL || "http://localhost:3000"
    const response = await fetch(`${API_URL}/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `sessionId=${session.token}`,
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({ courseId }),
    })

    if (!response.ok) {
      throw new Error(`Failed to add to cart: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}
