import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  it('combines class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
    expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3')
  })

  it('handles conditional classes', () => {
    expect(cn('base', true && 'conditional')).toBe('base conditional')
    expect(cn('base', false && 'conditional')).toBe('base')
    expect(cn('base', true ? 'true-class' : 'false-class')).toBe('base true-class')
    expect(cn('base', false ? 'true-class' : 'false-class')).toBe('base false-class')
  })

  it('handles object syntax', () => {
    expect(cn('base', { conditional: true })).toBe('base conditional')
    expect(cn('base', { conditional: false })).toBe('base')
    expect(cn('base', { 'class1': true, 'class2': false, 'class3': true })).toBe('base class1 class3')
  })

  it('handles arrays', () => {
    expect(cn('base', ['class1', 'class2'])).toBe('base class1 class2')
    expect(cn('base', ['class1', false && 'class2', 'class3'])).toBe('base class1 class3')
  })

  it('handles nested arrays', () => {
    expect(cn('base', [['class1', 'class2'], 'class3'])).toBe('base class1 class2 class3')
  })

  it('handles empty strings and null values', () => {
    expect(cn('base', '', null, undefined)).toBe('base')
    expect(cn('', null, undefined, 'base')).toBe('base')
  })

  it('handles whitespace in class names', () => {
    expect(cn('  class1  ', '  class2  ')).toBe('class1 class2')
    expect(cn('class1 class2', 'class3')).toBe('class1 class2 class3')
  })

  it('handles duplicate classes', () => {
    expect(cn('class1', 'class1')).toBe('class1 class1')
    expect(cn('class1 class2', 'class2 class3')).toBe('class1 class2 class2 class3')
  })

  it('handles complex combinations', () => {
    const isActive = true
    const isDisabled = false
    const size = 'large'
    
    expect(cn(
      'base-class',
      isActive && 'active',
      isDisabled && 'disabled',
      size === 'large' && 'large-size',
      { 'conditional': true, 'unconditional': false }
    )).toBe('base-class active large-size conditional')
  })

  it('handles edge cases', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
    expect(cn(null)).toBe('')
    expect(cn(undefined)).toBe('')
    expect(cn(0)).toBe('0')
    expect(cn(false)).toBe('false')
    expect(cn(true)).toBe('true')
  })

  it('handles numbers and booleans as strings', () => {
    expect(cn('base', 0, 1, -1)).toBe('base 0 1 -1')
    expect(cn('base', true, false)).toBe('base true false')
  })

  it('handles deeply nested structures', () => {
    expect(cn('base', [['class1', ['class2', 'class3']], 'class4'])).toBe('base class1 class2 class3 class4')
  })

  it('handles mixed input types', () => {
    expect(cn(
      'base',
      'string-class',
      ['array-class1', 'array-class2'],
      { 'object-class': true },
      true && 'conditional-class',
      false && 'ignored-class'
    )).toBe('base string-class array-class1 array-class2 object-class conditional-class')
  })

  it('handles special characters in class names', () => {
    expect(cn('base', 'class-with-dash', 'class_with_underscore', 'class.with.dots')).toBe('base class-with-dash class_with_underscore class.with.dots')
  })

  it('handles very long class names', () => {
    const longClass = 'a'.repeat(1000)
    expect(cn('base', longClass)).toBe(`base ${longClass}`)
  })

  it('handles many class names', () => {
    const manyClasses = Array.from({ length: 100 }, (_, i) => `class${i}`)
    const result = cn('base', ...manyClasses)
    expect(result).toContain('base')
    manyClasses.forEach(cls => {
      expect(result).toContain(cls)
    })
  })
})
