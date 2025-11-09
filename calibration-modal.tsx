"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface CalibrationModalProps {
  isOpen: boolean
  onCancel: () => void
}

export default function CalibrationModal({ isOpen, onCancel }: CalibrationModalProps) {
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)

  useEffect(() => {
    if (isOpen) {
      setProgress(0)
      setTimeLeft(10)

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            onCancel() // Auto-complete calibration
            return 0
          }
          return prev - 1
        })
        setProgress((prev) => prev + 10)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold mb-4 text-center text-white">Calibration Mode</h3>
        <div>
          <p className="text-gray-300 mb-4 text-center">
            Keep your eyes open normally for 10 seconds to calibrate the system.
          </p>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-400">
            Progress: <span>{10 - timeLeft}/10</span> seconds
          </p>
        </div>
        <div className="flex justify-center mt-6">
          <Button onClick={onCancel} className="bg-gray-600 hover:bg-gray-700">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
