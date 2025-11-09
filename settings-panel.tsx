"use client"

import { Card } from "@/components/ui/card"
import type { Settings } from "@/hooks/use-drowsiness-detection"

interface SettingsPanelProps {
  settings: Settings
  onUpdateSettings: (settings: Partial<Settings>) => void
}

export default function SettingsPanel({ settings, onUpdateSettings }: SettingsPanelProps) {
  return (
    <Card className="bg-gray-800 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
        <i className="fas fa-sliders-h mr-2 text-purple-400"></i>
        Settings
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-2">Alert Threshold (seconds)</label>
          <input
            type="range"
            min="1"
            max="10"
            value={settings.alertThreshold}
            onChange={(e) => onUpdateSettings({ alertThreshold: Number.parseFloat(e.target.value) })}
            className="w-full"
          />
          <span className="text-xs text-gray-400">{settings.alertThreshold} seconds</span>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">EAR Threshold</label>
          <input
            type="range"
            min="0.15"
            max="0.30"
            step="0.01"
            value={settings.earThreshold}
            onChange={(e) => onUpdateSettings({ earThreshold: Number.parseFloat(e.target.value) })}
            className="w-full"
          />
          <span className="text-xs text-gray-400">{settings.earThreshold.toFixed(2)}</span>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Alert Volume</label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.alertVolume * 100}
            onChange={(e) => onUpdateSettings({ alertVolume: Number.parseFloat(e.target.value) / 100 })}
            className="w-full"
          />
          <span className="text-xs text-gray-400">{Math.round(settings.alertVolume * 100)}%</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Sound Alerts</span>
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
            className="w-4 h-4"
          />
        </div>
      </div>
    </Card>
  )
}
