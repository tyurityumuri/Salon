import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'

describe('Footer', () => {
  it('renders the salon name and address', () => {
    render(<Footer />)
    
    expect(screen.getByText('NAGASE SALON')).toBeInTheDocument()
    expect(screen.getByText(/東京都千代田区大手町/)).toBeInTheDocument()
  })

  it('renders business hours', () => {
    render(<Footer />)
    
    expect(screen.getByText(/営業時間/)).toBeInTheDocument()
    expect(screen.getByText(/月 - 金: 10:00 - 20:00/)).toBeInTheDocument()
    expect(screen.getByText(/土 - 日: 09:00 - 19:00/)).toBeInTheDocument()
    expect(screen.getByText(/定休日: 水曜日/)).toBeInTheDocument()
  })

  it('renders contact information', () => {
    render(<Footer />)
    
    expect(screen.getByText(/TEL: 03-1234-5678/)).toBeInTheDocument()
  })

  it('renders social media links', () => {
    render(<Footer />)
    
    const instagramLink = screen.getByLabelText(/instagram/i)
    expect(instagramLink).toBeInTheDocument()
  })

  it('renders copyright notice', () => {
    render(<Footer />)
    
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`${currentYear}.*NAGASE SALON`))).toBeInTheDocument()
  })
})