import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'

describe('Header', () => {
  it('renders the salon name', () => {
    render(<Header />)
    
    const salonName = screen.getByText('NAGASE')
    expect(salonName).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Header />)
    
    expect(screen.getByText('STYLISTS')).toBeInTheDocument()
    expect(screen.getByText('STYLES')).toBeInTheDocument()
    expect(screen.getByText('MENU')).toBeInTheDocument()
    expect(screen.getByText('ACCESS')).toBeInTheDocument()
    expect(screen.getByText('BOOKING')).toBeInTheDocument()
  })

  it('renders the booking button', () => {
    render(<Header />)
    
    const bookingButton = screen.getByText('BOOK NOW')
    expect(bookingButton).toBeInTheDocument()
  })

  it('has proper navigation links', () => {
    render(<Header />)
    
    const stylistsLink = screen.getByRole('link', { name: 'STYLISTS' })
    expect(stylistsLink).toHaveAttribute('href', '/stylists')
    
    const stylesLink = screen.getByRole('link', { name: 'STYLES' })
    expect(stylesLink).toHaveAttribute('href', '/styles')
  })
})