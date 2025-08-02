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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')

    const allNews = await dataManager.getJsonData<NewsItem[]>('news.json')
    
    let news = allNews
    if (category) {
      news = allNews.filter(item => item.category === category)
    }
    
    news = news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    if (limit) {
      news = news.slice(0, parseInt(limit))
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { title, content, category, date } = body
    
    if (!title || !content || !category || !date) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    const validCategories = ['campaign', 'event', 'notice']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be: campaign, event, or notice' },
        { status: 400 }
      )
    }

    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    const newsData = {
      title: String(title),
      content: String(content),
      category: category as 'campaign' | 'event' | 'notice',
      date: String(date),
      image: body.image || undefined
    }

    const updatedNews = await dataManager.updateJsonData<NewsItem[]>(
      'news.json',
      (currentNews) => {
        const newNews: NewsItem = {
          id: Date.now().toString(),
          ...newsData
        }
        return [...currentNews, newNews]
      }
    )
    
    const newNews = updatedNews[updatedNews.length - 1]
    
    return NextResponse.json({ 
      id: newNews.id, 
      message: 'News created successfully' 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    )
  }
}