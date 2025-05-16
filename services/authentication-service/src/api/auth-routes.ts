import express from "express"
import { login, register, logout, googleLogin, verifyToken } from "../services/auth-service"

const router = express.Router()

// Login endpoint
router.post("/login", async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required" })
  }

  try {
    const result = await login(username, password)

    if (result.success) {
      // Set cookie in response
      res.cookie("sessionId", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        path: "/",
        sameSite: "lax", // Changed from strict to lax for cross-site requests
      })

      return res.json({ success: true, role: result.role })
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
})

// Register endpoint
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required" })
  }

  try {
    const success = await register(username, password, role || "user")

    if (success) {
      return res.status(201).json({ success: true })
    } else {
      return res.status(409).json({ success: false, message: "Username already exists" })
    }
  } catch (error) {
    console.error("Registration error:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
})

// Google login endpoint
router.post("/google", async (req, res) => {
  const { token } = req.body

  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required" })
  }

  try {
    // In a real implementation, you would verify the token with Google
    // Here we're simulating by extracting the profile from the token
    let profile

    try {
      // Try to parse the token as a JWT
      profile = JSON.parse(atob(token.split(".")[1]))
    } catch (error) {
      // If that fails, assume the token is the profile data directly
      console.log("Failed to parse token as JWT, using as profile directly")
      profile = token
    }

    // Ensure we have the required fields
    if (!profile.email) {
      return res.status(400).json({ success: false, message: "Invalid token format" })
    }

    const result = await googleLogin({
      email: profile.email,
      name: profile.name || profile.email.split("@")[0],
      picture: profile.picture,
    })

    if (result.success) {
      // Set cookie in response
      res.cookie("sessionId", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        path: "/",
        sameSite: "lax", // Changed from strict to lax for cross-site requests
      })

      return res.json({ success: true, role: result.role })
    } else {
      return res.status(401).json({ success: false, message: "Failed to authenticate with Google" })
    }
  } catch (error) {
    console.error("Google login error:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
})

// Logout endpoint
router.post("/logout", (req, res) => {
  const token = req.cookies.sessionId

  if (token) {
    logout(token)
    res.clearCookie("sessionId")
  }

  return res.json({ success: true })
})

// Verify token endpoint
router.get("/verify", async (req, res) => {
  const token = req.cookies.sessionId || req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" })
  }

  try {
    const user = await verifyToken(token)

    if (user) {
      return res.json({ success: true, user })
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" })
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
})

// Get session endpoint
router.get("/session", async (req, res) => {
  const token = req.cookies.sessionId || req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" })
  }

  try {
    const user = await verifyToken(token)

    if (user) {
      return res.json({ success: true, user })
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" })
    }
  } catch (error) {
    console.error("Session error:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
})

export default router
