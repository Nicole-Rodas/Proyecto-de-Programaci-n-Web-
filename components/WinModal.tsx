"use client"

import { Button } from "@/components/ui/button"

interface WinModalProps {
  onRestart: () => void
}

export function WinModal({ onRestart }: WinModalProps) {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-blue-200 p-8 rounded-lg text-center">
        <h2 className="text-4xl font-bold text-blue-600 mb-4">
          ¡Felicidades!
          <br />
          Ganaste
        </h2>
        <Button onClick={onRestart} className="text-lg px-6 py-3">
          Reiniciar
        </Button>
      </div>
    </div>
  )
}
