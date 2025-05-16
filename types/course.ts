export interface Course {
  id: string
  title: string
  details: string
  category: string
  available: boolean
  price: number // Added price field
}

// Add a CartItem interface to represent items in the cart
export interface CartItem {
  courseId: string
  quantity: number
}
