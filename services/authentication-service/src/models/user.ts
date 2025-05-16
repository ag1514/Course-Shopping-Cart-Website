export type UserRole = "user" | "agent"

export interface User {
  id: string
  username: string
  role: UserRole
  email?: string
  password?: string
  picture?: string
}

export interface Session {
  user: User
  token: string
  cart: any[]
}
