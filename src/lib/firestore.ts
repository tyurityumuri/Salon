import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  orderBy, 
  query,
  where,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore'
import { db } from './firebase'
import { Stylist, MenuItem } from '@/types'

// 汎用的なFirestoreサービスクラス
export class FirestoreService {
  // コレクションの全ドキュメントを取得
  static async getAll<T>(collectionName: string, constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const collectionRef = collection(db, collectionName)
      const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as T))
    } catch (error) {
      console.error(`Error getting documents from ${collectionName}:`, error)
      throw error
    }
  }

  // 特定のドキュメントを取得
  static async getById<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T
      } else {
        return null
      }
    } catch (error) {
      console.error(`Error getting document ${id} from ${collectionName}:`, error)
      throw error
    }
  }

  // 新しいドキュメントを追加
  static async add<T extends DocumentData>(collectionName: string, data: Omit<T, 'id'>): Promise<string> {
    try {
      const collectionRef = collection(db, collectionName)
      const docRef = await addDoc(collectionRef, data)
      return docRef.id
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error)
      throw error
    }
  }

  // ドキュメントを更新
  static async update<T extends DocumentData>(collectionName: string, id: string, data: Partial<Omit<T, 'id'>>): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id)
      await updateDoc(docRef, data)
    } catch (error) {
      console.error(`Error updating document ${id} in ${collectionName}:`, error)
      throw error
    }
  }

  // ドキュメントを削除
  static async delete(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error(`Error deleting document ${id} from ${collectionName}:`, error)
      throw error
    }
  }
}

// スタイリスト専用サービス
export class StylistService {
  private static readonly COLLECTION = 'stylists'

  static async getAll(): Promise<Stylist[]> {
    return FirestoreService.getAll<Stylist>(this.COLLECTION, [orderBy('name')])
  }

  static async getById(id: string): Promise<Stylist | null> {
    return FirestoreService.getById<Stylist>(this.COLLECTION, id)
  }

  static async add(stylist: Omit<Stylist, 'id'>): Promise<string> {
    return FirestoreService.add<Stylist>(this.COLLECTION, stylist)
  }

  static async update(id: string, stylist: Partial<Omit<Stylist, 'id'>>): Promise<void> {
    return FirestoreService.update<Stylist>(this.COLLECTION, id, stylist)
  }

  static async delete(id: string): Promise<void> {
    return FirestoreService.delete(this.COLLECTION, id)
  }
}

// メニュー専用サービス
export class MenuService {
  private static readonly COLLECTION = 'menu'

  static async getAll(): Promise<MenuItem[]> {
    return FirestoreService.getAll<MenuItem>(this.COLLECTION, [orderBy('category'), orderBy('name')])
  }

  static async getByCategory(category: string): Promise<MenuItem[]> {
    return FirestoreService.getAll<MenuItem>(this.COLLECTION, [
      where('category', '==', category),
      orderBy('name')
    ])
  }

  static async getPopular(): Promise<MenuItem[]> {
    return FirestoreService.getAll<MenuItem>(this.COLLECTION, [
      where('isPopular', '==', true),
      orderBy('name')
    ])
  }

  static async getById(id: string): Promise<MenuItem | null> {
    return FirestoreService.getById<MenuItem>(this.COLLECTION, id)
  }

  static async add(menu: Omit<MenuItem, 'id'>): Promise<string> {
    return FirestoreService.add<MenuItem>(this.COLLECTION, menu)
  }

  static async update(id: string, menu: Partial<Omit<MenuItem, 'id'>>): Promise<void> {
    return FirestoreService.update<MenuItem>(this.COLLECTION, id, menu)
  }

  static async delete(id: string): Promise<void> {
    return FirestoreService.delete(this.COLLECTION, id)
  }
}

// ニュース専用サービス
interface NewsItem {
  id: string
  title: string
  content: string
  category: 'campaign' | 'event' | 'notice'
  date: string
  image?: string
}

