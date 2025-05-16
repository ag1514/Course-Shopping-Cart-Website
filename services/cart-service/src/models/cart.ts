export interface CartItem {
  courseId: string
  quantity: number
}

export interface Cart {
  userId: string
  items: CartItem[]
}
