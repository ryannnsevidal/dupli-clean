import React from 'react'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge Component', () => {
  it('renders with default props', () => {
    render(<Badge>Default Badge</Badge>)
    const badge = screen.getByText('Default Badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full', 'border', 'px-2.5', 'py-0.5', 'text-xs', 'font-semibold', 'transition-colors', 'focus:outline-none', 'focus:ring-2', 'focus:ring-ring', 'focus:ring-offset-2')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>)
    expect(screen.getByText('Default')).toHaveClass('border-transparent', 'bg-primary', 'text-primary-foreground', 'hover:bg-primary/80')

    rerender(<Badge variant="secondary">Secondary</Badge>)
    expect(screen.getByText('Secondary')).toHaveClass('border-transparent', 'bg-secondary', 'text-secondary-foreground', 'hover:bg-secondary/80')

    rerender(<Badge variant="destructive">Destructive</Badge>)
    expect(screen.getByText('Destructive')).toHaveClass('border-transparent', 'bg-destructive', 'text-destructive-foreground', 'hover:bg-destructive/80')

    rerender(<Badge variant="outline">Outline</Badge>)
    expect(screen.getByText('Outline')).toHaveClass('text-foreground')
  })

  it('applies custom className', () => {
    render(<Badge className="custom-badge">Custom Badge</Badge>)
    const badge = screen.getByText('Custom Badge')
    expect(badge).toHaveClass('custom-badge')
  })

  it('renders as different HTML elements', () => {
    const { rerender } = render(<Badge asChild><span>Span Badge</span></Badge>)
    expect(screen.getByText('Span Badge')).toBeInTheDocument()

    rerender(<Badge asChild><div>Div Badge</div></Badge>)
    expect(screen.getByText('Div Badge')).toBeInTheDocument()
  })

  it('handles empty content', () => {
    render(<Badge></Badge>)
    const badge = screen.getByRole('generic')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('')
  })

  it('handles null and undefined children', () => {
    const { rerender } = render(<Badge>{null}</Badge>)
    let badge = screen.getByRole('generic')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('')

    rerender(<Badge>{undefined}</Badge>)
    badge = screen.getByRole('generic')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('')
  })

  it('handles numbers as children', () => {
    render(<Badge>42</Badge>)
    const badge = screen.getByText('42')
    expect(badge).toBeInTheDocument()
  })

  it('handles zero as children', () => {
    render(<Badge>0</Badge>)
    const badge = screen.getByText('0')
    expect(badge).toBeInTheDocument()
  })

  it('handles special characters', () => {
    render(<Badge>!@#$%^&*()</Badge>)
    const badge = screen.getByText('!@#$%^&*()')
    expect(badge).toBeInTheDocument()
  })

  it('handles emoji content', () => {
    render(<Badge>🚀</Badge>)
    const badge = screen.getByText('🚀')
    expect(badge).toBeInTheDocument()
  })

  it('handles long text content', () => {
    const longText = 'This is a very long badge text that should still render properly without breaking the layout or styling'
    render(<Badge>{longText}</Badge>)
    const badge = screen.getByText(longText)
    expect(badge).toBeInTheDocument()
  })

  it('combines variant and custom className', () => {
    render(<Badge variant="destructive" className="custom-class">Combined</Badge>)
    const badge = screen.getByText('Combined')
    expect(badge).toHaveClass('custom-class', 'border-transparent', 'bg-destructive', 'text-destructive-foreground')
  })

  it('handles multiple children', () => {
    render(
      <Badge>
        <span>Icon</span>
        <span>Text</span>
      </Badge>
    )
    const badge = screen.getByText('Icon')
    expect(badge).toBeInTheDocument()
    expect(screen.getByText('Text')).toBeInTheDocument()
  })
})
