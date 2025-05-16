"use server"

import { cookies } from "next/headers"
import { sessions } from "./auth"
import axios from "axios"

export async function getSession() {
  try {
    const sessionId = cookies().get("sessionId")?.value
    if (!sessionId) {
      return null
    }

    // Try to get session from auth service
    try {
      const response = await axios.get(`http://localhost:3001/api/auth/verify`, {
        headers: {
          Authorization: `Bearer ${sessionId}`,
          Cookie: `sessionId=${sessionId}`,
        },
      })

      if (response.data.success && response.data.user) {
        return {
          user: response.data.user,
          token: sessionId,
        }
      }
    } catch (error) {
      console.error("Error verifying session with auth service:", error)
    }

    // Fallback to local sessions
    return sessions[sessionId] || null
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function setSession(sessionId: string, data: any) {
  try {
    sessions[sessionId] = data
  } catch (error) {
    console.error("Error setting session:", error)
  }
}
