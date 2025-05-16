import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/server-auth"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession()

  // Check if user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const API_URL = process.env.API_URL || "http://localhost:3000"
    const response = await fetch(`${API_URL}/api/cart/${params.id}`, {
      method: "DELETE",
      headers: {
        Cookie: `sessionId=${session.token}`,
        Authorization: `Bearer ${session.token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to remove from cart: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession()

  // Check if user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { quantity } = await request.json()

    if (quantity === undefined) {
      return NextResponse.json({ error: "Quantity is required" }, { status: 400 })
    }

    const API_URL = process.env.API_URL || "http://localhost:3000"
    const response = await fetch(`${API_URL}/api/cart/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `sessionId=${session.token}`,
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({ quantity }),
    })

    if (!response.ok) {
      throw new Error(`Failed to update cart: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}
