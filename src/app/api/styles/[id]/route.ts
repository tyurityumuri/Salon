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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const styles = await dataManager.getJsonData<StyleItem[]>('styles.json')
    const style = styles.find(s => s.id === params.id)
    
    if (!style) {
      return NextResponse.json(
        { error: 'Style not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(style)
  } catch (error) {
    console.error('Error fetching style:', error)
    return NextResponse.json(
      { error: 'Failed to fetch style' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const updateData: any = {}
    
    if (body.src !== undefined) updateData.src = String(body.src)
    if (body.alt !== undefined) updateData.alt = String(body.alt)
    if (body.category !== undefined) updateData.category = String(body.category)
    if (body.tags !== undefined) {
      updateData.tags = Array.isArray(body.tags) 
        ? body.tags 
        : body.tags.split(',').map((tag: string) => tag.trim())
    }
    if (body.stylistName !== undefined) updateData.stylistName = String(body.stylistName)
    if (body.height !== undefined) updateData.height = Number(body.height)

    if (updateData.height && (updateData.height < 200 || updateData.height > 800)) {
      return NextResponse.json(
        { error: 'Height must be between 200 and 800' },
        { status: 400 }
      )
    }

    if (updateData.tags && updateData.tags.length === 0) {
      return NextResponse.json(
        { error: 'At least one tag is required' },
        { status: 400 }
      )
    }

    await dataManager.updateJsonData<StyleItem[]>(
      'styles.json',
      (currentStyles) => {
        return currentStyles.map(style =>
          style.id === params.id ? { ...style, ...updateData } : style
        )
      }
    )
    
    return NextResponse.json({ 
      message: 'Style updated successfully' 
    })

  } catch (error) {
    console.error('Error updating style:', error)
    return NextResponse.json(
      { error: 'Failed to update style' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dataManager.updateJsonData<StyleItem[]>(
      'styles.json',
      (currentStyles) => {
        return currentStyles.filter(style => style.id !== params.id)
      }
    )
    
    return NextResponse.json({ 
      message: 'Style deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting style:', error)
    return NextResponse.json(
      { error: 'Failed to delete style' },
      { status: 500 }
    )
  }
}