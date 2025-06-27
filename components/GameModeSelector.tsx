"use client"

import { Button } from "@/components/ui/button"
import { Edit, Play, List, LogIn } from "lucide-react"

interface GameModeSelectorProps {
  onModeSelect: (mode: "play" | "editor" | "custom") => void
}

export function GameModeSelector({ onModeSelect }: GameModeSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Juego de Grúa</h1>

        <div className="space-y-4">

          <Button onClick={() => onModeSelect("play")} className="w-full py-4 text-lg" size="lg">
            <Play className="w-5 h-5 mr-2" />
            Jugar (Aleatorio)
          </Button>

          <Button onClick={() => onModeSelect("editor")} variant="outline" className="w-full py-4 text-lg" size="lg">
            <Edit className="w-5 h-5 mr-2" />
            Editor de Niveles
          </Button>

          <Button onClick={() => onModeSelect("custom")} variant="secondary" className="w-full py-4 text-lg" size="lg">
            <List className="w-5 h-5 mr-2" />
            Niveles Personalizados
          </Button>
        </div>
      </div>
    </div>
  )
}
