"use client"

import { Card } from "@/components/ui/card"
import type { EARReading } from "@/hooks/use-drowsiness-detection"

interface EARChartProps {
  earHistory: EARReading[]
  threshold: number
}

export default function EARChart({ earHistory, threshold }: EARChartProps) {
  return (
    <Card className="bg-gray-800 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
        <i className="fas fa-chart-area mr-2 text-green-400"></i>
        Eye Aspect Ratio Over Time
      </h3>
      <div className="h-64 bg-gray-900 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Chart visualization will be implemented with a charting library</p>
      </div>
    </Card>
  )
}
