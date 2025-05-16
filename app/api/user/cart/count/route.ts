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
    const count = await UserServiceClient.getCartCount(session.token)
    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error fetching cart count:", error)
    return NextResponse.json({ error: "Failed to fetch cart count" }, { status: 500 })
  }
}
