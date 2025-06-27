export interface Block {
  id: string
  size: number
  color: string
  x: number
  y: number
  width: number
  height: number
  isGrabbed: boolean
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
// En el archivo `types/game.ts` o donde guardes las interfaces

export interface Block {
  id: string;        // Identificador único
  x: number;         // Coordenada x del bloque
  y: number;         // Coordenada y del bloque
  width: number;     // Ancho del bloque
  height: number;    // Altura del bloque
  color: string;     // Color del bloque
  size: number;      // Tamaño del bloque (opcional, dependiendo de cómo lo estés utilizando)
  isGrabbed: boolean; // Si el bloque está siendo agarrado
}
