"use client"

import { useState, useEffect, useCallback } from "react"
import type { Block, Crane } from "../types/game"
import { GAME_CONFIG, INITIAL_BLOCKS, generateRandomBlocks } from "../constants/game"
import { findDropPosition, checkWinCondition, canGrabBlock } from "../utils/collision"

export function useCraneGame() {
  const [mounted, setMounted] = useState(false)
  const [crane, setCrane] = useState<Crane>({
    x: GAME_CONFIG.GAME_WIDTH / 2,
    y: GAME_CONFIG.CRANE_MIN_Y,
    isGrabbing: false,
    grabbedBlock: null,
  })

  const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS)
  const [gameWon, setGameWon] = useState(false)

  // Generar bloques aleatorios solo en el cliente
  useEffect(() => {
    setMounted(true)
    setBlocks(generateRandomBlocks())
  }, [])

  const moveCrane = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (!mounted) return

      setCrane((prev) => {
        let newX = prev.x
        let newY = prev.y

        switch (direction) {
          case "left":
            newX = Math.max(50, prev.x - GAME_CONFIG.CRANE_SPEED)
            break
          case "right":
            newX = Math.min(GAME_CONFIG.GAME_WIDTH - 50, prev.x + GAME_CONFIG.CRANE_SPEED)
            break
          case "up":
            newY = Math.max(GAME_CONFIG.CRANE_MIN_Y, prev.y - GAME_CONFIG.CRANE_SPEED)
            break
          case "down":
            newY = Math.min(GAME_CONFIG.CRANE_MAX_Y, prev.y + GAME_CONFIG.CRANE_SPEED)
            break
        }

        return { ...prev, x: newX, y: newY }
      })
    },
    [mounted],
  )

  const handleGrabRelease = useCallback(() => {
    if (!mounted) return

    setCrane((prev) => {
      if (prev.grabbedBlock) {
        const grabbedBlock = blocks.find((b) => b.id === prev.grabbedBlock)
        if (grabbedBlock) {
          setBlocks((prevBlocks) => {
            const newBlocks = prevBlocks.map((block) => {
              if (block.id === prev.grabbedBlock) {
                const dropPosition = findDropPosition(prev.x, prev.y, block, prevBlocks)
                return {
                  ...block,
                  x: dropPosition.x,
                  y: dropPosition.y,
                  isGrabbed: false,
                }
              }
              return block
            })

            setTimeout(() => {
              if (checkWinCondition(newBlocks)) {
                setGameWon(true)
              }
            }, 100)

            return newBlocks
          })
        }
        return { ...prev, isGrabbing: false, grabbedBlock: null }
      } else {
        const blockToGrab = blocks.find(
          (block) =>
            !block.isGrabbed &&
            prev.x >= block.x - 10 &&
            prev.x <= block.x + block.width + 10 &&
            prev.y >= block.y - 20 &&
            prev.y <= block.y + block.height + 20 &&
            canGrabBlock(block, blocks),
        )

        if (blockToGrab) {
          setBlocks((prevBlocks) =>
            prevBlocks.map((block) => (block.id === blockToGrab.id ? { ...block, isGrabbed: true } : block)),
          )
          return { ...prev, isGrabbing: true, grabbedBlock: blockToGrab.id }
        }
        return prev
      }
    })
  }, [blocks, mounted])

  useEffect(() => {
    if (crane.grabbedBlock && mounted) {
      setBlocks((prev) =>
        prev.map((block) =>
          block.id === crane.grabbedBlock ? { ...block, x: crane.x - block.width / 2, y: crane.y + 30 } : block,
        ),
      )
    }
  }, [crane.x, crane.y, crane.grabbedBlock, mounted])

  const resetGame = () => {
    if (!mounted) return

    setCrane({
      x: GAME_CONFIG.GAME_WIDTH / 2,
      y: GAME_CONFIG.CRANE_MIN_Y,
      isGrabbing: false,
      grabbedBlock: null,
    })
    setBlocks(generateRandomBlocks())
    setGameWon(false)
  }

  return {
    crane,
    blocks,
    gameWon,
    mounted,
    moveCrane,
    handleGrabRelease,
    resetGame,
  }
}
