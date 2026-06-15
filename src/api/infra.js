const DEFAULT_API_BASE_URL = 'http://localhost:8080'

const getApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL?.trim()
  return configuredUrl || DEFAULT_API_BASE_URL
}

export const fetchInfraItems = async ({ lat, lng, radius, types, signal }) => {
  const url = new URL('/api/infra', getApiBaseUrl())
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lng', String(lng))
  url.searchParams.set('radius', String(radius))

  if (types?.length) {
    url.searchParams.set('types', types.join(','))
  }

  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`치안 인프라 조회 실패 (${response.status})`)
  }

  return response.json()
}