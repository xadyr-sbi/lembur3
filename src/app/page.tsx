"use client"

import React, { useState, useEffect } from 'react'
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

export default function OvertimeCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [basicSalary, setBasicSalary] = useState<number>(2436886)
  const [workExperience, setWorkExperience] = useState<number>(0)
  const [overtimeData, setOvertimeData] = useState<OvertimeData>({})
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [overtimeHours, setOvertimeHours] = useState<string>('')
  const [isHoliday, setIsHoliday] = useState<boolean>(false)

  // Load data from localStorage when component mounts
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
    
    if (savedBasicSalary) {
      setBasicSalary(Number(savedBasicSalary))
    }
    
    if (savedWorkExperience) {
      setWorkExperience(Number(savedWorkExperience))
    }
  }, [])

  // Save overtime data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('overtimeData', JSON.stringify(overtimeData))
  }, [overtimeData])

  // Save basic salary to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('basicSalary', basicSalary.toString())
  }, [basicSalary])

  // Save work experience to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('workExperience', workExperience.toString())
  }, [workExperience])

  const months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ]

  const dayNames = ['Mgg', 'Snin', 'Slsa', 'Rbu', 'Kmis', 'Jmat', 'Sbtu']

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const calculateWorkExperienceAllowance = (years: number): number => {
    if (years <= 0) return 0
    return 5000 + ((years - 1) * 10000)
  }

  const calculateOvertimePay = (hours: number, isHoliday: boolean, basicSalary: number, workExp: number) => {
    const workExperienceAllowance = calculateWorkExperienceAllowance(workExp)
    const totalBasicSalary = basicSalary + workExperienceAllowance
    const hourlyRate = totalBasicSalary / 173 // 173 jam kerja per bulan standar Indonesia
    
    if (isHoliday) {
      // Hari libur/minggu
      if (hours <= 7) {
        return hours * hourlyRate * 2 // 2x untuk 7 jam pertama
      } else if (hours === 8) {
        return (7 * hourlyRate * 2) + (1 * hourlyRate * 3) // jam ke-8: 3x
      } else {
        return (7 * hourlyRate * 2) + (1 * hourlyRate * 3) + ((hours - 8) * hourlyRate * 4) // jam ke-9,10: 4x
      }
    } else {
      // Hari kerja biasa
      if (hours <= 1) {
        return hours * hourlyRate * 1.5 // 1.5x untuk jam pertama
      } else {
        return (1 * hourlyRate * 1.5) + ((hours - 1) * hourlyRate * 2) // jam selanjutnya: 2x
      }
    }
  }

  const getTotalOvertimePay = () => {
    let total = 0
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()
    
    // Hitung hanya untuk bulan yang sedang ditampilkan (dari tanggal 1 sampai akhir bulan)
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
    
    // Hitung hanya untuk bulan yang sedang ditampilkan (dari tanggal 1 sampai akhir bulan)
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
        setOvertimeData(prev => ({
          ...prev,
          [key]: {
            date: selectedDate,
            hours: hours,
            isHoliday: isHoliday
          }
        }))
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

  const clearAllData = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data lembur? Data yang sudah dihapus tidak dapat dikembalikan.')) {
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

  const exportData = () => {
    const dataToExport = {
      overtimeData,
      basicSalary,
      workExperience,
      exportDate: new Date().toISOString()
    }
    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `data-lembur-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string)
          if (importedData.overtimeData && importedData.basicSalary !== undefined && importedData.workExperience !== undefined) {
            setOvertimeData(importedData.overtimeData)
            setBasicSalary(importedData.basicSalary)
            setWorkExperience(importedData.workExperience)
            alert('Data berhasil diimpor!')
          } else {
            alert('Format file tidak valid!')
          }
        } catch {
          alert('Error membaca file!')
        }
      }
      reader.readAsText(file)
    }
    // Reset input value
    event.target.value = ''
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-16 border border-gray-300"></div>
      )
    }

    // Days of the month
    for (let date = 1; date <= daysInMonth; date++) {
      const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${date}`
      const overtimeDay = overtimeData[key]
      const isWeekend = (firstDay + date - 1) % 7 === 0 || (firstDay + date - 1) % 7 === 6
      
      days.push(
        <div
          key={date}
          onClick={() => handleDateClick(date)}
          className={`h-16 border border-gray-300 cursor-pointer flex items-center justify-center text-sm font-medium relative
            ${overtimeDay ? (overtimeDay.isHoliday ? 'bg-red-500 text-white' : 'bg-yellow-400 text-black') : 'bg-green-200'}
            ${isWeekend ? 'text-red-600' : 'text-black'}
            ${selectedDate === date ? 'ring-2 ring-blue-500' : ''}
            hover:bg-opacity-80 transition-colors
          `}
        >
          <span className={isWeekend ? 'text-red-600 font-bold' : ''}>{date}</span>
          {overtimeDay && (
            <div className="absolute bottom-1 right-1 text-xs">
              {overtimeDay.hours}h
            </div>
          )}
        </div>
      )
    }

    return days
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="bg-gray-100">
            <div className="text-left">
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
                  <Label htmlFor="salary" className="font-medium">UMK MADIUN:</Label>
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
          <CardContent className="p-0">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 bg-yellow-100">
              {dayNames.map((day, index) => (
                <div
                  key={day}
                  className={`p-3 text-center font-bold border border-gray-300 ${
                    index === 0 || index === 6 ? 'text-red-600' : 'text-black'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {renderCalendarDays()}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Input Jam Lembur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDate && (
                <>
                  <div>
                    <Label>Tanggal Terpilih: {selectedDate}</Label>
                  </div>
                  <div>
                    <Label htmlFor="hours">Jam Lembur</Label>
                    <Input
                      id="hours"
                      type="number"
                      step="0.5"
                      min="0"
                      max="10"
                      value={overtimeHours}
                      onChange={(e) => setOvertimeHours(e.target.value)}
                      placeholder="Masukkan jam lembur"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="holiday"
                      checked={isHoliday}
                      onChange={(e) => setIsHoliday(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="holiday">Hari Libur/Minggu</Label>
                  </div>
                  <Button onClick={handleSaveOvertime} className="w-full">
                    Simpan
                  </Button>
                </>
              )}
              {!selectedDate && (
                <p className="text-gray-500 text-center py-8">
                  Klik tanggal pada kalender untuk input jam lembur
                </p>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Lembur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Jam Lembur:</span>
                  <span className="font-bold">{getTotalOvertimeHours()} jam</span>
                </div>
                <div className="flex justify-between">
                  <span>Masa Kerja:</span>
                  <span className="font-bold">{workExperience} tahun</span>
                </div>
                <div className="flex justify-between">
                  <span>Tunjangan Masa Kerja:</span>
                  <span className="font-bold">Rp {(5000 + ((workExperience - 1) * 10000) > 0 ? 5000 + ((workExperience - 1) * 10000) : 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Periode:</span>
                  <span className="font-bold">
                    1 - {getDaysInMonth(currentDate)} {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold bg-green-100 p-2 rounded">
                  <span>Total Upah Lembur:</span>
                  <span>Rp {getTotalOvertimePay().toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <h4 className="font-semibold">Keterangan Warna:</h4>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 border"></div>
                  <span className="text-sm">Hari Normal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 border"></div>
                  <span className="text-sm">Hari Kerja Lembur</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 border"></div>
                  <span className="text-sm">Hari Libur Lembur</span>
                </div>
              </div>

              <div className="mt-6 text-xs text-gray-600">
                <h4 className="font-semibold mb-2">Perhitungan sesuai UU Ketenagakerjaan:</h4>
                <ul className="space-y-1">
                  <li>• Hari kerja: Jam 1 = 1.5x, Jam 2+ = 2x</li>
                  <li>• Hari libur: Jam 1-7 = 2x, Jam 8 = 3x, Jam 9-10 = 4x</li>
                  <li>• Upah per jam = Gaji Pokok ÷ 173</li>
                </ul>
              </div>
              
              <div className="mt-4 space-y-2">
                <Button onClick={exportData} variant="outline" size="sm" className="w-full">
                  Export Data
                </Button>
                <label className="w-full">
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                  <Button variant="outline" size="sm" className="w-full">
                    Import Data
                  </Button>
                </label>
                <Button onClick={clearAllData} variant="outline" size="sm" className="w-full text-red-600">
                  Hapus Semua Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
