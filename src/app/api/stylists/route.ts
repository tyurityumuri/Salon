import { NextRequest, NextResponse } from 'next/server'
import { getS3DataManager } from '@/lib/s3-data-manager'
import { Stylist } from '@/types'

const dataManager = getS3DataManager()

export async function GET() {
  try {
    const stylists = await dataManager.getJsonData<Stylist[]>('stylists.json')
    return NextResponse.json(stylists)
  } catch (error) {
    console.error('Error fetching stylists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stylists' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { name, position, bio, experience, rating, reviewCount, specialties } = body
    
    if (!name || !position || !bio || experience === undefined || rating === undefined || reviewCount === undefined || !specialties) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    const stylistData = {
      name: String(name),
      position: String(position),
      bio: String(bio),
      experience: Number(experience),
      rating: Number(rating),
      reviewCount: Number(reviewCount),
      specialties: Array.isArray(specialties) ? specialties : specialties.split(',').map((s: string) => s.trim()),
      social: body.social || {},
      image: body.image || null,
      skills: body.skills || [],
      portfolio: body.portfolio || []
    }

    if (stylistData.rating < 1 || stylistData.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (stylistData.experience < 0) {
      return NextResponse.json(
        { error: 'Experience must be non-negative' },
        { status: 400 }
      )
    }
    
    const updatedStylists = await dataManager.updateJsonData<Stylist[]>(
      'stylists.json',
      (currentStylists) => {
        const newStylist: Stylist = {
          id: Date.now().toString(),
          ...stylistData
        }
        return [...currentStylists, newStylist]
      }
    )
    
    const newStylist = updatedStylists[updatedStylists.length - 1]
    
    return NextResponse.json({
      id: newStylist.id,
      message: 'Stylist created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating stylist:', error)
    return NextResponse.json(
      { error: 'Failed to create stylist' },
      { status: 500 }
    )
  }
}