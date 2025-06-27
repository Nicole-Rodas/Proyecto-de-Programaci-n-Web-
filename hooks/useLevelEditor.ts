// useLevelEditor.ts con corrección de sobrescritura y verificación de ID
"use client";

import type React from "react";
import { useState, useCallback, useRef } from "react";
import type { EditorBlock, OrderType, CustomLevel } from "../types/editor";
import { findDropPosition } from "../utils/collision";
import { getFirestore, setDoc, doc, Timestamp } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export function useLevelEditor() {
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);
  const [platformCount, setPlatformCount] = useState(3);
  const [orderType, setOrderType] = useState<OrderType>("numeric");
  const [instructions, setInstructions] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [previewBlock, setPreviewBlock] = useState<{ x: number; y: number; size: number } | null>(null);
  const [blockHistory, setBlockHistory] = useState<EditorBlock[][]>([]);
  const [editingLevelId, setEditingLevelId] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const blockCounter = useRef(0);
  const router = useRouter();

  const getBlockLabel = useCallback((order: number, type: OrderType): string => {
    switch (type) {
      case "numeric": return order.toString();
      case "alphabetic": return String.fromCharCode(64 + order);
      case "size": return "";
      default: return order.toString();
    }
  }, []);

  const updateBlockLabels = useCallback((newOrderType: OrderType) => {
    setBlocks((prevBlocks) => prevBlocks.map((block) => ({
      ...block,
      label: getBlockLabel(block.order, newOrderType),
    })));
  }, [getBlockLabel]);

  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!isEditorMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clickedBlock = blocks.find((block) => x >= block.x && x <= block.x + block.width && y >= block.y && y <= block.y + block.height);
    if (clickedBlock) return;
    setIsDrawing(true);
    setDragStart({ x, y });
    setPreviewBlock({ x, y, size: 0 });
  }, [isEditorMode, blocks]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing || !dragStart) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const deltaX = Math.abs(currentX - dragStart.x);
    const size = Math.max(20, Math.min(80, deltaX));
    setPreviewBlock({ x: Math.min(dragStart.x, currentX), y: dragStart.y, size });
  }, [isDrawing, dragStart]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !dragStart || !previewBlock) return;
    if (previewBlock.size < 20) {
      setIsDrawing(false);
      setDragStart(null);
      setPreviewBlock(null);
      return;
    }
    setBlockHistory((prev) => [...prev, blocks]);
    blockCounter.current += 1;
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
    };
    const tempBlocks = blocks.map((block) => ({ ...block, isGrabbed: false }));
    const tempBlock = { ...newBlock, isGrabbed: false };
    const dropPosition = findDropPosition(newBlock.x + newBlock.width / 2, newBlock.y, tempBlock, tempBlocks);
    newBlock.x = dropPosition.x;
    newBlock.y = dropPosition.y;
    setBlocks((prev) => [...prev, newBlock]);
    setIsDrawing(false);
    setDragStart(null);
    setPreviewBlock(null);
  }, [isDrawing, dragStart, previewBlock, blocks, orderType, getBlockLabel]);

  const handleOrderTypeChange = useCallback((newType: OrderType) => {
    setOrderType(newType);
    updateBlockLabels(newType);
  }, [updateBlockLabels]);

  const undoLastBlock = useCallback(() => {
    if (blockHistory.length > 0) {
      const previousState = blockHistory[blockHistory.length - 1];
      setBlocks(previousState);
      setBlockHistory((prev) => prev.slice(0, -1));
      blockCounter.current = previousState.length;
    }
  }, [blockHistory]);

  const saveLevel = useCallback(async () => {
    if (blocks.length === 0) {
      alert("Agrega al menos un bloque antes de guardar");
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      alert("Debes iniciar sesión para guardar el nivel");
      return;
    }

    console.log("ID al guardar:", editingLevelId);

    const db = getFirestore();
    const id = editingLevelId ?? `custom-level-${Date.now()}`;
    const level = {
      id,
      userId: user.uid,
      name: `Nivel Personalizado ${id}`,
      platforms: platformCount,
      blocks,
      orderType,
      instructions,
      createdAt: Timestamp.now(),
    };
    try {
      await setDoc(doc(db, "plantillas", id), level);
      alert(editingLevelId ? "¡Nivel actualizado correctamente!" : "¡Nivel creado y guardado en Firebase! ✅");
      setEditingLevelId(null);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
      alert("Ocurrió un error al guardar el nivel ❌");
    }
  }, [blocks, platformCount, orderType, instructions, editingLevelId, router]);

  const clearEditor = useCallback(() => {
    setBlocks([]);
    setBlockHistory([]);
    setInstructions("");
    blockCounter.current = 0;
    setEditingLevelId(null);
  }, []);

  const toggleEditorMode = useCallback(() => {
    setIsEditorMode((prev) => {
      const newMode = !prev;
      if (!newMode) clearEditor();
      return newMode;
    });
  }, [clearEditor]);

  const loadLevelForEdit = useCallback((level: CustomLevel) => {
    console.log("ID al editar:", level.id);
    setPlatformCount(level.platforms);
    setInstructions(level.instructions);
    setOrderType(level.orderType);
    setBlocks(level.blocks);
    setEditingLevelId(level.id);
    blockCounter.current = level.blocks.length;
    setBlockHistory([level.blocks]);
  }, []);

  return {
    isEditorMode,
    blocks,
    platformCount,
    orderType,
    instructions,
    previewBlock,
    svgRef,
    toggleEditorMode,
    setPlatformCount,
    handleOrderTypeChange,
    setInstructions,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    undoLastBlock,
    saveLevel,
    clearEditor,
    canUndo: blockHistory.length > 0,
    loadLevelForEdit,
  };
}
