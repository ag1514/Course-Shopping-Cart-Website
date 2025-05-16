import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/server-auth"

export async function POST(request: NextRequest) {
  const session = await getServerSession()

  // Check if user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const API_URL = process.env.API_URL || "http://localhost:3000"
    const response = await fetch(`${API_URL}/api/cart/clear`, {
      method: "POST",
      headers: {
        Cookie: `sessionId=${session.token}`,
        Authorization: `Bearer ${session.token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to clear cart: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error clearing cart:", error)
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 })
  }
}
