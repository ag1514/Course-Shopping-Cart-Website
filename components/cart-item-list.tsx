"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Trash, Minus, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

interface CartItemListProps {
  cartItems: any[]
}

export default function CartItemList({ cartItems }: CartItemListProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const handleQuantityChange = async (courseId: string, newQuantity: number) => {
    if (loading[courseId]) return

    setLoading((prev) => ({ ...prev, [courseId]: true }))

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

      if (newQuantity <= 0) {
        // Remove item if quantity is 0 or less
        const response = await fetch(`${API_URL}/api/cart/${courseId}`, {
          method: "DELETE",
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error(`Failed to remove from cart: ${response.status}`)
        }

        toast({
          title: "Item removed",
          description: "The item has been removed from your cart.",
        })

        router.refresh()
      } else {
        // Update quantity
        const response = await fetch(`${API_URL}/api/cart/${courseId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }),
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error(`Failed to update quantity: ${response.status}`)
        }

        toast({
          title: "Quantity updated",
          description: `Quantity updated to ${newQuantity}.`,
        })

        router.refresh()
      }
    } catch (error) {
      console.error("Error updating cart:", error)
      toast({
        title: "Error",
        description: "Failed to update cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, [courseId]: false }))
    }
  }

  const handleRemove = async (courseId: string) => {
    if (loading[courseId]) return

    setLoading((prev) => ({ ...prev, [courseId]: true }))

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      const response = await fetch(`${API_URL}/api/cart/${courseId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`Failed to remove from cart: ${response.status}`)
      }

      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error removing from cart:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, [courseId]: false }))
    }
  }

  return (
    <div className="space-y-4">
      {cartItems.map(({ course, quantity, courseId }) => (
        <Card key={courseId} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              <div className="relative w-full h-48 sm:w-48 sm:h-auto">
                <Image src="/placeholder.svg?height=200&width=200" alt={course.title} fill className="object-cover" />
              </div>
              <div className="flex flex-col justify-between flex-1 p-4">
                <div>
                  <Link href={`/courses/${course.id}`} className="hover:underline">
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{course.details}</p>
                  <p className="mt-2 text-lg font-bold">${course.price.toFixed(2)}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between mt-4 gap-y-2">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => handleQuantityChange(courseId, quantity - 1)}
                      disabled={loading[courseId]}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>

                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value)
                        if (!isNaN(value) && value >= 1) {
                          handleQuantityChange(courseId, value)
                        }
                      }}
                      className="w-16 text-center"
                      min="1"
                      disabled={loading[courseId]}
                    />

                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => handleQuantityChange(courseId, quantity + 1)}
                      disabled={loading[courseId]}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center">
                    <p className="mr-4 font-semibold">Subtotal: ${(course.price * quantity).toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemove(courseId)}
                      disabled={loading[courseId]}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
