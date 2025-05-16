import { type NextRequest, NextResponse } from "next/server"
import { googleLogin } from "@/lib/auth"

// This is a simplified Google OAuth implementation for demonstration
// In a real app, you would use a library like next-auth

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    // In a real implementation, you would verify the token with Google
    // Here we're simulating by extracting the profile from the token
    // This is NOT secure and is just for demonstration

    // Decode the mock token (in a real app, you'd verify with Google)
    const profile = JSON.parse(atob(token.split(".")[1]))

    const result = await googleLogin({
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        role: result.role,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to authenticate with Google",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("Google auth error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Authentication failed",
      },
      { status: 500 },
    )
  }
}
