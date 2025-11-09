"use client"

import { useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CameraFeedProps {
  isRunning: boolean
  currentEAR: number
  eyesClosedTime: number
  isAlerting: boolean
  onStart: () => void
  onStop: () => void
  onCalibrate: () => void
}

export default function CameraFeed({
  isRunning,
  currentEAR,
  eyesClosedTime,
  isAlerting,
  onStart,
  onStop,
  onCalibrate,
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isRunning && videoRef.current) {
      // Initialize camera
      navigator.mediaDevices
        .getUserMedia({ video: { width: 640, height: 480 } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((error) => {
          console.error("Error accessing camera:", error)
        })
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [isRunning])

  const getStatusColor = () => {
    if (isAlerting) return "bg-red-400 animate-pulse"
    if (isRunning) return "bg-green-400"
    return "bg-gray-400"
  }

  const getStatusText = () => {
    if (isAlerting) return "DROWSINESS DETECTED!"
    if (isRunning) return "Detection Active"
    return "Detection Stopped"
  }

  return (
    <Card className="bg-gray-800 p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
        <i className="fas fa-video mr-2 text-green-400"></i>
        Live Camera Feed
      </h2>

      <div className="relative">
        <video ref={videoRef} className="w-full rounded-lg bg-black" autoPlay playsInline muted />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none" />

        {/* Status Overlay */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor()}`}></div>
            <span className="text-sm font-medium text-white">{getStatusText()}</span>
          </div>
          <div className="text-xs text-gray-300">
            <div>
              EAR: <span className="text-blue-300">{currentEAR.toFixed(3)}</span>
            </div>
            <div>
              Eyes Closed: <span className="text-yellow-300">{eyesClosedTime.toFixed(1)}s</span>
            </div>
          </div>
        </div>

        {/* Alert Overlay */}
        {isAlerting && (
          <div className="absolute inset-0 bg-red-500 bg-opacity-30 rounded-lg animate-pulse">
            <div className="flex items-center justify-center h-full">
              <div className="bg-red-600 text-white px-6 py-3 rounded-lg text-xl font-bold">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                DROWSINESS ALERT!
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center mt-4 space-x-4">
        <Button onClick={onStart} disabled={isRunning} className="bg-green-600 hover:bg-green-700">
          <i className="fas fa-play mr-2"></i>
          Start Detection
        </Button>
        <Button onClick={onStop} disabled={!isRunning} className="bg-red-600 hover:bg-red-700">
          <i className="fas fa-stop mr-2"></i>
          Stop Detection
        </Button>
        <Button onClick={onCalibrate} className="bg-blue-600 hover:bg-blue-700">
          <i className="fas fa-cog mr-2"></i>
          Calibrate
        </Button>
      </div>
    </Card>
  )
}
