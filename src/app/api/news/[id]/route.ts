import { NextRequest, NextResponse } from 'next/server'
import { getS3DataManager } from '@/lib/s3-data-manager'

interface NewsItem {
  id: string
  title: string
  content: string
  category: 'campaign' | 'event' | 'notice'
  date: string
  image?: string
}

const dataManager = getS3DataManager()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const newsItems = await dataManager.getJsonData<NewsItem[]>('news.json')
    const news = newsItems.find(n => n.id === params.id)
    
    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(news)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
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
    
    if (body.title !== undefined) updateData.title = String(body.title)
    if (body.content !== undefined) updateData.content = String(body.content)
    if (body.category !== undefined) updateData.category = body.category
    if (body.date !== undefined) updateData.date = String(body.date)
    if (body.image !== undefined) updateData.image = body.image

    if (updateData.category) {
      const validCategories = ['campaign', 'event', 'notice']
      if (!validCategories.includes(updateData.category)) {
        return NextResponse.json(
          { error: 'Invalid category. Must be: campaign, event, or notice' },
          { status: 400 }
        )
      }
    }

    if (updateData.date) {
      const dateObj = new Date(updateData.date)
      if (isNaN(dateObj.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format' },
          { status: 400 }
        )
      }
    }

    await dataManager.updateJsonData<NewsItem[]>(
      'news.json',
      (currentNews) => {
        return currentNews.map(news =>
          news.id === params.id ? { ...news, ...updateData } : news
        )
      }
    )
    
    return NextResponse.json({ 
      message: 'News updated successfully' 
    })

  } catch (error) {
    console.error('Error updating news:', error)
    return NextResponse.json(
      { error: 'Failed to update news' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dataManager.updateJsonData<NewsItem[]>(
      'news.json',
      (currentNews) => {
        return currentNews.filter(news => news.id !== params.id)
      }
    )
    
    return NextResponse.json({ 
      message: 'News deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    )
  }
}