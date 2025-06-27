"use client"

import { useEffect } from "react"
import { GameHeader } from "../components/GameHeader"
import { GameArea } from "../components/GameArea"
import { MobileControls } from "../components/MobileControls"
import { WinModal } from "../components/WinModal"
import { useKeyboard } from "../hooks/useKeyboard"
import { useCraneGame } from "../hooks/useCraneGame"

export default function CraneGame() {
  const { keys } = useKeyboard()
  const { crane, blocks, gameWon, mounted, moveCrane, handleGrabRelease, resetGame } = useCraneGame()

  useEffect(() => {
    if (!mounted) return

    const interval = setInterval(() => {
      if (keys.has("arrowleft") || keys.has("a")) {
        moveCrane("left")
      }
      if (keys.has("arrowright") || keys.has("d")) {
        moveCrane("right")
      }
      if (keys.has("arrowup") || keys.has("w")) {
        moveCrane("up")
      }
      if (keys.has("arrowdown") || keys.has("s")) {
        moveCrane("down")
      }
    }, 16)

    return () => clearInterval(interval)
  }, [keys, moveCrane, mounted])

  useEffect(() => {
    if (!mounted) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault()
        handleGrabRelease()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleGrabRelease, mounted])

  // Mostrar loading mientras se monta el componente
  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-bold">Cargando juego...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <GameHeader onGrabRelease={handleGrabRelease} onMove={moveCrane} />

      <div className="relative">
        <GameArea crane={crane} blocks={blocks} />
        {gameWon && <WinModal onRestart={resetGame} />}
      </div>

      <MobileControls onMove={moveCrane} onGrabRelease={handleGrabRelease} isGrabbing={crane.isGrabbing} />

      <div className="mt-4 text-center text-sm text-gray-600 max-w-2xl">
        <p className="mb-2">
          <strong>Controles:</strong> Usa las flechas del teclado (↑↓←→) para mover la grúa y la barra espaciadora para
          agarrar/soltar bloques.
        </p>
        <p className="mb-2">
          <strong>Objetivo:</strong> Apila todos los bloques en orden descendente (más grande abajo, más pequeño arriba)
          en cualquiera de las 3 plataformas.
        </p>
        <p className="text-xs text-gray-500">
          <strong>Nota:</strong> Solo puedes agarrar el bloque que está en la parte superior de cada pila.
        </p>
      </div>
    </div>
  )
}
