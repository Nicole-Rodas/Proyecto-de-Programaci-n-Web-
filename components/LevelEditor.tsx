"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Undo2, Save } from "lucide-react"
import type { EditorBlock, OrderType } from "../types/editor"
import { GAME_CONFIG } from "../constants/game"

interface LevelEditorProps {
  blocks: EditorBlock[]
  platformCount: number
  orderType: OrderType
  previewBlock: { x: number; y: number; size: number } | null
  svgRef: React.RefObject<SVGSVGElement>
  onPlatformCountChange: (count: number) => void
  onOrderTypeChange: (type: OrderType) => void
  onMouseDown: (e: React.MouseEvent<SVGSVGElement>) => void
  onMouseMove: (e: React.MouseEvent<SVGSVGElement>) => void
  onMouseUp: (e: React.MouseEvent<SVGSVGElement>) => void
  onUndo: () => void
  onSave: () => void
  canUndo: boolean
}

export function LevelEditor({
  blocks,
  platformCount,
  orderType,
  previewBlock,
  svgRef,
  onPlatformCountChange,
  onOrderTypeChange,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onUndo,
  onSave,
  canUndo,
}: LevelEditorProps) {
  const platforms = Array.from({ length: platformCount }, (_, i) => ({
    x: 50 + (i * (GAME_CONFIG.GAME_WIDTH - 100)) / (platformCount - 1) - 100,
    y: 500,
    width: 200,
    height: 20,
  }))

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="w-full max-w-4xl bg-black text-white p-4 mb-4 relative">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold">EDITOR DE NIVELES</h1>

          <div className="flex flex-col gap-4">
            {/* Platform Count */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Cantidad de Plataformas</label>
              <input
                type="number"
                min="3"
                max="5"
                value={platformCount}
                onChange={(e) => onPlatformCountChange(Number(e.target.value))}
                className="w-16 px-2 py-1 text-black rounded"
              />
            </div>

            {/* Order Type */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Tipo de Orden</label>
              <select
                value={orderType}
                onChange={(e) => onOrderTypeChange(e.target.value as OrderType)}
                className="px-2 py-1 text-black rounded"
              >
                <option value="numeric">Numérico</option>
                <option value="alphabetic">Alfabético</option>
                <option value="size">Tamaño</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative">
        <div
          className="relative bg-gray-200 border-4 border-black cursor-crosshair"
          style={{ width: GAME_CONFIG.GAME_WIDTH, height: GAME_CONFIG.GAME_HEIGHT }}
        >
          <svg
            ref={svgRef}
            width={GAME_CONFIG.GAME_WIDTH}
            height={GAME_CONFIG.GAME_HEIGHT}
            className="absolute inset-0"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
          >
            {/* Me designe a no tenerte mas nunca
              Y solamente a tus fotos yo ver
              Aunque cada dia te veo mas bonita
              Eres problema y ya no me quiero meter
              Tu ya sabes como enredarme
              Cada vez que quieres
              La vuelta buscarme*/}

              
            {platforms.map((platform, index) => (
              <rect
                key={index}
                x={platform.x}
                y={platform.y}
                width={platform.width}
                height={platform.height}
                fill="#666"
              />
            ))}

            
            {/* BLOQUES*/}
            {blocks.map((block) => (
              <g key={block.id}>
                <rect
                  x={block.x}
                  y={block.y}
                  width={block.width}
                  height={block.height}
                  fill={block.color}
                  stroke="#333"
                  strokeWidth="2"
                />
                {block.label && (
                  <text
                    x={block.x + block.width / 2}
                    y={block.y + block.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="24"
                    fontWeight="bold"
                    fill="#000"
                  >
                    {block.label}
                  </text>
                )}
              </g>
            ))}

            {/* Preview Block */}
            {previewBlock && (
              <rect
                x={previewBlock.x}
                y={previewBlock.y}
                width={previewBlock.size}
                height={previewBlock.size}
                fill="none"
                stroke="#333"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            )}
          </svg>
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <Button onClick={onSave} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2">
            <Save className="w-4 h-4 mr-2" />
            Guardar nivel
          </Button>

          <Button onClick={onUndo} disabled={!canUndo} variant="outline" className="p-2">
            <Undo2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-gray-600 max-w-2xl">
        <p className="mb-2">
          <strong>Instrucciones:</strong> Mantén presionado el botón izquierdo del mouse y arrastra horizontalmente para
          crear bloques.
        </p>
        <p>
          Los bloques caerán automáticamente sobre las plataformas. Cambia el tipo de orden para actualizar las
          etiquetas de los bloques existentes.
        </p>
      </div>
    </div>
  )
}