export class NewsService {
  private static readonly COLLECTION = 'news'

  static async getAll(): Promise<NewsItem[]> {
    return FirestoreService.getAll<NewsItem>(this.COLLECTION, [orderBy('date', 'desc')])
  }

  static async getByCategory(category: string): Promise<NewsItem[]> {
    return FirestoreService.getAll<NewsItem>(this.COLLECTION, [
      where('category', '==', category),
      orderBy('date', 'desc')
    ])
  }

  static async getRecent(limit: number = 3): Promise<NewsItem[]> {
    const allNews = await this.getAll()
    return allNews.slice(0, limit)
  }

  static async getById(id: string): Promise<NewsItem | null> {
    return FirestoreService.getById<NewsItem>(this.COLLECTION, id)
  }

  static async add(news: Omit<NewsItem, 'id'>): Promise<string> {
    return FirestoreService.add<NewsItem>(this.COLLECTION, news)
  }

  static async update(id: string, news: Partial<Omit<NewsItem, 'id'>>): Promise<void> {
    return FirestoreService.update<NewsItem>(this.COLLECTION, id, news)
  }

  static async delete(id: string): Promise<void> {
    return FirestoreService.delete(this.COLLECTION, id)
  }
}

// スタイル専用サービス
interface StyleItem {
  id: string
  src: string
  alt: string
  category: string
  tags: string[]
  stylistName: string
  height: number
}

export class StyleService {
  private static readonly COLLECTION = 'styles'

  static async getAll(): Promise<StyleItem[]> {
    return FirestoreService.getAll<StyleItem>(this.COLLECTION, [orderBy('category')])
  }

  static async getByCategory(category: string): Promise<StyleItem[]> {
    return FirestoreService.getAll<StyleItem>(this.COLLECTION, [
      where('category', '==', category)
    ])
  }

  static async getByStylist(stylistName: string): Promise<StyleItem[]> {
    return FirestoreService.getAll<StyleItem>(this.COLLECTION, [
      where('stylistName', '==', stylistName)
    ])
  }

  static async getById(id: string): Promise<StyleItem | null> {
    return FirestoreService.getById<StyleItem>(this.COLLECTION, id)
  }

  static async add(style: Omit<StyleItem, 'id'>): Promise<string> {
    return FirestoreService.add<StyleItem>(this.COLLECTION, style)
  }

  static async update(id: string, style: Partial<Omit<StyleItem, 'id'>>): Promise<void> {
    return FirestoreService.update<StyleItem>(this.COLLECTION, id, style)
  }

  static async delete(id: string): Promise<void> {
    return FirestoreService.delete(this.COLLECTION, id)
  }
}

// サロン情報専用サービス
interface SalonInfo {
  id: string
  name: string
  address: string
  phone: string
  email: string
  businessHours: {
    [key: string]: { open: string; close: string }
  }
  closedDays: string[]
  googleMapsUrl: string
  accessInfo: string[]
  parkingInfo: string
}

export class SalonService {
  private static readonly COLLECTION = 'salon'
  private static readonly DOC_ID = 'info' // 単一ドキュメント

  static async get(): Promise<SalonInfo | null> {
    return FirestoreService.getById<SalonInfo>(this.COLLECTION, this.DOC_ID)
  }

  static async update(salon: Partial<Omit<SalonInfo, 'id'>>): Promise<void> {
    return FirestoreService.update<SalonInfo>(this.COLLECTION, this.DOC_ID, salon)
  }

  // 初期データを設定（初回のみ）
  static async initialize(salon: Omit<SalonInfo, 'id'>): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, this.DOC_ID)
      await updateDoc(docRef, salon)
    } catch (error) {
      // ドキュメントが存在しない場合は作成
      const docRef = doc(db, this.COLLECTION, this.DOC_ID)
      await updateDoc(docRef, salon)
    }
  }
}