"use client"

import React, { useState, useEffect } from 'react'
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface OvertimeDay {
  date: number
  hours: number
  isHoliday: boolean
}

interface OvertimeData {
  [key: string]: OvertimeDay
}

// National holidays only (without joint leave)
const nationalHolidays: Record<string, string[]> = {
  '2024': ['2024-01-01','2024-02-08','2024-02-10','2024-03-11','2024-03-29','2024-03-31','2024-04-10','2024-04-11','2024-05-01','2024-05-09','2024-05-23','2024-06-01','2024-06-17','2024-07-07','2024-08-17','2024-09-16','2024-12-25'],
  '2025': ['2025-01-01','2025-01-28','2025-01-29','2025-03-29','2025-04-18','2025-04-20','2025-04-21','2025-04-22','2025-05-01','2025-05-29','2025-06-01','2025-06-07','2025-06-27','2025-08-17','2025-09-05','2025-12-25']
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

  // ✅ Navigasi bulan (fix error navigateMonth)
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  useEffect(() => {
    const timer = setInterval(() => setToday(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => setCurrentDate(new Date(today)), [today])

  useEffect(() => {
    const savedOvertimeData = localStorage.getItem('overtimeData')
    const savedBasicSalary = localStorage.getItem('basicSalary')
    const savedWorkExperience = localStorage.getItem('workExperience')
    if (savedOvertimeData) setOvertimeData(JSON.parse(savedOvertimeData))
    if (savedBasicSalary) setBasicSalary(Number(savedBasicSalary))
    if (savedWorkExperience) setWorkExperience(Number(savedWorkExperience))
  }, [])

  useEffect(() => localStorage.setItem('overtimeData', JSON.stringify(overtimeData)), [overtimeData])
  useEffect(() => localStorage.setItem('basicSalary', basicSalary.toString()), [basicSalary])
  useEffect(() => localStorage.setItem('workExperience', workExperience.toString()), [workExperience])

  const months = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER']
  const dayNames = ['Mgg', 'Snin', 'Slsa', 'Rbu', 'Kmis', 'Jmat', 'Sbtu']

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const calculateWorkExperienceAllowance = (years: number): number => years <= 0 ? 0 : 5000 + ((years - 1) * 10000)

  const calculateOvertimePay = (hours: number, isHoliday: boolean, basicSalary: number, workExp: number) => {
    const workExperienceAllowance = calculateWorkExperienceAllowance(workExp)
    const totalBasicSalary = basicSalary + workExperienceAllowance
    const hourlyRate = totalBasicSalary / 173
    if (isHoliday) {
      if (hours <= 7) return hours * hourlyRate * 2
      else if (hours === 8) return (7 * hourlyRate * 2) + (1 * hourlyRate * 3)
      else return (7 * hourlyRate * 2) + (1 * hourlyRate * 3) + ((hours - 8) * hourlyRate * 4)
    } else {
      if (hours <= 1) return hours * hourlyRate * 1.5
      else return (1 * hourlyRate * 1.5) + ((hours - 1) * hourlyRate * 2)
    }
  }

  const getTotalOvertimePay = () => {
    let total = 0
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()
    Object.entries(overtimeData).forEach(([key, day]) => {
      const [year, month] = key.split('-').map(Number)
      if (year === currentYear && month === currentMonth) {
        total += calculateOvertimePay(day.hours, day.isHoliday, basicSalary, workExperience)
      }
    })
    return total
  }

  const getTotalOvertimeHours = () => {
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()
    return Object.entries(overtimeData).reduce((total, [key, day]) => {
      const [year, month] = key.split('-').map(Number)
      if (year === currentYear && month === currentMonth) {
        return total + day.hours
      }
      return total
    }, 0)
  }

  const handleDateClick = (date: number) => {
    setSelectedDate(date)
    const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${date}`
    const existing = overtimeData[key]
    if (existing) {
      setOvertimeHours(existing.hours.toString())
      setIsHoliday(existing.isHoliday)
    } else {
      setOvertimeHours('')
      setIsHoliday(false)
    }
  }

  const handleSaveOvertime = () => {
    if (selectedDate && overtimeHours) {
      const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDate}`
      const hours = parseFloat(overtimeHours)
      if (hours > 0) {
        setOvertimeData(prev => ({ ...prev, [key]: { date: selectedDate, hours, isHoliday } }))
      } else {
        setOvertimeData(prev => {
          const newData = { ...prev }
          delete newData[key]
          return newData
        })
      }
      setSelectedDate(null)
      setOvertimeHours('')
      setIsHoliday(false)
    }
  }

  const clearAllData = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data lembur?')) {
      setOvertimeData({})
      setBasicSalary(2436886)
      setWorkExperience(0)
      localStorage.removeItem('overtimeData')
      localStorage.removeItem('basicSalary')
      localStorage.removeItem('workExperience')
      setSelectedDate(null)
      setOvertimeHours('')
      setIsHoliday(false)
    }
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 border border-gray-300"></div>)
    }

    for (let date = 1; date <= daysInMonth; date++) {
      const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${date}`
      const overtimeDay = overtimeData[key]

      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`
      const isNationalHoliday = nationalHolidays[year]?.includes(dateStr) ?? false

      const dayIndex = (firstDay + date - 1) % 7
      const isSunday = dayIndex === 0

      const isToday =
        date === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()

      days.push(
        <div
          key={date}
          onClick={() => handleDateClick(date)}
          className={`h-16 border border-gray-300 cursor-pointer flex items-center justify-center text-sm font-medium relative
            ${overtimeDay ? (overtimeDay.isHoliday ? 'bg-red-500 text-white' : 'bg-yellow-400 text-black') : (isNationalHoliday ? 'bg-pink-300' : 'bg-green-200')}
            ${selectedDate === date ? 'ring-2 ring-blue-500' : ''}
            ${isToday ? 'ring-2 ring-purple-500 ring-offset-1' : ''}
            hover:bg-opacity-80 transition-colors`}
        >
          <span className={isSunday ? 'text-red-600 font-bold' : 'text-black'}>{date}</span>
          {isToday && <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500"></div>}
          {overtimeDay && <div className="absolute bottom-1 right-1 text-xs">{overtimeDay.hours}h</div>}
          {isNationalHoliday && !overtimeDay && <div className="absolute bottom-1 right-1 text-xs">Libur</div>}
        </div>
      )
    }

    return days
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 relative">
      {/* ✅ Watermark Logo */}
      <div className="absolute top-4 right-4 opacity-20 pointer-events-none z-0">
        <Image src="/logo.png" alt="Logo" width={150} height={150} className="w-[15vw] h-auto max-w-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <Card className="mb-6">
          <CardHeader className="bg-gray-100">
            <CardTitle className="text-2xl font-bold text-gray-800">KALENDER HITUNG UPAH LEMBUR</CardTitle>
            <p className="text-lg font-semibold text-gray-700 mt-1">SBTP - FSBI</p>

            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <Label htmlFor="salary" className="font-medium">UMSK GWI MADIUN:</Label>
                  <div className="flex items-center gap-2">
                    <span>Rp</span>
                    <Input id="salary" type="number" value={basicSalary} onChange={(e) => setBasicSalary(Number(e.target.value))} className="w-32" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="experience" className="font-medium">Masa Kerja (tahun):</Label>
                  <Input id="experience" type="number" min="0" max="50" value={workExperience} onChange={(e) => setWorkExperience(Number(e.target.value))} className="w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-2 min-w-[200px] justify-center">
                    <span className="font-bold text-lg">{months[currentDate.getMonth()]}</span>
                    <span className="font-bold text-lg">{currentDate.getFullYear()}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 bg-yellow-100">
              {dayNames.map((day, index) => (
                <div key={day} className={`p-3 text-center font-bold border border-gray-300 ${index === 0 ? 'text-red-600' : 'text-black'}`}>{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">{renderCalendarDays()}</div>
          </CardContent>
        </Card>

        {/* Form & Ringkasan (tidak diubah) */}
        {/* ... bagian bawah tetap sama */}
      </div>
    </div>
  )
}
