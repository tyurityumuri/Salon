import { render, screen } from '@testing-library/react'
import Layout from '@/components/Layout'

describe('Layout', () => {
  it('renders header and footer', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )
    
    // Header should be present
    expect(screen.getByText('NAGASE')).toBeInTheDocument()
    
    // Footer should be present
    expect(screen.getByText(/営業時間/)).toBeInTheDocument()
    
    // Content should be present
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies correct structure', () => {
    render(
      <Layout>
        <div data-testid="content">Test Content</div>
      </Layout>
    )
    
    const content = screen.getByTestId('content')
    expect(content).toBeInTheDocument()
  })
})