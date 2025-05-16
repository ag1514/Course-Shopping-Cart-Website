import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { UserServiceClient } from "@/lib/service-clients"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()

  // Check if user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const success = await UserServiceClient.removeFromCart(params.id, session.token)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()

  // Check if user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { quantity } = await request.json()

    if (quantity === undefined) {
      return NextResponse.json({ error: "Quantity is required" }, { status: 400 })
    }

    const success = await UserServiceClient.updateCartItemQuantity(params.id, quantity, session.token)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}
