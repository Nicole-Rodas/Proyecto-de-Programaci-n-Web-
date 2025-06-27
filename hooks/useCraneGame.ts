"use client"

import { useState, useEffect, useCallback } from "react"
import type { Block, Crane } from "../types/game"
import type { CustomLevel } from "../types/editor"
import { GAME_CONFIG, INITIAL_BLOCKS, generateRandomBlocks } from "../constants/game"
import { findDropPosition, checkWinCondition, canGrabBlock } from "../utils/collision"

export function useCraneGame() {
  const [mounted, setMounted] = useState(false)
  const [isCustomLevel, setIsCustomLevel] = useState(false)
  const [customOrderType, setCustomOrderType] = useState<string>("")
  const [levelInstructions, setLevelInstructions] = useState<string>("") // ← AGREGADO: Estado para instrucciones del nivel
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
    // Solo generar bloques aleatorios si no es un nivel personalizado
    if (!isCustomLevel) {
      setBlocks(generateRandomBlocks())
    }
  }, [isCustomLevel])

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
              if (checkWinCondition(newBlocks, isCustomLevel, customOrderType)) {
                setGameWon(true)
              }
            }, 100)

            return newBlocks
          })
        }
        return { ...prev, isGrabbing: false, grabbedBlock: null }
      } else {
        // Improved grabbing logic with better range for smaller blocks
        const blockToGrab = blocks.find(
          (block) =>
            !block.isGrabbed &&
            prev.x >= block.x - 15 && // Increased horizontal range
            prev.x <= block.x + block.width + 15 &&
            prev.y >= block.y - 30 && // Increased vertical range above
            prev.y <= block.y + block.height + 30 && // Increased vertical range below
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
  }, [blocks, mounted, isCustomLevel, customOrderType])

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

    // Solo generar bloques aleatorios si no es un nivel personalizado
    if (!isCustomLevel) {
      setBlocks(generateRandomBlocks())
    }
    setGameWon(false)
  }

  const startRandomGame = useCallback(() => {
    if (!mounted) return

    setIsCustomLevel(false)
    setCustomOrderType("")
    setLevelInstructions("") // ← AGREGADO: Limpiar instrucciones
    setCrane({
      x: GAME_CONFIG.GAME_WIDTH / 2,
      y: GAME_CONFIG.CRANE_MIN_Y,
      isGrabbing: false,
      grabbedBlock: null,
    })
    setBlocks(generateRandomBlocks())
    setGameWon(false)
  }, [mounted])

  const loadCustomLevel = useCallback(
    (level: CustomLevel) => {
      if (!mounted) return

      setIsCustomLevel(true)
      setCustomOrderType(level.orderType)
      setLevelInstructions(level.instructions || "") // ← AGREGADO: Cargar instrucciones del nivel

      // Convert editor blocks to game blocks with labels
      const gameBlocks: Block[] = level.blocks.map((editorBlock) => ({
        id: editorBlock.id,
        size: editorBlock.size,
        color: editorBlock.color,
        x: editorBlock.x,
        y: editorBlock.y,
        width: editorBlock.width,
        height: editorBlock.height,
        isGrabbed: false,
        label: editorBlock.label, // Mantener la etiqueta
      }))

      setBlocks(gameBlocks)
      setGameWon(false)
      setCrane({
        x: GAME_CONFIG.GAME_WIDTH / 2,
        y: GAME_CONFIG.CRANE_MIN_Y,
        isGrabbing: false,
        grabbedBlock: null,
      })
    },
    [mounted],
  )

  return {
    crane,
    blocks,
    gameWon,
    mounted,
    isCustomLevel,
    levelInstructions, // ← AGREGADO: Exportar instrucciones del nivel
    moveCrane,
    handleGrabRelease,
    resetGame,
    startRandomGame,
    loadCustomLevel,
  }
}
