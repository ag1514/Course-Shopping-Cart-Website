import type { Request, Response, NextFunction } from "express"
import axios from "axios"

// Extend the Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

// Verify authentication middleware
export const verifyAuth = (allowedRoles?: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get token from cookie or Authorization header
      const token = req.cookies.sessionId || req.headers.authorization?.split(" ")[1]

      if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      // Verify token with Auth service
      const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:3001"
      const response = await axios.get(`${authServiceUrl}/api/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.data.success || !response.data.user) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      // Check if user has required role
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(response.data.user.role)) {
          return res.status(403).json({ error: "Forbidden" })
        }
      }

      // Attach user to request
      req.user = response.data.user
      next()
    } catch (error) {
      console.error("Auth verification error:", error)
      return res.status(401).json({ error: "Unauthorized" })
    }
  }
}
