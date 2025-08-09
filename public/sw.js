const CACHE_NAME = 'nagase-salon-v2'
const STATIC_CACHE_URLS = [
  '/',
  '/stylists',
  '/styles',
  '/menu',
  '/access',
  '/booking',
  '/manifest.json'
]

// Service Worker Install Event
self.addEventListener('install', event => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

// Service Worker Activate Event
self.addEventListener('activate', event => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})

// Service Worker Fetch Event
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip Chrome extensions
  if (event.request.url.startsWith('chrome-extension://')) {
    return
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  const url = new URL(event.request.url)
  
  // Skip API requests - always fetch fresh data
  if (url.pathname.startsWith('/api/')) {
    return
  }
  
  // Skip admin panel - always fetch fresh data
  if (url.pathname.startsWith('/admin')) {
    return
  }
  
  // Skip S3 images - let browser handle caching
  if (url.hostname.includes('amazonaws.com')) {
    return
  }

  // Only cache static assets and pages
  const shouldCache = 
    url.pathname === '/' ||
    url.pathname.startsWith('/stylists') ||
    url.pathname.startsWith('/styles') ||
    url.pathname.startsWith('/menu') ||
    url.pathname.startsWith('/access') ||
    url.pathname.startsWith('/booking') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.json') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/icons/')

  if (!shouldCache) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          console.log('Serving from cache:', event.request.url)
          return response
        }

        // Fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache if not successful
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response
            const responseToCache = response.clone()

            // Cache the response
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache)
              })

            return response
          })
          .catch(() => {
            // Return offline fallback for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/')
            }
          })
      })
  )
})

// Background Sync (for future use)
self.addEventListener('sync', event => {
  console.log('Background sync:', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Perform background sync tasks
      console.log('Performing background sync...')
    )
  }
})

// Push Notifications (for future use)
self.addEventListener('push', event => {
  console.log('Push message received:', event)
  
  const options = {
    body: event.data ? event.data.text() : 'Long Salon からの新しいお知らせ',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '詳細を見る',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: '閉じる',
        icon: '/icons/xmark.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('長瀬サロン', options)
  )
})

// Notification Click
self.addEventListener('notificationclick', event => {
  console.log('Notification click received:', event)
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})