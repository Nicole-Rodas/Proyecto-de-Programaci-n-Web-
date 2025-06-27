import type { Block } from "../types/game"
import { GAME_CONFIG, PLATFORMS } from "../constants/game"

export function findDropPosition(
  craneX: number,
  craneY: number,
  blockToPlace: Block,
  allBlocks: Block[],
): { x: number; y: number } {
  const platform = PLATFORMS.find((p) => craneX >= p.x && craneX <= p.x + p.width)

  if (platform) {
    return findStackPosition(craneX - blockToPlace.width / 2, blockToPlace, allBlocks, platform.x)
  }

  return { x: craneX - blockToPlace.width / 2, y: GAME_CONFIG.PLATFORM_Y - blockToPlace.height }
}

function findStackPosition(
  dropX: number,
  blockToPlace: Block,
  allBlocks: Block[],
  platformX: number,
): { x: number; y: number } {
  const platformBlocks = allBlocks
    .filter(
      (block) =>
        block.id !== blockToPlace.id &&
        block.x >= platformX - 30 &&
        block.x <= platformX + GAME_CONFIG.PLATFORM_WIDTH + 30,
    )
    .sort((a, b) => a.y - b.y)

  if (platformBlocks.length === 0) {
    return {
      x: Math.max(platformX, Math.min(dropX, platformX + GAME_CONFIG.PLATFORM_WIDTH - blockToPlace.width)),
      y: GAME_CONFIG.PLATFORM_Y - blockToPlace.height,
    }
  }

  let targetY = GAME_CONFIG.PLATFORM_Y - blockToPlace.height

  for (const existingBlock of platformBlocks) {
    const blockLeft = Math.max(platformX, Math.min(dropX, platformX + GAME_CONFIG.PLATFORM_WIDTH - blockToPlace.width))
    const blockRight = blockLeft + blockToPlace.width
    const existingLeft = existingBlock.x
    const existingRight = existingBlock.x + existingBlock.width

    if (blockLeft < existingRight && blockRight > existingLeft) {
      targetY = Math.min(targetY, existingBlock.y - blockToPlace.height)
    }
  }

  return {
    x: Math.max(platformX, Math.min(dropX, platformX + GAME_CONFIG.PLATFORM_WIDTH - blockToPlace.width)),
    y: targetY,
  }
}

export function canGrabBlock(blockToGrab: Block, allBlocks: Block[]): boolean {
  const blocksAbove = allBlocks.filter(
    (block) =>
      block.id !== blockToGrab.id &&
      block.y < blockToGrab.y &&
      block.x < blockToGrab.x + blockToGrab.width &&
      block.x + block.width > blockToGrab.x,
  )

  return blocksAbove.length === 0
}

// Fix the win condition logic for custom levels
export function checkWinCondition(blocks: Block[], isCustomLevel = false, orderType?: string): boolean {
  if (isCustomLevel) {
    // Para niveles personalizados, verificar si todos los bloques están en orden correcto
    // en cualquier plataforma
    for (const platform of PLATFORMS) {
      const platformBlocks = blocks
        .filter((block) => block.x >= platform.x - 20 && block.x <= platform.x + GAME_CONFIG.PLATFORM_WIDTH + 20)
        .sort((a, b) => b.y - a.y) // Sort by Y position (bottom to top)

      if (platformBlocks.length === blocks.length) {
        // Verificar orden según el tipo
        let correctOrder = false

        if (orderType === "numeric") {
          // Para numérico: verificar que las etiquetas estén en orden ascendente de abajo hacia arriba
          correctOrder = platformBlocks.every((block, index) => {
            if (index === 0) return true // El primer bloque (más abajo) siempre está bien
            const currentLabel = Number.parseInt(block.label || "0")
            const previousLabel = Number.parseInt(platformBlocks[index - 1].label || "0")
            return currentLabel > previousLabel
          })
        } else if (orderType === "alphabetic") {
          // Para alfabético: verificar que las letras estén en orden alfabético de abajo hacia arriba
          correctOrder = platformBlocks.every((block, index) => {
            if (index === 0) return true // El primer bloque (más abajo) siempre está bien
            const currentLabel = block.label || ""
            const previousLabel = platformBlocks[index - 1].label || ""
            return currentLabel > previousLabel
          })
        } else {
          // Para tamaño: verificar que estén en orden por tamaño (más grande abajo)
          correctOrder = platformBlocks.every((block, index) => {
            if (index === 0) return true
            return block.size <= platformBlocks[index - 1].size
          })
        }

        if (correctOrder) {
          return true
        }
      }
    }
    return false
  }

  // Lógica original para niveles aleatorios
  for (const platform of PLATFORMS) {
    const platformBlocks = blocks
      .filter((block) => block.x >= platform.x - 20 && block.x <= platform.x + GAME_CONFIG.PLATFORM_WIDTH + 20)
      .sort((a, b) => b.y - a.y)

    if (platformBlocks.length === 5) {
      const correctOrder = platformBlocks.every((block, index) => block.size === 5 - index)
      if (correctOrder) {
        return true
      }
    }
  }

  return false
}
