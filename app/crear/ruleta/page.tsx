"use client"

import { useState, useRef, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

export default function Ruleta() {
  const [questions, setQuestions] = useState<string[]>(["", "", "", ""])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)

  const colors = ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"]

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[index] = value
    setQuestions(newQuestions)
  }

  const addQuestion = () => {
    setQuestions([...questions, ""])
  }

  const spinWheel = () => {
    if (spinning) return

    setSpinning(true)
    const spinDegrees = 2000 + Math.random() * 1000
    const duration = 5000
    const start = performance.now()
    const startRotation = rotation

    const animate = (time: number) => {
      const elapsed = time - start
      const progress = Math.min(elapsed / duration, 1)
      // Easing function for slowing down
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
      const currentRotation = startRotation + spinDegrees * easeOut(progress)

      setRotation(currentRotation)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setSpinning(false)
      }
    }

    requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw wheel segments
    const segmentAngle = (2 * Math.PI) / questions.length

    for (let i = 0; i < questions.length; i++) {
      const startAngle = i * segmentAngle + (rotation * Math.PI) / 180
      const endAngle = (i + 1) * segmentAngle + (rotation * Math.PI) / 180

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      ctx.fillStyle = colors[i % colors.length]
      ctx.fill()

      ctx.strokeStyle = "white"
      ctx.lineWidth = 2
      ctx.stroke()

      // Add dots at segment edges
      ctx.beginPath()
      ctx.arc(centerX + radius * Math.cos(startAngle), centerY + radius * Math.sin(startAngle), 5, 0, 2 * Math.PI)
      ctx.fillStyle = "white"
      ctx.fill()

      // Add question text to the segment
      if (questions[i].trim() !== "") {
        // Save context state
        ctx.save()

        // Position text in the middle of the segment
        const textAngle = startAngle + (endAngle - startAngle) / 2
        const textRadius = radius * 0.75 // Position text at 75% of radius
        const textX = centerX + textRadius * Math.cos(textAngle)
        const textY = centerY + textRadius * Math.sin(textAngle)

        // Rotate text to align with segment
        ctx.translate(textX, textY)
        ctx.rotate(textAngle + Math.PI / 2) // Rotate text perpendicular to radius

        // Draw text
        ctx.fillStyle = "black"
        ctx.font = "bold 10px Arial"
        ctx.textAlign = "center"

        // Limit text length to fit in segment
        const maxLength = 15
        const displayText =
          questions[i].length > maxLength ? questions[i].substring(0, maxLength) + "..." : questions[i]

        ctx.fillText(displayText, 0, 0)

        // Restore context state
        ctx.restore()
      }
    }

    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI)
    ctx.fillStyle = "#d946ef"
    ctx.fill()

    // Draw pointer
    ctx.beginPath()
    ctx.moveTo(canvas.width, centerY)
    ctx.lineTo(canvas.width - 40, centerY - 15)
    ctx.lineTo(canvas.width - 40, centerY + 15)
    ctx.closePath()
    ctx.fillStyle = "black"
    ctx.fill()
  }, [questions, rotation])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Ruleta de preguntas</h1>
          <Button className="quizora-green text-white">Guardar Plantilla</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Inserta tus preguntas</h2>

            {questions.map((question, index) => (
              <Input
                key={index}
                placeholder={`Pregunta ${index + 1}`}
                value={question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                className="w-full p-4 text-lg rounded-full"
              />
            ))}

            <Button
              variant="outline"
              className="w-full py-6 rounded-lg bg-slate-200 hover:bg-slate-300"
              onClick={addQuestion}
            >
              <Plus className="h-6 w-6 text-gray-500" />
            </Button>

            <Button className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white text-xl mt-4" onClick={() => {}}>
              Guardar ruleta
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center">
            <canvas ref={canvasRef} width={400} height={400} className="mb-4" onClick={spinWheel} />
          </div>
        </div>
      </main>
    </div>
  )
}
