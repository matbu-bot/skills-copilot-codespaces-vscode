import { formatDate, getWeekStart, formatTime, cn } from '@/utils/helpers'

describe('Helper Utilities', () => {
  describe('formatDate', () => {
    it('should format a Date object correctly', () => {
      const date = new Date('2024-01-15')
      const result = formatDate(date)
      expect(result).toBe('Jan 15, 2024')
    })

    it('should format a date string correctly', () => {
      const result = formatDate('2024-03-20')
      expect(result).toBe('Mar 20, 2024')
    })

    it('should handle different months', () => {
      expect(formatDate('2024-12-25')).toBe('Dec 25, 2024')
      expect(formatDate('2024-06-01')).toBe('Jun 1, 2024')
    })
  })

  describe('getWeekStart', () => {
    it('should return Monday for a week', () => {
      // Wednesday, Jan 17, 2024
      const wednesday = new Date('2024-01-17')
      const weekStart = getWeekStart(wednesday)
      
      // Should return Monday, Jan 15
      expect(weekStart.getDay()).toBe(1) // Monday
      expect(weekStart.getDate()).toBe(15)
    })

    it('should return same day if already Monday', () => {
      const monday = new Date('2024-01-15')
      const weekStart = getWeekStart(monday)
      
      expect(weekStart.getDay()).toBe(1)
      expect(weekStart.getDate()).toBe(15)
    })

    it('should handle Sunday correctly', () => {
      // Sunday, Jan 21, 2024
      const sunday = new Date('2024-01-21')
      const weekStart = getWeekStart(sunday)
      
      // Should return Monday of that week (Jan 15)
      expect(weekStart.getDay()).toBe(1)
      expect(weekStart.getDate()).toBe(15)
    })

    it('should default to current date when no argument', () => {
      const weekStart = getWeekStart()
      expect(weekStart.getDay()).toBe(1) // Should be Monday
    })

    it('should handle year boundaries', () => {
      // Friday, Dec 29, 2023
      const endOfYear = new Date('2023-12-29')
      const weekStart = getWeekStart(endOfYear)
      
      // Should return Monday, Dec 25, 2023
      expect(weekStart.getDay()).toBe(1)
      expect(weekStart.getFullYear()).toBe(2023)
      expect(weekStart.getMonth()).toBe(11) // December
    })
  })

  describe('formatTime', () => {
    it('should format minutes only when less than 60', () => {
      expect(formatTime(30)).toBe('30 min')
      expect(formatTime(45)).toBe('45 min')
      expect(formatTime(59)).toBe('59 min')
    })

    it('should format hours only when exact hours', () => {
      expect(formatTime(60)).toBe('1h')
      expect(formatTime(120)).toBe('2h')
      expect(formatTime(180)).toBe('3h')
    })

    it('should format hours and minutes', () => {
      expect(formatTime(75)).toBe('1h 15m')
      expect(formatTime(90)).toBe('1h 30m')
      expect(formatTime(135)).toBe('2h 15m')
    })

    it('should handle zero minutes', () => {
      expect(formatTime(0)).toBe('0 min')
    })

    it('should handle large values', () => {
      expect(formatTime(300)).toBe('5h')
      expect(formatTime(375)).toBe('6h 15m')
    })

    it('should handle 1 minute', () => {
      expect(formatTime(1)).toBe('1 min')
    })
  })

  describe('cn (className helper)', () => {
    it('should combine multiple class names', () => {
      expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3')
    })

    it('should filter out falsy values', () => {
      expect(cn('class1', null, 'class2', undefined, 'class3')).toBe(
        'class1 class2 class3'
      )
    })

    it('should filter out false values', () => {
      expect(cn('class1', false, 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const isDisabled = false
      
      expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe(
        'base active'
      )
    })

    it('should handle empty input', () => {
      expect(cn()).toBe('')
    })

    it('should handle all falsy values', () => {
      expect(cn(null, undefined, false)).toBe('')
    })

    it('should filter out empty strings', () => {
      expect(cn('class1', '', 'class2')).toBe('class1 class2')
    })

    it('should preserve spaces in class names', () => {
      expect(cn('class1 class2', 'class3')).toBe('class1 class2 class3')
    })
  })
})
