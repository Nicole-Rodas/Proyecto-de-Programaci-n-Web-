import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"

interface GameHeaderProps {
  onGrab: () => void  // Para agarrar un bloque
  onRelease: () => void // Para soltar un bloque
  onMove: (direction: "up" | "down" | "left" | "right") => void
  isGrabbing: boolean  // Estado de si la grúa está agarrando un bloque
}

export function GameHeader({ onGrab, onRelease, onMove, isGrabbing }: GameHeaderProps) {
  return (
    <div className="w-full max-w-4xl bg-white border-b-4 border-black p-4 mb-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Juego de Garra</h1>
        <div className="flex gap-4 items-center">
          {/* Botón de "Soltar" */}
          <div className="flex flex-col items-center cursor-pointer" onClick={onRelease}>
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-1 hover:bg-gray-700 transition-colors">
              <div className="w-8 h-8 border-4 border-white rounded-full border-t-transparent"></div>
            </div>
            <span className="text-sm font-semibold">Soltar</span>
          </div>

          {/* Botón de "Agarrar" */}
          <div className="flex flex-col items-center cursor-pointer" onClick={onGrab}>
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-1 hover:bg-gray-700 transition-colors">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <span className="text-sm font-semibold">{isGrabbing ? "Soltar" : "Agarrar"}</span>
          </div>

          {/* Controles de movimiento */}
          <div className="grid grid-cols-3 gap-1 w-16 h-16 bg-gray-400 rounded p-1">
            <div></div>
            <div
              className="bg-gray-600 rounded flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors select-none"
              onClick={() => onMove("up")}
            >
              <ArrowUp className="w-3 h-3 text-white" />
            </div>
            <div></div>
            <div
              className="bg-gray-600 rounded flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors select-none"
              onClick={() => onMove("left")}
            >
              <ArrowLeft className="w-3 h-3 text-white" />
            </div>
            <div className="bg-gray-500 rounded"></div>
            <div
              className="bg-gray-600 rounded flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors select-none"
              onClick={() => onMove("right")}
            >
              <ArrowRight className="w-3 h-3 text-white" />
            </div>
            <div></div>
            <div
              className="bg-gray-600 rounded flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors select-none"
              onClick={() => onMove("down")}
            >
              <ArrowDown className="w-3 h-3 text-white" />
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  )
}
