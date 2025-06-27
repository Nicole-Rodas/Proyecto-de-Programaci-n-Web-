"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import type { EditorBlock, OrderType } from "../types/editor"
import { findDropPosition } from "../utils/collision"

export function useLevelEditor() {
  const [isEditorMode, setIsEditorMode] = useState(false)
  const [blocks, setBlocks] = useState<EditorBlock[]>([])
  const [platformCount, setPlatformCount] = useState(3)
  const [orderType, setOrderType] = useState<OrderType>("numeric")
  const [instructions, setInstructions] = useState("") // ← AGREGADO: Estado para instrucciones
  const [isDrawing, setIsDrawing] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [previewBlock, setPreviewBlock] = useState<{ x: number; y: number; size: number } | null>(null)
  const [blockHistory, setBlockHistory] = useState<EditorBlock[][]>([])

  const svgRef = useRef<SVGSVGElement>(null)
  const blockCounter = useRef(0)

  const getBlockLabel = useCallback((order: number, type: OrderType): string => {
    switch (type) {
      case "numeric":
        return order.toString()
      case "alphabetic":
        return String.fromCharCode(64 + order) // A, B, C...
      case "size":
        return ""
      default:
        return order.toString()
    }
  }, [])

  const updateBlockLabels = useCallback(
    (newOrderType: OrderType) => {
      setBlocks((prevBlocks) =>
        prevBlocks.map((block) => ({
          ...block,
          label: getBlockLabel(block.order, newOrderType),
        })),
      )
    },
    [getBlockLabel],
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isEditorMode) return

      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Don't start drawing if clicking on existing blocks
      const clickedBlock = blocks.find(
        (block) => x >= block.x && x <= block.x + block.width && y >= block.y && y <= block.y + block.height,
      )

      if (clickedBlock) return

      setIsDrawing(true)
      setDragStart({ x, y })
      setPreviewBlock({ x, y, size: 0 })
    },
    [isEditorMode, blocks],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isDrawing || !dragStart) return

      const rect = e.currentTarget.getBoundingClientRect()
      const currentX = e.clientX - rect.left
      const currentY = e.clientY - rect.top

      const deltaX = Math.abs(currentX - dragStart.x)
      const size = Math.max(20, Math.min(80, deltaX))

      setPreviewBlock({
        x: Math.min(dragStart.x, currentX),
        y: dragStart.y,
        size,
      })
    },
    [isDrawing, dragStart],
  )

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isDrawing || !dragStart || !previewBlock) return

      if (previewBlock.size < 20) {
        setIsDrawing(false)
        setDragStart(null)
        setPreviewBlock(null)
        return
      }

      // Save current state for undo
      setBlockHistory((prev) => [...prev, blocks])

      blockCounter.current += 1
      const newBlock: EditorBlock = {
        id: `editor-block-${blockCounter.current}`,
        x: previewBlock.x,
        y: previewBlock.y,
        width: previewBlock.size,
        height: previewBlock.size,
        size: Math.ceil(previewBlock.size / 16),
        color: `hsl(${(blockCounter.current * 137.5) % 360}, 70%, 50%)`,
        order: blockCounter.current,
        label: getBlockLabel(blockCounter.current, orderType),
      }

      // Apply physics - find drop position
      // Convertir EditorBlocks a Blocks agregando isGrabbed
      const tempBlocks = blocks.map((block) => ({ ...block, isGrabbed: false }))
      // Crear un bloque temporal con la propiedad isGrabbed para la función de colisión
      const tempBlock = { ...newBlock, isGrabbed: false }
      const dropPosition = findDropPosition(newBlock.x + newBlock.width / 2, newBlock.y, tempBlock, tempBlocks)

      newBlock.x = dropPosition.x
      newBlock.y = dropPosition.y

      setBlocks((prev) => [...prev, newBlock])
      setIsDrawing(false)
      setDragStart(null)
      setPreviewBlock(null)
    },
    [isDrawing, dragStart, previewBlock, blocks, orderType, getBlockLabel],
  )

  const handleOrderTypeChange = useCallback(
    (newType: OrderType) => {
      setOrderType(newType)
      updateBlockLabels(newType)
    },
    [updateBlockLabels],
  )

  const undoLastBlock = useCallback(() => {
    if (blockHistory.length > 0) {
      const previousState = blockHistory[blockHistory.length - 1]
      setBlocks(previousState)
      setBlockHistory((prev) => prev.slice(0, -1))
      blockCounter.current = previousState.length
    }
  }, [blockHistory])

  const saveLevel = useCallback(() => {
    if (blocks.length === 0) {
      alert("Agrega al menos un bloque antes de guardar")
      return
    }

    const level = {
      id: `custom-level-${Date.now()}`,
      name: `Nivel Personalizado ${Date.now()}`,
      platforms: platformCount,
      blocks,
      orderType,
      instructions, // ← AGREGADO: Incluir instrucciones al guardar
      createdAt: new Date(),
    }

    // Save to localStorage
    const savedLevels = JSON.parse(localStorage.getItem("customLevels") || "[]")
    savedLevels.push(level)
    localStorage.setItem("customLevels", JSON.stringify(savedLevels))

    alert("¡Nivel creado correctamente!")
  }, [blocks, platformCount, orderType, instructions]) // ← AGREGADO: instructions en dependencias

  const clearEditor = useCallback(() => {
    setBlocks([])
    setBlockHistory([])
    setInstructions("") // ← AGREGADO: Limpiar instrucciones
    blockCounter.current = 0
  }, [])

  const toggleEditorMode = useCallback(() => {
    setIsEditorMode((prev) => !prev)
    if (isEditorMode) {
      clearEditor()
    }
  }, [isEditorMode, clearEditor])

  return {
    isEditorMode,
    blocks,
    platformCount,
    orderType,
    instructions, // ← AGREGADO: Exportar estado de instrucciones
    previewBlock,
    svgRef,
    toggleEditorMode,
    setPlatformCount,
    handleOrderTypeChange,
    setInstructions, // ← AGREGADO: Exportar función para cambiar instrucciones
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    undoLastBlock,
    saveLevel,
    clearEditor,
    canUndo: blockHistory.length > 0,
  }
}
