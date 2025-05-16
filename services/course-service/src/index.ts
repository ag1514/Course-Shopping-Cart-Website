import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import courseRoutes from "./api/course-routes"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

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

// Routes
app.use("/api/courses", courseRoutes)

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Course service is running" })
})

// Start server
app.listen(PORT, () => {
  console.log(`Course service running on port ${PORT}`)
})
