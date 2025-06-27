"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, PieChart, Search, Edit3, FileCheck, Layers, Share2, Pencil, Trash2, Plus } from "lucide-react"
import Link from "next/link"

interface Template {
  id: string
  title: string
  type: "test" | "ruleta" | "sopa" | "completa" | "examen" | "flashcards"
  createdAt: string
  shared: boolean
}

export default function Dashboard() {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      title: "Geografía Mundial",
      type: "test",
      createdAt: "2023-05-15",
      shared: true,
    },
    {
      id: "2",
      title: "Vocabulario Inglés",
      type: "flashcards",
      createdAt: "2023-05-10",
      shared: false,
    },
    {
      id: "3",
      title: "Historia de España",
      type: "ruleta",
      createdAt: "2023-05-05",
      shared: true,
    },
    {
      id: "4",
      title: "Términos de Biología",
      type: "sopa",
      createdAt: "2023-04-28",
      shared: false,
    },
    {
      id: "5",
      title: "Matemáticas Básicas",
      type: "examen",
      createdAt: "2023-04-20",
      shared: true,
    },
  ])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "test":
        return <FileText className="h-5 w-5" />
      case "ruleta":
        return <PieChart className="h-5 w-5" />
      case "sopa":
        return <Search className="h-5 w-5" />
      case "completa":
        return <Edit3 className="h-5 w-5" />
      case "examen":
        return <FileCheck className="h-5 w-5" />
      case "flashcards":
        return <Layers className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case "test":
        return "Test Clásico"
      case "ruleta":
        return "Ruleta de preguntas"
      case "sopa":
        return "Sopa de Letras"
      case "completa":
        return "Completa Palabras"
      case "examen":
        return "Examen Quizora"
      case "flashcards":
        return "Flashcards"
      default:
        return type
    }
  }

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter((template) => template.id !== id))
  }

  const toggleShare = (id: string) => {
    setTemplates(
      templates.map((template) => (template.id === id ? { ...template, shared: !template.shared } : template)),
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <Tabs defaultValue="mis-plantillas" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="mis-plantillas">Mis Plantillas</TabsTrigger>
            <TabsTrigger value="compartidas">Compartidas conmigo</TabsTrigger>
          </TabsList>

          <TabsContent value="mis-plantillas" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(template.type)}
                        <CardTitle>{template.title}</CardTitle>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => toggleShare(template.id)}>
                          <Share2 className={`h-4 w-4 ${template.shared ? "text-green-500" : "text-gray-400"}`} />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteTemplate(template.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      {getTypeName(template.type)} • Creado el {template.createdAt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm">{template.shared ? "Compartido con estudiantes" : "No compartido"}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Abrir plantilla
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              <Card className="flex flex-col items-center justify-center p-6 border-dashed">
                <Link href="/" className="flex flex-col items-center text-center p-6">
                  <div className="rounded-full bg-blue-100 p-3 mb-4">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium">Crear nueva plantilla</h3>
                  <p className="text-sm text-gray-500 mt-2">Elige entre los diferentes tipos de tests</p>
                </Link>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compartidas">
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="font-medium mb-2">No tienes plantillas compartidas</h3>
              <p className="text-sm text-gray-500">
                Cuando otros usuarios compartan plantillas contigo, aparecerán aquí
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
