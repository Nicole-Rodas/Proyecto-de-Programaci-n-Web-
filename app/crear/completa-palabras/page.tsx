"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

export default function CompletaPalabras() {
  const [words, setWords] = useState<string[]>(["", "", "", ""])
  const [displayWord, setDisplayWord] = useState<string>("CASAS")
  const [selectedCell, setSelectedCell] = useState<number | null>(null)

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...words]
    newWords[index] = value.toUpperCase()
    setWords(newWords)
  }

  const addWord = () => {
    setWords([...words, ""])
  }

  const generateWords = () => {
    // Filter out empty words
    const validWords = words.filter((word) => word.trim() !== "")

    if (validWords.length > 0) {
      // Select a random word to display
      const randomIndex = Math.floor(Math.random() * validWords.length)
      setDisplayWord(validWords[randomIndex])
    }
  }

  const handleCellClick = (index: number) => {
    setSelectedCell(index)
  }

  const handleKeyPress = (letter: string) => {
    if (selectedCell === null) return

    const newDisplayWord = displayWord.split("")
    newDisplayWord[selectedCell] = letter
    setDisplayWord(newDisplayWord.join(""))

    // Move to next cell
    if (selectedCell < displayWord.length - 1) {
      setSelectedCell(selectedCell + 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Completa Palabras</h1>
          <Button className="quizora-green text-white">Guardar Plantilla</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Inserta las palabras a completar</h2>

            {words.map((word, index) => (
              <Input
                key={index}
                placeholder={`Palabra ${index + 1}`}
                value={word}
                onChange={(e) => handleWordChange(index, e.target.value)}
                className="w-full p-4 text-lg rounded-full border-blue-300"
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
              onClick={generateWords}
            >
              Generar Palabras
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="mb-8">
              <div className="flex gap-1 mb-8">
                {displayWord.split("").map((letter, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 flex items-center justify-center text-xl font-bold border-2 ${
                      selectedCell === index ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-gray-100"
                    }`}
                    onClick={() => handleCellClick(index)}
                  >
                    {letter}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-10 gap-1">
                {[
                  "Q",
                  "W",
                  "E",
                  "R",
                  "T",
                  "Y",
                  "U",
                  "I",
                  "O",
                  "P",
                  "A",
                  "S",
                  "D",
                  "F",
                  "G",
                  "H",
                  "J",
                  "K",
                  "L",
                  "Ñ",
                  "⌫",
                  "Z",
                  "X",
                  "C",
                  "V",
                  "B",
                  "N",
                  "M",
                  "Enter",
                ].map((key, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`h-12 ${key === "⌫" || key === "Enter" ? "col-span-2" : ""} bg-gray-200`}
                    onClick={() => handleKeyPress(key)}
                  >
                    {key}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
