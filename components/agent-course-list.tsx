"use client"

import type React from "react"
import { useState } from "react"
import type { Course } from "@/types/course"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"
import AgentDeleteCourseButton from "./agent-delete-course-button"

interface AgentCourseListProps {
  courses: Course[]
}

export default function AgentCourseList({ courses }: AgentCourseListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCourses = courses.filter((course) => {
    return (
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.details.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const navigateToCourse = (courseId: string) => {
    window.location.href = `/agent/courses/${courseId}`
  }

  const navigateToEdit = (courseId: string) => {
    window.location.href = `/agent/courses/${courseId}/edit`
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
                  <Button variant="outline" className="w-full" onClick={() => navigateToCourse(course.id)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigateToEdit(course.id)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
                <AgentDeleteCourseButton id={course.id} buttonStyle="full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
