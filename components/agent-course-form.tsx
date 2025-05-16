"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Course } from "@/types/course"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

interface AgentCourseFormProps {
  course?: Course
}

const categories = ["Programming", "Design", "Business", "Marketing", "Science", "Mathematics", "Language", "Other"]

export default function AgentCourseForm({ course }: AgentCourseFormProps) {
  const router = useRouter()
  const isEditing = !!course

  const [formData, setFormData] = useState<Omit<Course, "id">>({
    title: course?.title || "",
    details: course?.details || "",
    category: course?.category || "Programming",
    available: course?.available ?? true,
    price: course?.price ?? 49.99,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleAvailableChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, available: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

      if (isEditing && course) {
        // Update existing course
        const response = await fetch(`${API_URL}/api/courses/${course.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, id: course.id }),
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error(`Failed to update course: ${response.status}`)
        }

        toast({
          title: "Course updated",
          description: "The course has been updated successfully.",
        })

        router.push(`/agent/courses/${course.id}`)
        router.refresh()
      } else {
        // Create new course
        const response = await fetch(`${API_URL}/api/courses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error(`Failed to create course: ${response.status}`)
        }

        const newCourse = await response.json()

        toast({
          title: "Course created",
          description: "The new course has been created successfully.",
        })

        router.push(`/agent/courses/${newCourse.id}`)
        router.refresh()
      }
    } catch (err) {
      console.error("Error saving course:", err)
      setError("Failed to save course. Please try again.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <Link href={isEditing ? `/agent/courses/${course.id}` : "/agent/courses"}>
          <Button variant="ghost" className="pl-0" type="button">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isEditing ? "Back to Course" : "Back to Courses"}
          </Button>
        </Link>
      </div>

      {error && <div className="p-3 text-sm text-white bg-red-500 rounded">{error}</div>}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Course Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="details">Course Details</Label>
          <Textarea id="details" name="details" value={formData.details} onChange={handleChange} rows={5} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleNumberChange}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="available" checked={formData.available} onCheckedChange={handleAvailableChange} />
          <Label htmlFor="available">Available</Label>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : isEditing ? "Update Course" : "Create Course"}
      </Button>
    </form>
  )
}
