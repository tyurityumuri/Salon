import { NextRequest, NextResponse } from 'next/server'
import { getS3DataManager } from '@/lib/s3-data-manager'
import { MenuItem } from '@/types'

const dataManager = getS3DataManager()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const menus = await dataManager.getJsonData<MenuItem[]>('menu.json')
    const menu = menus.find(m => m.id === params.id)
    
    if (!menu) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(menu)
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
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
    if (body.category !== undefined) updateData.category = String(body.category)
    if (body.description !== undefined) updateData.description = String(body.description)
    if (body.price !== undefined) updateData.price = Number(body.price)
    if (body.duration !== undefined) updateData.duration = Number(body.duration)
    if (body.isPopular !== undefined) updateData.isPopular = Boolean(body.isPopular)
    if (body.options !== undefined) updateData.options = body.options

    if (updateData.price && updateData.price < 0) {
      return NextResponse.json(
        { error: 'Price must be non-negative' },
        { status: 400 }
      )
    }

    if (updateData.duration && updateData.duration <= 0) {
      return NextResponse.json(
        { error: 'Duration must be positive' },
        { status: 400 }
      )
    }

    if (updateData.options && Array.isArray(updateData.options)) {
      for (const option of updateData.options) {
        if (!option.name || option.additionalPrice === undefined) {
          return NextResponse.json(
            { error: 'Option must have name and additionalPrice' },
            { status: 400 }
          )
        }
        option.additionalPrice = Number(option.additionalPrice)
        if (option.additionalPrice < 0) {
          return NextResponse.json(
            { error: 'Option additional price must be non-negative' },
            { status: 400 }
          )
        }
      }
    }

    await dataManager.updateJsonData<MenuItem[]>(
      'menu.json',
      (currentMenus) => {
        return currentMenus.map(menu =>
          menu.id === params.id ? { ...menu, ...updateData } : menu
        )
      }
    )
    
    return NextResponse.json({ 
      message: 'Menu updated successfully' 
    })

  } catch (error) {
    console.error('Error updating menu:', error)
    return NextResponse.json(
      { error: 'Failed to update menu' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dataManager.updateJsonData<MenuItem[]>(
      'menu.json',
      (currentMenus) => {
        return currentMenus.filter(menu => menu.id !== params.id)
      }
    )
    
    return NextResponse.json({ 
      message: 'Menu deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting menu:', error)
    return NextResponse.json(
      { error: 'Failed to delete menu' },
      { status: 500 }
    )
  }
}