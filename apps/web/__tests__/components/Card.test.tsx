import React from 'react'
import { render, screen } from '@testing-library/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default props', () => {
      render(<Card>Card content</Card>)
      const card = screen.getByText('Card content')
      expect(card).toBeInTheDocument()
      expect(card.parentElement).toHaveClass('rounded-lg', 'border', 'bg-card', 'text-card-foreground', 'shadow-sm')
    })

    it('applies custom className', () => {
      render(<Card className="custom-class">Card content</Card>)
      const card = screen.getByText('Card content').parentElement
      expect(card).toHaveClass('custom-class')
    })

    it('handles empty children', () => {
      render(<Card></Card>)
      const card = screen.getByRole('generic')
      expect(card).toBeInTheDocument()
      expect(card).toHaveTextContent('')
    })
  })

  describe('CardHeader', () => {
    it('renders with default props', () => {
      render(<CardHeader>Header content</CardHeader>)
      const header = screen.getByText('Header content')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    })

    it('applies custom className', () => {
      render(<CardHeader className="custom-header">Header content</CardHeader>)
      const header = screen.getByText('Header content')
      expect(header).toHaveClass('custom-header')
    })
  })

  describe('CardTitle', () => {
    it('renders with default props', () => {
      render(<CardTitle>Card Title</CardTitle>)
      const title = screen.getByText('Card Title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight')
    })

    it('applies custom className', () => {
      render(<CardTitle className="custom-title">Card Title</CardTitle>)
      const title = screen.getByText('Card Title')
      expect(title).toHaveClass('custom-title')
    })

    it('renders as different HTML elements', () => {
      const { rerender } = render(<CardTitle asChild><h1>H1 Title</h1></CardTitle>)
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()

      rerender(<CardTitle asChild><h2>H2 Title</h2></CardTitle>)
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    })
  })

  describe('CardDescription', () => {
    it('renders with default props', () => {
      render(<CardDescription>Card Description</CardDescription>)
      const description = screen.getByText('Card Description')
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('text-sm', 'text-muted-foreground')
    })

    it('applies custom className', () => {
      render(<CardDescription className="custom-desc">Card Description</CardDescription>)
      const description = screen.getByText('Card Description')
      expect(description).toHaveClass('custom-desc')
    })
  })

  describe('CardContent', () => {
    it('renders with default props', () => {
      render(<CardContent>Content</CardContent>)
      const content = screen.getByText('Content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveClass('p-6', 'pt-0')
    })

    it('applies custom className', () => {
      render(<CardContent className="custom-content">Content</CardContent>)
      const content = screen.getByText('Content')
      expect(content).toHaveClass('custom-content')
    })
  })

  describe('Card Integration', () => {
    it('renders complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>Test Content</CardContent>
        </Card>
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('handles nested components with custom props', () => {
      render(
        <Card className="outer-card">
          <CardHeader className="custom-header">
            <CardTitle className="custom-title">Nested Title</CardTitle>
            <CardDescription className="custom-desc">Nested Description</CardDescription>
          </CardHeader>
          <CardContent className="custom-content">Nested Content</CardContent>
        </Card>
      )

      const card = screen.getByText('Nested Content').closest('.outer-card')
      expect(card).toHaveClass('outer-card')
      expect(screen.getByText('Nested Title')).toHaveClass('custom-title')
      expect(screen.getByText('Nested Description')).toHaveClass('custom-desc')
      expect(screen.getByText('Nested Content')).toHaveClass('custom-content')
    })

    it('handles empty content gracefully', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle></CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      )

      const card = screen.getByRole('generic')
      expect(card).toBeInTheDocument()
      expect(card).toHaveTextContent('')
    })

    it('handles null and undefined children', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>{null}</CardTitle>
            <CardDescription>{undefined}</CardDescription>
          </CardHeader>
          <CardContent>{null}</CardContent>
        </Card>
      )

      const card = screen.getByRole('generic')
      expect(card).toBeInTheDocument()
      expect(card).toHaveTextContent('')
    })
  })
})
