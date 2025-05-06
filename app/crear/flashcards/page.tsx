"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

interface Flashcard {
  id: number
  term: string
  definition: string
}

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    { id: 1, term: "", definition: "" },
    { id: 2, term: "", definition: "" },
  ])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showingTerm, setShowingTerm] = useState(true)

  const handleTermChange = (id: number, value: string) => {
    const updatedFlashcards = [...flashcards]
    const index = updatedFlashcards.findIndex((card) => card.id === id)
    updatedFlashcards[index].term = value
    setFlashcards(updatedFlashcards)
  }

  const handleDefinitionChange = (id: number, value: string) => {
    const updatedFlashcards = [...flashcards]
    const index = updatedFlashcards.findIndex((card) => card.id === id)
    updatedFlashcards[index].definition = value
    setFlashcards(updatedFlashcards)
  }

  const addFlashcard = () => {
    const newId = Math.max(...flashcards.map((card) => card.id)) + 1
    setFlashcards([...flashcards, { id: newId, term: "", definition: "" }])
  }

  const flipCard = () => {
    setShowingTerm(!showingTerm)
  }

  const currentCard = flashcards[currentCardIndex]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Flashcards</h1>
          <Button className="quizora-green text-white">Guardar Plantilla</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Inserta la palabra</h2>
            {flashcards.map((card) => (
              <div key={card.id} className="space-y-2">
                <Input
                  placeholder="Palabra"
                  value={card.term}
                  onChange={(e) => handleTermChange(card.id, e.target.value)}
                  className="w-full p-4 text-lg"
                />
                <h2 className="text-xl font-medium">Inserta concepto</h2>
                <Textarea
                  placeholder="Concepto*"
                  value={card.definition}
                  onChange={(e) => handleDefinitionChange(card.id, e.target.value)}
                  className="w-full p-4 text-lg min-h-[100px]"
                />
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full py-6 rounded-lg bg-slate-200 hover:bg-slate-300"
              onClick={addFlashcard}
            >
              <Plus className="h-6 w-6 text-gray-500" />
            </Button>

            <Button className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white text-xl mt-4" onClick={() => {}}>
              Generar Flashcards
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
              <h2 className="text-xl font-medium mb-2">{showingTerm ? "Palabra" : "Concepto"}</h2>
              <div
                className="w-full aspect-[4/3] bg-slate-600 rounded-lg flex items-center justify-center p-6 cursor-pointer"
                onClick={flipCard}
              >
                <div className="text-center">
                  {showingTerm ? (
                    <div className="text-4xl font-bold text-white">{currentCard.term || "HTTP"}</div>
                  ) : (
                    <div className="text-lg text-white">
                      {currentCard.definition ||
                        "Hypertext Transfer Protocol, es el protocolo de comunicación principal que se utiliza en la World Wide Web (WWW) para transferir datos entre un cliente (como un navegador web) y un servidor web."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
