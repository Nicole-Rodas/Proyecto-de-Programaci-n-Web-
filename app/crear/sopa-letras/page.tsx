"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

interface Cell {
  row: number
  col: number
}

interface FoundWord {
  word: string
  cells: Cell[]
}

export default function SopaLetras() {
  const [words, setWords] = useState<string[]>(["", "", "", ""])
  const [grid, setGrid] = useState<string[][]>([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedCells, setSelectedCells] = useState<Cell[]>([])
  const [foundWords, setFoundWords] = useState<FoundWord[]>([])
  const gridSize = 10

  const handleWordChange = (index: number, value: string) => {
    // Normalizar texto: quitar acentos y convertir a mayúsculas
    const normalizedValue = value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()

    const newWords = [...words]
    newWords[index] = normalizedValue
    setWords(newWords)
  }

  const addWord = () => {
    setWords([...words, ""])
  }

  const generateWordSearch = () => {
    // Filter out empty words and words that are too long
    const validWords = words.filter((word) => word.trim() !== "" && word.length <= gridSize)

    if (validWords.length === 0) return

    // Initialize empty grid with empty strings
    const newGrid: string[][] = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(""))

    // Información de ubicación de palabras para debugging
    const wordPlacements: {
      word: string
      placed: boolean
      position?: { row: number; col: number; direction: string }
    }[] = []

    // Try to place each word
    validWords.forEach((word) => {
      let placed = false
      let attempts = 0
      let finalPosition = null

      while (!placed && attempts < 100) {
        attempts++

        // Random direction (0: horizontal, 1: vertical, 2: diagonal down, 3: diagonal up)
        const direction = Math.floor(Math.random() * 4)

        let row, col, rowChange, colChange
        let directionName = ""

        switch (direction) {
          case 0: // Horizontal
            row = Math.floor(Math.random() * gridSize)
            col = Math.floor(Math.random() * (gridSize - word.length + 1))
            rowChange = 0
            colChange = 1
            directionName = "horizontal"
            break
          case 1: // Vertical
            row = Math.floor(Math.random() * (gridSize - word.length + 1))
            col = Math.floor(Math.random() * gridSize)
            rowChange = 1
            colChange = 0
            directionName = "vertical"
            break
          case 2: // Diagonal down
            row = Math.floor(Math.random() * (gridSize - word.length + 1))
            col = Math.floor(Math.random() * (gridSize - word.length + 1))
            rowChange = 1
            colChange = 1
            directionName = "diagonal-down"
            break
          case 3: // Diagonal up
            row = Math.floor(Math.random() * (gridSize - word.length + 1)) + word.length - 1
            col = Math.floor(Math.random() * (gridSize - word.length + 1))
            rowChange = -1
            colChange = 1
            directionName = "diagonal-up"
            break
          default:
            row = 0
            col = 0
            rowChange = 0
            colChange = 0
            directionName = "unknown"
        }

        // Check if word fits
        let fits = true
        for (let i = 0; i < word.length; i++) {
          const r = row + i * rowChange
          const c = col + i * colChange

          if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) {
            fits = false
            break
          }

          if (newGrid[r][c] !== "" && newGrid[r][c] !== word[i]) {
            fits = false
            break
          }
        }

        // Place word if it fits
        if (fits) {
          for (let i = 0; i < word.length; i++) {
            const r = row + i * rowChange
            const c = col + i * colChange
            newGrid[r][c] = word[i]
          }
          placed = true
          finalPosition = { row, col, direction: directionName }
        }
      }

      // Registrar si la palabra se colocó correctamente
      wordPlacements.push({
        word,
        placed,
        position: finalPosition,
      })
    })

    // Fill remaining empty cells with random letters
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (newGrid[i][j] === "") {
          newGrid[i][j] = letters.charAt(Math.floor(Math.random() * letters.length))
        }
      }
    }

    // Log para debugging
    console.log("Palabras colocadas:", wordPlacements)

    setGrid(newGrid)
    setSelectedCells([])
    setFoundWords([])
  }

  // Función para manejar el inicio de la selección
  const handleCellMouseDown = (row: number, col: number) => {
    setSelectedCells([{ row, col }])
    setIsSelecting(true)
  }

  // Función para manejar el movimiento sobre las celdas
  const handleCellMouseOver = (row: number, col: number) => {
    if (!isSelecting) return

    // Si ya está seleccionada, no hacer nada
    if (selectedCells.some((cell) => cell.row === row && cell.col === col)) return

    // Solo permitir selecciones en línea recta (horizontal, vertical o diagonal)
    if (selectedCells.length > 0) {
      const lastCell = selectedCells[selectedCells.length - 1]

      // Calcular la dirección de la selección
      const rowDiff = row - lastCell.row
      const colDiff = col - lastCell.col

      // Si no es adyacente, no hacer nada
      if (Math.abs(rowDiff) > 1 || Math.abs(colDiff) > 1) return

      // Si es el primer movimiento, guardar la dirección
      if (selectedCells.length === 1) {
        setSelectedCells([...selectedCells, { row, col }])
      } else {
        // Verificar que sigue la misma dirección
        const prevCell = selectedCells[selectedCells.length - 2]
        const prevRowDiff = lastCell.row - prevCell.row
        const prevColDiff = lastCell.col - prevCell.col

        if (rowDiff === prevRowDiff && colDiff === prevColDiff) {
          setSelectedCells([...selectedCells, { row, col }])
        }
      }
    }
  }

  // Función para verificar si la palabra seleccionada está en la lista
  const checkSelectedWord = () => {
    if (selectedCells.length < 2) {
      setSelectedCells([])
      return
    }

    // Construir la palabra a partir de las celdas seleccionadas
    let selectedWord = ""
    selectedCells.forEach((cell) => {
      selectedWord += grid[cell.row][cell.col]
    })

    // Verificar si la palabra está en la lista (también al revés)
    const reversedWord = selectedWord.split("").reverse().join("")
    const validWords = words.filter((word) => word.trim() !== "")

    if (validWords.includes(selectedWord) || validWords.includes(reversedWord)) {
      // Marcar como encontrada
      setFoundWords([...foundWords, { word: selectedWord, cells: [...selectedCells] }])
    }

    // Limpiar selección
    setSelectedCells([])
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Sopa de Letras</h1>
          <Button className="quizora-green text-white">Guardar Plantilla</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Inserta las palabras a esconder</h2>

            {words.map((word, index) => (
              <Input
                key={index}
                placeholder={`Palabra ${index + 1}`}
                value={word}
                onChange={(e) => handleWordChange(index, e.target.value)}
                className="w-full p-4 text-lg rounded-full"
              />
            ))}

            <Button
              variant="outline"
              className="w-full py-6 rounded-lg bg-slate-200 hover:bg-slate-300"
              onClick={addWord}
            >
              <Plus className="h-6 w-6 text-gray-500" />
            </Button>

            <Button
              className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white text-xl mt-4"
              onClick={generateWordSearch}
            >
              Generar Sopa de Letras
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center">
            {/* Lista de palabras a encontrar */}
            <div className="mb-4 w-full">
              <h3 className="text-lg font-medium mb-2">Palabras a encontrar:</h3>
              <div className="flex flex-wrap gap-2">
                {words
                  .filter((word) => word.trim() !== "")
                  .map((word, index) => (
                    <div key={index} className="px-3 py-1 bg-blue-100 rounded-full text-sm font-medium">
                      {word}
                    </div>
                  ))}
              </div>
            </div>

            {grid.length > 0 && (
              <div className="relative">
                {words.filter((word) => word.trim() !== "").length > 0 && grid.length > 0 && (
                  <p className="text-sm text-green-600 mb-2">
                    Sopa de letras generada con {words.filter((word) => word.trim() !== "").length} palabras
                  </p>
                )}
                <div
                  className="grid grid-cols-10 gap-1 border border-gray-300"
                  onMouseDown={() => setIsSelecting(true)}
                  onMouseUp={() => {
                    setIsSelecting(false)
                    checkSelectedWord()
                  }}
                  onMouseLeave={() => setIsSelecting(false)}
                >
                  {grid.map((row, rowIndex) =>
                    row.map((letter, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-10 h-10 flex items-center justify-center border border-gray-200 font-bold cursor-pointer select-none
                          ${selectedCells.some((cell) => cell.row === rowIndex && cell.col === colIndex) ? "bg-yellow-200" : ""}
                          ${foundWords.some((word) => word.cells.some((cell) => cell.row === rowIndex && cell.col === colIndex)) ? "bg-green-200" : ""}
                        `}
                        onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                        onMouseOver={() => handleCellMouseOver(rowIndex, colIndex)}
                      >
                        {letter}
                      </div>
                    )),
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
