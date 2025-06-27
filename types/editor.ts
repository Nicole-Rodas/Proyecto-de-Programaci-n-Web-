export interface EditorBlock {
  id: string
  x: number
  y: number
  width: number
  height: number
  size: number
  color: string
  order: number
  label: string
}

export interface CustomLevel {
  id: string
  name: string
  platforms: number
  blocks: EditorBlock[]
  orderType: "numeric" | "alphabetic" | "size"
  createdAt: Date
}

export type OrderType = "numeric" | "alphabetic" | "size"
