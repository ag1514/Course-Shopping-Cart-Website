"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Types
export type UserRole = "user" | "agent"

export interface User {
  id: string
  username: string
  role: UserRole
}

export interface Session {
  user: User
  token: string
}

// API base URL - this should point to your API Gateway
const API_URL = process.env.API_URL || "http://localhost:3000"

export async function getServerSession(): Promise<Session | null> {
  try {
    const sessionId = cookies().get("sessionId")?.value

    if (!sessionId) {
      return null
    }

    const response = await fetch(`${API_URL}/api/auth/verify`, {
      headers: {
        Authorization: `Bearer ${sessionId}`,
        Cookie: `sessionId=${sessionId}`,
      },
      cache: "no-store",
    })

    const data = await response.json()

    if (data.success && data.user) {
      return {
        user: data.user,
        token: sessionId,
      }
    }

    return null
  } catch (error) {
    console.error("Get server session error:", error)
    return null
  }
}

export async function requireAuth(redirectTo = "/login") {
  const session = await getServerSession()

  if (!session?.user) {
    redirect(redirectTo)
  }

  return session
}

export async function requireAgentRole(redirectTo = "/courses") {
  const session = await requireAuth()

  if (session.user.role !== "agent") {
    redirect(redirectTo)
  }

  return session
}
