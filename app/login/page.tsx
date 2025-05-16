"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "@/lib/auth"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import GoogleLoginButton from "@/components/google-login-button"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [googleAvailable, setGoogleAvailable] = useState(true)

  // Check if Google Sign-In is available
  useEffect(() => {
    // If Google Sign-In fails to load after 5 seconds, hide the option
    const timeout = setTimeout(() => {
      if (!window.google?.accounts?.id) {
        setGoogleAvailable(false)
      }
    }, 5000)

    return () => clearTimeout(timeout)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!username || !password) {
        setError("Username and password are required")
        setLoading(false)
        return
      }

      console.log("Submitting login form...")
      const result = await login(username, password)
      console.log("Login result:", result)

      if (result && result.success) {
        setRedirecting(true)
        console.log(`Login successful, role: ${result.role}`)

        // Force a delay before redirecting to ensure cookie is set
        setTimeout(() => {
          // Use window.location.replace for a cleaner redirect
          if (result.role === "agent") {
            console.log("Redirecting to agent courses page...")
            window.location.replace("/agent/courses")
          } else {
            console.log("Redirecting to user courses page...")
            window.location.replace("/courses")
          }
        }, 1000)
      } else {
        setError("Invalid username or password")
        setLoading(false)
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred during login. Please try again.")
      setLoading(false)
    }
  }

  const handleGoogleLoginStart = () => {
    setLoading(true)
    setError("")
  }

  const handleGoogleLoginComplete = (success: boolean, role?: string) => {
    if (success) {
      setRedirecting(true)
      console.log(`Google login successful, role: ${role}`)

      // Force a delay before redirecting to ensure cookie is set
      setTimeout(() => {
        if (role === "agent") {
          console.log("Redirecting to agent courses page...")
          window.location.replace("/agent/courses")
        } else {
          console.log("Redirecting to user courses page...")
          window.location.replace("/courses")
        }
      }, 1000)
    } else {
      setLoading(false)
      setError("Google login failed. Please try again.")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="p-3 text-sm text-white bg-red-500 rounded">{error}</div>}
            {redirecting && (
              <div className="p-3 text-sm text-white bg-green-500 rounded">Login successful! Redirecting...</div>
            )}

            {googleAvailable && (
              <>
                <GoogleLoginButton onLoginStart={handleGoogleLoginStart} onLoginComplete={handleGoogleLoginComplete} />

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 bg-white text-muted-foreground">Or continue with</span>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <div className="text-sm text-gray-500">
              <p>Demo accounts:</p>
              <ul className="ml-4 list-disc">
                <li>Agent: username "admin", password "password"</li>
                <li>User: username "user", password "password"</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={loading || redirecting}>
              {loading ? "Logging in..." : redirecting ? "Redirecting..." : "Login with Username"}
            </Button>
            <div className="text-sm text-center text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
