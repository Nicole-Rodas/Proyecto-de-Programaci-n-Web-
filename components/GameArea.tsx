// GameArea.tsx
import React from 'react'
import { Block, Crane } from '../types/game'
import { GAME_CONFIG, PLATFORMS } from '../constants/game'

interface GameAreaProps {
  crane: Crane
  blocks: Block[]
  grabbedBlock: Block | null // Definir esta propiedad en las props
}

export function GameArea({ crane, blocks, grabbedBlock }: GameAreaProps) {
  return (
    <div
      className="relative bg-gray-200 border-4 border-black"
      style={{ width: GAME_CONFIG.GAME_WIDTH, height: GAME_CONFIG.GAME_HEIGHT }}
    >
      <svg width={GAME_CONFIG.GAME_WIDTH} height={GAME_CONFIG.GAME_HEIGHT} className="absolute inset-0">
        <rect x="0" y="140" width={GAME_CONFIG.GAME_WIDTH} height="10" fill="#333" />

        <g>
          <rect x={crane.x - 15} y="130" width="30" height="20" fill="#666" />
          <line x1={crane.x} y1="150" x2={crane.x} y2={crane.y} stroke="#333" strokeWidth="2" />
          <g transform={`translate(${crane.x}, ${crane.y})`}>
            <circle cx="0" cy="0" r="15" fill="#17a2b8" />
            <circle cx="0" cy="0" r="8" fill="white" />
            <polygon points="-12,8 12,8 8,20 -8,20" fill="#666" />
            {crane.isGrabbing && <circle cx="0" cy="0" r="5" fill="#dc3545" />}
          </g>
        </g>

        {PLATFORMS.map((platform, index) => (
          <rect key={index} x={platform.x} y={platform.y} width={platform.width} height={platform.height} fill="#666" />
        ))}

        {blocks.map((block) => (
          <rect
            key={block.id}
            x={block.x}
            y={block.y}
            width={block.width}
            height={block.height}
            fill={block.color}
            stroke={block.isGrabbed ? "#fff" : "none"}
            strokeWidth={block.isGrabbed ? "3" : "0"}
          />
        ))}

        {/* Renderizar el bloque que está siendo agarrado */}
        {grabbedBlock && (
          <rect
            x={grabbedBlock.x}
            y={grabbedBlock.y}
            width={grabbedBlock.width}
            height={grabbedBlock.height}
            fill={grabbedBlock.color}
            stroke="#fff"
            strokeWidth="3"
          />
        )}
      </svg>
    </div>
  )
}
