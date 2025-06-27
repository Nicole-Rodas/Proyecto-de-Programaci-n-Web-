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

export function checkWinCondition(blocks: Block[]): boolean {
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
