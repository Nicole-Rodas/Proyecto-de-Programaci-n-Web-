// CraneGame.tsx completo
"use client";

import { useState, useEffect } from "react";
import { GameHeader } from "../../components/GameHeader";
import { GameArea } from "../../components/GameArea";
import { MobileControls } from "../../components/MobileControls";
import { WinModal } from "../../components/WinModal";
import { LevelEditor } from "../../components/LevelEditor";
import { GameModeSelector } from "../../components/GameModeSelector";
import { CustomLevelsList } from "../../components/CustomLevelsList";
import { useKeyboard } from "../../hooks/useKeyboard";
import { useCraneGame } from "../../hooks/useCraneGame";
import { useLevelEditor } from "../../hooks/useLevelEditor";
import type { CustomLevel } from "../../types/editor";

type GameMode = "menu" | "play" | "editor" | "custom";

export default function CraneGame() {
  const [gameMode, setGameMode] = useState<GameMode>("menu");
  const { keys } = useKeyboard();
  const {
    crane,
    blocks,
    gameWon,
    mounted,
    isCustomLevel,
    levelInstructions,
    moveCrane,
    handleGrabRelease,
    resetGame,
    startRandomGame,
    loadCustomLevel,
  } = useCraneGame();
  const {
    isEditorMode,
    blocks: editorBlocks,
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
    canUndo,
    clearEditor,
    loadLevelForEdit,
  } = useLevelEditor();

  useEffect(() => {
    if (!mounted || gameMode !== "play") return;
    const interval = setInterval(() => {
      if (keys.has("arrowleft") || keys.has("a")) moveCrane("left");
      if (keys.has("arrowright") || keys.has("d")) moveCrane("right");
      if (keys.has("arrowup") || keys.has("w")) moveCrane("up");
      if (keys.has("arrowdown") || keys.has("s")) moveCrane("down");
    }, 16);
    return () => clearInterval(interval);
  }, [keys, moveCrane, mounted, gameMode]);

  useEffect(() => {
    if (!mounted || gameMode !== "play") return;
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        handleGrabRelease();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleGrabRelease, mounted, gameMode]);

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === "editor") {
      toggleEditorMode();
      clearEditor();
    } else if (mode === "play") {
      startRandomGame();
    }
  };

  const handlePlayCustomLevel = (level: CustomLevel) => {
    loadCustomLevel(level);
    setGameMode("play");
  };

  const handleEditLevel = (level: CustomLevel) => {
    loadLevelForEdit(level);
    setGameMode("editor");
  };

  const handleBackToMenu = () => {
    setGameMode("menu");
    if (isEditorMode) toggleEditorMode();
  };

  const handleResetGame = () => {
    if (isCustomLevel) resetGame();
    else startRandomGame();
  };

  if (!mounted && gameMode === "play") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-bold">Cargando juego...</div>
      </div>
    );
  }

  if (gameMode === "menu") {
    return <GameModeSelector onModeSelect={handleModeSelect} />;
  }

 if (gameMode === "custom") {
  return (
    <CustomLevelsList
      onPlayLevel={handlePlayCustomLevel}
      onBack={handleBackToMenu}
      onEditLevel={(level) => {
        loadLevelForEdit(level);   // ← Carga el nivel seleccionado
        toggleEditorMode();        // ← Activa el modo editor (necesario para permitir dibujar/borrar)
        setGameMode("editor");     // ← Cambia la vista al editor
      }}
    />
  );
}

  if (gameMode === "editor") {
    return (
      <div>
        <div className="fixed top-4 left-4 z-10">
          <button onClick={handleBackToMenu} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            ← Volver al Menú
          </button>
        </div>
        <LevelEditor
          blocks={editorBlocks}
          platformCount={platformCount}
          orderType={orderType}
          instructions={instructions}
          previewBlock={previewBlock}
          svgRef={svgRef}
          onPlatformCountChange={setPlatformCount}
          onOrderTypeChange={handleOrderTypeChange}
          onInstructionsChange={setInstructions}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onUndo={undoLastBlock}
          onSave={saveLevel}
          canUndo={canUndo}
          onClear={clearEditor}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="fixed top-4 left-4 z-10">
        <button onClick={handleBackToMenu} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          ← Volver al Menú
        </button>
      </div>
      <GameHeader onGrabRelease={handleGrabRelease} onMove={moveCrane} />
      <div className="relative">
        <GameArea crane={crane} blocks={blocks} instructions={levelInstructions} />
        {gameWon && <WinModal onRestart={handleResetGame} />}
      </div>
      <MobileControls onMove={moveCrane} onGrabRelease={handleGrabRelease} isGrabbing={crane.isGrabbing} />
      <div className="mt-4 text-center text-sm text-gray-600 max-w-2xl">
        <p className="mb-2">
          <strong>Controles:</strong> Usa las flechas del teclado (↑↓←→) para mover la grúa y la barra espaciadora para
          agarrar/soltar bloques.
        </p>
        <p className="mb-2">
          <strong>Objetivo:</strong> Apila todos los bloques en orden {isCustomLevel ? "correcto" : "descendente (más grande abajo, más pequeño arriba)"} en cualquiera de las 3 plataformas.
        </p>
        <p className="text-xs text-gray-500">
          <strong>Nota:</strong> Solo puedes agarrar el bloque que está en la parte superior de cada pila.
        </p>
      </div>
    </div>
  );
}
