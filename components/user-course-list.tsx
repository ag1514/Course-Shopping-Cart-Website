"use client"

import type React from "react"
import { useState } from "react"
import type { Course } from "@/types/course"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, ShoppingCart, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

interface UserCourseListProps {
  courses: Course[]
}

export default function UserCourseList({ courses }: UserCourseListProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const categoryFilter = searchParams.get("category") || ""
  const [searchTerm, setSearchTerm] = useState("")
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({})

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = categoryFilter ? course.category === categoryFilter : true
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.details.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleAddToCart = async (courseId: string, courseTitle: string) => {
    if (loadingStates[courseId]) return

    setLoadingStates((prev) => ({ ...prev, [courseId]: true }))

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      const response = await fetch(`${API_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`Failed to add to cart: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Show success state
        setAddedItems((prev) => ({ ...prev, [courseId]: true }))

        toast({
          title: "Added to cart",
          description: `${courseTitle} has been added to your cart.`,
        })

        // Reset success state after 2 seconds
        setTimeout(() => {
          setAddedItems((prev) => ({ ...prev, [courseId]: false }))
        }, 2000)

        // Refresh the page to update cart count
        router.refresh()
      } else {
        throw new Error("Failed to add to cart")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add course to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingStates((prev) => ({ ...prev, [courseId]: false }))
    }
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Input placeholder="Search courses..." value={searchTerm} onChange={handleSearch} className="max-w-md" />
      </div>

      {filteredCourses.length === 0 ? (
        <div className="p-8 text-center border rounded-lg">
          <p className="text-muted-foreground">No courses found</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge>{course.category}</Badge>
                  <Badge variant={course.available ? "success" : "destructive"}>
                    {course.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{course.details}</p>
                <p className="mt-2 text-lg font-bold">${course.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <div className="flex w-full space-x-2">
                  <Link href={`/courses/${course.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleAddToCart(course.id, course.title)}
                    disabled={loadingStates[course.id] || !course.available}
                    className={`flex-1 ${addedItems[course.id] ? "bg-green-500 hover:bg-green-600" : ""}`}
                  >
                    {addedItems[course.id] ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {loadingStates[course.id] ? "Adding..." : "Add to Cart"}
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
