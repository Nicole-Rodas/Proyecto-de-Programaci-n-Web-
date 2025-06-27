export interface Block {
  id: string
  size: number
  color: string
  x: number
  y: number
  width: number
  height: number
  isGrabbed: boolean
  label?: string // Agregar label para bloques personalizados
}

export interface Crane {
  x: number
  y: number
  isGrabbing: boolean
  grabbedBlock: string | null
}

export interface Platform {
  x: number
  y: number
  width: number
  height: number
}

export interface CustomLevel {
  id: string
  name: string
  platforms: number
  blocks: any[] // Replace 'any' with the actual type if available
  orderType: "numeric" | "alphabetic" | "size"
  createdAt: Date
}
