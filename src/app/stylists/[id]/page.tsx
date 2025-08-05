import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import StylistDetailClient from '@/components/StylistDetailClient'
import { generateSEO, generateStylistStructuredData } from '@/utils/seo'
import { StructuredData } from '@/components/StructuredData'
import { Stylist } from '@/types'
import { getS3DataManager } from '@/lib/s3-data-manager'

interface Props {
  params: {
    id: string
  }
}

// スタイリストデータを取得する関数
async function getStylist(id: string): Promise<Stylist | null> {
  try {
    const dataManager = getS3DataManager()
    const stylists = await dataManager.getJsonData<Stylist[]>('stylists.json')
    return stylists.find((s: Stylist) => s.id === id) || null
  } catch (error) {
    console.error('Error fetching stylist:', error)
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const stylist = await getStylist(params.id)
  
  if (!stylist) {
    return generateSEO({
      title: 'スタイリストが見つかりません',
      description: 'お探しのスタイリストは見つかりませんでした。',
      path: `/stylists/${params.id}`,
    })
  }

  return generateSEO({
    title: `${stylist.name} | ${stylist.position}`,
    description: `${stylist.name}（${stylist.position}）のプロフィール。経験${stylist.experience}年、評価${stylist.rating}点。専門分野: ${stylist.specialties.join('、')}。${stylist.bio}`,
    keywords: [
      stylist.name,
      stylist.position,
      ...stylist.specialties,
      'スタイリスト',
      'プロフィール',
      '予約'
    ],
    path: `/stylists/${params.id}`,
    type: 'profile',
    author: stylist.name,
  })
}

export default async function StylistDetailPage({ params }: Props) {
  const stylist = await getStylist(params.id)

  if (!stylist) {
    notFound()
  }

  const stylistStructuredData = generateStylistStructuredData({
    name: stylist.name,
    jobTitle: stylist.position,
    description: stylist.bio,
    image: stylist.image || undefined,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://nagase-salon.vercel.app'}/stylists/${stylist.id}`,
    worksFor: {
      name: '長瀬サロン',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://nagase-salon.vercel.app',
    },
    skills: stylist.specialties,
    experience: stylist.experience.toString(),
    socialMedia: stylist.social,
  })

  return (
    <>
      <StructuredData data={stylistStructuredData} />
      <StylistDetailClient params={params} />
    </>
  )
}