import { NextRequest, NextResponse } from 'next/server'
import { getS3DataManager } from '@/lib/s3-data-manager'
import { Stylist } from '@/types'

const dataManager = getS3DataManager()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stylists = await dataManager.getJsonData<Stylist[]>('stylists.json')
    const stylist = stylists.find(s => s.id === params.id)
    
    if (!stylist) {
      return NextResponse.json(
        { error: 'Stylist not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(stylist)
  } catch (error) {
    console.error('Error fetching stylist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stylist' },
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
    
    if (body.name !== undefined) updateData.name = String(body.name)
    if (body.position !== undefined) updateData.position = String(body.position)
    if (body.bio !== undefined) updateData.bio = String(body.bio)
    if (body.experience !== undefined) updateData.experience = Number(body.experience)
    if (body.rating !== undefined) updateData.rating = Number(body.rating)
    if (body.reviewCount !== undefined) updateData.reviewCount = Number(body.reviewCount)
    if (body.specialties !== undefined) {
      updateData.specialties = Array.isArray(body.specialties) 
        ? body.specialties 
        : body.specialties.split(',').map((s: string) => s.trim())
    }
    if (body.social !== undefined) updateData.social = body.social
    if (body.image !== undefined) updateData.image = body.image

    if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (updateData.experience && updateData.experience < 0) {
      return NextResponse.json(
        { error: 'Experience must be non-negative' },
        { status: 400 }
      )
    }

    await dataManager.updateJsonData<Stylist[]>(
      'stylists.json',
      (currentStylists) => {
        return currentStylists.map(stylist =>
          stylist.id === params.id ? { ...stylist, ...updateData } : stylist
        )
      }
    )
    
    return NextResponse.json({ 
      message: 'Stylist updated successfully' 
    })

  } catch (error) {
    console.error('Error updating stylist:', error)
    return NextResponse.json(
      { error: 'Failed to update stylist' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dataManager.updateJsonData<Stylist[]>(
      'stylists.json',
      (currentStylists) => {
        return currentStylists.filter(stylist => stylist.id !== params.id)
      }
    )
    
    return NextResponse.json({ 
      message: 'Stylist deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting stylist:', error)
    return NextResponse.json(
      { error: 'Failed to delete stylist' },
      { status: 500 }
    )
  }
}