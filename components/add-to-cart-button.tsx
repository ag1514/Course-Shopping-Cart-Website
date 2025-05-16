"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

interface AddToCartButtonProps {
  courseId: string
  courseTitle: string
}

export default function AddToCartButton({ courseId, courseTitle }: AddToCartButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = async () => {
    setLoading(true)

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
        setAdded(true)

        toast({
          title: "Added to cart",
          description: `${courseTitle} has been added to your cart.`,
        })

        // Reset success state after 2 seconds
        setTimeout(() => {
          setAdded(false)
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
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={loading}
      size="lg"
      className={added ? "bg-green-500 hover:bg-green-600" : ""}
    >
      {added ? (
        <>
          <Check className="w-5 h-5 mr-2" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5 mr-2" />
          {loading ? "Adding to Cart..." : "Add to Cart"}
        </>
      )}
    </Button>
  )
}
