"use client"
import CameraFeed from "@/components/camera-feed"
import StatisticsPanel from "@/components/statistics-panel"
import SettingsPanel from "@/components/settings-panel"
import QuickActions from "@/components/quick-actions"
import EARChart from "@/components/ear-chart"
import CalibrationModal from "@/components/calibration-modal"
import { useDrowsinessDetection } from "@/hooks/use-drowsiness-detection"

export default function DrowsinessDetectionPage() {
  const {
    isRunning,
    isCalibrating,
    sessionStats,
    currentEAR,
    eyesClosedTime,
    isAlerting,
    settings,
    earHistory,
    alertLog,
    startDetection,
    stopDetection,
    startCalibration,
    cancelCalibration,
    updateSettings,
    resetStatistics,
    testAlert,
    exportLog,
  } = useDrowsinessDetection()

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Navigation Header */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* <i className="fas fa-eye text-blue-400 text-xl"></i> */}
              <span className="text-xl font-bold text-white">DrowsyGuard AI</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="flex items-center space-x-1 text-gray-300 hover:text-white">
                <i className="fas fa-home"></i>
                <span>Home</span>
              </a>
              <a href="#" className="flex items-center space-x-1 text-blue-400">
                <i className="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </a>
              <a href="#" className="flex items-center space-x-1 text-gray-300 hover:text-white">
                <i className="fas fa-chart-bar"></i>
                <span>Analytics</span>
              </a>
              <a href="#" className="flex items-center space-x-1 text-gray-300 hover:text-white">
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </a>
              <a href="#" className="flex items-center space-x-1 text-gray-300 hover:text-white">
                <i className="fas fa-info-circle"></i>
                <span>About</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400 mb-2 flex items-center justify-center gap-3">
            <i className="fas fa-eye"></i>
            Detection Dashboard
          </h1>
          <p className="text-gray-300">Real-time monitoring with smart alerts</p>
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <CameraFeed
              isRunning={isRunning}
              currentEAR={currentEAR}
              eyesClosedTime={eyesClosedTime}
              isAlerting={isAlerting}
              onStart={startDetection}
              onStop={stopDetection}
              onCalibrate={startCalibration}
            />
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <StatisticsPanel stats={sessionStats} />
            <SettingsPanel settings={settings} onUpdateSettings={updateSettings} />
            <QuickActions onResetStats={resetStatistics} onTestAlert={testAlert} onExportLog={exportLog} />
          </div>
        </div>

        {/* EAR Chart */}
        <div className="mt-8">
          <EARChart earHistory={earHistory} threshold={settings.earThreshold} />
        </div>

        {/* Calibration Modal */}
        <CalibrationModal isOpen={isCalibrating} onCancel={cancelCalibration} />
      </div>
    </div>
  )
}
