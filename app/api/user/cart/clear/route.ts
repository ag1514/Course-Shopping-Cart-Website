import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { UserServiceClient } from "@/lib/service-clients"

export async function POST(request: NextRequest) {
  const session = await getSession()

  // Check if user is authenticated
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const success = await UserServiceClient.clearCart(session.token)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error clearing cart:", error)
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 })
  }
}
