"use client"

import type React from "react"

import { useState } from "react"
import type { Course } from "@/types/course"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { addToCart } from "@/lib/cart"

interface CourseListProps {
  courses: Course[]
}

export default function CourseList({ courses }: CourseListProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const categoryFilter = searchParams.get("category") || ""
  const [searchTerm, setSearchTerm] = useState("")
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

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

  const handleAddToCart = async (courseId: string) => {
    setLoadingStates((prev) => ({ ...prev, [courseId]: true }))
    await addToCart(courseId)
    router.refresh()
    setLoadingStates((prev) => ({ ...prev, [courseId]: false }))
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
                    onClick={() => handleAddToCart(course.id)}
                    disabled={loadingStates[course.id] || !course.available}
                    className="flex-1"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
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
