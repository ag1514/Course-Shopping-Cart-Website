import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/server-auth"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart, Trash } from "lucide-react"
import Link from "next/link"
import CartItemList from "@/components/cart-item-list"
import { CartSummary } from "@/components/cart-summary"

export default async function CartPage() {
  const session = await requireAuth()

  // Only users can access the cart
  if (session.user.role !== "user") {
    redirect("/agent/courses")
  }

  // Fetch cart items directly from the API
  const API_URL = process.env.API_URL || "http://localhost:3000"
  const response = await fetch(`${API_URL}/api/cart`, {
    headers: {
      Cookie: `sessionId=${session.token}`,
      Authorization: `Bearer ${session.token}`,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    console.error(`Failed to fetch cart items: ${response.status}`)
  }

  const cartItems = (await response.json()) || []

  async function clearCartAction() {
    "use server"

    const session = await requireAuth()
    const API_URL = process.env.API_URL || "http://localhost:3000"

    const response = await fetch(`${API_URL}/api/cart/clear`, {
      method: "POST",
      headers: {
        Cookie: `sessionId=${session.token}`,
        Authorization: `Bearer ${session.token}`,
      },
    })

    if (!response.ok) {
      console.error(`Failed to clear cart: ${response.status}`)
    }

    redirect("/cart")
  }

  return (
    <div className="container py-8 mx-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/courses">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">My Cart</h1>
          <form action={clearCartAction}>
            <Button variant="outline" type="submit" disabled={cartItems.length === 0}>
              <Trash className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
          </form>
        </div>

        {cartItems.length === 0 ? (
          <div className="p-8 text-center border rounded-lg">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
            <p className="mb-4 text-muted-foreground">Add some courses to your cart to get started.</p>
            <Link href="/courses">
              <Button>Browse Courses</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_300px]">
            <CartItemList cartItems={cartItems} />
            <CartSummary cartItems={cartItems} />
          </div>
        )}
      </div>
    </div>
  )
}
