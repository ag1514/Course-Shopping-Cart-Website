"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  categories: string[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentCategory = searchParams.get("category") || ""

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    return params.toString()
  }

  const handleCategoryClick = (category: string) => {
    const query = createQueryString("category", currentCategory === category ? "" : category)
    router.push(`${pathname}?${query}`)
  }

  return (
    <div className="space-y-2">
      <Button
        variant={!currentCategory ? "default" : "outline"}
        className="w-full justify-start"
        onClick={() => handleCategoryClick("")}
      >
        All Categories
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={currentCategory === category ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
