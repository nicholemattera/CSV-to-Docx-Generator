const ASSETS_TO_CACHE = ['/', '/images/minnesota.svg', '/index.html', '/robots.txt']

async function fetchAssets() {
  const response = await fetch('/')
  const text = await response.text()

  const assets = []
  const regex = /(href|src)="([^"]+\.(css|js|ts))"/g

  let match
  while ((match = regex.exec(text))) {
    assets.push(match[2])
  }

  return assets
}

// Create our cache and preload it on install
self.addEventListener('install', (event) => {
  console.log('WORKER: install started')

  event.waitUntil(
    caches
      .open(import.meta.env.VITE_PACKAGE_VERSION + '-CsvToDocxGenerator')
      .then(async (cache) => {
        return cache.addAll([...ASSETS_TO_CACHE, ...(await fetchAssets())])
      })
      .then(function () {
        console.log('WORKER: install completed')
      }),
  )
})

// Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('WORKER: activate started')

  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return !key.startsWith(import.meta.env.VITE_PACKAGE_VERSION)
            })
            .map(function (key) {
              return caches.delete(key)
            }),
        )
      })
      .then(function () {
        console.log('WORKER: activate completed')
      }),
  )
})

// Add any new files to the cache as they get loaded by the page
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchedFromNetwork = (response) => {
        const cacheCopy = response.clone()

        caches.open(import.meta.env.VITE_PACKAGE_VERSION + '-CsvToDocxGenerator').then(function add(cache) {
          cache.put(event.request, cacheCopy)
        })

        return response
      }

      const unableToResolve = () => {
        return new Response('<h1>Service Unavailable</h1>', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/html',
          }),
        })
      }

      const networked = fetch(event.request).then(fetchedFromNetwork, unableToResolve).catch(unableToResolve)

      return cached || networked
    }),
  )
})
