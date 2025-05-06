"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, X, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Question {
  id: number
  text: string
  answers: Answer[]
}

interface Answer {
  id: number
  text: string
  isCorrect: boolean
}

export default function ExamenQuizora() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: "",
      answers: [
        { id: 1, text: "", isCorrect: true },
        { id: 2, text: "", isCorrect: false },
        { id: 3, text: "", isCorrect: false },
        { id: 4, text: "", isCorrect: false },
      ],
    },
  ])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timePerQuestion, setTimePerQuestion] = useState("10")

  const currentQuestion = questions[currentQuestionIndex]

  const handleQuestionChange = (text: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[currentQuestionIndex].text = text
    setQuestions(updatedQuestions)
  }

  const handleAnswerChange = (id: number, text: string) => {
    const updatedQuestions = [...questions]
    const answerIndex = updatedQuestions[currentQuestionIndex].answers.findIndex((a) => a.id === id)
    updatedQuestions[currentQuestionIndex].answers[answerIndex].text = text
    setQuestions(updatedQuestions)
  }

  const toggleCorrectAnswer = (id: number) => {
    const updatedQuestions = [...questions]
    const answers = updatedQuestions[currentQuestionIndex].answers

    // Set all answers to incorrect first
    answers.forEach((answer) => {
      answer.isCorrect = false
    })

    // Set the clicked answer to correct
    const answerIndex = answers.findIndex((a) => a.id === id)
    answers[answerIndex].isCorrect = true

    setQuestions(updatedQuestions)
  }

  const addNewQuestion = () => {
    const newQuestion: Question = {
      id: questions.length + 1,
      text: "",
      answers: [
        { id: 1, text: "", isCorrect: true },
        { id: 2, text: "", isCorrect: false },
        { id: 3, text: "", isCorrect: false },
        { id: 4, text: "", isCorrect: false },
      ],
    }

    setQuestions([...questions, newQuestion])
    setCurrentQuestionIndex(questions.length)
  }

  const deleteCurrentQuestion = () => {
    if (questions.length <= 1) return

    const updatedQuestions = questions.filter((_, index) => index !== currentQuestionIndex)
    setQuestions(updatedQuestions)

    if (currentQuestionIndex >= updatedQuestions.length) {
      setCurrentQuestionIndex(updatedQuestions.length - 1)
    }
  }

  const navigateToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const navigateToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Examen Quizora</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="mr-2">Tiempo de respuesta por pregunta</span>
              <Select value={timePerQuestion} onValueChange={setTimePerQuestion}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="10 seg" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 seg</SelectItem>
                  <SelectItem value="10">10 seg</SelectItem>
                  <SelectItem value="15">15 seg</SelectItem>
                  <SelectItem value="20">20 seg</SelectItem>
                  <SelectItem value="30">30 seg</SelectItem>
                  <SelectItem value="60">60 seg</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="quizora-green text-white">Guardar Plantilla</Button>
          </div>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          <div>
            <h2 className="text-xl font-medium mb-2">Pregunta {currentQuestionIndex + 1}</h2>
            <Input
              placeholder="Inserte pregunta..."
              value={currentQuestion.text}
              onChange={(e) => handleQuestionChange(e.target.value)}
              className="w-full p-4 text-lg rounded-full"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-medium">Pregunta {currentQuestionIndex + 1}</h2>

            {currentQuestion.answers.map((answer) => (
              <div key={answer.id} className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full w-12 h-12 ${answer.isCorrect ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                  onClick={() => toggleCorrectAnswer(answer.id)}
                >
                  {answer.isCorrect ? <Check className="h-6 w-6 text-white" /> : <X className="h-6 w-6 text-white" />}
                </Button>
                <Input
                  placeholder="Respuesta..."
                  value={answer.text}
                  onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                  className="w-full p-4 text-lg rounded-full"
                />
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full py-6 rounded-lg bg-slate-200 hover:bg-slate-300"
            onClick={addNewQuestion}
          >
            <Plus className="h-6 w-6 text-gray-500" />
          </Button>

          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="py-6 bg-sky-400 hover:bg-sky-500 text-white text-xl"
              onClick={navigateToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Anterior Pregunta
            </Button>
            <Button
              variant="outline"
              className="py-6 bg-red-500 hover:bg-red-600 text-white text-xl"
              onClick={deleteCurrentQuestion}
              disabled={questions.length <= 1}
            >
              Borrar Pregunta
            </Button>
            <Button
              variant="outline"
              className="py-6 bg-sky-400 hover:bg-sky-500 text-white text-xl"
              onClick={navigateToNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Nueva Pregunta
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
