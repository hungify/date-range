import type { DateType } from '#/types/date'

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate()
}

function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month - 1, 1).getDay()
}

function getLastDayOfMonth(month: number, year: number) {
  return new Date(year, month, 0).getDay()
}

export function getMonthDays(month: number, year: number) {
  const days = getDaysInMonth(month, year)
  const firstDay = getFirstDayOfMonth(month, year)
  const lastDay = getLastDayOfMonth(month, year)
  const monthDays: DateType['monthDay'][] = []

  for (let i = 0; i < firstDay; i++) {
    monthDays.push('')
  }

  for (let i = 1; i <= days; i++) {
    monthDays.push(i)
  }

  for (let i = 0; i < 6 - lastDay; i++) {
    monthDays.push('')
  }

  return monthDays
}

export function isToday(date: Date) {
  const today = new Date()
  return (
    date.getDate() === today.getDate()
    && date.getMonth() === today.getMonth()
    && date.getFullYear() === today.getFullYear()
  )
}

export function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getDate() === date2.getDate()
    && date1.getMonth() === date2.getMonth()
    && date1.getFullYear() === date2.getFullYear()
  )
}
