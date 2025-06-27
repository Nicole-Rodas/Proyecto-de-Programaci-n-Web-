"use client"

import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"

interface MobileControlsProps {
  onMove: (direction: "up" | "down" | "left" | "right") => void
  onGrabRelease: () => void
  isGrabbing: boolean
}

export function MobileControls({ onMove, onGrabRelease, isGrabbing }: MobileControlsProps) {
  return (
    <div className="mt-4 flex flex-col items-center gap-4 md:hidden">
      <div className="grid grid-cols-3 gap-2">
        <div></div>
        <Button variant="outline" size="lg" onClick={() => onMove("up")}>
          <ArrowUp />
        </Button>
        <div></div>
        <Button variant="outline" size="lg" onClick={() => onMove("left")}>
          <ArrowLeft />
        </Button>
        <Button variant="outline" size="lg" onClick={() => onMove("down")}>
          <ArrowDown />
        </Button>
        <Button variant="outline" size="lg" onClick={() => onMove("right")}>
          <ArrowRight />
        </Button>
      </div>
      <Button variant="default" size="lg" onClick={onGrabRelease} className="px-8 py-4 text-lg">
        {isGrabbing ? "Soltar" : "Agarrar"}
      </Button>
    </div>
  )
}
