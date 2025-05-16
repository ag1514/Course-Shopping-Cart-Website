import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { UserServiceClient } from "@/lib/service-clients"

export async function GET(request: NextRequest) {
  const session = await getSession()

  // Check if user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const cartItems = await UserServiceClient.getCartItems(session.token)
    return NextResponse.json(cartItems)
  } catch (error) {
    console.error("Error fetching cart items:", error)
    return NextResponse.json({ error: "Failed to fetch cart items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession()

  // Check if user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    const success = await UserServiceClient.addToCart(courseId, session.token)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}
