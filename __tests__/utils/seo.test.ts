import { generateSEO, generateBusinessStructuredData } from '@/utils/seo'

describe('SEO Utilities', () => {
  describe('generateSEO', () => {
    it('generates basic SEO metadata', () => {
      const result = generateSEO({
        title: 'Test Page',
        description: 'Test Description',
        path: '/test',
      })

      expect(result.title).toBe('Test Page')
      expect(result.description).toBe('Test Description')
      expect(result.openGraph?.title).toBe('Test Page')
      expect(result.openGraph?.description).toBe('Test Description')
    })

    it('generates SEO with keywords', () => {
      const result = generateSEO({
        title: 'Test Page',
        description: 'Test Description',
        path: '/test',
        keywords: ['hair', 'salon', 'tokyo'],
      })

      expect(result.keywords).toEqual(expect.arrayContaining(['hair', 'salon', 'tokyo']))
    })

    it('generates canonical URL correctly', () => {
      const result = generateSEO({
        title: 'Test Page',
        description: 'Test Description',
        path: '/stylists',
      })

      expect(result.alternates?.canonical).toBe('https://nagase-salon.vercel.app/stylists')
    })
  })

  describe('generateBusinessStructuredData', () => {
    it('generates valid business structured data', () => {
      const businessData = {
        name: '長瀬サロン',
        address: {
          streetAddress: '1-1-1 Shibuya',
          addressLocality: 'Shibuya',
          addressRegion: 'Tokyo',
          postalCode: '150-0001',
          addressCountry: 'JP',
        },
        telephone: '+81-3-1234-5678',
        email: 'info@nagase-salon.com',
        url: 'https://nagase-salon.com',
        openingHours: ['Mo-Su 10:00-19:00'],
        priceRange: '¥¥',
        image: 'https://nagase-salon.com/hero.jpg',
      }

      const result = generateBusinessStructuredData(businessData)

      expect(result['@context']).toBe('https://schema.org')
      expect(result['@type']).toBe('HairSalon')
      expect(result.name).toBe('長瀬サロン')
      expect(result.address['@type']).toBe('PostalAddress')
      expect(result.telephone).toBe('+81-3-1234-5678')
    })
  })
})