"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from 'next/image'; // Tambahkan import Image
import SendLocation from "@/components/SendLocation";

export default function HomePage() {
  return (
    <div>
      <SendLocation />
    </div>
  );
}

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
  '2024': [
    '2024-01-01', // Tahun Baru Masehi
    '2024-02-08', // Isra Mikraj Nabi Muhammad SAW
    '2024-02-10', // Tahun Baru Imlek 2575
    '2024-03-11', // Hari Suci Nyepi
    '2024-03-29', // Wafat Isa Almasih
    '2024-03-31', // Hari Paskah
    '2024-04-10', // Hari Raya Idul Fitri 1445 H
    '2024-04-11', // Hari Raya Idul Fitri 1445 H
    '2024-05-01', // Hari Buruh Internasional
    '2024-05-09', // Kenaikan Isa Almasih
    '2024-05-23', // Hari Raya Waisak 2568 BE
    '2024-06-01', // Hari Lahir Pancasila
    '2024-06-17', // Hari Raya Idul Adha 1445 H
    '2024-07-07', // Tahun Baru Islam 1446 H
    '2024-08-17', // Hari Kemerdekaan RI
    '2024-09-16', // Maulid Nabi Muhammad SAW
    '2024-12-25', // Hari Raya Natal
  ],
  '2025': [
    '2025-01-01', // Tahun Baru Masehi
    '2025-01-28', // Isra Mikraj Nabi Muhammad SAW
    '2025-01-29', // Tahun Baru Imlek 2576
    '2025-03-29', // Hari Suci Nyepi
    '2025-04-18', // Wafat Isa Almasih
    '2025-04-20', // Hari Paskah
    '2025-04-21', // Hari Raya Idul Fitri 1446 H
    '2025-04-22', // Hari Raya Idul Fitri 1446 H
    '2025-05-01', // Hari Buruh Internasional
    '2025-05-29', // Kenaikan Isa Almasih
    '2025-06-07', // Hari Raya Waisak 2569 BE
    '2025-06-01', // Hari Lahir Pancasila
    '2025-06-07', // Hari Raya Idul Adha 1446 H
    '2025-06-27', // Tahun Baru Islam 1447 H
    '2025-08-17', // Hari Kemerdekaan RI
    '2025-09-05', // Maulid Nabi Muhammad SAW
    '2025-12-25', // Hari Raya Natal
  ],
  '2026': [
    '2026-01-01', // Tahun Baru 2026 [citation:1]
    '2026-01-16', // Isra Mikraj [citation:1]
    '2026-02-17', // Tahun Baru Imlek 2577 Kongzili [citation:1]
    '2026-03-19', // Hari Suci Nyepi [citation:1]
    '2026-03-21', // Idul Fitri 1447 Hijriah [citation:1]
    '2026-03-22', // Idul Fitri 1447 Hijriah [citation:1]
    '2026-04-03', // Wafat Yesus Kristus [citation:1]
    '2026-04-05', // Hari Kebangkitan Yesus Kristus (Paskah) [citation:1]
    '2026-05-01', // Hari Buruh Internasional [citation:1]
    '2026-05-14', // Kenaikan Yesus Kristus [citation:1]
    '2026-05-27', // Idul Adha 1447 Hijriah [citation:1]
    '2026-05-31', // Hari Raya Waisak [citation:1]
    '2026-06-01', // Hari Lahir Pancasila [citation:1]
    '2026-06-16', // 1 Muharram 1448 Hijriah [citation:1]
    '2026-08-17', // Proklamasi Kemerdekaan RI [citation:1]
    '2026-08-25', // Maulid Nabi Muhammad SAW [citation:1]
    '2026-12-25', // Hari Natal [citation:1]
  ]
};

export default function OvertimeCalendar() {
  const [today, setToday] = useState(new Date()) // Tanggal saat ini (selalu diperbarui)
  const [currentDate, setCurrentDate] = useState(new Date(today)) // Bulan yang ditampilkan di kalender
  const [basicSalary, setBasicSalary] = useState<number>(2436886)
  const [workExperience, setWorkExperience] = useState<number>(0)
  const [overtimeData, setOvertimeData] = useState<OvertimeData>({})
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [overtimeHours, setOvertimeHours] = useState<string>('')
  const [isHoliday, setIsHoliday] = useState<boolean>(false)

  // Update today setiap menit
  useEffect(() => {
    const timer = setInterval(() => {
      setToday(new Date())
    }, 60000) // Update setiap 1 menit
    
    return () => clearInterval(timer)
  }, [])

  // Set currentDate ke today saat pertama kali dibuka
  useEffect(() => {
    setCurrentDate(new Date(today))
  }, [today])

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
      
      // Check if it's a national holiday
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
      const isNationalHoliday = nationalHolidays[year]?.includes(dateStr) ?? false;
      
      const dayIndex = (firstDay + date - 1) % 7
      const isSunday = dayIndex === 0
      
      // Check if this is today's date
      const isToday = 
        date === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();
      
      days.push(
        <div
          key={date}
          onClick={() => handleDateClick(date)}
          className={`h-16 border border-gray-300 cursor-pointer flex items-center justify-center text-sm font-medium relative
            ${overtimeDay ? (overtimeDay.isHoliday ? 'bg-red-500 text-white' : 'bg-yellow-400 text-black') : (isNationalHoliday ? 'bg-pink-300' : 'bg-green-200')}
            ${selectedDate === date ? 'ring-2 ring-blue-500' : ''}
            ${isToday ? 'ring-2 ring-purple-500 ring-offset-1' : ''}
            hover:bg-opacity-80 transition-colors
          `}
        >
          <span className={isSunday ? 'text-red-600 font-bold' : 'text-black'}>
            {date}
          </span>
          {isToday && (
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500"></div>
          )}
          {overtimeDay && (
            <div className="absolute bottom-1 right-1 text-xs">
              {overtimeDay.hours}h
            </div>
          )}
          {isNationalHoliday && !overtimeDay && (
            <div className="absolute bottom-1 right-1 text-xs">Libur</div>
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
            <div className="text-center"> {/* Ubah menjadi text-center untuk pusatkan logo */}
              <CardTitle className="text-2xl font-bold text-gray-800">
                KALENDER HITUNG UPAH LEMBUR
              </CardTitle>
              <p className="text-lg font-semibold text-gray-700 mt-1">
                SBTP - FSBI
              </p>
              
              {/* Logo ditambahkan di sini */}
              <div className="flex justify-center my-4">
                <Image 
                  src="/logo.png" 
                  alt="SBTP-FSBI Logo" 
                  width={300} 
                  height={100}
                  className="object-contain"
                />
              </div>
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
          <CardContent className="p-0">
            {/* Calendar Header */}
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
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-pink-300 border"></div>
                  <span className="text-sm">Libur Nasional</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-purple-500 relative">
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  </div>
                  <span className="text-sm">Hari Ini</span>
                </div>
              </div>

              <div className="mt-6 text-xs text-gray-600">
                <h4 className="font-semibold mb-2">Perhitungan sesuai UU Ketenagakerjaan:</h4>
                <ul className="space-y-1">
                  <li>• Hari kerja: Jam 1 = 1.5x, Jam 2+ = 2x</li>
                  <li>• Hari libur: Jam 1-7 = 2x, Jam 8 = 3x, Jam 9-10 = 4x</li>
                  <li>• Upah per jam = (UMK + Tunjangan) ÷ 173</li>
                  <li>• Tunjangan masa kerja: Rp5.000/tahun pertama + Rp10.000/tahun berikutnya</li>
                </ul>
              </div>
              
              <div className="mt-4 space-y-2">
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
