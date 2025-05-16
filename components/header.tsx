"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X, ShoppingCart, Settings } from "lucide-react"
import { logout } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import type { UserRole } from "@/types/auth"
import Link from "next/link"

interface HeaderProps {
  username: string
  role: UserRole
}

export default function Header({ username, role }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const fetchCartCount = async () => {
      if (role === "user") {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
          const response = await fetch(`${API_URL}/api/cart/count`, {
            credentials: "include",
            cache: "no-store",
          })

          if (response.ok) {
            const data = await response.json()
            setCartCount(data.count)
          }
        } catch (error) {
          console.error("Error fetching cart count:", error)
        }
      }
    }

    fetchCartCount()
  }, [pathname, role])

  const handleLogout = async () => {
    await logout()
    // Use window.location for a full page reload after logout
    window.location.href = "/login"
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white border-b">
      <div className="container flex items-center justify-between h-16 mx-auto">
        <Link href={role === "agent" ? "/agent/courses" : "/courses"} className="text-xl font-bold">
          {role === "agent" ? "Course Admin" : "My Courses"}
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <div className="text-sm text-muted-foreground">
            Welcome, {username} ({role === "agent" ? "Agent" : "User"})
          </div>

          {role === "user" && (
            <Link href="/cart">
              <Button variant="outline" className="relative">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {cartCount > 0 && <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs">{cartCount}</Badge>}
              </Button>
            </Link>
          )}

          {role === "agent" && (
            <Link href="/agent/courses">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Manage Courses
              </Button>
            </Link>
          )}

          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <button className="p-2 md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="container py-4 md:hidden">
          <div className="flex flex-col space-y-4">
            <div className="text-sm text-muted-foreground">
              Welcome, {username} ({role === "agent" ? "Agent" : "User"})
            </div>

            {role === "user" && (
              <Link href="/cart">
                <Button variant="outline" className="w-full justify-start relative">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                  {cartCount > 0 && <Badge className="absolute top-0 right-2 px-1.5 py-0.5 text-xs">{cartCount}</Badge>}
                </Button>
              </Link>
            )}

            {role === "agent" && (
              <Link href="/agent/courses">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Courses
                </Button>
              </Link>
            )}

            <Button variant="ghost" onClick={handleLogout} className="justify-start">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
