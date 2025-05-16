import type { CartItem, Course } from "@/types/course"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

interface CartItemWithCourse extends CartItem {
  course: Course
}

interface CartSummaryProps {
  cartItems: CartItemWithCourse[]
}

export function CartSummary({ cartItems }: CartSummaryProps) {
  // Calculate total items
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.course.price * item.quantity
  }, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Total Courses:</span>
          <span>{totalItems}</span>
        </div>
        <div className="flex justify-between">
          <span>Unique Courses:</span>
          <span>{cartItems.length}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total Price:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Checkout
        </Button>
      </CardFooter>
    </Card>
  )
}
