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
import { createCourse, updateCourse } from "@/lib/courses"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface CourseFormProps {
  course?: Course
}

const categories = ["Programming", "Design", "Business", "Marketing", "Science", "Mathematics", "Language", "Other"]

export default function CourseForm({ course }: CourseFormProps) {
  const router = useRouter()
  const isEditing = !!course

  const [formData, setFormData] = useState<Omit<Course, "id">>({
    title: course?.title || "",
    details: course?.details || "",
    category: course?.category || "Programming",
    available: course?.available ?? true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
      if (isEditing && course) {
        await updateCourse({ ...formData, id: course.id })
        router.push(`/courses/${course.id}`)
      } else {
        const newCourse = await createCourse(formData)
        router.push(`/courses/${newCourse.id}`)
      }
      router.refresh()
    } catch (err) {
      setError("Failed to save course")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <Link href={isEditing ? `/courses/${course.id}` : "/courses"}>
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
