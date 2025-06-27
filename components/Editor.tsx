import React, { useState } from 'react'
import { GAME_CONFIG } from '../constants/game'
import type { Block } from '../types/game'

// Definir el número de bases permitido
const MIN_BASES = 2
const MAX_BASES = 4

export default function Editor({ onSave }: { onSave: (initialBlocks: Block[], targetBlocks: Block[]) => void }) {
  const [mode, setMode] = useState<'initial' | 'target'>('initial')
  const [initialBlocks, setInitialBlocks] = useState<Block[]>([])
  const [targetBlocks, setTargetBlocks] = useState<Block[]>([])
  const [blockSize, setBlockSize] = useState(50)
  const [numBases, setNumBases] = useState(MIN_BASES)  // Número de bases editable
  const [bases, setBases] = useState(
    Array(MIN_BASES).fill({ x: 50, y: 300, width: 150, height: 20 }) // Bases iniciales (más abajo)
  )

  // Cambiar el número de bases (de 2 a 4)
  function handleNumBasesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value, 10)
    if (value >= MIN_BASES && value <= MAX_BASES) {
      const newBases = Array(value).fill({ x: 50, y: 300, width: 150, height: 20 }).map((base, index) => ({
        ...base,
        x: 50 + index * (GAME_CONFIG.GAME_WIDTH / value), // Distribuir las bases de manera uniforme
      }))
      setNumBases(value)
      setBases(newBases)
    }
  }

  // Crear un bloque en el área de juego al hacer clic
  function handleAreaClick(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newBlock: Block = {
      id: Date.now().toString(),
      x: x - blockSize / 2, // Permite que el bloque se cree en cualquier lugar en el eje X
      y: y - blockSize / 2, // Permite que el bloque se cree en cualquier lugar en el eje Y
      width: blockSize,
      height: blockSize,
      size: blockSize,
      color: mode === 'initial' ? '#ff7f50' : '#32cd32',
      isGrabbed: false,
    }

    if (mode === 'initial') setInitialBlocks((b) => [...b, newBlock])
    else setTargetBlocks((b) => [...b, newBlock])
  }

  // Limpiar los bloques de la zona actual
  function clearBlocks() {
    if (mode === 'initial') setInitialBlocks([])
    else setTargetBlocks([])
  }

  // Guardar los bloques y volver al juego
  function saveDesign() {
    onSave(initialBlocks, targetBlocks)
  }

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMode('initial')}
          className={`px-4 py-2 rounded ${mode === 'initial' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Editar Inicial
        </button>
        <button
          onClick={() => setMode('target')}
          className={`px-4 py-2 rounded ${mode === 'target' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Editar Objetivo
        </button>
        <button onClick={clearBlocks} className="px-4 py-2 bg-red-500 text-white rounded">
          Limpiar {mode === 'initial' ? 'Inicial' : 'Objetivo'}
        </button>
      </div>

      {/* Input para cambiar el número de bases */}
      <div className="mb-4">
        <label htmlFor="numBases" className="mr-2">Número de Bases (2-4):</label>
        <input
          id="numBases"
          type="number"
          value={numBases}
          onChange={handleNumBasesChange}
          min={MIN_BASES}
          max={MAX_BASES}
        />
      </div>

      {/* Selector de tamaño de bloques */}
      <div className="mb-4">
        <label htmlFor="blockSize" className="mr-2">Tamaño del Bloque:</label>
        <input
          id="blockSize"
          type="number"
          value={blockSize}
          onChange={(e) => setBlockSize(parseInt(e.target.value))}
          min="30"
          max="100"
        />
      </div>

      <div className="relative bg-gray-100 border border-gray-400">
        <svg
          width={GAME_CONFIG.GAME_WIDTH}
          height={GAME_CONFIG.GAME_HEIGHT}
          onClick={handleAreaClick}
          className="cursor-crosshair"
        >
          {/* Render bases */}
          {bases.map((base, index) => (
            <rect key={index} x={base.x} y={base.y} width={base.width} height={base.height} fill="#888" />
          ))}

          {/* Render bloques iniciales */}
          {initialBlocks.map((block) => (
            <rect
              key={`i-${block.id}`}
              x={block.x}
              y={block.y}
              width={block.width}
              height={block.height}
              fill={block.color}
              opacity={0.8}
            />
          ))}

          {/* Render bloques de objetivo */}
          {targetBlocks.map((block) => (
            <rect
              key={`t-${block.id}`}
              x={block.x}
              y={block.y}
              width={block.width}
              height={block.height}
              fill="none"
              stroke={block.color}
              strokeWidth={3}
              strokeDasharray="4"
            />
          ))}
        </svg>
      </div>

      {/* Guardar diseño y continuar */}
      <div className="mt-4">
        <button
          onClick={saveDesign}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Guardar y Volver al Juego
        </button>
      </div>
    </div>
  )
}
