import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { createProxyMiddleware } from "http-proxy-middleware"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Service URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3001"
const COURSE_SERVICE_URL = process.env.COURSE_SERVICE_URL || "http://localhost:3002"
const CART_SERVICE_URL = process.env.CART_SERVICE_URL || "http://localhost:3003"

// CORS configuration - allow requests from both localhost:3000 and localhost:3004
const allowedOrigins = ["http://localhost:3000", "http://localhost:3004", process.env.FRONTEND_URL].filter(Boolean)

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true)

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        console.warn(`Origin ${origin} not allowed by CORS`)
        callback(null, true) // Allow all origins in development
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
)

app.use(express.json())
app.use(cookieParser())

// Handle preflight requests
app.options("*", cors())

// Proxy middleware for authentication service
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth": "/api/auth",
    },
    onProxyReq: (proxyReq, req, res) => {
      // Add CORS headers to proxied requests
      res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*")
      res.setHeader("Access-Control-Allow-Credentials", "true")
    },
  }),
)

// Proxy middleware for course service
app.use(
  "/api/courses",
  createProxyMiddleware({
    target: COURSE_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/courses": "/api/courses",
    },
    onProxyReq: (proxyReq, req, res) => {
      // Add CORS headers to proxied requests
      res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*")
      res.setHeader("Access-Control-Allow-Credentials", "true")
    },
  }),
)

// Proxy middleware for cart service
app.use(
  "/api/cart",
  createProxyMiddleware({
    target: CART_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/cart": "/api/cart",
    },
    onProxyReq: (proxyReq, req, res) => {
      // Add CORS headers to proxied requests
      res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*")
      res.setHeader("Access-Control-Allow-Credentials", "true")
    },
  }),
)

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "API Gateway is running" })
})

// Start server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`)
})
