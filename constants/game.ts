import type { Block } from "../types/game"

export const GAME_CONFIG = {
  GAME_WIDTH: 800,
  GAME_HEIGHT: 600,
  PLATFORM_WIDTH: 200,
  PLATFORM_HEIGHT: 20,
  PLATFORM_Y: 500,
  CRANE_SPEED: 5,
  CRANE_MIN_Y: 150,
  CRANE_MAX_Y: 480, // Increased from 450 to 480 to reach smaller blocks
} as const

export const PLATFORMS = [
  { x: 50, y: 500, width: 200, height: 20 },
  { x: 300, y: 500, width: 200, height: 20 },
  { x: 550, y: 500, width: 200, height: 20 },
]

// Bloques iniciales determinísticos para evitar problemas de hidratación
export const INITIAL_BLOCKS: Block[] = [
  { id: "1", size: 5, color: "#ef4444", x: 100, y: 420, width: 80, height: 80, isGrabbed: false },
  { id: "2", size: 4, color: "#3b82f6", x: 350, y: 440, width: 60, height: 60, isGrabbed: false },
  { id: "3", size: 3, color: "#22c55e", x: 600, y: 450, width: 50, height: 50, isGrabbed: false },
  { id: "4", size: 2, color: "#a855f7", x: 120, y: 340, width: 40, height: 40, isGrabbed: false },
  { id: "5", size: 1, color: "#93c5fd", x: 370, y: 380, width: 30, height: 30, isGrabbed: false },
]

export function generateRandomBlocks(): Block[] {
  const blocks = [
    { id: "1", size: 5, color: "#ef4444", width: 80, height: 80, isGrabbed: false },
    { id: "2", size: 4, color: "#3b82f6", width: 60, height: 60, isGrabbed: false },
    { id: "3", size: 3, color: "#22c55e", width: 50, height: 50, isGrabbed: false },
    { id: "4", size: 2, color: "#a855f7", width: 40, height: 40, isGrabbed: false },
    { id: "5", size: 1, color: "#93c5fd", width: 30, height: 30, isGrabbed: false },
  ]

  // Shuffle blocks array
  const shuffledBlocks = [...blocks].sort(() => Math.random() - 0.5)

  // Ensure at least one block per platform
  const platformAssignments = [0, 1, 2] // Left, Center, Right platforms
  const assignedBlocks: Block[] = []

  // Assign first 3 blocks to each platform (one per platform)
  for (let i = 0; i < 3; i++) {
    const platformIndex = platformAssignments[i]
    const platform = PLATFORMS[platformIndex]
    const block = shuffledBlocks[i]

    // Random position within platform bounds
    const x = platform.x + Math.random() * (platform.width - block.width)
    const y = GAME_CONFIG.PLATFORM_Y - block.height

    assignedBlocks.push({
      ...block,
      x,
      y,
    })
  }

  // Assign remaining 2 blocks to random platforms
  for (let i = 3; i < 5; i++) {
    const randomPlatformIndex = Math.floor(Math.random() * 3)
    const platform = PLATFORMS[randomPlatformIndex]
    const block = shuffledBlocks[i]

    // Check if there are already blocks on this platform
    const existingBlocks = assignedBlocks.filter(
      (b) => b.x >= platform.x - 20 && b.x <= platform.x + platform.width + 20,
    )

    let x = platform.x + Math.random() * (platform.width - block.width)
    let y = GAME_CONFIG.PLATFORM_Y - block.height

    // If there are existing blocks, stack on top of the highest one
    if (existingBlocks.length > 0) {
      const highestBlock = existingBlocks.sort((a, b) => a.y - b.y)[0]
      y = highestBlock.y - block.height
      x = highestBlock.x + (Math.random() - 0.5) * 20 // Small random offset

      // Ensure block stays within platform bounds
      x = Math.max(platform.x, Math.min(x, platform.x + platform.width - block.width))
    }

    assignedBlocks.push({
      ...block,
      x,
      y,
    })
  }

  return assignedBlocks
}
