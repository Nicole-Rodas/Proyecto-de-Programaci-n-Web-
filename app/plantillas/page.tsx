"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, PieChart, Search, Edit3, FileCheck, Layers, Copy } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Template {
  id: string
  title: string
  type: "test" | "ruleta" | "sopa" | "completa" | "examen" | "flashcards"
  author: string
  createdAt: string
  likes: number
}

export default function Plantillas() {
  const [searchTerm, setSearchTerm] = useState("")
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      title: "Geografía Mundial",
      type: "test",
      author: "Profesor García",
      createdAt: "2023-05-15",
      likes: 124,
    },
    {
      id: "2",
      title: "Vocabulario Inglés",
      type: "flashcards",
      author: "Profesora Martínez",
      createdAt: "2023-05-10",
      likes: 87,
    },
    {
      id: "3",
      title: "Historia de España",
      type: "ruleta",
      author: "Profesor López",
      createdAt: "2023-05-05",
      likes: 56,
    },
    {
      id: "4",
      title: "Términos de Biología",
      type: "sopa",
      author: "Profesor Sánchez",
      createdAt: "2023-04-28",
      likes: 42,
    },
    {
      id: "5",
      title: "Matemáticas Básicas",
      type: "examen",
      author: "Profesora Rodríguez",
      createdAt: "2023-04-20",
      likes: 98,
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

  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getTypeName(template.type).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Plantillas Compartidas</h1>

        <div className="mb-8">
          <Input
            placeholder="Buscar plantillas por título, autor o tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xl"
          />
        </div>

        <Tabs defaultValue="populares" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="populares">Populares</TabsTrigger>
            <TabsTrigger value="recientes">Recientes</TabsTrigger>
            <TabsTrigger value="guardadas">Guardadas</TabsTrigger>
          </TabsList>

          <TabsContent value="populares" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates
                .sort((a, b) => b.likes - a.likes)
                .map((template) => (
                  <Card key={template.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(template.type)}
                          <CardTitle>{template.title}</CardTitle>
                        </div>
                      </div>
                      <CardDescription>
                        {getTypeName(template.type)} • Por {template.author}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm">{template.likes} personas han usado esta plantilla</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        <Copy className="h-4 w-4 mr-2" />
                        Usar plantilla
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="recientes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((template) => (
                  <Card key={template.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(template.type)}
                          <CardTitle>{template.title}</CardTitle>
                        </div>
                      </div>
                      <CardDescription>
                        {getTypeName(template.type)} • Por {template.author}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm">Creado el {template.createdAt}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        <Copy className="h-4 w-4 mr-2" />
                        Usar plantilla
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="guardadas">
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="font-medium mb-2">No tienes plantillas guardadas</h3>
              <p className="text-sm text-gray-500">Cuando guardes plantillas de otros usuarios, aparecerán aquí</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
