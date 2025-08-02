import { NextRequest, NextResponse } from 'next/server'
import { getS3DataManager } from '@/lib/s3-data-manager'
import { MenuItem } from '@/types'

const dataManager = getS3DataManager()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const popular = searchParams.get('popular')

    const allMenus = await dataManager.getJsonData<MenuItem[]>('menu.json')
    
    let menus = allMenus
    if (popular === 'true') {
      menus = allMenus.filter(menu => menu.isPopular)
    } else if (category) {
      menus = allMenus.filter(menu => menu.category === category)
    }

    return NextResponse.json(menus)
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { name, category, description, price, duration } = body
    
    if (!name || !category || !description || price === undefined || duration === undefined) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    const menuData = {
      name: String(name),
      category: String(category),
      description: String(description),
      price: Number(price),
      duration: Number(duration),
      isPopular: Boolean(body.isPopular),
      options: body.options || []
    }

    if (menuData.price < 0) {
      return NextResponse.json(
        { error: 'Price must be non-negative' },
        { status: 400 }
      )
    }

    if (menuData.duration <= 0) {
      return NextResponse.json(
        { error: 'Duration must be positive' },
        { status: 400 }
      )
    }

    if (menuData.options && Array.isArray(menuData.options)) {
      for (const option of menuData.options) {
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

    const updatedMenus = await dataManager.updateJsonData<MenuItem[]>(
      'menu.json',
      (currentMenus) => {
        const newMenu: MenuItem = {
          id: Date.now().toString(),
          ...menuData
        }
        return [...currentMenus, newMenu]
      }
    )
    
    const newMenu = updatedMenus[updatedMenus.length - 1]
    
    return NextResponse.json({ 
      id: newMenu.id, 
      message: 'Menu created successfully' 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating menu:', error)
    return NextResponse.json(
      { error: 'Failed to create menu' },
      { status: 500 }
    )
  }
}