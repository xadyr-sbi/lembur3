"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"   // ✅ Tambahkan untuk logo

interface OvertimeDay {
  date: number
  hours: number
  isHoliday: boolean
}

interface OvertimeData {
  [key: string]: OvertimeDay
}

// ✅ (National holidays tetap seperti kode kamu)
const nationalHolidays: Record<string, string[]> = {
  '2024': [/* ... */],
  '2025': [/* ... */]
};

export default function OvertimeCalendar() {
  const [today, setToday] = useState(new Date())
  const [currentDate, setCurrentDate] = useState(new Date(today))
  const [basicSalary, setBasicSalary] = useState<number>(2436886)
  const [workExperience, setWorkExperience] = useState<number>(0)
  const [overtimeData, setOvertimeData] = useState<OvertimeData>({})
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [overtimeHours, setOvertimeHours] = useState<string>('')
  const [isHoliday, setIsHoliday] = useState<boolean>(false)

  // ✅ Semua fungsi asli tetap sama ...
  useEffect(() => {
    const timer = setInterval(() => {
      setToday(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setCurrentDate(new Date(today))
  }, [today])

  useEffect(() => {
    const savedOvertimeData = localStorage.getItem('overtimeData')
    const savedBasicSalary = localStorage.getItem('basicSalary')
    const savedWorkExperience = localStorage.getItem('workExperience')

    if (savedOvertimeData) {
      try {
        setOvertimeData(JSON.parse(savedOvertimeData))
      } catch (error) {
        console.error('Error loading overtime data:', error)
      }
    }

    if (savedBasicSalary) setBasicSalary(Number(savedBasicSalary))
    if (savedWorkExperience) setWorkExperience(Number(savedWorkExperience))
  }, [])

  useEffect(() => {
    localStorage.setItem('overtimeData', JSON.stringify(overtimeData))
  }, [overtimeData])

  useEffect(() => {
    localStorage.setItem('basicSalary', basicSalary.toString())
  }, [basicSalary])

  useEffect(() => {
    localStorage.setItem('workExperience', workExperience.toString())
  }, [workExperience])

  // ✅ Semua helper & renderCalendarDays tetap sama...

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="bg-gray-100 relative">
            {/* ✅ Logo di pojok kanan atas */}
            <div className="absolute top-2 right-2 w-24 md:w-32 lg:w-40">
              <Image
                src="/logo.png"
                alt="Logo"
                width={200}
                height={120}
                className="w-full h-auto object-contain"
                priority
              />
            </div>

            <div className="text-left pr-28 md:pr-40">
              <CardTitle className="text-2xl font-bold text-gray-800">
                KALENDER HITUNG UPAH LEMBUR
              </CardTitle>
              <p className="text-lg font-semibold text-gray-700 mt-1">
                SBTP - FSBI
              </p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <Label htmlFor="salary" className="font-medium">UMSK GWI MADIUN:</Label>
                  <div className="flex items-center gap-2">
                    <span>Rp</span>
                    <Input
                      id="salary"
                      type="number"
                      value={basicSalary}
                      onChange={(e) => setBasicSalary(Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="experience" className="font-medium">Masa Kerja (tahun):</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="50"
                    value={workExperience}
                    onChange={(e) => setWorkExperience(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-2 min-w-[200px] justify-center">
                    <span className="font-bold text-lg">
                      {months[currentDate.getMonth()]}
                    </span>
                    <span className="font-bold text-lg">
                      {currentDate.getFullYear()}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* ✅ Kalender tetap seperti semula */}
          <CardContent className="p-0">
            {/* Header Hari */}
            <div className="grid grid-cols-7 bg-yellow-100">
              {dayNames.map((day, index) => (
                <div
                  key={day}
                  className={`p-3 text-center font-bold border border-gray-300 ${
                    index === 0 ? 'text-red-600' : 'text-black'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grid Kalender */}
            <div className="grid grid-cols-7">
              {renderCalendarDays()}
            </div>
          </CardContent>
        </Card>

        {/* ✅ Form Input dan Ringkasan tetap sama */}
        {/* ... (bagian bawah tidak diubah) ... */}
      </div>
    </div>
  )
}
