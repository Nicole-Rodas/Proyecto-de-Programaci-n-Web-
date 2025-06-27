"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="quizora-blue w-full py-2 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="text-5xl font-bold">
            <span className="text-yellow-300">Quiz</span>
            <span className="text-black">ora</span>
          </div>
        </Link>

        {pathname !== "/" && (
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/plantillas"
              className={cn(
                "text-lg font-medium transition-colors",
                pathname.includes("/plantillas") ? "text-black font-semibold" : "text-gray-700",
              )}
            >
              Plantillas
            </Link>
            <Link
              href="/"
              className={cn(
                "text-lg font-medium transition-colors",
                pathname === "/" ? "text-black font-semibold" : "text-gray-700",
              )}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                "text-lg font-medium transition-colors",
                pathname.includes("/dashboard") ? "text-black font-semibold" : "text-gray-700",
              )}
            >
              Dashboard
            </Link>
          </nav>
        )}

        {pathname === "/" ? (
          <Link href="/login" className="text-lg font-medium">
            Inicia Sesion o Registrate
          </Link>
        ) : (
          <Avatar className="h-10 w-10 bg-sky-500">
            <AvatarImage src="/placeholder.svg" alt="Usuario" />
            <AvatarFallback className="bg-sky-500 text-white">U</AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  )
}
