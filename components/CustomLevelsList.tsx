"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Trash2, ArrowLeft } from "lucide-react"
import type { CustomLevel } from "../types/editor"

interface CustomLevelsListProps {
  onPlayLevel: (level: CustomLevel) => void
  onBack: () => void
}

export function CustomLevelsList({ onPlayLevel, onBack }: CustomLevelsListProps) {
  const [levels, setLevels] = useState<CustomLevel[]>([])

  useEffect(() => {
    const savedLevels = JSON.parse(localStorage.getItem("customLevels") || "[]")
    setLevels(savedLevels)
  }, [])

  const deleteLevel = (levelId: string) => {
    const updatedLevels = levels.filter((level) => level.id !== levelId)
    setLevels(updatedLevels)
    localStorage.setItem("customLevels", JSON.stringify(updatedLevels))
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold">Niveles Personalizados</h1>
        </div>

        {levels.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No hay niveles personalizados creados</p>
            <Button onClick={onBack} variant="outline">
              Crear primer nivel
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {levels.map((level) => (
              <div key={level.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{level.name}</h3>
                  <p className="text-sm text-gray-600">
                    {level.blocks.length} bloques • {level.platforms} plataformas • Orden: {level.orderType}
                  </p>
                  <p className="text-xs text-gray-500">Creado: {new Date(level.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => onPlayLevel(level)} size="sm">
                    <Play className="w-4 h-4 mr-1" />
                    Jugar
                  </Button>
                  <Button onClick={() => deleteLevel(level.id)} variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
