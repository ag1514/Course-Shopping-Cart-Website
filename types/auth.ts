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
