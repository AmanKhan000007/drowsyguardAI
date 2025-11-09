"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface QuickActionsProps {
  onResetStats: () => void
  onTestAlert: () => void
  onExportLog: () => void
}

export default function QuickActions({ onResetStats, onTestAlert, onExportLog }: QuickActionsProps) {
  return (
    <Card className="bg-gray-800 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
        <i className="fas fa-bolt mr-2 text-yellow-400"></i>
        Quick Actions
      </h3>
      <div className="space-y-2">
        <Button onClick={onResetStats} className="w-full bg-gray-700 hover:bg-gray-600">
          <i className="fas fa-refresh mr-2"></i>
          Reset Statistics
        </Button>
        <Button onClick={onTestAlert} className="w-full bg-orange-600 hover:bg-orange-700">
          <i className="fas fa-bell mr-2"></i>
          Test Alert
        </Button>
        <Button onClick={onExportLog} className="w-full bg-purple-600 hover:bg-purple-700">
          <i className="fas fa-download mr-2"></i>
          Export Log
        </Button>
      </div>
    </Card>
  )
}
