'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/app/components/ui/Button'
import { Card } from '@/app/components/ui/Card'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

export default function TrackingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [trackingData, setTrackingData] = useState({
    startTime: null as Date | null,
    duration: 0,
    location: 'ห้องเรียน A1'
  })

  useEffect(() => {
    // ตรวจสอบการ login
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      alert('กรุณาเข้าสู่ระบบก่อน')
      window.location.href = '/login'
      return
    }

    setUser(JSON.parse(userData))
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTracking && trackingData.startTime) {
      interval = setInterval(() => {
        const now = new Date()
        const duration = Math.floor((now.getTime() - trackingData.startTime!.getTime()) / 1000)
        setTrackingData(prev => ({ ...prev, duration }))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTracking, trackingData.startTime])

  const handleStartTracking = () => {
    setTrackingData(prev => ({
      ...prev,
      startTime: new Date()
    }))
    setIsTracking(true)
  }

  const handleStopTracking = () => {
    setIsTracking(false)
    // บันทึกข้อมูลการติดตาม
    console.log('Tracking completed:', trackingData)
    alert(`การติดตามเสร็จสิ้น เวลารวม: ${formatTime(trackingData.duration)}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Tracking System</h1>
                <p className="text-sm text-gray-600">ยินดีต้อนรับ {user.firstName} {user.lastName}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="secondary">
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid gap-6">
          {/* Status Card */}
          <Card className="p-8">
            <div className="text-center">
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                isTracking 
                  ? 'bg-green-100 text-green-600 animate-pulse' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isTracking ? 'กำลังติดตาม...' : 'พร้อมเริ่มติดตาม'}
              </h2>

              <p className="text-gray-600 mb-6">
                {isTracking 
                  ? `เวลาการติดตาม: ${formatTime(trackingData.duration)}`
                  : 'กดปุ่มเริ่มเมื่อคุณพร้อม'
                }
              </p>

              {!isTracking ? (
                <Button
                  onClick={handleStartTracking}
                  className="px-12 py-4 text-lg"
                >
                  🚀 เริ่มติดตาม
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="text-4xl font-mono font-bold text-purple-600">
                    {formatTime(trackingData.duration)}
                  </div>
                  <Button
                    onClick={handleStopTracking}
                    variant="secondary"
                    className="px-8 py-3"
                  >
                    ⏹️ หยุดติดตาม
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">ข้อมูลส่วนตัว</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">ชื่อ:</span>
                  <span className="font-medium">{user.firstName} {user.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">อีเมล:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">สถานะ:</span>
                  <span className={`font-medium ${isTracking ? 'text-green-600' : 'text-gray-600'}`}>
                    {isTracking ? 'กำลังติดตาม' : 'พร้อมใช้งาน'}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">สถิติวันนี้</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">เวลาทำงาน:</span>
                  <span className="font-medium">{formatTime(trackingData.duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">สถานที่:</span>
                  <span className="font-medium">{trackingData.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">วันที่:</span>
                  <span className="font-medium">{new Date().toLocaleDateString('th-TH')}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}