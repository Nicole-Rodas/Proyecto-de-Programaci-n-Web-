import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { FileText, PieChart, Search, Edit3, FileCheck, Layers } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Enseñar nunca fue tan facil</h1>
        <h2 className="text-xl md:text-2xl mb-16">Diseña tus propios Test de forma rápida y didactica</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {/* Test Clásico */}
          <Link href="/crear/test-clasico">
            <div className="bg-blue-100 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4">Test Clasico</h3>
              <div className="flex mb-4 justify-center">
              <img src="/test.png" width= "64" height="64"  alt="Test Clásico" className="w-16 h-16 " />
       
      
              </div>
              <p className="text-sm">
                Realiza pruebas de selección multiple. Pon a prueba tus conocimientos. Ideal para trivias rápidas y
                educativas.
              </p>
            </div>
          </Link>

          {/* Ruleta de preguntas */}
          <Link href="/crear/ruleta">
            <div className="bg-blue-100 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4">Ruleta de preguntas</h3>
              <div className="flex mb-4 justify-center">
              <img src="/ruleta.png" width= "64" height="64"  alt="Test Clásico" className="w-16 h-16 " />
      
              </div>
              <p className="text-sm">
                Gira la ruleta y responde la pregunta que te toque al azar. ¡Nunca sabrás qué tema te va a tocar!
                Perfecto para sesiones divertidas y desafiantes.
              </p>
            </div>
          </Link>

          {/* Sopa de Letras */}
          <Link href="/crear/sopa-letras">
            <div className="bg-blue-100 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4">Sopa de Letras</h3>
              <div className="flex mb-4 justify-center">
              <img src="/sopa.png" width= "64" height="64"  alt="Test Clásico" className="w-16 h-16 " />
       
              </div>
              <p className="text-sm">
                Encuentra palabras ocultas entre un mar de letras. Excelente para reforzar vocabulario o conceptos de
                forma entretenida.
              </p>
            </div>
          </Link>

          {/* Completa Palabras */}
          <Link href="/crear/completa-palabras">
            <div className="bg-blue-100 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4">Completa Palabras</h3>
              <div className="flex mb-4 justify-center">
              <img src="/completa.png" width= "64" height="64"  alt="Test Clásico" className="w-16 h-16 " />
              </div>
              <p className="text-sm">
                Rellena los espacios en blanco para completar palabras o términos clave. ¡Demuestra tu dominio del tema!
              </p>
            </div>
          </Link>

          {/* Quizora Exam */}
          <Link href="/crear/examen">
            <div className="bg-blue-100 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4">Quizora Exam</h3>
              <div className="flex mb-4 justify-center">
              <img src="/exam.png" width= "64" height="64"  alt="Test Clásico" className="w-16 h-16 " />
              </div>
              <p className="text-sm">
                Simula un examen real con preguntas de selección multiple y tiempos límite. Ideal para practicar antes
                de evaluaciones o certificar conocimientos.
              </p>
            </div>
          </Link>

          {/* Flashcards */}
          <Link href="/crear/flashcards">
            <div className="bg-blue-100 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4">Flashcards</h3>
              <div className="flex mb-4 justify-center">
              <img src="/flashcards.png" width= "64" height="64"  alt="Test Clásico" className="w-16 h-16 " />
              </div>
              <p className="text-sm">
                Memoriza conceptos rápidamente repasando tarjetas interactivas. Una herramienta ágil para estudiar temas
                clave de forma visual y dinámica.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}
