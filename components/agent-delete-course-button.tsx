"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AgentServiceClient } from "@/lib/service-clients"

interface AgentDeleteCourseButtonProps {
  id: string
  buttonStyle?: "icon" | "full"
}

export default function AgentDeleteCourseButton({ id, buttonStyle = "icon" }: AgentDeleteCourseButtonProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await AgentServiceClient.deleteCourse(id)
      // Use direct window.location.href for navigation
      window.location.href = "/agent/courses"
    } catch (error) {
      console.error("Failed to delete course:", error)
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {buttonStyle === "full" ? (
          <Button variant="destructive" className="w-full">
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </Button>
        ) : (
          <Button variant="destructive" size="sm">
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the course from your catalog.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-red-500 hover:bg-red-600">
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
