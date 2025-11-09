"use client"

import { Card } from "@/components/ui/card"
import type { SessionStats } from "@/hooks/use-drowsiness-detection"

interface StatisticsPanelProps {
  stats: SessionStats
}

export default function StatisticsPanel({ stats }: StatisticsPanelProps) {
  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <Card className="bg-gray-800 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
        <i className="fas fa-chart-line mr-2 text-blue-400"></i>
        Session Statistics
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-300">Session Duration:</span>
          <span className="text-green-400 font-mono">{formatDuration(stats.duration)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Alert Count:</span>
          <span className="text-red-400 font-bold">{stats.alertCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Drowsiness Score:</span>
          <span className="text-yellow-400 font-bold">{stats.drowsinessScore.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Avg EAR:</span>
          <span className="text-blue-400 font-mono">{stats.avgEAR.toFixed(3)}</span>
        </div>
      </div>
    </Card>
  )
}
