const DEFAULT_API_BASE_URL = 'http://localhost:8080'

const getApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL?.trim()
  return configuredUrl || DEFAULT_API_BASE_URL
}

export const fetchProperties = async ({ lat, lng, radius, page = 0, size = 100, signal }) => {
  const url = new URL('/api/properties', getApiBaseUrl())
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lng', String(lng))
  url.searchParams.set('radius', String(radius))
  url.searchParams.set('page', String(page))
  url.searchParams.set('size', String(size))

  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`매물 목록 조회 실패 (${response.status})`)
  }

  return response.json()
}
