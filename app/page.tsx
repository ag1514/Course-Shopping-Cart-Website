import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
  const session = await getSession()

  if (session?.user) {
    if (session.user.role === "agent") {
      redirect("/agent/courses")
    } else {
      redirect("/courses")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="mt-2 text-gray-600">Manage your course catalog with ease</p>
        </div>

        <div className="flex flex-col space-y-4">
          <Link href="/login" className="w-full">
            <Button className="w-full" size="lg">
              Login
            </Button>
          </Link>

          <Link href="/register" className="w-full">
            <Button variant="outline" className="w-full" size="lg">
              Register
            </Button>
          </Link>
        </div>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">A microservices-based course management system</p>
        </div>
      </div>
    </div>
  )
}
