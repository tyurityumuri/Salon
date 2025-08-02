import { NextRequest, NextResponse } from 'next/server'
import { getS3DataManager } from '@/lib/s3-data-manager'

interface StyleItem {
  id: string
  src: string
  alt: string
  category: string
  tags: string[]
  stylistName: string
  height: number
}

const dataManager = getS3DataManager()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const stylistName = searchParams.get('stylistName')

    const allStyles = await dataManager.getJsonData<StyleItem[]>('styles.json')
    
    let styles = allStyles
    if (stylistName) {
      styles = allStyles.filter(style => style.stylistName === stylistName)
    } else if (category) {
      styles = allStyles.filter(style => style.category === category)
    }

    return NextResponse.json(styles)
  } catch (error) {
    console.error('Error fetching styles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch styles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { src, alt, category, tags, stylistName, height } = body
    
    if (!src || !alt || !category || !tags || !stylistName || height === undefined) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    const styleData = {
      src: String(src),
      alt: String(alt),
      category: String(category),
      tags: Array.isArray(tags) ? tags : tags.split(',').map((tag: string) => tag.trim()),
      stylistName: String(stylistName),
      height: Number(height)
    }

    if (styleData.height < 200 || styleData.height > 800) {
      return NextResponse.json(
        { error: 'Height must be between 200 and 800' },
        { status: 400 }
      )
    }

    if (styleData.tags.length === 0) {
      return NextResponse.json(
        { error: 'At least one tag is required' },
        { status: 400 }
      )
    }

    const updatedStyles = await dataManager.updateJsonData<StyleItem[]>(
      'styles.json',
      (currentStyles) => {
        const newStyle: StyleItem = {
          id: Date.now().toString(),
          ...styleData
        }
        return [...currentStyles, newStyle]
      }
    )
    
    const newStyle = updatedStyles[updatedStyles.length - 1]
    
    return NextResponse.json({ 
      id: newStyle.id, 
      message: 'Style created successfully' 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating style:', error)
    return NextResponse.json(
      { error: 'Failed to create style' },
      { status: 500 }
    )
  }
}