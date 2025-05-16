import { MongoClient } from "mongodb"
import { v4 as uuidv4 } from "uuid"
import type { User, UserRole, Session } from "../models/user"

// In-memory session store - making it global to persist between requests
const sessions: Record<string, Session> = {}

export async function login(
  username: string,
  password: string,
): Promise<{ success: boolean; role?: UserRole; token?: string }> {
  //Pull data from MongoDB
  const mongoClient = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb+srv://22bcs107:mWocnmqhJQtCAzk2@cluster0.rdjhjyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  )

  try {
    await mongoClient.connect()
    const mongoData = await mongoClient.db("Users").collection("UserInfo").find({ username: username }).toArray()

    console.log("MongoData: ", mongoData)

    //Check if user exists and password matches using mongoDB
    if (mongoData.length > 0) {
      if (mongoData[0].password !== password) return { success: false }
    } else return { success: false }

    // Create a session ID
    const sessionId = uuidv4()

    // Store session data
    sessions[sessionId] = {
      user: {
        id: username,
        username: mongoData[0].username,
        role: mongoData[0].role,
      },
      token: sessionId,
      cart: [],
    }

    return { success: true, role: mongoData[0].role, token: sessionId }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false }
  } finally {
    await mongoClient.close()
  }
}

export async function googleLogin(profile: { email: string; name: string; picture?: string }): Promise<{
  success: boolean
  role?: UserRole
  token?: string
}> {
  const { email, name, picture } = profile

  // Use email as the username/id for Google users
  const username = email.toLowerCase()

  const mongoClient = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb+srv://22bcs107:mWocnmqhJQtCAzk2@cluster0.rdjhjyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  )

  try {
    await mongoClient.connect()
    let mongoData = await mongoClient.db("Users").collection("UserInfo").find({ email: username }).toArray()

    //Check if email is already registered, if not create a new entry
    if (mongoData.length === 0) {
      await mongoClient.db("Users").collection("UserInfo").insertOne({
        username: name,
        role: "user",
        email: username,
      })
    }

    //Update mongoData array if email was not registered
    mongoData = await mongoClient.db("Users").collection("UserInfo").find({ email: username }).toArray()

    // Create a session ID
    const sessionId = uuidv4()

    // Store session data
    sessions[sessionId] = {
      user: {
        id: username,
        username: mongoData[0].username,
        role: mongoData[0].role,
      },
      token: sessionId,
      cart: [],
    }

    return { success: true, role: mongoData[0].role, token: sessionId }
  } catch (error) {
    console.error("Google login error:", error)
    return { success: false }
  } finally {
    await mongoClient.close()
  }
}

export async function register(username: string, password: string, role: UserRole = "user"): Promise<boolean> {
  const mongoClient = new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb+srv://22bcs107:mWocnmqhJQtCAzk2@cluster0.rdjhjyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  )

  try {
    await mongoClient.connect()
    const mongoData = await mongoClient.db("Users").collection("UserInfo").find({ username: username }).toArray()

    // Check if username already exists
    if (mongoData.length > 0) {
      return false
    }

    //Creating a new entry into the database
    await mongoClient.db("Users").collection("UserInfo").insertOne({
      username: username,
      password: password,
      role: role,
    })

    return true
  } catch (error) {
    console.error("Registration error:", error)
    return false
  } finally {
    await mongoClient.close()
  }
}

export async function logout(token: string): Promise<boolean> {
  if (token && sessions[token]) {
    // Remove session from store
    delete sessions[token]
    return true
  }
  return false
}

export async function getSession(token: string): Promise<Session | null> {
  // Return session data if it exists
  return sessions[token] || null
}

export async function verifyToken(token: string): Promise<User | null> {
  // In this simplified approach, the token is the session ID
  const session = sessions[token]
  return session?.user || null
}

export { sessions }
