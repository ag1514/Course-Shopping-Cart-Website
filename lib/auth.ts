// Client-side auth service
"use client"

import axios from "axios"

// API base URL - this should point to your API Gateway
// Make sure this matches your frontend's origin
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

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

// Configure axios defaults
axios.defaults.withCredentials = true

// Auth functions
export async function login(username: string, password: string): Promise<{ success: boolean; role?: UserRole }> {
  try {
    console.log(`Attempting to login with username: ${username}`)

    // Use XMLHttpRequest instead of axios for better error handling
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open("POST", "http://localhost:3001/api/auth/login", true)
      xhr.setRequestHeader("Content-Type", "application/json")
      xhr.withCredentials = true

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText)
            console.log("Login response:", data)

            // Store the role in sessionStorage for backup
            if (data.success && data.role) {
              sessionStorage.setItem("userRole", data.role)
            }

            resolve({
              success: data.success,
              role: data.role,
            })
          } catch (error) {
            console.error("Error parsing response:", error)
            resolve({ success: false })
          }
        } else {
          console.error("Login failed with status:", xhr.status)
          resolve({ success: false })
        }
      }

      xhr.onerror = () => {
        console.error("Network error during login")
        resolve({ success: false })
      }

      xhr.send(JSON.stringify({ username, password }))
    })
  } catch (error) {
    console.error("Login error:", error)
    return { success: false }
  }
}

export async function register(username: string, password: string, role: UserRole = "user"): Promise<boolean> {
  try {
    const response = await axios.post(
      `http://localhost:3001/api/auth/register`,
      { username, password, role },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    return response.data.success
  } catch (error) {
    console.error("Registration error:", error)
    return false
  }
}

export async function logout(): Promise<void> {
  try {
    // Clear sessionStorage
    sessionStorage.removeItem("userRole")

    await axios.post(
      `http://localhost:3001/api/auth/logout`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
    window.location.replace("/login")
  } catch (error) {
    console.error("Logout error:", error)
    window.location.replace("/login")
  }
}

export async function getSession(): Promise<Session | null> {
  try {
    // Use the hardcoded URL for session check
    const response = await axios.get(`http://localhost:3001/api/auth/session`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.data.success && response.data.user) {
      return {
        user: response.data.user,
        token: response.data.token || "",
      }
    }

    // Check sessionStorage as fallback
    const storedRole = sessionStorage.getItem("userRole")
    if (storedRole) {
      console.log("Using role from sessionStorage:", storedRole)
      return {
        user: {
          id: "session-fallback",
          username: "User",
          role: storedRole as UserRole,
        },
        token: "session-fallback",
      }
    }

    return null
  } catch (error) {
    console.error("Get session error:", error)

    // Check sessionStorage as fallback
    const storedRole = sessionStorage.getItem("userRole")
    if (storedRole) {
      console.log("Using role from sessionStorage after error:", storedRole)
      return {
        user: {
          id: "session-fallback",
          username: "User",
          role: storedRole as UserRole,
        },
        token: "session-fallback",
      }
    }

    return null
  }
}

export async function googleLogin(token: string): Promise<{ success: boolean; role?: UserRole }> {
  try {
    const response = await axios.post(
      `http://localhost:3001/api/auth/google`,
      { token },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    // Store the role in sessionStorage for backup
    if (response.data.success && response.data.role) {
      sessionStorage.setItem("userRole", response.data.role)
    }

    return {
      success: response.data.success,
      role: response.data.role,
    }
  } catch (error) {
    console.error("Google login error:", error)
    return { success: false }
  }
}

// Do NOT export sessions object
export const sessions: Record<string, Session> = {}
